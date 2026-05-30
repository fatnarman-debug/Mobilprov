import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'mock-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get all topics and their question counts
    const topics = await prisma.topic.findMany({
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });

    // 2. Filter topics that actually have questions
    const validTopics = topics.filter((t: any) => t._count.questions > 0);
    const totalQuestionsInDb = validTopics.reduce((acc: number, t: any) => acc + t._count.questions, 0);

    if (totalQuestionsInDb === 0) {
      return NextResponse.json({ error: 'No questions in database.' }, { status: 400 });
    }

    // 3. Create or update the ExamTemplate for 60 questions, 90 minutes
    const TOTAL_EXAM_QUESTIONS = 60;
    const EXAM_DURATION = 90;

    let template = await prisma.examTemplate.findFirst({
      where: { title: 'Medborgarskapsprov (60 Frågor)' }
    });

    if (!template) {
      template = await prisma.examTemplate.create({
        data: {
          title: 'Medborgarskapsprov (60 Frågor)',
          durationMin: EXAM_DURATION,
          isActive: true
        }
      });
    }

    // 4. Calculate distribution (proportional to available questions)
    let assignedQuestions = 0;
    const rulesData = validTopics.map((topic: any) => {
      // Calculate raw proportion
      const proportion = topic._count.questions / totalQuestionsInDb;
      let qCount = Math.round(proportion * TOTAL_EXAM_QUESTIONS);
      
      // Ensure we don't ask more questions than exist
      if (qCount > topic._count.questions) qCount = topic._count.questions;
      
      assignedQuestions += qCount;
      return { topicId: topic.id, count: qCount, topic };
    });

    // Adjust for rounding errors to exactly hit 60
    let diff = TOTAL_EXAM_QUESTIONS - assignedQuestions;
    // Sort by count descending to add/subtract from the ones with most questions
    rulesData.sort((a: any, b: any) => b.count - a.count);
    
    let i = 0;
    while (diff > 0) {
      if (rulesData[i].count < rulesData[i].topic._count.questions) {
        rulesData[i].count++;
        diff--;
      }
      i = (i + 1) % rulesData.length;
    }
    while (diff < 0) {
      if (rulesData[i].count > 1) { // keep at least 1 if possible
        rulesData[i].count--;
        diff++;
      }
      i = (i + 1) % rulesData.length;
    }

    // Clear old rules for this template
    await prisma.examTopicRule.deleteMany({
      where: { examTemplateId: template.id }
    });

    // Insert new rules
    for (const rule of rulesData) {
      if (rule.count > 0) {
        await prisma.examTopicRule.create({
          data: {
            examTemplateId: template.id,
            topicId: rule.topicId,
            questionCount: rule.count
          }
        });
      }
    }

    // Clear existing mock exams for this template to prevent infinite duplicates
    const existingExams = await prisma.mockExam.findMany({
      where: { templateId: template.id }
    });
    for (const exam of existingExams) {
      await prisma.mockExam.delete({ where: { id: exam.id } });
    }

    // 5. Generate 20 MockExams
    const mockExamsCreated: string[] = [];
    for (let examIndex = 1; examIndex <= 20; examIndex++) {
      const mockExam = await prisma.mockExam.create({
        data: {
          title: `Medborgarskapsprov Deneme Sınavı ${examIndex}`,
          description: '60 soruluk tam kapsamlı resmi vatandaşlık deneme sınavı simülasyonu.',
          durationMin: EXAM_DURATION,
          isPublished: true,
          templateId: template.id
        }
      });

      // Pick random questions based on rules
      let questionOrder = 1;
      for (const rule of rulesData) {
        if (rule.count === 0) continue;
        
        const questions = await prisma.question.findMany({
          where: { topicId: rule.topicId },
          select: { id: true }
        });
        
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, rule.count);

        for (const q of selected) {
          await prisma.mockExamQuestion.create({
            data: {
              mockExamId: mockExam.id,
              questionId: q.id,
              order: questionOrder++
            }
          });
        }
      }
      mockExamsCreated.push(mockExam.id);
    }

    return NextResponse.json({
      success: true,
      message: `Created Exam Template and 20 Mock Exams successfully.`,
      templateId: template.id,
      mockExamsCount: mockExamsCreated.length
    });

  } catch (error: any) {
    console.error('Seed mock exams error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

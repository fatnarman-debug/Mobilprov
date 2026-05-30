import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import flashcardsData from './flashcards.json';
import questionsData from './questions.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'historia-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const topic = await prisma.topic.create({
      data: {
        title: 'Sveriges moderna historia',
        description: 'Kapitel 10 & 11 - Från jordbrukssamhälle till modern tid (Sverige i fokus).',
        category: 'Historia',
        order: 10,
        isPublished: true,
      },
    });

    await prisma.material.create({
      data: {
        topicId: topic.id,
        type: 'PDF',
        title: 'Sverige i fokus - Kapitel 10 och 11',
        url: 'https://www.uhr.se/globalassets/_uhr.se/medborgarskapsprovet/utbildningsmaterial/sverige-i-fokus.pdf',
        order: 1,
      }
    });

    for (let i = 0; i < flashcardsData.length; i++) {
      await prisma.flashcard.create({
        data: {
          topicId: topic.id,
          frontText: flashcardsData[i].front,
          backText: flashcardsData[i].back,
          order: i + 1,
        }
      });
    }

    for (const q of questionsData) {
      await prisma.question.create({
        data: {
          topicId: topic.id,
          text: q.text,
          optionA: q.options[0],
          optionB: q.options[1],
          optionC: q.options[2],
          optionD: q.options[3],
          correctAnswer: q.correct,
          explanation: q.expl,
          difficulty: 'MEDIUM',
          isTest: false,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      topic: topic.title,
      flashcardsAdded: flashcardsData.length,
      questionsAdded: questionsData.length,
      message: 'Sveriges moderna historia added successfully!' 
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

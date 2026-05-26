'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createExamTemplate(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const title = formData.get('title') as string;
  const durationMin = parseInt(formData.get('durationMin') as string);

  if (!title || isNaN(durationMin)) {
    return { error: 'Başlık ve Süre alanları zorunludur.' };
  }

  try {
    const template = await prisma.examTemplate.create({
      data: {
        title,
        durationMin
      }
    });
    revalidatePath('/admin/exams');
    return { success: 'Sınav şablonu başarıyla oluşturuldu.', template };
  } catch (error) {
    console.error(error);
    return { error: 'Şablon oluşturulurken hata meydana geldi.' };
  }
}

export async function deleteExamTemplate(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    await prisma.examTemplate.delete({
      where: { id }
    });
    revalidatePath('/admin/exams');
    return { success: 'Şablon silindi.' };
  } catch (error) {
    return { error: 'Silinirken hata oluştu.' };
  }
}

export async function addExamTopicRule(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const examTemplateId = formData.get('examTemplateId') as string;
  const topicId = formData.get('topicId') as string;
  const questionCount = parseInt(formData.get('questionCount') as string);

  if (!examTemplateId || !topicId || isNaN(questionCount) || questionCount <= 0) {
    return { error: 'Tüm alanları geçerli doldurun.' };
  }

  try {
    await prisma.examTopicRule.create({
      data: {
        examTemplateId,
        topicId,
        questionCount
      }
    });
    revalidatePath('/admin/exams');
    return { success: 'Kural eklendi.' };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Bu sınav için bu konunun kuralı zaten var. Eklemek yerine mevcut kuralı silip yeniden ekleyin.' };
    }
    console.error(error);
    return { error: 'Kural eklenirken hata oluştu.' };
  }
}

export async function deleteExamTopicRule(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    await prisma.examTopicRule.delete({
      where: { id }
    });
    revalidatePath('/admin/exams');
    return { success: 'Kural silindi.' };
  } catch (error) {
    return { error: 'Kural silinirken hata oluştu.' };
  }
}

export async function generateMockExam(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const templateId = formData.get('templateId') as string;
  const title = formData.get('title') as string;

  if (!templateId || !title) {
    return { error: 'Başlık zorunludur.' };
  }

  try {
    // 1. Şablonu kurallarıyla beraber çek
    const template = await prisma.examTemplate.findUnique({
      where: { id: templateId },
      include: { rules: true }
    });

    if (!template) return { error: 'Şablon bulunamadı.' };
    if (template.rules.length === 0) return { error: 'Bu şablonda hiç kural yok, lütfen önce kural ekleyin.' };

    let selectedQuestionIds: string[] = [];

    // 2. Her kural için veritabanından rastgele soru seç
    for (const rule of template.rules) {
      // O konuya ait olan ve isTest=true olan soruları çek
      let availableQuestions = await prisma.question.findMany({
        where: {
          topicId: rule.topicId,
          isTest: true
        },
        select: { id: true }
      });

      // Akıllı Fallback: Yeterli sınav sorusu yoksa, aynı konudaki çalışma sorularından (isTest=false) da çek
      if (availableQuestions.length < rule.questionCount) {
        const practiceQuestions = await prisma.question.findMany({
          where: {
            topicId: rule.topicId,
            isTest: false
          },
          select: { id: true }
        });
        availableQuestions = [...availableQuestions, ...practiceQuestions];
      }

      if (availableQuestions.length < rule.questionCount) {
        return { error: `Hata: Seçilen konudan ${rule.questionCount} adet soru istendi ancak havuzda (sınav + çalışma soruları dahil) sadece ${availableQuestions.length} soru var.` };
      }

      // Diziyi karıştır ve istenilen adette al
      const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, rule.questionCount);
      selectedQuestionIds.push(...selected.map(q => q.id));
    }

    // 3. Soruları karıştır (farklı konulardan gelen sorular arda arda çıkmasın diye opsiyonel)
    selectedQuestionIds = selectedQuestionIds.sort(() => 0.5 - Math.random());

    // 4. Sabit MockExam'i veritabanına kaydet
    await prisma.mockExam.create({
      data: {
        title,
        templateId: template.id,
        durationMin: template.durationMin,
        isPublished: true, // Şimdilik anında yayınla
        questions: {
          create: selectedQuestionIds.map((qId, index) => ({
            questionId: qId,
            order: index + 1
          }))
        }
      }
    });

    revalidatePath('/admin/exams');
    return { success: `Sınav başarıyla üretildi! (${selectedQuestionIds.length} Soru)` };

  } catch (error) {
    console.error(error);
    return { error: 'Sınav üretilirken hata oluştu.' };
  }
}

export async function deleteMockExam(id: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    await prisma.mockExam.delete({
      where: { id }
    });
    revalidatePath('/admin/exams');
    return { success: 'Deneme Sınavı silindi.' };
  } catch (error) {
    return { error: 'Silinirken hata oluştu.' };
  }
}

'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

/**
 * Kullanıcının Hata Defteri'ndeki güncel yanlış soru sayısını döner.
 */
export async function getUserWrongQuestionsCount(userId: string) {
  if (!userId) {
    return { count: 0 };
  }

  try {
    const count = await prisma.userWrongQuestion.count({
      where: { userId },
    });
    return { count };
  } catch (error) {
    console.error('Error getting wrong questions count:', error);
    return { count: 0, error: 'Hata sayısı alınamadı.' };
  }
}

/**
 * Kullanıcının yaptığı yanlışlardan maksimum 20 soruluk yeni bir deneme sınavı üretir.
 * Temizlik amacıyla kullanıcının eski Hata Temizleme sınavlarını veritabanından siler.
 */
export async function createWrongQuestionsExam(userId: string) {
  if (!userId) {
    return { error: 'Geçersiz kullanıcı kimliği.' };
  }

  try {
    // 1. Kullanıcının yanlış yaptığı aktif soruları çek (Maks. 20 adet)
    const wrongQuestions = await prisma.userWrongQuestion.findMany({
      where: { userId },
      select: { questionId: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    if (wrongQuestions.length === 0) {
      return { error: 'Hata defterinizde henüz yanlış yaptığınız bir soru bulunmuyor.' };
    }

    // 2. Veritabanı şişmesini önlemek için kullanıcının eski Hata Sınavlarını temizle
    await prisma.mockExam.deleteMany({
      where: {
        userId,
        isMistakesExam: true,
      },
    });

    // 3. Yeni bir dinamik hata deneme sınavı oluştur
    const exam = await prisma.mockExam.create({
      data: {
        title: 'Hata Temizleme Sınavı',
        description: 'Hata defterinizdeki yanlış yaptığınız sorulardan dinamik olarak oluşturulmuştur. Sıfır hataya ulaşana kadar çözebilirsiniz.',
        durationMin: Math.max(10, wrongQuestions.length * 1.5), // Soru başına 1.5 dakika süre (Min 10 dk)
        isPublished: false, // Genel sınav listesinde diğer kullanıcılara görünmesin
        isMistakesExam: true,
        userId,
      },
    });

    // 4. Soruları bu sınava ekle
    const mockExamQuestions = wrongQuestions.map((wq, index) => ({
      mockExamId: exam.id,
      questionId: wq.questionId,
      order: index + 1,
    }));

    await prisma.mockExamQuestion.createMany({
      data: mockExamQuestions,
    });

    revalidatePath('/test');
    return { success: true, examId: exam.id };
  } catch (error) {
    console.error('Error creating wrong questions exam:', error);
    return { error: 'Hatalarınızdan yeni bir sınav üretilirken teknik bir hata oluştu.' };
  }
}

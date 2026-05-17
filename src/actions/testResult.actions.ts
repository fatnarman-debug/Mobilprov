'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveTestResult(data: {
  userId: string;
  topicId?: string | null;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
}) {
  try {
    const result = await prisma.testResult.create({
      data: {
        userId: data.userId,
        topicId: data.topicId || null,
        score: data.score,
        correctAnswers: data.correctAnswers,
        wrongAnswers: data.wrongAnswers,
      },
    });

    revalidatePath('/test');
    revalidatePath('/dashboard');
    return { success: true, result };
  } catch (error) {
    console.error('Error saving test result:', error);
    return { error: 'Sınav sonucu kaydedilirken bir hata oluştu.' };
  }
}

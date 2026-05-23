'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function saveTestResult(data: {
  userId: string;
  topicId?: string | null;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  wrongQuestionIds?: string[];
  correctQuestionIds?: string[];
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Save the general test result summary
      const testResult = await tx.testResult.create({
        data: {
          userId: data.userId,
          topicId: data.topicId || null,
          score: data.score,
          correctAnswers: data.correctAnswers,
          wrongAnswers: data.wrongAnswers,
        },
      });

      // 2. Add new wrong questions (if any) avoiding duplicates for SQLite compatibility
      if (data.wrongQuestionIds && data.wrongQuestionIds.length > 0) {
        const existing = await tx.userWrongQuestion.findMany({
          where: {
            userId: data.userId,
            questionId: {
              in: data.wrongQuestionIds,
            },
          },
          select: {
            questionId: true,
          },
        });
        const existingIds = new Set(existing.map((e) => e.questionId));
        const newWrongQuestionIds = data.wrongQuestionIds.filter(
          (qId) => !existingIds.has(qId)
        );

        if (newWrongQuestionIds.length > 0) {
          const wrongData = newWrongQuestionIds.map((qId) => ({
            userId: data.userId,
            questionId: qId,
          }));
          await tx.userWrongQuestion.createMany({
            data: wrongData,
          });
        }
      }

      // 3. Remove corrected questions (if any)
      if (data.correctQuestionIds && data.correctQuestionIds.length > 0) {
        await tx.userWrongQuestion.deleteMany({
          where: {
            userId: data.userId,
            questionId: {
              in: data.correctQuestionIds,
            },
          },
        });
      }

      return testResult;
    });

    revalidatePath('/test');
    revalidatePath('/dashboard');
    return { success: true, result };
  } catch (error) {
    console.error('Error saving test result:', error);
    return { error: 'Sınav sonucu kaydedilirken bir hata oluştu.' };
  }
}

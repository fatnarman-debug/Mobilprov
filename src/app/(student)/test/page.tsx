import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { auth } from '@/auth';
import TestClient from './TestClient';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Provsimulering – Medborgarskapsprov 2026 | Deneme Sınavı', 'Starta provsimuleringar för medborgarskapsprovet och följ dina resultat. İsveç vatandaşlık sınavı deneme testleri.', '/test');


export default async function TestPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  // Fetch settings for global configurations
  const settings = await prisma.platformSetting.findUnique({
    where: { id: 'global_settings' },
  });

  const isMaintenance = settings?.maintenanceMode ?? false;
  const isAdmin = session.user.role === 'ADMIN';

  

  // Fetch all mock exams with questions relation (excluding mistakes exams)
  const mockExams = await prisma.mockExam.findMany({
    where: {
      isMistakesExam: false,
      ...(isAdmin ? {} : { isPublished: true }),
    },
    include: {
      questions: {
        select: {
          id: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Fetch user's test results
  const testResults = await prisma.testResult.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { completedAt: 'desc' },
  });

  // Fetch user's native language preference
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nativeLanguage: true },
  });

  // Fetch count of wrong questions in user's mistakes list
  const wrongQuestionsCount = await prisma.userWrongQuestion.count({
    where: { userId: session.user.id },
  });

  return (
    <TestClient
      mockExams={mockExams}
      testResults={testResults}
      passingScore={settings?.passingScorePercentage ?? 60}
      isPaid={session.user.isPaid || false}
      siteName={settings?.siteName || 'Medborgarskapsprov'}
      userId={session.user.id}
      userLang={user?.nativeLanguage || 'TR'}
      wrongQuestionsCount={wrongQuestionsCount}
    />
  );
}

import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { auth } from '@/auth';
import AnalysisClient from './AnalysisClient';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Resultatanalys – Medborgarskapsprov', 'Se dina resultat, styrkor och svagheter inför medborgarskapsprovet.', '/analysis');


export default async function AnalysisPage() {
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

  

  // Fetch all mock exams titles to resolve ID to Title in history
  const mockExams = await prisma.mockExam.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  // Fetch user's test results
  const testResults = await prisma.testResult.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { completedAt: 'desc' },
  });

  // Map to simple JSON-friendly types
  const mappedResults = testResults.map(r => ({
    id: r.id,
    topicId: r.topicId,
    score: r.score,
    correctAnswers: r.correctAnswers,
    wrongAnswers: r.wrongAnswers,
    completedAt: r.completedAt.toISOString(),
  }));

  return (
    <AnalysisClient
      testResults={mappedResults}
      mockExams={mockExams}
      passingScore={settings?.passingScorePercentage ?? 60}
      isPaid={session.user.isPaid || false}
      siteName={settings?.siteName || 'Medborgarskapsprov'}
    />
  );
}

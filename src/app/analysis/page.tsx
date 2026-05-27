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

  // Maintenance Guard
  if (isMaintenance && !isAdmin) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-gutter text-center">
        <div className="w-24 h-24 bg-warning-container text-on-warning-container flex items-center justify-center rounded-full mb-6">
          <span className="material-symbols-outlined text-[48px]">construction</span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-sm">Underhåll pågår</h1>
        <p className="text-on-surface-variant font-body-md max-w-md mb-lg">
          Vår plattform är för närvarande stängd för planerat underhåll. Vänligen försök igen senare.
        </p>
        {settings?.contactEmail && (
          <p className="text-sm font-label-md bg-surface-container px-4 py-2 rounded-full text-on-surface-variant">
            Support: <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">{settings.contactEmail}</a>
          </p>
        )}
      </div>
    );
  }

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

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { auth } from '@/auth';
import ExamPlayerClient from './ExamPlayerClient';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Digitalt test – Medborgarskapsprov | Online Deneme', 'Genomför en digital provsimulering inför medborgarskapsprovet. İsveç vatandaşlık sınavı online deneme ekranı.', '/test');


export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const { examId } = await params;

  // Fetch the Mock Exam and its questions
  const mockExam = await prisma.mockExam.findUnique({
    where: {
      id: examId,
    },
    include: {
      questions: {
        include: {
          question: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!mockExam) {
    notFound();
  }

  const isOwner = mockExam.userId === session.user.id;
  const isAllowed = mockExam.isPublished || (mockExam.isMistakesExam && isOwner);
  if (!isAllowed) {
    notFound();
  }

  // Fetch settings for siteName and passingScorePercentage
  const settings = await prisma.platformSetting.findUnique({
    where: { id: 'global_settings' },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nativeLanguage: true }
  });

  return (
    <ExamPlayerClient
      mockExam={mockExam}
      passingScore={settings?.passingScorePercentage ?? 60}
      siteName={settings?.siteName || 'EduFlow'}
      userId={session.user.id}
      userLang={user?.nativeLanguage || 'TR'}
    />
  );
}

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { auth } from '@/auth';
import PracticeClient from './PracticeClient';

export default async function PracticePage({
  searchParams,
}: {
  searchParams: { topicId?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const topicId = searchParams.topicId;

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
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-sm">Bakım Modundayız</h1>
        <p className="text-on-surface-variant font-body-md max-w-md mb-lg">
          Platformumuz şu anda planlı bakım çalışması nedeniyle geçici olarak hizmet dışıdır. Lütfen daha sonra tekrar deneyin.
        </p>
        {settings?.contactEmail && (
          <p className="text-sm font-label-md bg-surface-container px-4 py-2 rounded-full text-on-surface-variant">
            Destek: <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">{settings.contactEmail}</a>
          </p>
        )}
      </div>
    );
  }

  // Fetch all published topics for the dropdown selector
  const allTopics = await prisma.topic.findMany({
    where: isAdmin ? {} : { isPublished: true },
    orderBy: { order: 'asc' },
  });

  const topic = topicId 
    ? await prisma.topic.findUnique({ where: { id: topicId } }) 
    : null;

  const questions = await prisma.question.findMany({
    where: topicId ? { topicId } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  // Map choices for client rendering
  const mappedQuestions = questions.map((q) => ({
    id: q.id,
    topicId: q.topicId,
    text: q.text,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: q.difficulty,
    isTest: q.isTest,
  }));

  const flashcards = await prisma.flashcard.findMany({
    where: topicId ? { topicId } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  const mappedFlashcards = flashcards.map((f) => ({
    id: f.id,
    topicId: f.topicId,
    front: f.frontText,
    back: f.backText,
  }));

  return (
    <PracticeClient 
      topic={topic} 
      allTopics={allTopics}
      questions={mappedQuestions} 
      flashcards={mappedFlashcards}
      isPaid={session.user.isPaid || false}
      freeDailyQuestionLimit={settings?.freeDailyQuestionLimit ?? 20}
      siteName={settings?.siteName || 'EduFlow'}
      userId={session.user.id}
    />
  );
}

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { auth } from '@/auth';
import PracticeClient from './PracticeClient';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Öva efter ämne – Medborgarskapsprov | Konuya Göre Çalış', 'Öva på frågor och flashcards efter ämne inför medborgarskapsprovet. İsveç vatandaşlık sınavına konu bazlı hazırlan.', '/practice');


export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ topicId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const resolvedParams = await searchParams;
  const topicId = resolvedParams.topicId;

  // Fetch settings for global configurations
  const settings = await prisma.platformSetting.findUnique({
    where: { id: 'global_settings' },
  });

  const isMaintenance = settings?.maintenanceMode ?? false;
  const isAdmin = session.user.role === 'ADMIN';

  

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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { nativeLanguage: true }
  });

  return (
    <PracticeClient 
      topic={topic} 
      allTopics={allTopics}
      questions={mappedQuestions} 
      flashcards={mappedFlashcards}
      isPaid={session.user.isPaid || false}
      freeDailyQuestionLimit={settings?.freeDailyQuestionLimit ?? 20}
      siteName={settings?.siteName || 'Medborgarskapsprov'}
      userId={session.user.id}
      userLang={user?.nativeLanguage || 'TR'}
    />
  );
}

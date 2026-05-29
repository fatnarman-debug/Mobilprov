import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import TopicClient from './TopicClient';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Ämnesstudier – Medborgarskapsprov | Konu Çalışması', 'Läs material, öva frågor och repetera flashcards för ett ämne i medborgarskapsprovet. İsveç vatandaşlık sınavı konu sayfası.', '/topic');


export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const { id } = await params;

  // Fetch Platform Settings
  const settings = await prisma.platformSetting.findUnique({
    where: { id: 'global_settings' },
  });

  const isMaintenance = settings?.maintenanceMode ?? false;
  const isAdmin = session.user.role === 'ADMIN';

  

  // Fetch topic and its related materials
  const topic = await prisma.topic.findUnique({
    where: {
      id,
    },
    include: {
      materials: true,
    },
  });

  if (!topic) {
    notFound();
  }

  return <TopicClient topic={topic} />;
}

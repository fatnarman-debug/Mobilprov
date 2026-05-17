import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import TopicClient from './TopicClient';

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

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

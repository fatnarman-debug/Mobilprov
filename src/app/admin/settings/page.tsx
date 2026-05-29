import React from 'react';
import prisma from '@/lib/db';
import Link from 'next/link';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const settings = await prisma.platformSetting.findUnique({
    where: { id: 'global_settings' }
  });

  return (
    <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">
          <header className="mb-lg">
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Platform Ayarları</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">İş modeli, SEO ve platform kısıtlamalarını kod yazmadan buradan kontrol edebilirsiniz.</p>
          </header>

          <SettingsClient initialSettings={settings} />
        </main>
  );
}

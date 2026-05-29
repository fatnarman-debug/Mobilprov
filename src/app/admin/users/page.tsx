import React from 'react';
import prisma from '@/lib/db';
import Link from 'next/link';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          progress: true,
          testResults: true
        }
      }
    }
  });

  return (
    <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">
          <header className="mb-lg">
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Kullanıcı Yönetimi ve Pazarlama (CRM)</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Platforma kayıtlı tüm kullanıcıları görebilir, üyelik tarihlerini yönetebilir ve pazarlama stratejilerini planlayabilirsiniz.</p>
          </header>

          <UsersClient initialUsers={users} />
        </main>
  );
}

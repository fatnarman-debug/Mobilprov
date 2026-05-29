import React from 'react';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import prisma from '@/lib/db';
import ProfileClient from './ProfileClient';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Profil och konto – Medborgarskapsprov | Kullanıcı Profili', 'Hantera konto, språk, betalning och studieresultat för medborgarskapsprovet. İsveç vatandaşlık sınavı profil ayarları.', '/profile');


export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const userId = session.user.id;

  // Fetch full user details from DB to get up-to-date role and isPaid status
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isPaid: true,
      nativeLanguage: true,
      subscriptionEndsAt: true,
      createdAt: true
    }
  });

  if (!user) {
    redirect('/');
  }

  // Fetch Site Settings
  const settings = await prisma.platformSetting.findUnique({
    where: { id: 'global_settings' },
  });

  // Calculate dynamic stats
  const completedTopicsCount = await prisma.userProgress.count({
    where: {
      userId,
      isCompleted: true
    }
  });

  const totalExamsAttempted = await prisma.testResult.count({
    where: { userId }
  });

  const examStats = await prisma.testResult.aggregate({
    where: { userId },
    _avg: {
      score: true
    },
    _max: {
      score: true
    }
  });

  const averageScore = examStats._avg.score ? Math.round(examStats._avg.score) : 0;
  const maxScore = examStats._max.score ? Math.round(examStats._max.score) : 0;

  // Logout Server Action
  const handleLogout = async () => {
    'use server';
    await signOut({ redirectTo: '/' });
  };

  // Password Change Server Action
  const handlePasswordChange = async (formData: FormData) => {
    'use server';
    const { changeUserPassword } = await import('@/actions/user.actions');
    return await changeUserPassword(userId, formData);
  };

  // Language Change Server Action
  const handleLanguageChange = async (nativeLanguage: string) => {
    'use server';
    const { updateUserLanguage } = await import('@/actions/user.actions');
    return await updateUserLanguage(userId, nativeLanguage);
  };

  return (
    <ProfileClient
      user={{
        ...user,
        subscriptionEndsAt: user.subscriptionEndsAt ? user.subscriptionEndsAt.toISOString() : null,
        createdAt: user.createdAt.toISOString()
      }}
      stats={{
        completedTopicsCount,
        totalExamsAttempted,
        averageScore,
        maxScore
      }}
      settings={{
        siteName: settings?.siteName ?? 'Mobilprov',
        contactEmail: settings?.contactEmail ?? 'destek@mobilprov.se'
      }}
      logoutAction={handleLogout}
      changePasswordAction={handlePasswordChange}
      changeLanguageAction={handleLanguageChange}
    />
  );
}

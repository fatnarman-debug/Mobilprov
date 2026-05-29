import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import StudentHeader from '@/components/student/StudentHeader';
import BottomNav from '@/components/BottomNav';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  // Fetch Platform Settings for Header
  const settings = await prisma.platformSetting.findUnique({
    where: { id: 'global_settings' },
  });

  const isAdmin = session.user.role === 'ADMIN';
  const isMaintenance = settings?.maintenanceMode ?? false;

  // Maintenance Guard
  if (isMaintenance && !isAdmin) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-warning-container text-on-warning-container flex items-center justify-center rounded-full mb-6">
          <span className="material-symbols-outlined text-[48px]">construction</span>
        </div>
        <h1 className="text-3xl font-extrabold text-primary mb-4">Underhåll pågår</h1>
        <p className="text-on-surface-variant max-w-md mb-8">
          Vår plattform är för närvarande stängd för planerat underhåll. Vänligen försök igen senare.
        </p>
        {settings?.contactEmail && (
          <p className="text-sm font-semibold bg-surface-container px-6 py-3 rounded-2xl text-on-surface-variant">
            Support: <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">{settings.contactEmail}</a>
          </p>
        )}
      </div>
    );
  }

  // Fetch full user details to check payment status exactly
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  
  const isUserPaid = dbUser?.isPaid ?? false;
  const userInitial = session.user.name ? session.user.name.charAt(0) : session.user.email?.charAt(0) || 'U';

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen selection:bg-primary/20 selection:text-primary font-sans antialiased flex flex-col">
      <StudentHeader 
        userInitial={userInitial}
        siteName={settings?.siteName || 'Medborgarskapsprov'}
        isAdmin={isAdmin}
        isUserPaid={isUserPaid}
        userId={session.user.id}
      />
      
      {/* 
        The pt-16 is for the TopBar. 
        The md:pb-0 pb-20 is to give space for BottomNav on mobile. 
        It will flow naturally into the pages.
      */}
      <div className="flex-1 flex flex-col pt-16 pb-20 md:pb-0">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}

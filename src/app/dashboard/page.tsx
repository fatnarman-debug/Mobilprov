import React from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import prisma from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Instrumentpanel – Medborgarskapsprov | İsveç Vatandaşlık Paneli', 'Din privata startsida för medborgarskapsprovet med ämnen, framsteg och övningar. İsveç vatandaşlık sınavı çalışma paneliniz.', '/dashboard');


export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

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

  // Fetch topics from the database (only published ones or if ADMIN they can see all for previewing!)
  const topics = await prisma.topic.findMany({
    where: isAdmin ? {} : { isPublished: true },
    orderBy: {
      order: 'asc',
    },
  });

  // Fetch student past test results for solved stats
  const pastResults = await prisma.testResult.findMany({
    where: { userId: session.user.id },
  });

  // Fetch complete User object to see subscription details
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const isUserPaid = dbUser?.isPaid ?? false;
  const subEnds = dbUser?.subscriptionEndsAt;

  // Analytics
  const totalSolved = pastResults.length;

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center px-gutter h-16 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg uppercase">
              {session.user.name ? session.user.name.charAt(0) : session.user.email?.charAt(0)}
            </div>
            <h1 className="font-display-lg text-title-md text-primary font-bold">
              {settings?.siteName || 'EduFlow'}
            </h1>
          </div>
          
          <div className="flex items-center gap-base">
            {isAdmin && (
              <Link href="/admin" className="text-xs bg-error text-on-error font-bold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                ADMINPANEL
              </Link>
            )}
            {isUserPaid ? (
              <span className="bg-tertiary-container text-on-tertiary-container text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span> VIP PREMIUM
              </span>
            ) : (
              <Link href={`/payment?userId=${session.user.id}`} className="bg-primary text-on-primary text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-0.5 hover:bg-primary-dark transition-all">
                UPPGRADERA
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="mt-16 px-gutter pt-md max-w-container-max mx-auto space-y-lg">
        {/* Greeting Section */}
        <section className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low/50 border border-outline-variant/30 rounded-3xl p-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background font-bold text-pretty">
              Hej, {session.user.name || 'studerande'}! 👋
            </h2>
            <p className="text-on-surface-variant font-body-md mt-1">
              Idag är en fantastisk dag att förbereda sig för det svenska medborgarskapsprovet.
            </p>
            {subEnds && (
              <p className="text-xs text-secondary font-semibold mt-2 flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span> 
                Din prenumeration löper ut den {new Date(subEnds).toLocaleDateString('sv-SE')}.
              </p>
            )}
          </div>

          {!isUserPaid && (
            <div className="w-full md:w-auto bg-primary-container/5 border border-primary-container/10 p-md rounded-2xl space-y-sm">
              <span className="text-xs font-bold text-primary uppercase block tracking-wider">Kostnadsfritt testkonto</span>
              <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
                Du kan lösa max {settings?.freeDailyQuestionLimit ?? 20} övningsfrågor per dag. Bli VIP Premium för obegränsad övning och prov i 1 år.
              </p>
              <Link 
                href={`/payment?userId=${session.user.id}`}
                className="w-full md:w-auto py-2.5 px-5 bg-primary text-on-primary font-bold text-xs rounded-full hover:bg-primary-dark active:scale-95 transition-all inline-flex justify-center items-center gap-xs shadow-sm"
              >
                <span className="material-symbols-outlined text-xs">workspace_premium</span>
                Bli Premium VIP (299 kr / 1 år)
              </Link>
            </div>
          )}
        </section>

        {/* Topic Categories */}
        <section className="space-y-md">
          <div className="flex justify-between items-end px-xs">
            <h3 className="font-title-md text-title-md text-on-background font-bold text-pretty">Studieämnen</h3>
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">TOTALT {topics.length} ÄMNEN</span>
          </div>

          {topics.length === 0 ? (
            <div className="p-lg border-2 border-dashed border-outline-variant/30 rounded-3xl text-center bg-surface-container-lowest">
              <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-sm">library_books</span>
              <p className="text-on-surface-variant font-body-md">Det finns inga publicerade ämnen ännu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {topics.map((topic, index) => {
                const colors = [
                  { bg: 'bg-primary-container/5 border-primary-container/10', text: 'text-primary', bar: 'bg-primary' },
                  { bg: 'bg-secondary-container/10 border-secondary-container/15', text: 'text-secondary', bar: 'bg-secondary' },
                  { bg: 'bg-tertiary-container/5 border-tertiary-container/10', text: 'text-tertiary', bar: 'bg-tertiary' }
                ];
                const theme = colors[index % colors.length];

                return (
                  <Link 
                    key={topic.id} 
                    href={`/topic/${topic.id}`} 
                    className="group block bg-surface-container-lowest p-md rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/20 hover:scale-[1.01] transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-md">
                      <div className="flex items-center gap-md">
                        <div className={`w-12 h-12 rounded-2xl ${theme.bg} border flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                          <span className={`material-symbols-outlined ${theme.text}`} style={{fontVariationSettings: "'FILL' 1"}}>menu_book</span>
                        </div>
                        <div>
                          <h4 className="font-title-md text-title-md text-on-surface font-bold text-pretty group-hover:text-primary transition-colors">{topic.title}</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{topic.category}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-1.5 transition-transform duration-300">arrow_forward</span>
                    </div>
                    {topic.description && (
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                        {topic.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Stats Quick View */}
        <section className="space-y-md">
          <h3 className="font-title-md text-title-md text-on-background font-bold text-pretty px-xs">Min studieanalys</h3>
          <div className="grid grid-cols-2 gap-md">
            <div className="bg-gradient-to-br from-primary/5 to-primary-container/10 border border-primary-container/15 text-primary p-md rounded-3xl flex flex-col gap-xs justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
              <div>
                <span className="font-display-lg text-3xl font-extrabold block">{totalSolved}</span>
                <span className="font-label-md text-[10px] opacity-80 uppercase font-bold tracking-wider">Genomförda prov</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary/5 to-secondary-container/10 border border-secondary-container/15 text-secondary p-md rounded-3xl flex flex-col gap-xs justify-between shadow-sm hover:shadow-md transition-all duration-300">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
              <div>
                <span className="font-display-lg text-3xl font-extrabold block">{topics.length}</span>
                <span className="font-label-md text-[10px] opacity-80 uppercase font-bold tracking-wider">Aktiva ämnen</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav activeTab="topics" />
    </div>
  );
}

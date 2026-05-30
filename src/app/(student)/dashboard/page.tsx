import React from 'react';
import Link from 'next/link';
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

  return ( <main className="px-4 md:px-8 pt-6 lg:pt-10 max-w-[1600px] w-full mx-auto space-y-8">
        {/* Greeting Section */}
        <section className="bg-gradient-to-br from-white to-surface-container-lowest dark:from-surface-container-low/50 dark:to-background border border-outline-variant/50 rounded-[2rem] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
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
                Bli Premium VIP (199 kr / 1 år)
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
                    className="group block bg-white dark:bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 group"
                  >
                    <div className="flex justify-between items-start mb-md">
                      <div className="flex items-center gap-md">
                        <div className={`w-14 h-14 rounded-2xl shadow-sm ${theme.bg} border flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
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

      
    
  );
}

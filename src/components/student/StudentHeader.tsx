import React from 'react';
import Link from 'next/link';

export default function StudentHeader({
  userInitial,
  siteName,
  isAdmin,
  isUserPaid,
  userId,
}: {
  userInitial: string;
  siteName: string;
  isAdmin: boolean;
  isUserPaid: boolean;
  userId: string;
}) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 h-16 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-8 h-full w-full max-w-[1600px] mx-auto">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/80 shadow-lg shadow-primary/20 text-white flex items-center justify-center font-bold text-lg uppercase transition-transform duration-300">
            {userInitial}
          </div>
          <h1 className="font-display-sm text-lg md:text-xl text-on-surface font-extrabold tracking-tight">
            {siteName}
          </h1>
        </Link>
        
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link href="/admin" className="text-xs bg-error/10 text-error hover:bg-error hover:text-white font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-sm">
              ADMIN
            </Link>
          )}
          {isUserPaid ? (
            <div className="bg-gradient-to-r from-tertiary/10 to-tertiary/5 border border-tertiary/20 text-tertiary text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-default">
              <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span> 
              <span className="hidden sm:inline">VIP</span> PREMIUM
            </div>
          ) : (
            <Link href={`/payment?userId=${userId}`} className="bg-primary hover:bg-primary/90 text-white text-xs px-5 py-2 rounded-xl font-bold flex items-center gap-1.5 hover:-translate-y-0.5 shadow-lg shadow-primary/30 active:scale-95 transition-all duration-300">
              UPPGRADERA
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

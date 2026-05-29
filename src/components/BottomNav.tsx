'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Helper function to check if a path is active
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');
  // dashboard or topic -> topics tab
  const isTopicsActive = pathname === '/dashboard' || pathname?.startsWith('/topic/');

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-2 bg-white/80 dark:bg-background/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] z-50 transition-all duration-300 md:hidden">
      <Link href="/dashboard" className={`flex flex-col items-center justify-center rounded-2xl px-3 py-1.5 active:scale-95 transition-all duration-300 ${isTopicsActive ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[24px] mb-0.5 transition-transform duration-300" style={isTopicsActive ? {fontVariationSettings: "'FILL' 1"} : {}}>auto_stories</span>
        <span className="font-label-md text-[10px] tracking-wider font-semibold">Ämnen</span>
      </Link>
      <Link href="/practice" className={`flex flex-col items-center justify-center rounded-2xl px-3 py-1.5 active:scale-95 transition-all duration-300 ${isActive('/practice') || isActive('/ovning') ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[24px] mb-0.5 transition-transform duration-300" style={isActive('/practice') || isActive('/ovning') ? {fontVariationSettings: "'FILL' 1"} : {}}>quiz</span>
        <span className="font-label-md text-[10px] tracking-wider font-semibold">Öva</span>
      </Link>
      <Link href="/test" className={`flex flex-col items-center justify-center rounded-2xl px-3 py-1.5 active:scale-95 transition-all duration-300 ${isActive('/test') ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[24px] mb-0.5 transition-transform duration-300" style={isActive('/test') ? {fontVariationSettings: "'FILL' 1"} : {}}>history_edu</span>
        <span className="font-label-md text-[10px] tracking-wider font-semibold">Prov</span>
      </Link>
      <Link href="/analysis" className={`flex flex-col items-center justify-center rounded-2xl px-3 py-1.5 active:scale-95 transition-all duration-300 ${isActive('/analysis') ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[24px] mb-0.5 transition-transform duration-300" style={isActive('/analysis') ? {fontVariationSettings: "'FILL' 1"} : {}}>leaderboard</span>
        <span className="font-label-md text-[10px] tracking-wider font-semibold">Analys</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center justify-center rounded-2xl px-3 py-1.5 active:scale-95 transition-all duration-300 ${isActive('/profile') ? 'bg-primary/10 text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[24px] mb-0.5 transition-transform duration-300" style={isActive('/profile') ? {fontVariationSettings: "'FILL' 1"} : {}}>person</span>
        <span className="font-label-md text-[10px] tracking-wider font-semibold">Profil</span>
      </Link>
    </nav>
  );
}

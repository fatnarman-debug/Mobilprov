'use client';

import React from 'react';
import Link from 'next/link';

export default function BottomNav({ activeTab = 'topics' }: { activeTab?: 'topics' | 'practice' | 'exams' | 'analysis' | 'profile' }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-2 bg-surface dark:bg-background border-t border-outline-variant shadow-sm z-50">
      <Link href="/dashboard" className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'topics' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[22px]" style={activeTab === 'topics' ? {fontVariationSettings: "'FILL' 1"} : {}}>auto_stories</span>
        <span className="font-label-md text-[10px] mt-xs">Ämnen</span>
      </Link>
      <Link href="/practice" className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'practice' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[22px]" style={activeTab === 'practice' ? {fontVariationSettings: "'FILL' 1"} : {}}>quiz</span>
        <span className="font-label-md text-[10px] mt-xs">Öva</span>
      </Link>
      <Link href="/test" className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'exams' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[22px]" style={activeTab === 'exams' ? {fontVariationSettings: "'FILL' 1"} : {}}>history_edu</span>
        <span className="font-label-md text-[10px] mt-xs">Prov</span>
      </Link>
      <Link href="/analysis" className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'analysis' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[22px]" style={activeTab === 'analysis' ? {fontVariationSettings: "'FILL' 1"} : {}}>leaderboard</span>
        <span className="font-label-md text-[10px] mt-xs">Analys</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1 active:scale-95 transition-transform duration-150 ${activeTab === 'profile' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[22px]" style={activeTab === 'profile' ? {fontVariationSettings: "'FILL' 1"} : {}}>person</span>
        <span className="font-label-md text-[10px] mt-xs">Profil</span>
      </Link>
    </nav>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

type TestResult = {
  id: string;
  topicId: string | null;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedAt: string;
};

type MockExamInfo = {
  id: string;
  title: string;
};

type AnalysisClientProps = {
  testResults: TestResult[];
  mockExams: MockExamInfo[];
  passingScore: number;
  isPaid: boolean;
  siteName: string;
};

export default function AnalysisClient({
  testResults,
  mockExams,
  passingScore,
  isPaid,
  siteName,
}: AnalysisClientProps) {
  // Aggregate calculations
  const totalExams = testResults.length;
  const avgScore = totalExams > 0 
    ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / totalExams) 
    : 0;
  const maxScore = totalExams > 0 
    ? Math.round(Math.max(...testResults.map(r => r.score))) 
    : 0;
  const totalCorrect = testResults.reduce((acc, r) => acc + r.correctAnswers, 0);
  const totalWrong = testResults.reduce((acc, r) => acc + r.wrongAnswers, 0);

  // Helper to map exam ID to Exam Title
  const getExamTitle = (topicId: string | null) => {
    if (!topicId) return 'Generellt prov';
    const found = mockExams.find(m => m.id === topicId);
    return found ? found.title : 'Övningsprov';
  };

  // Date format helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('sv-SE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Okänt datum';
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant h-16 flex items-center px-gutter justify-between">
        <div className="flex items-center gap-base">
          <Link href="/dashboard" className="w-8 h-8 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <h1 className="font-display-lg text-title-md text-primary font-bold">{siteName}</h1>
        </div>
        <div className="flex items-center gap-sm">
          <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-bold">
            Avancerad statistik
          </span>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="mt-20 px-gutter max-w-container-max mx-auto space-y-lg">
        
        {/* Performance Header Banner */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm space-y-xs">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary">analytics</span>
            <h2 className="font-headline-lg-mobile text-lg font-bold text-primary">Resultat- & prestationsanalys</h2>
          </div>
          <p className="text-on-surface-variant font-body-sm text-xs">
            Resultat, framsteg och detaljerad historik för dina genomförda prov.
          </p>
        </section>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-sm">
          {/* Average Success Rate Card */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
            <div className="relative w-20 h-20 mb-base">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--md-sys-color-outline-variant)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--md-sys-color-secondary)" strokeWidth="3" strokeDasharray={`${avgScore}, 100`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-title-md text-title-md text-primary font-bold">{avgScore}%</span>
            </div>
            <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-[10px]">Genomsnittligt resultat</span>
          </div>

          {/* Highest Score Card */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="material-symbols-outlined text-[36px] text-tertiary mb-xs">workspace_premium</span>
            <span className="text-2xl font-bold text-primary">{maxScore}%</span>
            <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-[10px] mt-xs">Högsta resultat</span>
          </div>

          {/* Total Solved Card */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
            <span className="material-symbols-outlined text-[36px] text-secondary mb-xs">assignment_turned_in</span>
            <span className="text-2xl font-bold text-primary">{totalExams}</span>
            <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-[10px] mt-xs">Genomförda prov</span>
          </div>

          {/* Correct / Wrong Split Card */}
          <div className="bg-surface-container-low border border-outline-variant p-md rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between w-full">
              <span className="text-secondary font-bold text-title-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">done</span> {totalCorrect} Rätt
              </span>
              <span className="text-error font-bold text-title-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-sm">close</span> {totalWrong} Fel
              </span>
            </div>
            <div className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-[10px] text-center mt-xs">Svarsfördelning</div>
            <div className="h-2 w-full bg-outline-variant rounded-full overflow-hidden mt-base">
              <div 
                className="bg-secondary h-full transition-all duration-300" 
                style={{ width: `${totalCorrect + totalWrong > 0 ? (totalCorrect / (totalCorrect + totalWrong)) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Test Attempts Log Section */}
        <section className="space-y-md">
          <div className="flex items-center justify-between px-xs">
            <h3 className="font-headline-sm text-primary font-bold flex items-center gap-sm">
              <span className="material-symbols-outlined">history</span>
              Historik över genomförda prov
            </h3>
            <span className="bg-secondary-container text-on-secondary-container font-bold text-[10px] uppercase px-3 py-1 rounded-full">
              {totalExams} genomförda prov
            </span>
          </div>

          {testResults.length === 0 ? (
            <div className="p-lg border-2 border-dashed border-outline-variant rounded-2xl text-center bg-surface-container-lowest">
              <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-sm">bar_chart</span>
              <p className="text-on-surface-variant font-body-md">Du har inte slutfört något övningsprov än.</p>
              <Link 
                href="/test" 
                className="mt-sm px-6 py-2 bg-primary text-on-primary font-bold text-xs rounded-full inline-flex items-center gap-xs active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-xs">play_arrow</span> Gå till prov
              </Link>
            </div>
          ) : (
            <div className="space-y-sm">
              {testResults.map((result) => {
                const isPassed = result.score >= passingScore;
                return (
                  <div 
                    key={result.id} 
                    className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md"
                  >
                    <div className="space-y-xs">
                      <div className="flex items-center gap-base">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${isPassed ? 'bg-secondary' : 'bg-error'}`}></span>
                        <h4 className="font-title-md font-bold text-primary">{getExamTitle(result.topicId)}</h4>
                      </div>
                      <div className="flex items-center gap-md text-[11px] text-on-surface-variant pl-5">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-xs">calendar_month</span> {formatDate(result.completedAt)}
                        </span>
                        <span className="flex items-center gap-xs font-semibold text-secondary">
                          {result.correctAnswers} Rätt
                        </span>
                        <span className="flex items-center gap-xs font-semibold text-error">
                          {result.wrongAnswers} Fel
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-md pl-5 sm:pl-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${isPassed ? 'bg-secondary/15 text-secondary' : 'bg-error/15 text-error'}`}>
                        {isPassed ? 'GODKÄND' : 'UNDERKÄND'}
                      </span>
                      <span className="text-xl font-bold text-primary">{Math.round(result.score)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      <BottomNav activeTab="analysis" />
    </div>
  );
}

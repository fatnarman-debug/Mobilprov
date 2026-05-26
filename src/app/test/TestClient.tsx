'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { createWrongQuestionsExam } from '@/actions/mockExam.actions';

type MockExam = {
  id: string;
  title: string;
  description: string | null;
  durationMin: number;
  questions: { id: string }[];
};

type TestResult = {
  id: string;
  topicId: string | null;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  completedAt: Date;
};

type TestClientProps = {
  mockExams: MockExam[];
  testResults: TestResult[];
  passingScore: number;
  isPaid: boolean;
  siteName: string;
  userId: string;
  userLang: string;
  wrongQuestionsCount: number;
};

export default function TestClient({
  mockExams,
  testResults,
  passingScore,
  isPaid,
  siteName,
  userId,
  userLang,
  wrongQuestionsCount,
}: TestClientProps) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [generatingExam, setGeneratingExam] = useState(false);
  const [examError, setExamError] = useState<string | null>(null);

  const handleCreateMistakesExam = async () => {
    setGeneratingExam(true);
    setExamError(null);
    try {
      const res = await createWrongQuestionsExam(userId);
      if (res.error) {
        setExamError(res.error);
      } else if (res.examId) {
        window.location.href = `/test/${res.examId}`;
      }
    } catch (e) {
      console.error(e);
      setExamError('Hata sınavı üretilirken bilinmeyen bir hata oluştu.');
    } finally {
      setGeneratingExam(false);
    }
  };

  // Handle Mock Exam launch
  const handleStartExam = (examId: string, index: number) => {
    // Lock exams beyond index 0 for free users to prompt upgrades
    if (!isPaid && index > 0) {
      setShowPaywall(true);
      return;
    }
    window.location.href = `/test/${examId}`;
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
          {!isPaid && (
            <span className="bg-primary-container text-on-primary-container text-xs px-3 py-1 rounded-full font-bold">
              Ücretsiz Sürüm
            </span>
          )}
          <span className="material-symbols-outlined text-primary">history_edu</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mt-20 px-gutter max-w-container-max mx-auto space-y-lg">
        
        {/* Exams Center Header */}
        <section className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low/50 border border-outline-variant/30 rounded-3xl p-md shadow-sm space-y-xs">
          <div className="flex items-center gap-xs">
            <span className="material-symbols-outlined text-primary">history_edu</span>
            <h2 className="font-headline-lg-mobile text-lg font-bold text-primary text-pretty">Deneme Sınavı Merkezi</h2>
          </div>
          <p className="text-on-surface-variant font-body-sm text-xs">
            Yöneticiler tarafından hazırlanan güncel deneme sınavlarını seçerek süreli gerçek sınav simülasyonunu başlatın.
          </p>
        </section>

        {/* Hata Defteri / Mistakes Notebook Section */}
        <section 
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.03), rgba(124, 58, 237, 0.03))',
            border: '1px solid rgba(124, 58, 237, 0.1)'
          }}
          className="rounded-3xl p-md shadow-sm space-y-md relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-base border-b border-outline-variant/30 pb-sm">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-error font-bold">menu_book</span>
              <h3 className="font-headline-sm text-primary font-bold text-base sm:text-lg text-pretty">Hata Defteri & Sıfır Hata Döngüsü</h3>
            </div>
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${wrongQuestionsCount > 0 ? 'bg-error/15 text-error border border-error/20' : 'bg-secondary/15 text-secondary border border-secondary/20'}`}>
              {wrongQuestionsCount} Yanlış Soru
            </span>
          </div>

          <div className="space-y-sm">
            {wrongQuestionsCount > 0 ? (
              <>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Çözdüğünüz denemelerde yanlış cevapladığınız sorular burada biririk. Hatalarınızdan yeni bir deneme sınavı üreterek, sıfır yanlışa ulaşana kadar kendinizi deneyebilir ve eksiklerinizi tamamlayabilirsiniz.
                </p>
                {examError && (
                  <div className="text-xs font-bold text-error bg-error/10 px-3 py-2 rounded-xl border border-error/20">
                    ⚠️ {examError}
                  </div>
                )}
                <button
                  onClick={handleCreateMistakesExam}
                  disabled={generatingExam}
                  className="w-full sm:w-auto px-6 py-3 bg-secondary text-on-secondary font-bold rounded-full shadow-md hover:bg-secondary/90 transition-all flex items-center justify-center gap-xs active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
                >
                  <span className="material-symbols-outlined text-sm animate-pulse">{generatingExam ? 'progress_activity' : 'bolt'}</span>
                  {generatingExam ? 'Sınav Üretiliyor…' : 'Hatalarımdan Sınav Üret 🚀'}
                </button>
              </>
            ) : (
              <div className="flex items-start gap-md py-sm">
                <span className="text-3xl">🎯</span>
                <div>
                  <h4 className="font-title-sm text-secondary font-bold text-sm text-pretty">Tebrikler! Hiç Yanlışınız Kalmadı.</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                    Hata defteriniz tamamen temiz. Bilgileriniz tam ve sınava tamamen hazırsınız! Yeni denemeler çözerek hatalarınızı sıfırda tutmaya çalışın.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mock Exams List Section */}
        <section className="space-y-md">
          <div className="flex items-center justify-between px-xs">
            <h3 className="font-headline-sm text-primary font-bold flex items-center gap-sm text-pretty">
              <span className="material-symbols-outlined text-secondary">library_books</span>
              Aktif Denemeler
            </h3>
            <span className="bg-primary/10 text-primary font-bold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider">
              {mockExams.length} Deneme
            </span>
          </div>

          {mockExams.length === 0 ? (
            <div className="p-lg border-2 border-dashed border-outline-variant/30 rounded-3xl text-center bg-surface-container-lowest">
              <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-sm">history_edu</span>
              <p className="text-on-surface-variant font-body-md">Şu anda yayınlanmış deneme sınavı bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {mockExams.map((exam, index) => {
                // Find user's best attempt score on this specific exam
                const examAttempts = testResults.filter(r => r.topicId === exam.id);
                const bestExamScore = examAttempts.length > 0
                  ? Math.max(...examAttempts.map(r => r.score))
                  : null;

                const isLocked = !isPaid && index > 0;

                return (
                  <div 
                    key={exam.id} 
                    className="group bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-md shadow-sm hover:shadow-md hover:border-primary/20 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between gap-md relative overflow-hidden"
                  >
                    {/* VIP Ribbon Overlay */}
                    {isLocked && (
                      <div className="absolute top-0 right-0 bg-primary text-on-primary font-bold text-[9px] uppercase px-3 py-1 rounded-bl-2xl flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[10px]">lock</span> VIP Premium
                      </div>
                    )}

                    <div className="space-y-xs">
                      <div className="flex items-center gap-base">
                        <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-bold text-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          {index + 1}
                        </span>
                        <h4 className="font-title-md font-bold text-primary truncate max-w-[200px] md:max-w-xs group-hover:text-primary transition-colors">{exam.title}</h4>
                      </div>

                      {exam.description && (
                        <p className="text-xs text-on-surface-variant line-clamp-2 pt-xs">
                          {exam.description}
                        </p>
                      )}

                      <div className="flex gap-md pt-xs text-[11px] text-on-surface-variant">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">timer</span> {exam.durationMin} Dakika
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[14px]">quiz</span> {exam.questions.length} Soru
                        </span>
                      </div>
                    </div>

                    <div className="pt-sm border-t border-outline-variant/50 flex items-center justify-between">
                      {/* Previous attempts info */}
                      <div>
                        {bestExamScore !== null ? (
                          <div className="space-y-xs">
                            <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block">En İyi Skorunuz</span>
                            <span className={`font-title-sm text-xs font-bold px-2.5 py-0.5 rounded-full ${bestExamScore >= passingScore ? 'bg-secondary/15 text-secondary' : 'bg-error/15 text-error'}`}>
                              %{Math.round(bestExamScore)} ({bestExamScore >= passingScore ? 'Geçti' : 'Kaldı'})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-on-surface-variant font-label-md italic">Henüz çözülmedi</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartExam(exam.id, index)}
                        className={`px-4 py-2 rounded-full font-title-sm text-xs flex items-center gap-xs transition-all active:scale-95 cursor-pointer ${isLocked ? 'bg-outline-variant text-on-surface-variant' : 'bg-primary text-on-primary hover:bg-primary-dark hover:shadow-md shadow-sm'}`}
                      >
                        <span className="material-symbols-outlined text-xs">{isLocked ? 'lock' : 'play_arrow'}</span>
                        {isLocked ? 'Kilitli (VIP)' : 'Sınavı Başlat'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav activeTab="exams" />

      {/* --- STRIPE PREMIUM UPGRADE PAYWALL MODAL --- */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative border border-outline-variant p-6 text-center space-y-md">
            
            <button 
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
              <span className="material-symbols-outlined text-[36px]">star</span>
            </div>

            <div className="space-y-xs">
              <h3 className="font-headline-sm text-xl font-bold text-primary">Sınav Kilidini Açın (VIP)</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Bu deneme sınavına ve diğer tüm kilitli denemelere sınırsız erişim kazanmak için hesabınızı Premium VIP seviyesine yükseltin.
              </p>
            </div>

            <div className="bg-surface-container-low p-md rounded-2xl text-left border border-outline-variant">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">Premium VIP Avantajları</span>
              <ul className="space-y-1 text-xs text-on-surface">
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span> Sınırsız Soru & Flashcard Çözümü
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span> Tüm Sabit Deneme Sınavlarına Erişim
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span> Detaylı Performans ve Sınav Analizi
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href={`/payment?userId=${userId}`}
                className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-xs"
              >
                <span className="material-symbols-outlined">workspace_premium</span>
                Premium VIP'ye Yükselt
              </Link>
            </div>

            <p className="text-[10px] text-on-surface-variant opacity-70">
              299 kr ödemeyle 1 yıl boyunca tam erişim kazanın.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { saveTestResult } from '@/actions/testResult.actions';
import GlossaryText from '@/components/GlossaryText';
import { translateText } from '@/actions/translate.actions';
import type { MockExam, Question } from '@prisma/client';

type MockExamWithQuestions = MockExam & {
  questions: {
    id: string;
    question: Question;
    order: number;
  }[];
};

type ExamPlayerProps = {
  mockExam: MockExamWithQuestions;
  passingScore: number;
  siteName: string;
  userId: string;
  userLang: string;
};

export default function ExamPlayerClient({ mockExam, passingScore, siteName, userId, userLang }: ExamPlayerProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mockExam.durationMin * 60);

  // Explanation translation states for review screen
  const [translatedExplanations, setTranslatedExplanations] = useState<Record<string, string>>({});
  const [translatingExplanationIds, setTranslatingExplanationIds] = useState<Record<string, boolean>>({});
  const [translationErrors, setTranslationErrors] = useState<Record<string, string>>({});

  const handleTranslateExplanation = async (questionId: string, explanationText: string) => {
    setTranslatingExplanationIds(prev => ({ ...prev, [questionId]: true }));
    setTranslationErrors(prev => ({ ...prev, [questionId]: '' }));
    try {
      const res = await translateText(explanationText, userLang);
      if (res.error) {
        setTranslationErrors(prev => ({ ...prev, [questionId]: res.error }));
      } else if (res.translation) {
        setTranslatedExplanations(prev => ({ ...prev, [questionId]: res.translation }));
      }
    } catch (err) {
      console.error(err);
      setTranslationErrors(prev => ({ ...prev, [questionId]: 'Ett fel uppstod vid översättning.' }));
    } finally {
      setTranslatingExplanationIds(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Result stats
  const [results, setResults] = useState<{
    score: number;
    correct: number;
    wrong: number;
    empty: number;
  } | null>(null);

  // Kaldığı Yerden Devam Etme (State Persistence) - Yükleme
  useEffect(() => {
    const saved = localStorage.getItem(`exam_${mockExam.id}_state`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.answers === 'object' && parsed.answers !== null) {
          setSelectedAnswers(parsed.answers);
        }
        if (typeof parsed?.currentIdx === 'number') setCurrentIdx(parsed.currentIdx);
        if (typeof parsed?.timeLeft === 'number') setTimeLeft(parsed.timeLeft);
      } catch (e) {
        console.error("Failed to restore exam state from localStorage:", e);
        localStorage.removeItem(`exam_${mockExam.id}_state`);
      }
    }
  }, [mockExam.id]);

  // Kaldığı Yerden Devam Etme (State Persistence) - Kaydetme
  useEffect(() => {
    if (isSubmitted) {
      localStorage.removeItem(`exam_${mockExam.id}_state`);
      return;
    }
    localStorage.setItem(`exam_${mockExam.id}_state`, JSON.stringify({
      answers: selectedAnswers,
      currentIdx,
      timeLeft
    }));
  }, [selectedAnswers, currentIdx, timeLeft, isSubmitted, mockExam.id]);

  // Timer Countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));

    // Otomatik sonraki soruya geçiş (Auto-advance)
    if (currentIdx < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
      }, 250); // 250ms smooth transition delay
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setSaving(true);
    
    // Sınav bittiği için geçici hafızayı temizle
    localStorage.removeItem(`exam_${mockExam.id}_state`);

    let correct = 0;
    let wrong = 0;
    let empty = 0;
    const wrongQuestionIds: string[] = [];
    const correctQuestionIds: string[] = [];

    mockExam.questions.forEach(({ question }) => {
      const selected = selectedAnswers[question.id];
      if (!selected) {
        empty++;
        wrongQuestionIds.push(question.id);
      } else if (selected === question.correctAnswer) {
        correct++;
        correctQuestionIds.push(question.id);
      } else {
        wrong++;
        wrongQuestionIds.push(question.id);
      }
    });

    const totalQuestions = mockExam.questions.length;
    const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    // Save to DB
    const res = await saveTestResult({
      userId,
      topicId: mockExam.id, // we save the mock exam ID inside topicId as a reference for analytics
      score,
      correctAnswers: correct,
      wrongAnswers: wrong,
      wrongQuestionIds,
      correctQuestionIds,
    });

    if (res.error) {
      alert(res.error);
    }

    setResults({
      score,
      correct,
      wrong,
      empty,
    });
    setIsSubmitted(true);
    setSaving(false);
  };

  const currentItem = mockExam.questions[currentIdx];
  const totalQuestions = mockExam.questions.length;

  if (totalQuestions === 0) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">warning</span>
        <h2 className="text-xl font-bold">Det finns inga frågor i detta prov!</h2>
        <p className="text-on-surface-variant mt-2 mb-6">Administratören har inte lagt till några frågor till detta övningsprov än.</p>
        <Link href="/test" className="px-6 py-3 bg-primary text-on-primary rounded-full font-title-sm">Gå tillbaka</Link>
      </div>
    );
  }

  // --- RESULT VIEW ---
  if (isSubmitted && results) {
    const isPassed = results.score >= passingScore;

    return (
      <div className="bg-background font-body-md text-on-background min-h-screen pb-20">
        <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant h-16 flex items-center px-gutter justify-between">
          <span className="font-title-md text-primary font-bold">{mockExam.title} - Resultat</span>
          <Link href="/test" className="px-4 py-1.5 border border-outline-variant rounded-full text-sm font-title-sm hover:bg-surface-container-low transition-colors">
            Gå till prov
          </Link>
        </header>

        <main className="mt-20 px-gutter max-w-container-max mx-auto space-y-lg">
          {/* Main Success Badge Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-lg shadow-sm flex flex-col items-center text-center space-y-md">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isPassed ? 'bg-secondary-container text-on-secondary-container animate-bounce' : 'bg-error/10 text-error'}`}>
              <span className="material-symbols-outlined text-[48px]">
                {isPassed ? 'emoji_events' : 'cancel'}
              </span>
            </div>
            
            <div className="space-y-sm">
              <h2 className={`font-headline-lg-mobile text-2xl font-bold ${isPassed ? 'text-secondary' : 'text-error'}`}>
                {isPassed ? 'Grattis, du blev godkänd på provet! 🎉' : 'Tyvärr blev du inte godkänd.'}
              </h2>
              <p className="text-on-surface-variant text-sm max-w-md">
                {isPassed 
                  ? 'Fantastiskt resultat! Din procentandel ligger över godkändgränsen.' 
                  : `Godkändgränsen för detta prov är %${passingScore} och ditt resultat blev %${results.score}. Repetera ämnena och försök igen.`
                }
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md w-full max-w-xl pt-md">
              <div className="bg-surface-container-low p-md rounded-2xl flex flex-col items-center">
                <span className="text-3xl font-extrabold text-primary">%{results.score}</span>
                <span className="text-xs text-on-surface-variant font-label-md uppercase tracking-wider mt-1">Resultat</span>
              </div>
              <div className="bg-surface-container-low p-md rounded-2xl flex flex-col items-center">
                <span className="text-3xl font-extrabold text-secondary">{results.correct}</span>
                <span className="text-xs text-on-surface-variant font-label-md uppercase tracking-wider mt-1">Rätt svar</span>
              </div>
              <div className="bg-surface-container-low p-md rounded-2xl flex flex-col items-center">
                <span className="text-3xl font-extrabold text-error">{results.wrong}</span>
                <span className="text-xs text-on-surface-variant font-label-md uppercase tracking-wider mt-1">Felaktiga svar</span>
              </div>
              <div className="bg-surface-container-low p-md rounded-2xl flex flex-col items-center">
                <span className="text-3xl font-extrabold text-on-surface-variant">{results.empty}</span>
                <span className="text-xs text-on-surface-variant font-label-md uppercase tracking-wider mt-1">Obesvarade</span>
              </div>
            </div>
          </div>

          {/* Question Review Section */}
          <section className="space-y-md">
            <h3 className="font-title-md text-title-md text-on-background font-bold">Detaljerad genomgång av frågor</h3>
            <div className="space-y-lg">
              {mockExam.questions.map(({ question }, idx) => {
                const selected = selectedAnswers[question.id];
                const isCorrect = selected === question.correctAnswer;

                return (
                  <div key={question.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm space-y-md">
                    <div className="flex justify-between items-center pb-base border-b border-outline-variant">
                      <span className="text-primary font-bold">Fråga {idx + 1}</span>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-secondary-container text-on-secondary-container' : selected ? 'bg-error/10 text-error' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        {isCorrect ? 'RÄTT' : selected ? 'FEL' : 'TOM'}
                      </span>
                    </div>

                    <p className="text-on-surface font-body-md whitespace-pre-wrap">
                      <GlossaryText text={question.text} language={userLang} />
                    </p>

                    {/* Choices Review */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                      {['A', 'B', 'C', 'D'].map((opt) => {
                        const optText = question[`option${opt}` as keyof Question] as string;
                        const isThisCorrect = question.correctAnswer === opt;
                        const isThisSelected = selected === opt;

                        let cardStyle = 'border border-outline-variant bg-surface';
                        let optStyle = 'border border-outline text-on-surface-variant';

                        if (isThisCorrect) {
                          cardStyle = 'border-2 border-secondary bg-secondary-container/20';
                          optStyle = 'bg-secondary text-on-secondary';
                        } else if (isThisSelected && !isCorrect) {
                          cardStyle = 'border-2 border-error bg-error-container/10';
                          optStyle = 'bg-error text-on-error';
                        }

                        return (
                          <div key={opt} className={`flex items-center p-md rounded-xl text-left ${cardStyle}`}>
                            <span className={`w-8 h-8 rounded-full font-title-md text-sm flex items-center justify-center mr-md ${optStyle}`}>{opt}</span>
                            <span className="font-body-md text-sm text-on-surface">
                              <GlossaryText text={optText} language={userLang} />
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="bg-primary-container/15 text-on-primary-container p-md rounded-xl border border-primary/10 space-y-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-xs text-primary">
                            <span className="material-symbols-outlined text-[18px]">info</span>
                            <span className="font-bold text-sm">Förklaring</span>
                          </div>
                          
                          <button
                            onClick={() => handleTranslateExplanation(question.id, question.explanation || '')}
                            disabled={translatingExplanationIds[question.id]}
                            className="text-[10px] font-bold text-secondary bg-secondary/15 hover:bg-secondary/25 px-2 py-0.5 rounded transition-colors flex items-center gap-1 active:scale-95 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined !text-[12px]">{translatingExplanationIds[question.id] ? 'progress_activity' : 'translate'}</span>
                            {translatedExplanations[question.id] ? 'Uppdatera översättning' : 'Översätt förklaring'}
                          </button>
                        </div>
                        
                        <p className="font-body-sm text-xs leading-relaxed text-on-surface-variant">
                          <GlossaryText text={question.explanation} language={userLang} />
                        </p>

                        {translatedExplanations[question.id] && (
                          <div className="bg-surface-container/60 p-sm rounded-xl border border-outline-variant/20 mt-xs animate-in fade-in duration-200">
                            <span className="text-[9px] font-bold text-secondary uppercase tracking-wider block mb-1">Översättning ({userLang})</span>
                            <p className="text-on-surface font-body-sm text-xs leading-relaxed italic">{translatedExplanations[question.id]}</p>
                          </div>
                        )}

                        {translationErrors[question.id] && (
                          <p className="text-xs text-error font-semibold mt-1">⚠️ {translationErrors[question.id]}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --- GAMEPLAY PLAYING VIEW ---
  const currentQuestion = currentItem.question;
  const selectedOpt = selectedAnswers[currentQuestion.id];

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant h-16 flex items-center px-gutter justify-between">
        <div className="flex items-center gap-base">
          <Link href="/test" className="w-8 h-8 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">close</span>
          </Link>
          <span className="font-title-md text-primary font-bold truncate max-w-[150px] sm:max-w-none">{mockExam.title}</span>
        </div>

        {/* Dynamic Countdown Timer Widget */}
        <div className={`flex items-center gap-xs px-3 py-1.5 rounded-full font-bold text-sm ${timeLeft < 120 ? 'bg-error/15 text-error animate-pulse' : 'bg-surface-container-high text-on-surface'}`}>
          <span className="material-symbols-outlined text-[18px]">timer</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <main className="pt-20 px-gutter max-w-container-max mx-auto space-y-md">
        {/* Navigation Indicator & Exam Progress Bar */}
        <section className="flex flex-col gap-xs">
          <div className="flex items-center justify-between">
            <span className="bg-secondary-container text-on-secondary-container text-label-md font-label-md px-3 py-1 rounded-full uppercase text-xs">
              FRÅGA {currentIdx + 1} / {totalQuestions}
            </span>
            <span className="text-on-surface-variant font-label-md text-xs">
              Besvarade: {Object.keys(selectedAnswers ?? {}).length} / {totalQuestions}
            </span>
          </div>
          <div className="h-2.5 w-full bg-surface-container rounded-full mt-base overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all duration-300 rounded-full" 
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </section>

        {/* Central Card with Current Question */}
        <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm space-y-md">
          <div className="flex justify-between items-center pb-base border-b border-outline-variant">
            <span className="text-primary font-bold">Fråga {currentIdx + 1}</span>
            <span className="bg-surface-container-high text-on-surface text-label-md font-bold px-2 py-0.5 rounded text-xs uppercase">
              {currentQuestion.difficulty}
            </span>
          </div>

          <p className="font-body-lg text-lg text-on-surface leading-relaxed whitespace-pre-wrap">
            <GlossaryText text={currentQuestion.text} language={userLang} disableHover={true} />
          </p>

          {/* Answer Choice Selector Buttons */}
          <div className="space-y-sm">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const optText = currentQuestion[`option${opt}` as keyof Question] as string;
              const isSelected = selectedOpt === opt;

              return (
                <button 
                  key={opt}
                  onClick={() => handleSelectOption(currentQuestion.id, opt)}
                  className={`w-full flex items-center p-md rounded-xl text-left transition-all duration-150 ${isSelected ? 'border-2 border-primary bg-primary/5 shadow-sm' : 'border border-outline-variant bg-surface hover:bg-surface-container-high'}`}
                >
                  <span className={`w-9 h-9 flex-shrink-0 rounded-full font-title-md flex items-center justify-center mr-md transition-colors ${isSelected ? 'bg-primary text-on-primary' : 'border border-outline text-on-surface-variant'}`}>{opt}</span>
                  <span className="font-body-md text-sm text-on-surface">
                    <GlossaryText text={optText} language={userLang} disableHover={true} />
                  </span>
                </button>
              );
            })}
          </div>
        </article>

        {/* Control Actions (Prev / Skip / Next / Submit) */}
        <div className="flex gap-md pt-base">
          <button 
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
            className="flex-1 py-3 px-4 border border-outline-variant font-semibold rounded-xl hover:bg-surface-container transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Föregående
          </button>
          
          {currentIdx < totalQuestions - 1 ? (
            <button 
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="flex-1 py-3 px-4 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary-dark transition-all"
            >
              Nästa fråga
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 px-4 bg-secondary text-on-secondary font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-xs disabled:opacity-50"
            >
              {saving ? 'Beräknar...' : 'Avsluta prov'}
            </button>
          )}
        </div>

        {/* Jump-to-Question Grid Navigator */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md shadow-sm space-y-base">
          <div className="flex items-center justify-between">
            <h4 className="font-title-sm text-sm text-on-surface font-semibold">Provkarta</h4>
            <span className="text-[10px] text-on-surface-variant font-label-md">
              Blå: Besvarad | Svart: Aktuell fråga
            </span>
          </div>
          
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-w-xs sm:max-w-xl mx-auto justify-items-center pt-xs">
            {mockExam.questions.map(({ question }, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = !!selectedAnswers[question.id];

              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center transition-all ${isCurrent ? 'ring-2 ring-primary bg-primary text-on-primary scale-110 shadow-md' : isAnswered ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'bg-surface-container-high text-on-surface hover:bg-surface-container transition-colors'}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

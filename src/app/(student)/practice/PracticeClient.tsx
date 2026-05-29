'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import GlossaryText from '@/components/GlossaryText';
import { translateText } from '@/actions/translate.actions';
import type { Topic } from '@prisma/client';

type Question = {
  id: string;
  topicId: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  difficulty: string;
  isTest: boolean;
};

type Flashcard = {
  id: string;
  topicId: string;
  front: string;
  back: string;
};

type PracticeProps = {
  topic: Topic | null;
  allTopics: Topic[];
  questions: Question[];
  flashcards: Flashcard[];
  isPaid: boolean;
  freeDailyQuestionLimit: number;
  siteName: string;
  userId: string;
  userLang: string;
};

export default function PracticeClient({ 
  topic, 
  allTopics,
  questions, 
  flashcards, 
  isPaid, 
  freeDailyQuestionLimit, 
  siteName, 
  userId,
  userLang
}: PracticeProps) {
  const [activeMode, setActiveMode] = useState<'questions' | 'flashcards'>('questions');
  
  // Question states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Flashcard states
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Freemium states
  const [solvedTodayCount, setSolvedTodayCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  // Explanation Translation states
  const [translatedExplanation, setTranslatedExplanation] = useState<string>('');
  const [translatingExplanation, setTranslatingExplanation] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string>('');

  // Reset translation when changing questions
  useEffect(() => {
    setTranslatedExplanation('');
    setTranslationError('');
  }, [currentQuestionIndex]);

  // Fetch / initialize solved count today from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('solved_date');
    const storedCount = localStorage.getItem('solved_count');

    let currentCount = 0;
    if (storedDate === today && storedCount) {
      currentCount = parseInt(storedCount);
      setSolvedTodayCount(currentCount);
    } else {
      localStorage.setItem('solved_date', today);
      localStorage.setItem('solved_count', '0');
      setSolvedTodayCount(0);
    }

    // Secure Paywall check on initial page load if already exceeded limit
    if (!isPaid && currentCount >= freeDailyQuestionLimit) {
      setShowPaywall(true);
    }
  }, [isPaid, freeDailyQuestionLimit]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentFlashcard = flashcards[currentFlashcardIndex];

  const handleTranslateExplanation = async () => {
    if (!currentQuestion.explanation) return;
    setTranslatingExplanation(true);
    setTranslationError('');
    try {
      const res = await translateText(currentQuestion.explanation, userLang);
      if (res.error) {
        setTranslationError(res.error);
      } else if (res.translation) {
        setTranslatedExplanation(res.translation);
      }
    } catch (err) {
      console.error(err);
      setTranslationError('Ett fel uppstod vid översättning.');
    } finally {
      setTranslatingExplanation(false);
    }
  };

  // Question navigation
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    // Check limit before advancing to a new question if not paid
    if (!isPaid && solvedTodayCount >= freeDailyQuestionLimit) {
      setShowPaywall(true);
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Increment solved count for free users
      if (!isPaid) {
        const nextCount = solvedTodayCount + 1;
        setSolvedTodayCount(nextCount);
        localStorage.setItem('solved_count', nextCount.toString());
      }
    }
  };

  // Flashcard navigation
  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentFlashcardIndex > 0) {
        setCurrentFlashcardIndex(prev => prev - 1);
      }
    }, 300);
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentFlashcardIndex < flashcards.length - 1) {
        setCurrentFlashcardIndex(prev => prev + 1);
      }
    }, 300);
  };

  // Topic Switcher redirect handler
  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = e.target.value;
    if (selectedVal === 'all') {
      window.location.href = '/practice';
    } else {
      window.location.href = `/practice?topicId=${selectedVal}`;
    }
  };

  return ( <>
      <main className="mt-20 px-gutter max-w-container-max mx-auto">
        {/* Navigation / Tabs */}
        <nav className="flex gap-xs mb-md bg-surface-container p-xs rounded-xl">
          <button 
            onClick={() => setActiveMode('questions')}
            className={`flex-1 py-3 px-4 rounded-lg font-title-md text-body-md transition-colors duration-200 ${activeMode === 'questions' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Övningsfrågor
          </button>
          <button 
            onClick={() => setActiveMode('flashcards')}
            className={`flex-1 py-3 px-4 rounded-lg font-body-md transition-colors duration-200 ${activeMode === 'flashcards' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            Flashcards
          </button>
        </nav>

        {/* Dynamic Topic Selector Dropdown Header */}
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-2xl shadow-sm mb-md flex flex-col sm:flex-row sm:items-center justify-between gap-md">
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-wider block mb-xs">Aktivt studieområde</span>
            <h2 className="font-headline-lg-mobile text-lg font-bold text-primary truncate max-w-xs">
              {topic?.title || 'Alla ämnen'}
            </h2>
          </div>
          
          <div className="flex items-center gap-sm min-w-[200px]">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            <select 
              value={topic?.id || 'all'} 
              onChange={handleTopicChange}
              className="flex-1 bg-surface border border-outline-variant px-4 py-2.5 rounded-xl font-title-sm text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-sm"
            >
              <option value="all">📚 Alla ämnen</option>
              {allTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  📖 {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section: Practice Questions */}
        {activeMode === 'questions' && (
          <section className="space-y-md">
            {questions.length === 0 ? (
              <div className="p-lg border-2 border-dashed border-outline-variant rounded-xl text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-sm">quiz</span>
                <p className="text-on-surface-variant font-body-md">Det finns inga övningsfrågor för detta ämne än.</p>
              </div>
            ) : (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm space-y-md">
                <div className="flex gap-base justify-between items-center pb-sm border-b border-outline-variant">
                  <div className="flex gap-base">
                    <span className="bg-secondary-container text-on-secondary-container text-label-md font-label-md px-2 py-0.5 rounded-full uppercase">Fråga {currentQuestionIndex + 1}</span>
                    <span className="text-on-surface-variant text-label-md font-label-md flex items-center gap-1">
                      <span className="material-symbols-outlined !text-[14px]">category</span> {currentQuestion.difficulty}
                    </span>
                  </div>
                  <span className="text-on-surface-variant text-label-md font-label-md">{currentQuestionIndex + 1} / {questions.length}</span>
                </div>
                
                <p className="text-on-surface font-body-md leading-relaxed whitespace-pre-wrap">
                  <GlossaryText text={currentQuestion.text} language={userLang} />
                </p>

                {/* Correct Answer Display - Clutter-Free Study Mode */}
                <div className="bg-secondary-container/10 border-2 border-secondary/20 p-md rounded-2xl shadow-sm space-y-md">
                  <div>
                    <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded uppercase tracking-wider mb-xs inline-block">Rätt svar</span>
                    <p className="text-on-surface font-body-md text-base leading-relaxed mt-2">
                      <GlossaryText text={currentQuestion[`option${currentQuestion.correctAnswer}` as keyof Question] as string} language={userLang} />
                    </p>
                  </div>
                  
                  {currentQuestion.explanation && (
                    <div className="pt-sm border-t border-outline-variant/30 space-y-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">Förklaring</span>
                        
                        <button
                          onClick={handleTranslateExplanation}
                          disabled={translatingExplanation}
                          className="text-[10px] font-bold text-secondary bg-secondary/15 hover:bg-secondary/25 px-2.5 py-1 rounded transition-colors flex items-center gap-1 active:scale-95 disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined !text-[12px]">{translatingExplanation ? 'progress_activity' : 'translate'}</span>
                          {translatedExplanation ? 'Uppdatera översättning' : 'Översätt förklaring'}
                        </button>
                      </div>
                      
                      <p className="text-on-surface-variant font-body-sm text-xs leading-relaxed mt-2">
                        <GlossaryText text={currentQuestion.explanation} language={userLang} />
                      </p>

                      {translatedExplanation && (
                        <div className="bg-surface-container p-sm rounded-xl border border-outline-variant/20 mt-xs animate-in fade-in duration-200">
                          <span className="text-[9px] font-bold text-secondary uppercase tracking-wider block mb-1">Översättning ({userLang})</span>
                          <p className="text-on-surface font-body-sm text-xs leading-relaxed italic">{translatedExplanation}</p>
                        </div>
                      )}

                      {translationError && (
                        <p className="text-xs text-error font-semibold mt-1">⚠️ {translationError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Question Navigation Control Buttons */}
                <div className="flex gap-md pt-base border-t border-outline-variant">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={handlePrevQuestion}
                    className="flex-1 py-3 px-4 border border-outline-variant text-on-surface font-semibold rounded-xl hover:bg-surface-container transition-colors flex items-center justify-center gap-xs disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Föregående fråga
                  </button>
                  <button
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={handleNextQuestion}
                    className="flex-1 py-3 px-4 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-xs disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Nästa fråga
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* Progress Card */}
            {questions.length > 0 && (
              <div className="bg-surface-container-high rounded-xl p-md">
                <div className="flex justify-between items-center mb-base">
                  <span className="font-body-md font-bold text-primary">Framsteg</span>
                  <span className="text-label-md text-primary">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-outline-variant h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full transition-all duration-300" style={{width: `${Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%`}}></div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Flashcard Section */}
        {activeMode === 'flashcards' && (
          <div className="mt-lg">
            {flashcards.length === 0 ? (
              <div className="p-lg border-2 border-dashed border-outline-variant rounded-xl text-center">
                <span className="material-symbols-outlined text-on-surface-variant text-4xl mb-sm">style</span>
                <p className="text-on-surface-variant font-body-md">Det finns inga flashcards för detta ämne än.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-sm px-xs">
                  <h3 className="font-title-md text-title-md text-primary">Flashcard-läge</h3>
                  <span className="text-label-md text-on-surface-variant">Återstående: {flashcards.length - currentFlashcardIndex} kort</span>
                </div>

                {/* Flashcard Interaction Area */}
                <div className={`relative w-full h-[280px] md:h-[240px] max-w-xl mx-auto perspective-1000 group ${isFlipped ? 'flipped' : ''}`}>
                  <div className="flashcard-inner relative w-full h-full">
                    {/* Front of Card */}
                    <div className="flashcard-front absolute inset-0 bg-primary text-on-primary rounded-2xl p-md flex flex-col items-center justify-between text-center shadow-md">
                      <div className="flex flex-col items-center justify-center flex-1">
                        <span className="material-symbols-outlined !text-[32px] mb-xs opacity-50">quiz</span>
                        <h4 className="font-headline-md text-base md:text-lg font-semibold px-sm leading-snug line-clamp-3">
                          {currentFlashcard.front}
                        </h4>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <button 
                          onClick={() => setIsFlipped(true)}
                          className="px-6 py-2 bg-secondary-container text-on-secondary-container rounded-full font-title-sm text-sm flex items-center gap-xs active:scale-95 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined !text-[16px] pointer-events-none">flip_camera_android</span>
                          Visa svar
                        </button>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="flashcard-back absolute inset-0 bg-surface-container-low text-on-surface rounded-2xl p-md flex flex-col items-center justify-between text-center shadow-md border-2 border-secondary">
                      <div className="flex flex-col items-center justify-center flex-1">
                        <span className="material-symbols-outlined !text-[32px] mb-xs text-secondary opacity-80">check_circle</span>
                        <h4 className="font-headline-md text-base md:text-lg font-semibold text-secondary px-sm leading-snug whitespace-pre-wrap line-clamp-3">
                          {currentFlashcard.back}
                        </h4>
                      </div>
                      <div className="flex flex-col items-center w-full">
                        <button 
                          onClick={() => setIsFlipped(false)}
                          className="px-6 py-2 bg-secondary-container text-on-secondary-container rounded-full font-title-sm text-sm flex items-center gap-xs active:scale-95 transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined !text-[16px] pointer-events-none">flip_camera_android</span>
                          Visa fråga
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flashcard Navigation Controls */}
                <div className="flex gap-md max-w-xl mx-auto mt-md">
                  <button
                    disabled={currentFlashcardIndex === 0}
                    onClick={handlePrevFlashcard}
                    className="flex-1 py-3 px-4 border border-outline-variant text-on-surface font-semibold rounded-xl hover:bg-surface-container transition-colors flex items-center justify-center gap-xs disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Föregående kort
                  </button>
                  <button
                    disabled={currentFlashcardIndex === flashcards.length - 1}
                    onClick={handleNextFlashcard}
                    className="flex-1 py-3 px-4 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-xs disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Nästa kort
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      

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
              <h3 className="font-headline-sm text-xl font-bold text-primary">Du har nått den dagliga frågegränsen</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Din dagliga maxgräns för frågor har uppnåtts ({freeDailyQuestionLimit} frågor).
              </p>
            </div>

            <div className="bg-surface-container-low p-md rounded-2xl text-left border border-outline-variant">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-1">Premium VIP-fördelar</span>
              <ul className="space-y-1 text-xs text-on-surface">
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span> Obegränsat med frågor och flashcards
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span> Tillgång till alla övningsprov
                </li>
                <li className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px] text-secondary font-bold">check</span> Detaljerad prestanda- och provanalys
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href={`/payment?userId=${userId}`}
                className="w-full py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-xs"
              >
                <span className="material-symbols-outlined">workspace_premium</span>
                Uppgradera till Premium VIP
              </Link>
            </div>

            <p className="text-[10px] text-on-surface-variant opacity-70">
              Betala 299 kr för full tillgång i 1 år.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GlossaryText from '@/components/GlossaryText'

interface Flashcard {
  id: string
  frontText: string
  backText: string
  topic: { title: string }
}

export default function FlashcardDemoClient({ cards, userLang = 'TR' }: { cards: Flashcard[]; userLang?: string }) {
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [seen, setSeen] = useState<Set<number>>(new Set())
  const [lang, setLang] = useState(userLang)

  useEffect(() => {
    const saved = localStorage.getItem('preferred_language')
    if (saved) {
      setLang(saved)
    } else if (userLang) {
      setLang(userLang)
    }
  }, [userLang])

  const handleLangChange = (val: string) => {
    setLang(val)
    localStorage.setItem('preferred_language', val)
  }

  const card = cards[current]


  const next = () => {
    setSeen(prev => new Set([...prev, current]))
    setFlipped(false)
    setTimeout(() => setCurrent(i => (i + 1) % cards.length), 150)
  }

  const prev = () => {
    setFlipped(false)
    setTimeout(() => setCurrent(i => (i - 1 + cards.length) % cards.length), 150)
  }

  if (!card) return null

  return ( <>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / cards.length) * 100}%`, background: '#FECC02' }}
          />
        </div>
        <span className="text-white/60 text-sm font-mono">
          {current + 1} / {cards.length}
        </span>
      </div>

      {/* Topic badge */}
      <div className="text-center mb-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(254,204,2,0.15)', color: '#FECC02', border: '1px solid rgba(254,204,2,0.3)' }}>
          {card.topic.title}
        </span>
      </div>

      {/* Flashcard */}
      <div
        className="relative mx-auto cursor-pointer select-none"
        style={{ width: '100%', maxWidth: '520px', height: '260px', perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
            style={{
              backfaceVisibility: 'hidden',
              background: 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="text-xs font-bold mb-4 tracking-widest" style={{ color: 'rgba(254,204,2,0.6)' }}>FRÅGA</div>
            <p className="text-white text-lg font-semibold leading-snug">{card.frontText}</p>
            <div className="mt-6 flex items-center gap-1.5 text-white/60 text-xs">
              <span className="material-symbols-outlined text-[14px]">touch_app</span>
              Tryck för att visa svar
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'rgba(52,168,83,0.15)',
              border: '1px solid rgba(52,168,83,0.35)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="text-xs font-bold mb-4 tracking-widest" style={{ color: 'rgba(52,168,83,0.8)' }}>SVAR</div>
            <p className="text-white text-lg font-semibold leading-snug">{card.backText}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button
          onClick={() => setFlipped(f => !f)}
          className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
        >
          {flipped ? '🙈 Dölj svar' : '👁 Visa svar'}
        </button>
        <button
          onClick={next}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: '#FECC02', color: '#002244' }}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* Seen counter */}
      {seen.size > 0 && (
        <p className="text-center text-white/60 text-xs mt-4">
          {seen.size} av {cards.length} kort visade
        </p>
      )}
    </>
  )
}

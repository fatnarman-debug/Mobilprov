'use client'

import { useState, useEffect } from 'react'
import GlossaryText from '@/components/GlossaryText'

interface Question {
  id: string
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string | null
  topic: { title: string }
}

export default function OvningClient({ questions, userLang = 'TR' }: { questions: Question[]; userLang?: string }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
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

  const q = questions[current]

  const options = [
    { key: 'A', text: q.optionA },
    { key: 'B', text: q.optionB },
    { key: 'C', text: q.optionC },
    { key: 'D', text: q.optionD },
  ]
  const isAnswered = selected !== null
  const isCorrect = selected === q.correctAnswer

  const handleSelect = (key: string) => {
    if (isAnswered) return
    setSelected(key)
    if (key === q.correctAnswer) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(i => i + 1)
      setSelected(null)
    }
  }

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(i => i - 1)
      setSelected(null)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  // Finished screen
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
          <div className="text-6xl mb-4">{pct >= 70 ? '🏆' : '📚'}</div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
            {pct >= 70 ? 'Bra jobbat!' : 'Fortsätt öva!'}
          </h2>
          <p className="text-gray-500 mb-6">
            Du fick rätt på <span className="font-bold text-purple-600">{score}</span> av <span className="font-bold">{questions.length}</span> frågor ({pct}%)
          </p>
          <div className="w-full h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: pct >= 70 ? '#7c3aed' : '#f59e0b' }}
            />
          </div>
          <button
            onClick={handleRestart}
            className="px-8 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
            style={{ background: '#7c3aed' }}
          >
            Försök igen →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/30">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((current) / questions.length) * 100}%`, background: '#7c3aed' }}
          />
        </div>
        <span className="text-white/70 text-sm font-semibold">
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          {/* Topic badge & Language Selector */}
          <div className="mb-4 flex items-center justify-between">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{ background: '#ede9fe', color: '#7c3aed' }}
            >
              {q.topic.title}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Översättningsspråk:</span>
              <select
                value={lang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer shadow-sm"
              >
                <option value="TR">TR 🇹🇷</option>
                <option value="EN">EN 🇬🇧</option>
                <option value="AR">AR 🇸🇦</option>
                <option value="ES">ES 🇪🇸</option>
                <option value="UK">UK 🇺🇦</option>
                <option value="FR">FR 🇫🇷</option>
                <option value="FA">FA 🇮🇷</option>
                <option value="DA">DA 🇦🇫</option>
              </select>
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg font-extrabold text-gray-800 mb-6 leading-snug">
            <span style={{ color: '#7c3aed' }}>{current + 1}.</span> <GlossaryText text={q.text} language={lang} />
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {options.map(opt => {
              const isSelected = selected === opt.key
              const isRight = opt.key === q.correctAnswer

              let bg = 'bg-white'
              let border = 'border border-gray-200'
              let textColor = 'text-gray-700'
              let indicator: React.ReactNode = null

              if (isAnswered) {
                if (isRight) {
                  bg = 'bg-green-50'
                  border = 'border-2 border-green-500'
                  textColor = 'text-green-800'
                  indicator = <span className="ml-auto text-green-600 text-sm font-bold">✓ Rätt</span>
                } else if (isSelected && !isRight) {
                  bg = 'bg-red-50'
                  border = 'border-2 border-red-400'
                  textColor = 'text-red-700'
                  indicator = <span className="ml-auto text-red-500 text-sm font-bold">✗</span>
                }
              } else if (isSelected) {
                bg = 'bg-purple-50'
                border = 'border-2 border-purple-500'
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  disabled={isAnswered}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all ${bg} ${border} ${textColor} ${!isAnswered ? 'hover:bg-purple-50 hover:border-purple-300 cursor-pointer' : 'cursor-default'}`}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: isAnswered && isRight ? '#22c55e' : isAnswered && isSelected ? '#ef4444' : '#ede9fe',
                      color: isAnswered && (isRight || isSelected) ? 'white' : '#7c3aed',
                    }}
                  >
                    {opt.key}
                  </span>
                  <span className="font-medium"><GlossaryText text={opt.text} language={lang} /></span>
                  {indicator}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {isAnswered && q.explanation && (
            <div
              className="mt-5 flex items-start gap-2 p-4 rounded-2xl text-sm"
              style={{ background: '#fefce8', border: '1px solid #fde68a', color: '#92400e' }}
            >
              <span className="text-yellow-500 text-base flex-shrink-0">💡</span>
              <div>
                <span className="font-bold text-yellow-700">Förklaring: </span>
                <GlossaryText text={q.explanation} language={lang} />
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div
          className="flex items-center justify-between px-8 py-4"
          style={{ borderTop: '1px solid #f3f4f6' }}
        >
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500"
          >
            ← Föregående
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: '#7c3aed' }}
          >
            {current + 1 === questions.length ? 'Avsluta ✓' : 'Nästa →'}
          </button>
        </div>
      </div>
    </div>
  )
}

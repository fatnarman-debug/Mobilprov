'use client';

import React, { useState } from 'react';
import { loginUser, registerUser } from '@/actions/auth.actions';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

// İsveç Bayrağı SVG
function SwedenFlag({ size = 64 }: { size?: number }) {
  const w = size * 1.5;
  const h = size;
  const crossX = w * 0.35;
  const crossThickness = h * 0.22;
  const r = size * 0.12;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: r, display: 'block', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
      {/* Blue background */}
      <rect width={w} height={h} fill="#006AA7" rx={r} />
      {/* Horizontal yellow stripe */}
      <rect y={(h - crossThickness) / 2} width={w} height={crossThickness} fill="#FECC02" />
      {/* Vertical yellow stripe */}
      <rect x={crossX - crossThickness / 2} width={crossThickness} height={h} fill="#FECC02" />
    </svg>
  );
}

const testimonials = [
  {
    name: 'Yasmin Al-Rashid',
    origin: 'Ursprungligen från Irak',
    status: 'Klarade provet i augusti',
    avatar: '🇮🇶',
    text: 'Äntligen en plattform som verkligen förbereder en! Förklaringarna till varje svar hjälpte mig att förstå sammanhanget och inte bara memorera frågorna.'
  },
  {
    name: 'Ali Reza Karimi',
    origin: 'Ursprungligen från Iran',
    status: 'Övar inför nästa prov',
    avatar: '🇮🇷',
    text: 'Det flerspråkiga stödet är fantastiskt. Jag kan läsa frågorna på svenska och snabbt kolla översättningen på persiska när jag är osäker.'
  },
  {
    name: 'Leyla Demir',
    origin: 'Ursprungligen från Turkiet',
    status: 'Klarade provsimuleringen',
    avatar: '🇹🇷',
    text: 'Flashcard-funktionen är min favorit. Den gör det jätteroligt att lära sig svensk historia och politik på bussen på väg till jobbet!'
  },
  {
    name: 'Amna Khan',
    origin: 'Ursprungligen från Pakistan',
    status: 'SFI-studerande',
    avatar: '🇵🇰',
    text: 'Tack vare provsimuleringarna kände jag mig inte alls stressad under provet. Frågorna är väldigt lika de riktiga frågorna i Sverige i fokus.'
  },
  {
    name: 'Ahmad Noorzaei',
    origin: 'Ursprungligen från Afghanistan',
    status: 'Bor i Malmö, pluggar dagligen',
    avatar: '🇦🇫',
    text: 'Bästa sidan för de som ska göra provet! Förklaringarna är korta, enkla att förstå och översatta direkt till mitt modersmål dari.'
  },
  {
    name: 'Semir Halilović',
    origin: 'Ursprungligen från Bosnien',
    status: 'Övar inför medborgarskapstestet',
    avatar: '🇧🇦',
    text: 'Jag rekommenderar VIP-medlemskapet starkt. Att ha tillgång till över 500 frågor med statistik på mina framsteg har sparat mig så mycket tid.'
  }
];

type HomeArticle = {
  title: string
  slug: string
  metaDescription: string
  publishedAt: string
  readingTime: number
}

export default function HomeClient({ articles = [] }: { articles?: HomeArticle[] }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setLoading(true);
    try {
      const response = isLogin
        ? await loginUser(formData)
        : await registerUser(formData);
      if (response?.error) {
        setError(response.error);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #002244 0%, #003566 40%, #006AA7 100%)' }}>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10" style={{ background: '#FECC02', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-10" style={{ background: '#006AA7', filter: 'blur(80px)' }} />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full opacity-10" style={{ background: '#FECC02', filter: 'blur(100px)' }} />
        {/* Swedish flag cross - subtle watermark */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#FECC02 0px, #FECC02 1px, transparent 1px), linear-gradient(90deg, #FECC02 0px, #FECC02 1px, transparent 1px)',
          backgroundSize: '200px 200px',
          backgroundPosition: '40% 50%'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <SwedenFlag size={40} />
          <Link href="/" className="flex items-center gap-1">
            <span className="text-white font-bold text-lg tracking-tight">SVERIGEMEDBORGARSKAPSPROV</span>
            <span style={{ color: '#FECC02' }} className="font-bold text-lg">.com</span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/artiklar" className="hidden md:block text-white/80 hover:text-white font-semibold transition-colors">
            Blogg & Guider
          </Link>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>🇸🇪</span>
            <span>Sverige</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-center px-4 py-8 gap-12 max-w-6xl mx-auto w-full">

        {/* Left — Hero text (visible on large screens) */}
        <div className="hidden lg:flex flex-col flex-1 text-white max-w-lg">
          <div className="mb-8">
            <SwedenFlag size={120} />
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4 text-pretty">
            Svenskt Medborgarskapsprov & Test<br />
            <span style={{ color: '#FECC02' }}>Klara ditt medborgarskap prov på första försöket</span>
          </h1>
          <p className="text-xl text-white/80 mb-6 leading-relaxed">
            Flashcards, övningsfrågor och provsimuleringar – allt på ett ställe. 
          </p>
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: 'rgba(254,204,2,0.15)', color: '#FECC02', border: '1px solid rgba(254,204,2,0.3)' }}>
              ⭐️ Bli VIP-medlem för endast 199 kr (Engångsavgift)
            </span>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '📚', text: 'Ämnesspecifika studier' },
              { icon: '🧠', text: 'Flashcard-system' },
              { icon: '✅', text: 'Övningsprov' },
              { icon: '📊', text: 'Framstegsspårning' },
            ].map((f) => (
              <div
                key={f.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white border border-white/20"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
              >
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Auth Card */}
        <div
          className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          {/* Card Header */}
          <div className="p-8 pb-0 text-center">
            {/* Logo — mobile only */}
            <div className="flex justify-center mb-4 lg:hidden">
              <SwedenFlag size={72} />
            </div>
            <h2 className="text-white text-2xl font-bold mb-1">
              {isLogin ? 'Välkommen' : 'Skapa konto'}
            </h2>
            <p className="text-white/75 text-sm mb-6">
              {isLogin ? 'Logga in på ditt konto på Sverigemedborgarskapsprov.com' : 'Börja förbereda dig för provet'}
            </p>

            {/* Tabs */}
            <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <button
                onClick={() => { setIsLogin(true); setError(null); }}
                type="button"
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={isLogin
                  ? { background: '#FECC02', color: '#002244' }
                  : { color: 'rgba(255,255,255,0.6)' }}
              >
                Logga in
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(null); }}
                type="button"
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={!isLogin
                  ? { background: '#FECC02', color: '#002244' }
                  : { color: 'rgba(255,255,255,0.6)' }}
              >
                Skapa konto
              </button>
            </div>
          </div>

          <div className="p-8 pt-0">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/auth/google-callback' })}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all mb-5 hover:scale-[1.02] active:scale-95"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            >
              {/* Google "G" Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              {isLogin ? 'Logga in med Google' : 'Registrera med Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <span className="text-white/40 text-xs font-semibold tracking-widest">ELLER</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Form */}
            <form className="space-y-4" action={handleSubmit}>
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">Namn</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">person</span>
                      <input
                        name="name"
                        type="text"
                        placeholder="Ditt för- och efternamn"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all focus:ring-2"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' } as React.CSSProperties}
                        onFocus={e => (e.target.style.borderColor = '#FECC02')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">Ditt modersmål (för översättningar)</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">translate</span>
                      <select
                        name="nativeLanguage"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all cursor-pointer appearance-none"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                      >
                        <option value="TR" className="bg-[#002244] text-white">🇹🇷 Türkçe</option>
                        <option value="EN" className="bg-[#002244] text-white">🇬🇧 English</option>
                        <option value="AR" className="bg-[#002244] text-white">🇸🇦 العربية</option>
                        <option value="ES" className="bg-[#002244] text-white">🇪🇸 Español</option>
                        <option value="UK" className="bg-[#002244] text-white">🇺🇦 Українська</option>
                        <option value="FR" className="bg-[#002244] text-white">🇫🇷 Français</option>
                        <option value="FA" className="bg-[#002244] text-white">🇮🇷 فارسی</option>
                        <option value="DA" className="bg-[#002244] text-white">🇦🇫 دری</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">E-post</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">mail</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="exempel@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    onFocus={e => (e.target.style.borderColor = '#FECC02')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">Lösenord</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">lock</span>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    onFocus={e => (e.target.style.borderColor = '#FECC02')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(186,26,26,0.2)', border: '1px solid rgba(186,26,26,0.4)', color: '#ffb3b3' }}>
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
                style={{ background: '#FECC02', color: '#002244' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Bearbetar...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Logga in' : 'Registrera dig och fortsätt'}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Trust badge (register only) */}
            {!isLogin && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background: 'rgba(254,204,2,0.1)', border: '1px solid rgba(254,204,2,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                <span className="material-symbols-outlined text-[16px]" style={{ color: '#FECC02' }}>verified_user</span>
                Betalningen är säkrad med 256-bitars SSL.
              </div>
            )}

            {/* Switch mode */}
            <p className="text-center text-white/70 text-sm mt-5">
              {isLogin ? 'Har du inget konto? ' : 'Har du redan ett konto? '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="font-semibold transition-colors hover:underline"
                style={{ color: '#FECC02' }}
              >
                {isLogin ? 'Registrera dig' : 'Logga in'}
              </button>
            </p>

            {/* Free trial link */}
            <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Link
                href="/ovning"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
              >
                <span>🆓</span>
                Prova gratis först – ingen registrering krävs
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Rich SEO Content Section */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 py-16 space-y-12 text-white content-visibility-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Detailed Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#FECC02' }}>
              Vad är ett svenskt medborgarskap prov?
            </h2>
            <p className="text-white/80 leading-relaxed text-base">
              Den <strong>6 juni 2026</strong> införs ett nytt krav. Du måste klara ett <strong>medborgarskap prov</strong> (även kallat medborgarskapstest) för att bli svensk medborgare. Det visar att du förstår hur det svenska samhället fungerar. Vi rekommenderar att du börjar plugga i god tid.
            </p>
            <p className="text-white/80 leading-relaxed text-base">
              Vi hjälper dig att förbereda dig för ditt medborgarskap test. Hos oss hittar du gratis övningsfrågor, flashcards och provsimuleringar. Allt material är granskat av pedagoger och bygger helt på den officiella boken <em>Sverige i fokus</em>. Gör vårt medborgarskap test online varje dag för att träna och bygga upp ditt självförtroende.
            </p>
            <p className="text-white/80 leading-relaxed text-base">
              Våra enkla guider hjälper dig att verifiera din förståelse. Att förstå hur demokratin fungerar är lika viktigt som att minnas fakta. Detta ökar dina chanser att lyckas på ditt medborgarskap prov.
            </p>
            <div className="p-5 rounded-2xl border border-white/10 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
              <h3 className="font-bold text-base flex items-center gap-2" style={{ color: '#FECC02' }}>
                <span className="material-symbols-outlined text-[20px]">verified</span>
                Expertgranskat material för ditt medborgarskap test
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Alla våra frågor, svar och förklaringar är framtagna och kvalitetssäkrade av utbildningsexperter inom SFI och samhällskunskap. Dessutom finns översättningar till flera modersmål så du snabbt förstår svåra begrepp inför ditt medborgarskap prov.
              </p>
            </div>
          </div>

          {/* Key Facts / Features */}
          <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl" style={{ backdropFilter: 'blur(20px)' }}>
            <h3 className="text-2xl font-bold tracking-tight">Korta fakta om medborgarskapstestet</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-lg">📝</span>
                <div>
                  <strong className="block text-white" style={{ color: '#FECC02' }}>60 flervalsfrågor</strong>
                  <span className="text-sm text-white/75">Provet består av 60 frågor där du väljer ett av fyra svarsalternativ.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">⏱️</span>
                <div>
                  <strong className="block text-white" style={{ color: '#FECC02' }}>90 minuters provtid</strong>
                  <span className="text-sm text-white/75">Du har 90 minuter på dig att besvara alla frågor under provet. Tiden är väl tilltagen.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <div>
                  <strong className="block text-white" style={{ color: '#FECC02' }}>Godkändgräns på 67%</strong>
                  <span className="text-sm text-white/75">Det krävs minst 40 rätta svar av 60 för att få ett godkänt resultat på testet.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">📚</span>
                <div>
                  <strong className="block text-white" style={{ color: '#FECC02' }}>Sverige i fokus</strong>
                  <span className="text-sm text-white/75">Hela provet bygger på Universitets- och högskolerådets (UHR) officiella utbildningsmaterial.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-center tracking-tight" style={{ color: '#FECC02' }}>
            Vanliga frågor om det svenska medborgarskapsprovet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl border border-white/10 space-y-2 bg-white/5">
              <h3 className="font-bold text-white">Vem måste göra medborgarskapstestet i Sverige?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Alla över 15 år som söker svenskt medborgarskap efter den 6 juni 2026 måste göra provet. Undantag finns för personer med vissa sjukdomar eller funktionsnedsättningar.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 space-y-2 bg-white/5">
              <h3 className="font-bold text-white">Vad kostar ett svensk medborgarskap test?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Det första provet i augusti 2026 är gratis för dem som blir inbjudna. Regeringen bestämmer senare vad provet ska kosta i framtiden.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 space-y-2 bg-white/5">
              <h3 className="font-bold text-white">Kommer det finnas ett språktest i svenska också?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Kravet på språkprov kommer senare. Under 2026 testas provet bara dina kunskaper om samhället. Men kom ihåg att provet skrivs på svenska.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 space-y-2 bg-white/5">
              <h3 className="font-bold text-white">Hur kan jag förbereda mig för mitt medborgarskap prov?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Det bästa sättet är att läsa boken <em>Sverige i fokus</em>. Öva sedan på ett riktigt medborgarskap test med våra expertgranskade frågor och provsimuleringar här på hemsidan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {articles && articles.length > 0 && (
        <section className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12 text-white content-visibility-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">
              Utvalda <span style={{ color: '#FECC02' }}>guider & artiklar</span>
            </h2>
            <p className="text-white/80 text-base max-w-2xl mx-auto">
              Lär dig mer om det svenska medborgarskapsprovet, reglerna och hur du förbereder dig på bästa sätt.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/artiklar/${article.slug}`}
                className="block rounded-2xl p-6 transition-all hover:scale-[1.02] hover:border-[#FECC02]/30 group flex flex-col justify-between"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs text-white/60">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px]" style={{ background: 'rgba(254,204,2,0.15)', color: '#FECC02', border: '1px solid rgba(254,204,2,0.2)' }}>
                      Guide
                    </span>
                    <span>·</span>
                    <span>{article.readingTime} min läsning</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-300 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-white/70 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {article.metaDescription}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold mt-4" style={{ color: '#FECC02' }}>
                  Läs mer <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/artiklar"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
            >
              Visa alla artiklar & guider
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </section>
      )}

      {/* Testimonials Section (Gör som tusentals andra) */}
      <section className="relative z-10 w-full py-12 overflow-hidden text-white content-visibility-auto">
        <div className="max-w-6xl mx-auto px-6 text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Gör som tusentals andra</h2>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>197 användare online och övar just nu</span>
          </div>
        </div>

        {/* Marquee Wrapper */}
        <div className="w-full overflow-hidden relative flex py-4">
          {/* Blur masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#002244] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#002244] to-transparent z-10 pointer-events-none" />

          {/* Marquee Flex Row (Rendered twice for seamless loop) */}
          <div className="animate-marquee flex gap-6">
            {/* First Set */}
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div 
                key={idx}
                className="w-[300px] md:w-[350px] shrink-0 rounded-2xl p-6 border border-white/10 hover:border-[#FECC02]/30 bg-white/5 backdrop-blur-md flex flex-col justify-between transition-all duration-300 shadow-sm"
              >
                <p className="text-white/90 text-sm leading-relaxed italic mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{t.name}</h4>
                    <p className="text-xs text-white/50">{t.origin}</p>
                    <p className="text-[10px] text-[#FECC02] mt-0.5 font-semibold">{t.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 w-full px-6 pb-24 pt-12 flex justify-center items-center content-visibility-auto">
        <div className="bg-white rounded-[2rem] overflow-hidden w-full max-w-md shadow-2xl transition-transform hover:scale-[1.02] duration-300">
          {/* Card Header (Light Theme) */}
          <div className="bg-[#E5F0F6] pt-8 pb-10 flex justify-center">
            <span className="bg-white text-[#006AA7] px-6 py-2 rounded-full text-sm font-extrabold shadow-sm">
              Samhällskunskap
            </span>
          </div>
          
          {/* Price */}
          <div className="text-center pt-8 pb-6 px-8 bg-white">
            <h2 className="text-[#002244] text-6xl font-extrabold mb-3 tracking-tight">199 kr</h2>
            <p className="text-gray-600 font-semibold">Engångsbetalning — livstidstillgång</p>
          </div>

          <div className="px-10 bg-white">
            <div className="h-px bg-gray-200 w-full" />
          </div>

          {/* Features */}
          <div className="px-10 py-8 space-y-5 bg-white">
            {[
              <>Över <strong>500+ frågor</strong> från <em>Sverige i fokus</em></>,
              <>Översättning på <strong>8 olika språk</strong> (TR/EN/AR/ES...)</>,
              <><strong>Realistiska simuleringar</strong> av testet</>,
              <>Detaljerade <strong>förklaringar</strong> till varje fråga</>,
              <>Interaktivt <strong>Flashcard-läge</strong></>,
              <>Detaljerad <strong>statistik</strong> och historik</>,
              <>Tillgång på <strong>dator, surfplatta och mobil</strong></>,
              <><strong>Omedelbar aktivering</strong> efter betalning</>
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-[#006AA7] text-[18px] font-black mt-0.5">✓</span>
                <p className="text-gray-800 font-semibold text-sm leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button 
            onClick={() => { setIsLogin(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full py-5 text-lg font-black transition-all hover:brightness-110 flex justify-center items-center gap-2"
            style={{ background: '#006AA7', color: 'white' }}
          >
            Börja nu — 199 kr
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6 text-white/55 text-xs space-y-2">
        <p>🇸🇪 &nbsp;sverigemedborgarskapsprov.com</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/om-oss" className="text-white/60 hover:text-white transition-colors">Om Oss</Link>
          <span>·</span>
          <Link href="/ovning" className="text-white/60 hover:text-white transition-colors">Gratis övning</Link>
          <span>·</span>
          <Link href="/ovning/flashcards" className="text-white/60 hover:text-white transition-colors">Flashcards</Link>
          <span>·</span>
          <Link href="/artiklar" className="text-white/60 hover:text-white transition-colors">Artiklar & Guider</Link>
          <span>·</span>
          <a href="https://www.youtube.com/@SvenskMedborgarskapsprovet" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">YouTube</a>
          <span>·</span>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Användarvillkor</a>
        </div>
      </footer>
    </div>
  );
}

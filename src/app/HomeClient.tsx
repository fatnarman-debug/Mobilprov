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

export default function HomeClient() {
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
          <div>
            <span className="text-white font-bold text-lg tracking-tight">SVERIGEMEDBORGARSKAPSPROV</span>
            <span style={{ color: '#FECC02' }} className="font-bold text-lg">.com</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <span>🇸🇪</span>
          <span>Sverige</span>
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
            <span style={{ color: '#FECC02' }}>Bestå på första försöket</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Flashcards, övningsfrågor och provsimuleringar – allt på ett ställe
          </p>

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
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 py-16 space-y-12 text-white">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Detailed Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: '#FECC02' }}>
              Vad är det svenska medborgarskapsprovet?
            </h2>
            <p className="text-white/80 leading-relaxed">
              Från och med den <strong>6 juni 2026</strong> införs ett nytt obligatoriskt <strong>medborgarskapsprov</strong> (samhällskunskapstest) för alla som ansöker om svenskt medborgarskap. Syftet med testet är att säkerställa att nya medborgare har grundläggande kunskaper om hur det svenska samhället fungerar, dess lagar, historia och demokratiska värderingar.
            </p>
            <p className="text-white/80 leading-relaxed">
              Vår plattform är skräddarsydd för att hjälpa dig att klara detta prov på första försöket. We erbjuder gratis övningsfrågor, interaktiva flashcards och realistiska provsimuleringar baserade på det officiella studiematerialet <em>Sverige i fokus</em>.
            </p>
            <div className="p-5 rounded-2xl border border-white/10 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
              <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#FECC02' }}>
                <span className="material-symbols-outlined text-[20px]">translate</span>
                Förberedelse på svenska med flerspråkigt stöd
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                För att hjälpa dig att förstå frågorna på svenska finns översättningsstöd för alla frågor, svar och förklaringar till ditt valda modersmål (turkiska, engelska, arabiska, spanska, ukrainska, franska, persiska och dari). På så sätt utvecklar du ditt språk samtidigt som du lär dig allt inför provet.
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
                  <span className="text-sm text-white/75">Du har 90 minuter på dig att besvara alla frågor under provet.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <div>
                  <strong className="block text-white" style={{ color: '#FECC02' }}>Godkändgräns på 67%</strong>
                  <span className="text-sm text-white/75">Det krävs minst 40 rätta svar av 60 för att få godkänt resultat.</span>
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
                Alla personer över 15 år som ansöker om svenskt medborgarskap efter den 6 juni 2026 måste klara provet. Undantag kan göras för personer med vissa funktionsnedsättningar eller allvarlig sjukdom.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 space-y-2 bg-white/5">
              <h3 className="font-bold text-white">Vad kostar provet att skriva?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Det allra första utprövningsprovet den 15 augusti 2026 är helt kostnadsfritt för de som får kallelse. Avgiften för framtida ordinarie provtillfällen kommer att fastställas av regeringen och UHR.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 space-y-2 bg-white/5">
              <h3 className="font-bold text-white">Kommer det finnas ett språktest i svenska också?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Kravet på svenska språkkunskaper (språktest) planeras att införas i ett senare skede. Under 2026 testas enbart dina kunskaper om det svenska samhället (samhällskunskap), men frågorna är skrivna på svenska.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 space-y-2 bg-white/5">
              <h3 className="font-bold text-white">Hur kan jag förbereda mig på bästa sätt?</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Det mest effektiva sättet är att läsa boken <em>Sverige i fokus</em> kombinerat med att göra realistiska provsimuleringar och flashcards på vår sajt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6 text-white/55 text-xs space-y-2">
        <p>🇸🇪 &nbsp;sverigemedborgarskapsprov.com</p>
        <div className="flex justify-center gap-4">
          <Link href="/ovning" className="text-white/60 hover:text-white transition-colors">Gratis övning</Link>
          <span>·</span>
          <Link href="/ovning/flashcards" className="text-white/60 hover:text-white transition-colors">Flashcards</Link>
          <span>·</span>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Användarvillkor</a>
        </div>
      </footer>
    </div>
  );
}

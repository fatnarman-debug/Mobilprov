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
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Bestå medborgarskapstestet<br />
            <span style={{ color: '#FECC02' }}>på första försöket</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Flashcards, övningsfrågor och provsimuleringar – allt på ett ställe
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '📚', text: 'Konuya özel çalışma' },
              { icon: '🧠', text: 'Flashcard sistemi' },
              { icon: '✅', text: 'Deneme sınavları' },
              { icon: '📊', text: 'İlerleme takibi' },
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
              {isLogin ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
            </h2>
            <p className="text-white/75 text-sm mb-6">
              {isLogin ? 'Sverigemedborgarskapsprov.com hesabınıza giriş yapın' : 'Sınavınıza hazırlanmaya başlayın'}
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
                Giriş Yap
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(null); }}
                type="button"
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={!isLogin
                  ? { background: '#FECC02', color: '#002244' }
                  : { color: 'rgba(255,255,255,0.6)' }}
              >
                Kayıt Ol
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
              Google ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <span className="text-white/40 text-xs font-semibold tracking-widest">VEYA</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Form */}
            <form className="space-y-4" action={handleSubmit}>
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">Ad Soyad</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">person</span>
                      <input
                        name="name"
                        type="text"
                        placeholder="Adınız ve Soyadınız"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all focus:ring-2"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', focusRingColor: '#FECC02' } as React.CSSProperties}
                        onFocus={e => (e.target.style.borderColor = '#FECC02')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">Ana Diliniz (Çeviriler İçin)</label>
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
                      </select>
                      <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">E-posta</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-[20px]">mail</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="ornek@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    onFocus={e => (e.target.style.borderColor = '#FECC02')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-xs font-semibold mb-1.5 ml-1">Şifre</label>
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
                    İşleniyor...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol ve Devam Et'}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Trust badge (register only) */}
            {!isLogin && (
              <div className="mt-4 flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background: 'rgba(254,204,2,0.1)', border: '1px solid rgba(254,204,2,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                <span className="material-symbols-outlined text-[16px]" style={{ color: '#FECC02' }}>verified_user</span>
                Ödeme işlemi 256-bit SSL ile güvence altındadır.
              </div>
            )}

            {/* Switch mode */}
            <p className="text-center text-white/70 text-sm mt-5">
              {isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="font-semibold transition-colors hover:underline"
                style={{ color: '#FECC02' }}
              >
                {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
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
                Önce ücretsiz dene – kayıt gerekmez
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6 text-white/55 text-xs space-y-2">
        <p>🇸🇪 &nbsp;sverigemedborgarskapsprov.com</p>
        <div className="flex justify-center gap-4">
          <Link href="/ovning" className="text-white/60 hover:text-white transition-colors">Gratis övning</Link>
          <span>·</span>
          <Link href="/ovning/flashcards" className="text-white/60 hover:text-white transition-colors">Flashcards</Link>
          <span>·</span>
          <a href="#" className="text-white/60 hover:text-white transition-colors">Kullanım Koşulları</a>
        </div>
      </footer>
    </div>
  );
}

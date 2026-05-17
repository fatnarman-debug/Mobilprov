'use client';

import React, { useState } from 'react';
import { loginUser, registerUser } from '@/actions/auth.actions';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      // Next.js redirect might throw an error we need to catch or let bubble up depending on the implementation.
      // But typically, successful redirect doesn't reach here or we don't need to unset loading.
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="flex justify-between items-center px-gutter h-16 w-full max-w-container-max mx-auto">
          <span className="font-display-lg text-title-md text-primary font-bold">EduFlow</span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">school</span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-24 pb-12 px-gutter flex flex-col items-center justify-start w-full max-w-container-max mx-auto">
        {/* Welcome Section */}
        <div className="w-full text-center mb-lg">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-xs">Geleceğini İnşa Et</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sınav hazırlığında en güvenilir çözüm ortağın.</p>
        </div>

        {/* Auth Card Container */}
        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden p-6 relative z-10">
          {/* Toggle Tabs */}
          <div className="flex bg-surface-container-low p-1 rounded-lg mb-8">
            <button 
              className={`flex-1 py-2 font-label-md text-label-md rounded-md transition-all ${isLogin ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => { setIsLogin(true); setError(null); }}
              type="button"
            >
              Giriş Yap
            </button>
            <button 
              className={`flex-1 py-2 font-label-md text-label-md transition-all ${!isLogin ? 'bg-white shadow-sm text-primary rounded-md' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => { setIsLogin(false); setError(null); }}
              type="button"
            >
              Kayıt Ol
            </button>
          </div>

          {/* Social Login */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 flex justify-center items-center py-3 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors" type="button">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKalRK8qYR-7UACPhuV1ZOTZ1LT09OgXRk6nSLvgqELYU5rFHmE3xR3-DIOO5amF8bnV2sXEjqUojovXvP7t1C5f1EtNSfrNf5xNER5gi_fet_oYis7CSmjoXkl6Cn6pej3K4TFNWbO5YXTLEvdjqWustNDsW_UfBtn-Ei2CIPZ-eA91Ua98VePBDX6xlOnycUatAj5ce1Q33NOZNiHFrh-QVLEbU_lFuBPExmFG6iVAbjhoyZFbFgexAwfb1rTvOl5RXwBTm5Jf8"/>
            </button>
            <button className="flex-1 flex justify-center items-center py-3 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors" type="button">
              <span className="material-symbols-outlined text-on-surface">account_circle</span>
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-outline-variant"></div>
            <span className="px-4 font-label-md text-label-md text-outline uppercase tracking-widest">veya</span>
            <div className="flex-grow border-t border-outline-variant"></div>
          </div>

          {/* Form Fields */}
          <form className="space-y-6" action={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1">
                <label className="block font-label-md text-label-md text-on-surface-variant ml-1">Ad Soyad</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                  <input className="w-full pl-10 pr-4 py-3 bg-surface border-outline-variant border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-body-md text-body-md" placeholder="Adınız ve Soyadınız" type="text" name="name" required />
                </div>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant ml-1">E-posta</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input className="w-full pl-10 pr-4 py-3 bg-surface border-outline-variant border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-body-md text-body-md" placeholder="ornek@edu.com" type="email" name="email" required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-label-md text-label-md text-on-surface-variant ml-1">Şifre</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input className="w-full pl-10 pr-12 py-3 bg-surface border-outline-variant border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-body-md text-body-md" placeholder="••••••••" type="password" name="password" required />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px] cursor-pointer">visibility</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error/10 text-error rounded-lg font-label-md text-sm">
                {error}
              </div>
            )}

            {/* Transactional Action Button */}
            <div className="pt-4">
              <button 
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-title-md text-title-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:active:scale-100" 
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol ve Ödeme Yap')}</span>
                {!isLogin && !loading && <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>payments</span>}
              </button>
            </div>
          </form>

          {/* Trust Indicator (Only for Register) */}
          {!isLogin && (
            <div className="mt-8 p-4 bg-secondary-container rounded-lg border border-secondary/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-on-secondary-container mt-0.5">verified_user</span>
              <div className="space-y-1">
                <p className="font-label-md text-label-md text-on-secondary-container font-bold">Güvenli Ödeme</p>
                <p className="text-[11px] leading-relaxed text-on-secondary-container/80">Erişiminiz, ödeme işlemi başarıyla tamamlandıktan hemen sonra aktif edilecektir. 256-bit SSL ile korunmaktasınız.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="mt-lg text-center space-y-4 z-10">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {isLogin ? 'Hesabın yok mu? ' : 'Zaten bir hesabın var mı? '}
            <button className="text-primary font-bold hover:underline" onClick={() => setIsLogin(!isLogin)} type="button">
              {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>
          <div className="flex justify-center gap-base text-outline text-[12px] font-label-md">
            <a className="hover:text-primary transition-colors" href="#">Kullanım Koşulları</a>
            <span>•</span>
            <a className="hover:text-primary transition-colors" href="#">Gizlilik Politikası</a>
          </div>
        </div>
      </main>

      {/* Contextual Hero Image (Subtle Background Element) */}
      <div className="fixed inset-0 -z-10 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-[120px]"></div>
      </div>
      
      {/* Background Illustration Placeholder */}
      <div className="hidden lg:block fixed right-12 bottom-12 w-1/4 opacity-10 -z-10">
        <img className="w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD62ZmOC0RCSi7SYK5t788qQpNPnz6GcDFveJL3NVi4Ojo0EmwQWwZxdmQxa7UVIbLgrVgmr9ssWVqDgxMI7IE7XjUiShYa1WJtUKO9AxxCwcxnjeigZBSr31qHmtc6juMtXSi12j_aDpEI9c7zJ2ICtKHJbr1ivVZcs34tqYojX5O9n_EkyLG6uu-J-SauU_LPlwz-n03MP_EW9UH1fyFhcxJET7HNP6Vgi-4iewifRaRN22rWisFL51NhHUe0bOAl8foKvKYM-3c" alt="Background decoration"/>
      </div>
    </div>
  );
}

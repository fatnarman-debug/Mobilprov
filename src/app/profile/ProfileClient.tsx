'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

type ProfileClientProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    isPaid: boolean;
    subscriptionEndsAt: string | null;
    createdAt: string;
  };
  stats: {
    completedTopicsCount: number;
    totalExamsAttempted: number;
    averageScore: number;
    maxScore: number;
  };
  settings: {
    siteName: string;
    contactEmail: string;
  };
  logoutAction: () => Promise<void>;
  changePasswordAction: (formData: FormData) => Promise<{ success?: string; error?: string }>;
};

export default function ProfileClient({ 
  user, 
  stats, 
  settings, 
  logoutAction,
  changePasswordAction 
}: ProfileClientProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userInitials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long'
  });

  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    const formData = new FormData(e.currentTarget);
    const res = await changePasswordAction(formData);

    setLoading(false);
    if (res?.error) {
      setPasswordError(res.error);
    } else if (res?.success) {
      setPasswordSuccess(res.success);
      e.currentTarget.reset();
      
      // Collapse accordion after 2 seconds on success
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess(null);
      }, 2000);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen pb-28">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant h-16 flex items-center px-gutter justify-between">
        <span className="font-title-md text-primary font-bold">{settings.siteName}</span>
        <span className="font-label-md text-xs bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant">
          Hesabım
        </span>
      </header>

      <main className="mt-20 px-gutter max-w-container-max mx-auto space-y-md">
        
        {/* User Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-md shadow-sm flex items-center gap-md">
          {/* Avatar Initials bubble */}
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container font-title-lg flex items-center justify-center font-bold text-xl border-2 border-primary/20 shrink-0">
            {userInitials}
          </div>

          <div className="space-y-xs min-w-0">
            <div className="flex items-center gap-xs flex-wrap">
              <h2 className="font-title-lg text-lg text-on-surface font-bold truncate leading-none">
                {user.name || 'Öğrenci'}
              </h2>
              {user.isPaid ? (
                <span className="inline-flex items-center gap-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[12px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  VIP PREMIUM
                </span>
              ) : (
                <span className="inline-flex bg-surface-container-high text-on-surface-variant text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  STANDART
                </span>
              )}
            </div>
            <p className="text-on-surface-variant text-xs truncate">{user.email}</p>
            <p className="text-[10px] text-on-surface-variant/80 font-label-md">
              Katılım Tarihi: {formattedJoinDate}
            </p>
          </div>
        </section>

        {/* Dynamic Paywall / Subscription Info Banner */}
        <section>
          {user.isPaid ? (
            <div className="bg-gradient-to-r from-secondary-container/30 to-primary-container/30 border border-secondary/20 rounded-2xl p-md shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-base">
              {/* Background Sparkles */}
              <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-secondary">workspace_premium</span>
              </div>

              <div className="space-y-xs relative z-10">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest block">Premium Abonelik Aktif</span>
                <h3 className="font-title-md text-base text-on-surface font-bold">Ayrıcalıklı Eğitim Dünyası</h3>
                <p className="text-xs text-on-surface-variant max-w-md">
                  Tüm sınav kilitleriniz kaldırıldı! Sınırsız deneme sınavı çözebilir, çalışma sorularına dilediğiniz gibi erişebilirsiniz.
                </p>
              </div>

              {user.subscriptionEndsAt && (
                <div className="bg-surface/50 border border-outline-variant/60 rounded-xl px-4 py-2 shrink-0 relative z-10 self-start sm:self-auto">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold block tracking-wider">Yenilenme Tarihi</span>
                  <span className="text-xs font-bold text-on-surface">
                    {new Date(user.subscriptionEndsAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-2xl p-md shadow-sm relative overflow-hidden flex flex-col gap-base">
              {/* Background VIP Icon */}
              <div className="absolute right-[-15px] top-[-15px] opacity-15 pointer-events-none text-amber-500">
                <span className="material-symbols-outlined text-[100px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
              </div>

              <div className="space-y-xs relative z-10">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">SINIRSIZ ERİŞİM KAZANIN</span>
                <h3 className="font-title-md text-base text-on-surface font-bold">Premium VIP Avantajları</h3>
                <p className="text-xs text-on-surface-variant max-w-lg leading-relaxed">
                  İsveç Vatandaşlık sınavına eksiksiz hazırlanmak için tüm kilitleri açın. Sınırsız deneme sınavları, akıllı yapay zeka analizleri ve limitsiz soru çözümü sizi bekliyor!
                </p>
              </div>

              <div className="flex gap-sm items-center relative z-10">
                <Link 
                  href="/payment" 
                  className="inline-flex items-center gap-xs bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  VIP Premium Ol (₺499.00)
                </Link>
                <span className="text-[10px] text-on-surface-variant font-label-md">
                  Tek Seferlik Ödeme
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Dynamic Performance Stats Grid */}
        <section className="space-y-base">
          <h3 className="font-title-sm text-sm text-on-surface font-semibold px-xs">Performans Özeti</h3>
          <div className="grid grid-cols-2 gap-sm">
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md flex flex-col justify-between min-h-[90px] shadow-sm">
              <span className="text-on-surface-variant font-label-md text-xs uppercase tracking-wide">Sınav Ortalaması</span>
              <div className="flex items-baseline gap-xs mt-xs">
                <span className="text-2xl font-black text-primary">%{stats.averageScore}</span>
                {stats.averageScore > 0 && (
                  <span className="text-[10px] font-bold text-secondary uppercase">Başarı</span>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md flex flex-col justify-between min-h-[90px] shadow-sm">
              <span className="text-on-surface-variant font-label-md text-xs uppercase tracking-wide">En Yüksek Skor</span>
              <div className="flex items-baseline gap-xs mt-xs">
                <span className="text-2xl font-black text-secondary">%{stats.maxScore}</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md flex flex-col justify-between min-h-[90px] shadow-sm">
              <span className="text-on-surface-variant font-label-md text-xs uppercase tracking-wide">Çözülen Denemeler</span>
              <div className="flex items-baseline gap-xs mt-xs">
                <span className="text-2xl font-black text-on-surface">{stats.totalExamsAttempted}</span>
                <span className="text-[10px] font-label-md text-on-surface-variant">Sınav</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md flex flex-col justify-between min-h-[90px] shadow-sm">
              <span className="text-on-surface-variant font-label-md text-xs uppercase tracking-wide">Tamamlanan Konular</span>
              <div className="flex items-baseline gap-xs mt-xs">
                <span className="text-2xl font-black text-tertiary">{stats.completedTopicsCount}</span>
                <span className="text-[10px] font-label-md text-on-surface-variant">Konu</span>
              </div>
            </div>

          </div>
        </section>

        {/* Quick Actions List */}
        <section className="space-y-base">
          <h3 className="font-title-sm text-sm text-on-surface font-semibold px-xs">Hızlı İşlemler</h3>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden divide-y divide-outline-variant/60 shadow-sm">
            
            {/* Admin Panel Access Button (Only for Admin accounts) */}
            {user.role === 'ADMIN' && (
              <Link 
                href="/admin" 
                className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors text-left group"
              >
                <div className="flex items-center gap-md">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  </div>
                  <div>
                    <h4 className="font-title-sm text-sm text-on-surface font-bold">Yönetici Paneli</h4>
                    <p className="text-[10px] text-on-surface-variant">Soruları, konuları ve sınavları düzenleyin.</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>
            )}

            {/* Şifre Değiştirme Butonu (Expandable Accordion) */}
            <div className="p-0">
              <button 
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors text-left group"
              >
                <div className="flex items-center gap-md">
                  <div className="w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  </div>
                  <div>
                    <h4 className="font-title-sm text-sm text-on-surface font-bold">Şifre Değiştir</h4>
                    <p className="text-[10px] text-on-surface-variant">Hesap güvenlik şifrenizi güncelleyin.</p>
                  </div>
                </div>
                <span className={`material-symbols-outlined text-on-surface-variant text-base transition-transform duration-200 ${isChangingPassword ? 'rotate-90' : 'group-hover:translate-x-1'}`}>chevron_right</span>
              </button>

              {isChangingPassword && (
                <form onSubmit={handleSubmitPassword} className="p-md bg-surface-container-low/40 border-t border-outline-variant/40 space-y-sm transition-all duration-300">
                  <div className="space-y-xs">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Mevcut Şifre</label>
                    <input 
                      type="password" 
                      name="currentPassword" 
                      required 
                      placeholder="••••••••" 
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-sm text-on-surface focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Yeni Şifre</label>
                    <input 
                      type="password" 
                      name="newPassword" 
                      required 
                      placeholder="En az 6 karakter" 
                      className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-sm text-on-surface focus:border-primary transition-all outline-none"
                    />
                  </div>

                  {passwordError && (
                    <div className="text-xs text-error font-semibold bg-error/10 p-2 rounded-lg flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="text-xs text-secondary font-semibold bg-secondary-container/30 p-2 rounded-lg flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      {passwordSuccess}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-on-primary hover:bg-primary-dark active:scale-95 disabled:opacity-50 text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all"
                  >
                    {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </button>
                </form>
              )}
            </div>

            {/* Bize Ulaşın / Destek */}
            <div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-md">
                <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <h4 className="font-title-sm text-sm text-on-surface font-bold">Destek Al</h4>
                  <p className="text-[10px] text-on-surface-variant">Sorularınız veya görüşleriniz için destek maili.</p>
                </div>
              </div>
              <a 
                href={`mailto:${settings.contactEmail}`} 
                className="text-xs font-bold text-primary hover:underline"
              >
                {settings.contactEmail}
              </a>
            </div>

            {/* Çıkış Yap Butonu */}
            <form action={logoutAction} className="w-full">
              <button 
                type="submit" 
                className="w-full flex items-center justify-between p-md hover:bg-error-container/10 transition-colors text-left group"
              >
                <div className="flex items-center gap-md">
                  <div className="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                  </div>
                  <div>
                    <h4 className="font-title-sm text-sm text-error font-bold">Çıkış Yap</h4>
                    <p className="text-[10px] text-on-surface-variant">Hesabınızdan güvenli bir şekilde ayrılın.</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-error text-base group-hover:translate-x-1 transition-transform">chevron_right</span>
              </button>
            </form>

          </div>
        </section>

      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab="profile" />
    </div>
  );
}

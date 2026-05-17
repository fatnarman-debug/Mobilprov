'use client';

import React, { useState } from 'react';
import { updatePlatformSettings } from '@/actions/setting.actions';

type PlatformSetting = {
  id: string;
  siteName: string;
  contactEmail: string;
  maintenanceMode: boolean;
  freeDailyQuestionLimit: number;
  passingScorePercentage: number;
  seoTitle: string;
  seoDescription: string;
};

export default function SettingsClient({ initialSettings }: { initialSettings: PlatformSetting | null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Varsayılan boş ayarlar (Eğer DB henüz boşsa)
  const defaultSettings: PlatformSetting = {
    id: 'global_settings',
    siteName: 'SveaProv',
    contactEmail: 'destek@sveaprov.se',
    maintenanceMode: false,
    freeDailyQuestionLimit: 20,
    passingScorePercentage: 60,
    seoTitle: 'SveaProv - İsveç Vatandaşlık Sınavı Hazırlık Platformu',
    seoDescription: 'İsveç vatandaşlık sınavına (SveaProv) en güncel sorular, flashcardlar ve deneme sınavlarıyla hazırlanın.'
  };

  const currentSettings = initialSettings || defaultSettings;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updatePlatformSettings(formData);
    
    setIsSubmitting(false);
    if (result.error) alert(result.error);
    else alert(result.success);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      
      {/* 1. Temel Ayarlar */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
          <span className="material-symbols-outlined text-primary">settings</span>
          Temel Ayarlar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-title-sm text-on-surface mb-2">Platform Adı</label>
            <input 
              type="text" 
              name="siteName" 
              defaultValue={currentSettings.siteName} 
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <p className="text-xs text-on-surface-variant mt-1">Sitenin menülerinde ve maillerde görünecek marka adı.</p>
          </div>

          <div>
            <label className="block font-title-sm text-on-surface mb-2">İletişim / Destek E-postası</label>
            <input 
              type="email" 
              name="contactEmail" 
              defaultValue={currentSettings.contactEmail} 
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <p className="text-xs text-on-surface-variant mt-1">Öğrencilerin destek taleplerinin gönderileceği adres.</p>
          </div>

          <div className="md:col-span-2 mt-2">
            <label className="flex items-center gap-3 cursor-pointer p-4 border border-outline-variant rounded-lg hover:bg-surface-container-lowest transition-colors">
              <input 
                type="checkbox" 
                name="maintenanceMode" 
                defaultChecked={currentSettings.maintenanceMode} 
                className="w-6 h-6 accent-error"
              />
              <div>
                <div className="font-title-md text-on-surface flex items-center gap-2">
                  Bakım Modu (Maintenance Mode)
                  {currentSettings.maintenanceMode && <span className="bg-error text-on-error text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Aktif</span>}
                </div>
                <div className="font-body-sm text-on-surface-variant">Bu seçenek işaretliyken, sadece Adminler siteye girebilir. Diğer herkes 'Sitemiz Güncelleniyor' ekranı görür.</div>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* 2. İş Modeli ve Kısıtlamalar */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
          <span className="material-symbols-outlined text-tertiary">monetization_on</span>
          İş Modeli ve Kısıtlamalar (Paywall)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-title-sm text-on-surface mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">lock_open</span>
              Ücretsiz Günlük Soru Limiti
            </label>
            <input 
              type="number" 
              name="freeDailyQuestionLimit" 
              defaultValue={currentSettings.freeDailyQuestionLimit} 
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
              min="0"
              required
            />
            <p className="text-xs text-on-surface-variant mt-1">Örn: 20 derseniz, ücretsiz üyeler 21. soruda ödeme ekranına (Premium satın al) yönlendirilir. 0 yaparsanız hiç soru çözemezler.</p>
          </div>

          <div>
            <label className="block font-title-sm text-on-surface mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">grade</span>
              Sınav / Konu Geçme Barajı (%)
            </label>
            <input 
              type="number" 
              name="passingScorePercentage" 
              defaultValue={currentSettings.passingScorePercentage} 
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
              min="1" max="100"
              required
            />
            <p className="text-xs text-on-surface-variant mt-1">Öğrencinin bir sınavı "Geçti" sayılması için yapması gereken minimum doğru yüzdesi. (Örn: %60)</p>
          </div>
        </div>
      </section>

      {/* 3. SEO ve Pazarlama */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-outline-variant shadow-sm">
        <h2 className="font-headline-sm text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant pb-4">
          <span className="material-symbols-outlined text-secondary">rocket_launch</span>
          SEO ve Görünürlük (Google Ayarları)
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block font-title-sm text-on-surface mb-2">Ana Sayfa SEO Başlığı (Meta Title)</label>
            <input 
              type="text" 
              name="seoTitle" 
              defaultValue={currentSettings.seoTitle} 
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
              required
            />
            <p className="text-xs text-on-surface-variant mt-1">Google aramalarında ve tarayıcı sekmesinde görünen en büyük başlık. (Maks 60 karakter önerilir)</p>
          </div>

          <div>
            <label className="block font-title-sm text-on-surface mb-2">Ana Sayfa Açıklaması (Meta Description)</label>
            <textarea 
              name="seoDescription" 
              defaultValue={currentSettings.seoDescription} 
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
              rows={3}
              required
            ></textarea>
            <p className="text-xs text-on-surface-variant mt-1">Google aramalarında başlığın hemen altında çıkan kısa tanıtım yazısı. Sitenin tıklanma oranını çok etkiler. (Maks 160 karakter önerilir)</p>
          </div>
        </div>
      </section>

      {/* Kaydet Butonu */}
      <div className="sticky bottom-6 bg-surface-container-low p-4 rounded-2xl border border-outline-variant shadow-lg flex justify-between items-center backdrop-blur-md">
        <div>
          <h3 className="font-title-md text-on-surface">Değişiklikleri Uygula</h3>
          <p className="font-body-sm text-on-surface-variant hidden md:block">Kaydet butonuna bastığınız an tüm platform yeni kurallara göre çalışmaya başlar.</p>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary text-on-primary px-8 py-3 rounded-full font-title-md flex items-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined">save</span>
          )}
          {isSubmitting ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </div>

    </form>
  );
}

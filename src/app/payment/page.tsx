'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createCheckoutSession } from '@/actions/payment.actions';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const canceled = searchParams.get('canceled');
  const [isLoading, setIsLoading] = useState(false);

  const handleStripeCheckout = async () => {
    if (!userId) {
      alert('Kullanıcı kimliği bulunamadı. Lütfen tekrar kayıt olun veya giriş yapın.');
      return;
    }

    setIsLoading(true);
    try {
      const { url } = await createCheckoutSession(userId);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error(error);
      alert('Ödeme sayfası başlatılırken bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center px-gutter font-body-md">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant p-lg rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-md">
          <span className="material-symbols-outlined text-[32px]">credit_card</span>
        </div>
        
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-xs">Hesabınızı Aktifleştirin</h1>
        <p className="text-on-surface-variant font-body-md mb-lg">
          Eğitim platformuna tam erişim sağlamak için ödeme işlemini tamamlamanız gerekmektedir.
        </p>

        {canceled && (
          <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg text-sm">
            Ödeme işlemi iptal edildi. Lütfen tekrar deneyin.
          </div>
        )}

        <div className="bg-surface-container p-md rounded-xl mb-lg text-left">
          <div className="flex justify-between items-center mb-xs">
            <span className="text-on-surface-variant">EduFlow Premium</span>
            <span className="font-title-md text-title-md font-bold text-primary">₺499.00</span>
          </div>
          <span className="text-label-md text-on-surface-variant">Tek Seferlik Ödeme</span>
        </div>

        <button 
          onClick={handleStripeCheckout}
          disabled={isLoading}
          className="w-full py-4 bg-primary text-on-primary font-title-md rounded-full shadow-md active:scale-95 transition-transform flex justify-center items-center gap-xs disabled:opacity-70"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <>
              <span className="material-symbols-outlined">lock</span>
              Güvenli Ödeme Yap
            </>
          )}
        </button>

        <p className="font-label-sm text-label-sm text-on-surface-variant mt-md opacity-70">
          Ödeme altyapısı 256-bit SSL ve Stripe güvencesiyle korunmaktadır.
        </p>
      </div>
    </div>
  );
}

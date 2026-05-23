import React from 'react';
import Link from 'next/link';
import { privateSeo } from '@/lib/seo';

export const metadata = privateSeo('Betalning klar – Medborgarskapsprov | Ödeme Başarılı', 'Din betalning är klar och kontot är aktiverat. İsveç vatandaşlık sınavı hesabınız aktifleştirildi.', '/payment/success');


export default function PaymentSuccessPage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center px-gutter font-body-md">
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant p-lg rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-md">
          <span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
        </div>
        
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-xs">Ödeme Başarılı!</h1>
        <p className="text-on-surface-variant font-body-md mb-lg">
          Hesabınız başarıyla aktifleştirildi. EduFlow'a hoş geldiniz.
        </p>

        <Link 
          href="/"
          className="w-full py-4 block bg-primary text-on-primary font-title-md rounded-full shadow-md active:scale-95 transition-transform"
        >
          Giriş Yap
        </Link>
      </div>
    </div>
  );
}

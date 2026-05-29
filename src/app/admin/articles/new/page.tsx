import React from 'react';
import Link from 'next/link';
import ArticleForm from '../ArticleForm';

export default function NewArticlePage() {
  return (
    <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">
      <div className="mb-6">
        <Link href="/admin/articles" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold font-body-md transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Makalelere Dön
        </Link>
      </div>
      
      <header className="mb-lg">
        <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Yeni Makale Ekle</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">SEO uyumlu yeni bir içerik oluşturun. Markdown kullanarak yazınızı biçimlendirebilirsiniz.</p>
      </header>

      <ArticleForm />
    </main>
  );
}

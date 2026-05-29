import React from 'react';
import prisma from '@/lib/db';
import ArticlesClient from './ArticlesClient';

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">
      <header className="mb-lg">
        <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Makaleler ve SEO (Blog CMS)</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Sitenizin Google'da üst sıralara çıkmasını sağlayan tüm SEO uyumlu makaleleri buradan yönetebilirsiniz.</p>
      </header>

      <ArticlesClient initialArticles={articles} />
    </main>
  );
}

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ArticleForm from '../../ArticleForm';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      faqs: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">
      <div className="mb-6">
        <Link href="/admin/articles" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold font-body-md transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Makalelere Dön
        </Link>
      </div>
      
      <header className="mb-lg">
        <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Makaleyi Düzenle</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">"{article.title}" adlı makaleyi düzenliyorsunuz.</p>
      </header>

      <ArticleForm initialData={article} />
    </main>
  );
}

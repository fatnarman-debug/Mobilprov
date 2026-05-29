import React from 'react';
import prisma from '@/lib/db';
import Link from 'next/link';
import QuestionBankClient from './QuestionBankClient';

export default async function QuestionBankPage() {
  // Veritabanından soruları Konuları ile birlikte çekelim
  const questions = await prisma.question.findMany({
    include: {
      topic: {
        select: { id: true, title: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Filtreleme için sadece konu isimlerini ve id'lerini çekelim (Tekrarları önlemek için)
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      title: true
    },
    orderBy: {
      title: 'asc'
    }
  });

  return (
    <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">
          <header className="mb-lg flex items-center justify-between">
            <div>
              <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Soru Bankası</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Sisteme eklenen tüm soruları buradan görüntüleyebilirsiniz.</p>
            </div>
            <Link href="/admin" className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-title-md flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Soru Ekle
            </Link>
          </header>

          <QuestionBankClient initialQuestions={questions} topics={topics} />
        </main>
  );
}

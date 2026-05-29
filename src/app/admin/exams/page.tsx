import React from 'react';
import prisma from '@/lib/db';
import Link from 'next/link';
import ExamTemplatesClient from './ExamTemplatesClient';

export default async function ExamTemplatesPage() {
  const templates = await prisma.examTemplate.findMany({
    include: {
      rules: {
        include: {
          topic: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const topics = await prisma.topic.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  });

  const mockExams = await prisma.mockExam.findMany({
    include: {
      template: { select: { title: true } },
      _count: {
        select: { questions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="flex-1 p-6 lg:p-10 w-full max-w-[1600px] mx-auto pb-24">
          <header className="mb-lg">
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Sınav Şablonları Yönetimi</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Öğrencilerin gireceği deneme sınavlarının kurallarını ve soru dağılımlarını buradan belirleyip sabit sınavlar üretebilirsiniz.</p>
          </header>

          <ExamTemplatesClient templates={templates} topics={topics} mockExams={mockExams} />
        </main>
  );
}

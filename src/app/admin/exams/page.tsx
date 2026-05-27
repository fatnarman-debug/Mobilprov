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
    <div className="bg-background text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface dark:bg-background border-b border-outline-variant h-16">
        <div className="flex justify-between items-center px-gutter h-full w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-base">
            <button className="p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 lg:hidden">
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            <h1 className="font-display-lg text-title-md text-primary dark:text-primary-fixed font-bold">Medborgarskapsprov</h1>
          </div>
          <div className="flex items-center gap-base">
            <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors duration-200">
              <span className="material-symbols-outlined text-primary">query_stats</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJqqrK8lVGMcA-anSY34OOClViUK6Yw-I1ETYUw_L1rxmgxP84GKmuwBhT2Mt76k0IH3CkDmPigcslc-CYExtIPdi8D990ufN7WpPHhzy0DRGPirYW5-DFm9uzubk36UnNUMY3I32ucqVNhjocROcwrFitz3mLUw2PnG0-7Ja9KqLxiHQLQ-rFenPmH4mPBFhhcO2jW-JBvDNnDegwF-q7ruLgvdCX6ZYzec28BQQBAUpWARdLcUr7pdMEYMXxB0_W4LfCPImBWDo" alt="Admin Profile" />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar / NavigationDrawer (Desktop) */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container dark:bg-surface-container-low border-r border-outline-variant pt-20 hidden lg:flex flex-col py-md gap-base shadow-md">
        <div className="px-md mb-md">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">shield_person</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-primary font-bold">Admin Portal</h2>
              <p className="font-label-md text-label-md text-on-surface-variant">Content Management System</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/admin" className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
            <span className="material-symbols-outlined">folder_open</span>
            <span className="font-body-md text-body-md">Content Management</span>
          </Link>
          <Link href="/admin/questions" className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
            <span className="material-symbols-outlined">database</span>
            <span className="font-body-md text-body-md">Question Bank</span>
          </Link>
          <Link href="/admin/flashcards" className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
            <span className="material-symbols-outlined">style</span>
            <span className="font-body-md text-body-md">Flashcard Bank</span>
          </Link>
          <Link href="/admin/exams" className="bg-primary text-on-primary rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
            <span className="material-symbols-outlined">quiz</span>
            <span className="font-body-md text-body-md">Sınav Şablonları</span>
          </Link>
          <Link href="/admin/users" className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
            <span className="material-symbols-outlined">manage_accounts</span>
            <span className="font-body-md text-body-md">Kullanıcı Yönetimi</span>
          </Link>
          <Link href="/admin/settings" className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md text-body-md">Platform Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-20 pb-24 lg:pl-80 px-gutter min-h-screen">
        <div className="max-w-container-max mx-auto">
          <header className="mb-lg">
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Sınav Şablonları Yönetimi</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Öğrencilerin gireceği deneme sınavlarının kurallarını ve soru dağılımlarını buradan belirleyip sabit sınavlar üretebilirsiniz.</p>
          </header>

          <ExamTemplatesClient templates={templates} topics={topics} mockExams={mockExams} />
        </div>
      </main>
    </div>
  );
}

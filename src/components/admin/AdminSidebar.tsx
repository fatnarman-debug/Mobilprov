'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Content Management', icon: 'folder_open', path: '/admin' },
    { name: 'Question Bank', icon: 'database', path: '/admin/questions' },
    { name: 'Flashcard Bank', icon: 'style', path: '/admin/flashcards' },
    { name: 'Sınav Şablonları', icon: 'quiz', path: '/admin/exams' },
    { name: 'Makaleler (SEO)', icon: 'article', path: '/admin/articles' },
    { name: 'Kullanıcı Yönetimi', icon: 'manage_accounts', path: '/admin/users' },
    { name: 'Platform Settings', icon: 'settings', path: '/admin/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-white/80 dark:bg-surface-container-low/90 backdrop-blur-xl border-r border-outline-variant/30 pt-20 hidden lg:flex flex-col py-6 gap-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-all duration-300">
      <div className="px-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-primary/80 shadow-lg shadow-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white">shield_person</span>
          </div>
          <div>
            <h2 className="font-title-md text-[17px] text-on-surface font-bold tracking-tight">Admin Portal</h2>
            <p className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">CMS & Studio</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`group flex items-center px-4 py-3.5 gap-3.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface hover:scale-[1.01]'
              }`}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="font-body-md font-medium tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-outline-variant/30 mx-4">
        <p className="text-xs font-semibold text-on-surface-variant opacity-50 uppercase tracking-widest">v2.0 (Pro Max)</p>
      </div>
    </aside>
  );
}

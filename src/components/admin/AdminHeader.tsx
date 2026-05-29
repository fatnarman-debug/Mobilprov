'use client';

export default function AdminHeader({ userEmail }: { userEmail?: string | null }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 h-16 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="flex justify-between items-center px-6 h-full w-full max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4">
          <button className="p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors duration-300 lg:hidden focus:ring-2 focus:ring-primary/50 outline-none">
            <span className="material-symbols-outlined text-on-surface-variant">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">flag</span>
            </div>
            <h1 className="text-lg text-on-surface font-extrabold tracking-tight hidden sm:block">
              Sverige<span className="text-primary">medborgarskapsprov</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-surface-container-highest transition-all duration-300 focus:ring-2 focus:ring-primary/50 outline-none group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">notifications</span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-on-surface tracking-tight">{userEmail || 'Admin'}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary">Superadmin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJqqrK8lVGMcA-anSY34OOClViUK6Yw-I1ETYUw_L1rxmgxP84GKmuwBhT2Mt76k0IH3CkDmPigcslc-CYExtIPdi8D990ufN7WpPHhzy0DRGPirYW5-DFm9uzubk36UnNUMY3I32ucqVNhjocROcwrFitz3mLUw2PnG0-7Ja9KqLxiHQLQ-rFenPmH4mPBFhhcO2jW-JBvDNnDegwF-q7ruLgvdCX6ZYzec28BQQBAUpWARdLcUr7pdMEYMXxB0_W4LfCPImBWDo" alt="Profile" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

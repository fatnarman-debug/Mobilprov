'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Topic, Material } from '@prisma/client';

type TopicWithRelations = Topic & {
  materials: Material[];
};

export default function TopicClient({ topic }: { topic: TopicWithRelations | null }) {
  const [activeTab, setActiveTab] = useState<'oku' | 'dinle' | 'izle'>('oku');

  if (!topic) {
    return (
      <div className="bg-background text-on-background pb-4 flex flex-col items-center justify-center">
        <h2 className="text-title-lg font-bold">Ämne hittades inte</h2>
        <Link href="/dashboard" className="text-primary mt-4 underline">Gå tillbaka</Link>
      </div>
    );
  }

  // Get materials for this topic
  const readMaterial = topic.materials.find(m => m.type === 'READ');
  const listenMaterial = topic.materials.find(m => m.type === 'LISTEN');
  const watchMaterial = topic.materials.find(m => m.type === 'WATCH');

  return ( <>
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/50 h-16 flex items-center px-4 md:px-8 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors duration-200 text-on-surface">
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </Link>
          <h1 className="font-title-md text-on-surface font-semibold tracking-tight">Studieområde</h1>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
             <span className="material-symbols-outlined text-[18px]">school</span>
           </div>
        </div>
      </header> <main className="mt-20 px-4 md:px-8 max-w-4xl mx-auto space-y-6">
        
        {/* Topic Title Hero Card */}
        <div className="relative overflow-hidden bg-primary text-on-primary p-6 md:p-8 rounded-3xl shadow-lg border border-primary-dark/20">
          {/* Decorative background circle */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase">
                {topic.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 leading-tight">{topic.title}</h2>
            {topic.description && (
              <p className="text-primary-container/80 text-sm md:text-base max-w-2xl leading-relaxed">
                {topic.description}
              </p>
            )}
          </div>
        </div>

        {/* Premium Segmented Controls (Tabs) */}
        <nav className="flex w-full bg-surface-container-low/50 backdrop-blur-sm rounded-2xl p-1.5 shadow-inner border border-outline-variant/30">
          <button 
            onClick={() => setActiveTab('oku')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 transition-all duration-300 font-medium text-sm
              ${activeTab === 'oku' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-on-surface-variant hover:bg-surface-container-highest/50'}`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: activeTab === 'oku' ? "'FILL' 1" : "'FILL' 0"}}>auto_stories</span>
            <span className="hidden sm:inline">Läs dokument</span>
            <span className="sm:hidden">Läs</span>
          </button>
          <button 
            onClick={() => setActiveTab('dinle')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 transition-all duration-300 font-medium text-sm
              ${activeTab === 'dinle' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-on-surface-variant hover:bg-surface-container-highest/50'}`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: activeTab === 'dinle' ? "'FILL' 1" : "'FILL' 0"}}>headphones</span>
            <span className="hidden sm:inline">Lyssna på ljud</span>
            <span className="sm:hidden">Lyssna</span>
          </button>
          <button 
            onClick={() => setActiveTab('izle')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 transition-all duration-300 font-medium text-sm
              ${activeTab === 'izle' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-on-surface-variant hover:bg-surface-container-highest/50'}`}
          >
            <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: activeTab === 'izle' ? "'FILL' 1" : "'FILL' 0"}}>play_circle</span>
            <span className="hidden sm:inline">Titta på video</span>
            <span className="sm:hidden">Titta</span>
          </button>
        </nav>

        {/* Dynamic Study Area Context */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* READ TAB */}
          {activeTab === 'oku' && (
            <div className="bg-white rounded-3xl border border-outline-variant/50 shadow-md overflow-hidden flex flex-col h-[650px] transition-all">
              <div className="bg-surface-container-lowest px-5 py-4 flex justify-between items-center border-b border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>picture_as_pdf</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface leading-tight truncate max-w-[180px] md:max-w-md">
                      {readMaterial?.title || 'Läsmaterial'}
                    </h3>
                    <p className="text-xs text-on-surface-variant">PDF Dokument</p>
                  </div>
                </div>
                {readMaterial && (
                  <a 
                    href={readMaterial.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 text-sm bg-surface-container-high text-on-surface hover:bg-surface-container-highest px-4 py-2 rounded-xl font-medium transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    <span className="hidden sm:inline">Öppna externt</span>
                  </a>
                )}
              </div>
              <div className="flex-1 bg-surface-container-lowest relative">
                {readMaterial ? (
                  <iframe 
                    src={readMaterial.url} 
                    className="w-full h-full border-0 absolute inset-0"
                    title={readMaterial.title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-surface/30">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[40px] text-on-surface-variant/50">description</span>
                    </div>
                    <h4 className="text-lg font-semibold text-on-surface mb-1">Inget material tillagt</h4>
                    <p className="text-on-surface-variant text-sm max-w-sm">Det finns tyvärr inget läsmaterial tillagt för detta ämne än. Fortsätt till övningarna!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LISTEN TAB */}
          {activeTab === 'dinle' && (
            <div className="bg-white rounded-3xl border border-outline-variant/50 shadow-md overflow-hidden p-8 md:p-12 flex flex-col items-center justify-center min-h-[400px] relative">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-primary to-primary-container shadow-lg shadow-primary/20 flex items-center justify-center rounded-full text-on-primary mb-6 ring-4 ring-primary/10">
                  <span className="material-symbols-outlined text-[48px]" style={{fontVariationSettings: "'FILL' 1"}}>graphic_eq</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2 text-center">{listenMaterial?.title || 'Ljudguide'}</h3>
                <p className="text-on-surface-variant text-center max-w-md mb-8 text-sm leading-relaxed">
                  {listenMaterial ? 'Lyssna på sammanfattningen av detta ämne. Perfekt när du är på språng.' : 'Det finns inget ljudmaterial tillagt för detta ämne än.'}
                </p>
                
                {listenMaterial && (
                  <div className="w-full max-w-md bg-surface border border-outline-variant/50 p-4 rounded-2xl shadow-sm">
                    <audio 
                      src={listenMaterial.url} 
                      controls 
                      className="w-full focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WATCH TAB */}
          {activeTab === 'izle' && (
             <div className="bg-white rounded-3xl border border-outline-variant/50 shadow-md overflow-hidden flex flex-col">
                <div className="bg-surface-container-lowest px-5 py-4 flex items-center gap-3 border-b border-outline-variant/50">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>smart_display</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-on-surface leading-tight">
                      {watchMaterial?.title || 'Videomaterial'}
                    </h3>
                  </div>
                </div>
                
                {watchMaterial ? (
                  <div className="w-full aspect-video bg-black flex items-center justify-center">
                    {(() => {
                      const isYouTube = watchMaterial.url.includes('youtube.com') || watchMaterial.url.includes('youtu.be');
                      if (isYouTube) {
                        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                        let match = watchMaterial.url.match(regExp);
                        const embedId = (match && match[2].length === 11) ? match[2] : null;
                        
                        if (embedId) {
                          return (
                            <iframe 
                              src={`https://www.youtube.com/embed/${embedId}`} 
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={watchMaterial.title}
                            />
                          );
                        }
                      }
                      
                      return (
                        <video 
                          src={watchMaterial.url} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      );
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] p-8 text-center bg-surface/30">
                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-[40px] text-on-surface-variant/50">videocam_off</span>
                    </div>
                    <h4 className="text-lg font-semibold text-on-surface mb-1">Ingen video tillagd</h4>
                    <p className="text-on-surface-variant text-sm max-w-sm">Det finns tyvärr inget videomaterial tillagt för detta ämne än.</p>
                  </div>
                )}
             </div>
          )}

          {/* Contextual Preview (Collapsible) - Show if listening is available but not active */}
          {activeTab !== 'dinle' && listenMaterial && (
            <div className="mt-4 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-secondary-container text-on-secondary-container flex items-center justify-center rounded-xl shrink-0">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>headphones</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface text-sm truncate">{listenMaterial.title}</p>
                <p className="text-xs text-on-surface-variant truncate">Ljudsammanfattning är tillgänglig</p>
              </div>
              <button 
                onClick={() => setActiveTab('dinle')}
                className="bg-primary text-on-primary rounded-xl px-4 py-2.5 text-sm font-semibold active:scale-95 transition-transform shrink-0"
              >
                Lyssna
              </button>
            </div>
          )}
        </section>

        {/* Bottom CTA Actions */}
        <div className="pt-6 pb-4">
          <Link 
            href={`/practice?topicId=${topic.id}`} 
            className="group w-full py-4 px-6 bg-primary text-on-primary font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-between text-lg"
          >
            <span>Börja öva frågor</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
      </main>
    </>
  );
}
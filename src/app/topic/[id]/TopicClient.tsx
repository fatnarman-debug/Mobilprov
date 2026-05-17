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
      <div className="bg-background text-on-background min-h-screen pb-32 flex flex-col items-center justify-center">
        <h2 className="text-title-lg font-bold">Konu Bulunamadı</h2>
        <Link href="/dashboard" className="text-primary mt-4 underline">Geri Dön</Link>
      </div>
    );
  }

  // Get materials for this topic
  const readMaterial = topic.materials.find(m => m.type === 'READ');
  const listenMaterial = topic.materials.find(m => m.type === 'LISTEN');
  const watchMaterial = topic.materials.find(m => m.type === 'WATCH');

  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant h-16 flex items-center px-gutter justify-between">
        <div className="flex items-center gap-base">
          <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors duration-200">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">Konu Çalışma Alanı</h1>
        </div>
        <div className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-on-surface-variant">query_stats</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="mt-16 pt-md px-gutter max-w-container-max mx-auto">
        {/* Tabbed Navigation */}
        <nav className="flex w-full bg-surface-container-low rounded-xl p-1 mb-md">
          <button 
            onClick={() => setActiveTab('oku')}
            className={`flex-1 flex flex-col items-center justify-center rounded-lg py-2 transition-all duration-150 ${activeTab === 'oku' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined mb-1">auto_stories</span>
            <span className="font-label-md text-label-md">Oku</span>
          </button>
          <button 
            onClick={() => setActiveTab('dinle')}
            className={`flex-1 flex flex-col items-center justify-center rounded-lg py-2 transition-all duration-150 ${activeTab === 'dinle' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined mb-1">headset</span>
            <span className="font-label-md text-label-md">Dinle</span>
          </button>
          <button 
            onClick={() => setActiveTab('izle')}
            className={`flex-1 flex flex-col items-center justify-center rounded-lg py-2 transition-all duration-150 ${activeTab === 'izle' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined mb-1">play_circle</span>
            <span className="font-label-md text-label-md">İzle</span>
          </button>
        </nav>

        {/* Dynamic Study Area Context */}
        <section className="space-y-md">
          {/* Topic Title Card */}
          <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-base">
              <div>
                <h2 className="font-title-md text-title-md text-primary">{topic.title}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{topic.category}</p>
              </div>
              <div className="flex gap-xs">
                <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-label-md text-label-md">Zor</span>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-label-md text-label-md">45 Dakika</span>
              </div>
            </div>
          </div>

          {activeTab === 'oku' && (
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-[600px]">
              {/* PDF Header/Controls */}
              <div className="bg-surface-container px-md py-base flex justify-between items-center border-b border-outline-variant">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>picture_as_pdf</span>
                  <span className="font-body-md text-body-md text-primary font-semibold truncate max-w-[200px] md:max-w-none">{readMaterial?.title || 'Döküman'}</span>
                </div>
                {readMaterial && (
                  <a 
                    href={readMaterial.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 text-xs bg-primary text-on-primary px-3 py-1.5 rounded-full hover:bg-primary-dark transition-colors font-bold shadow active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    Yeni Sekmede Aç / İndir
                  </a>
                )}
              </div>

              {/* Content Canvas */}
              <div className="flex-1 bg-surface-container-lowest">
                {readMaterial ? (
                  <iframe 
                    src={readMaterial.url} 
                    className="w-full h-full border-0"
                    title={readMaterial.title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-md text-center">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">description</span>
                    <p className="text-on-surface-variant font-body-md">Bu konu için henüz okuma dökümanı eklenmemiş.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'dinle' && (
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center h-[500px]">
              <div className="w-24 h-24 bg-primary flex items-center justify-center rounded-full text-on-primary mb-6">
                <span className="material-symbols-outlined text-[48px]" style={{fontVariationSettings: "'FILL' 1"}}>headphones</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{listenMaterial?.title || 'Sesli Anlatım'}</h3>
              <p className="text-on-surface-variant text-center mb-8">
                {listenMaterial ? 'Bu ses kaydını dinleyerek konuyu tekrar edebilirsiniz.' : 'Bu konu için henüz ses kaydı eklenmemiş.'}
              </p>
              
              {listenMaterial && (
                <div className="w-full max-w-sm bg-surface-container-low p-4 rounded-xl flex flex-col items-center gap-md shadow-inner">
                  <audio 
                    src={listenMaterial.url} 
                    controls 
                    className="w-full focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'izle' && (
             <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-[500px]">
                {watchMaterial ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
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
                          className="w-full h-full object-contain"
                        />
                      );
                    })()}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">videocam_off</span>
                    <p className="text-on-surface-variant font-body-md">Bu konu için henüz video eklenmemiş.</p>
                  </div>
                )}
             </div>
          )}

          {/* Contextual Audio Player (Collapsible Preview) - Show only if not currently listening */}
          {activeTab !== 'dinle' && listenMaterial && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
              <div className="flex items-center gap-md">
                <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl text-on-primary">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>graphic_eq</span>
                </div>
                <div className="flex-1">
                  <p className="font-title-md text-title-md text-primary text-sm truncate">{listenMaterial.title}</p>
                  <p className="text-xs text-on-surface-variant">Konunun sesli özeti hazır</p>
                </div>
                <button 
                  onClick={() => setActiveTab('dinle')}
                  className="bg-secondary-container text-on-secondary-container rounded-full px-4 py-2 text-xs font-bold active:scale-95 transition-transform duration-150 flex items-center gap-1 hover:bg-secondary-container-hover"
                >
                  <span className="material-symbols-outlined text-[14px]">headphones</span>
                  Dinle
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex gap-md mt-lg pb-md">
          <button className="flex-1 py-3 px-4 border border-primary text-primary font-semibold rounded-xl hover:bg-surface-container-low transition-colors duration-200">
            Not Al
          </button>
          <Link href={`/practice?topicId=${topic.id}`} className="flex-1 py-3 px-4 bg-primary text-on-primary font-semibold rounded-xl shadow-md active:scale-95 transition-transform duration-150 text-center flex items-center justify-center gap-2">
            Pratiğe Geç <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

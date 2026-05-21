'use client';

import React, { useRef, useState, useEffect } from 'react';
import { uploadQuestionsCSV, uploadFlashcardsCSV, addTopic, addQuestion, addFlashcard, getTopics, updateTopicMaterials } from '@/actions/admin.actions';
import Link from 'next/link';

export default function AdminPage() {
  const topicFormRef = useRef<HTMLFormElement>(null);
  const questionFormRef = useRef<HTMLFormElement>(null);
  const flashcardFormRef = useRef<HTMLFormElement>(null);

  const [topics, setTopics] = useState<any[]>([]);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editPdfUrl, setEditPdfUrl] = useState('');
  const [editAudioUrl, setEditAudioUrl] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');

  const fetchTopics = async () => {
    const data = await getTopics();
    setTopics(data);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleCsvUpload = async (formData: FormData) => {
    const result = await uploadQuestionsCSV(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
    }
  };

  const handleFlashcardCsvUpload = async (formData: FormData) => {
    const result = await uploadFlashcardsCSV(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
    }
  };

  const handleAddTopic = async (formData: FormData) => {
    const result = await addTopic(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(`Başarılı! Yeni Konu ID: ${result.topic?.id}`);
      topicFormRef.current?.reset();
      fetchTopics(); // Listeyi güncelle
    }
  };

  const handleUpdateMaterials = async (topicId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await updateTopicMaterials(topicId, formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success || 'Materyaller güncellendi!');
      setEditingTopicId(null);
      fetchTopics();
    }
  };

  const handleAddQuestion = async (formData: FormData) => {
    const result = await addQuestion(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
      questionFormRef.current?.reset();
    }
  };

  const handleAddFlashcard = async (formData: FormData) => {
    const result = await addFlashcard(formData);
    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
      flashcardFormRef.current?.reset();
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface dark:bg-background border-b border-outline-variant h-16">
        <div className="flex justify-between items-center px-gutter h-full w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-base">
            <button className="p-2 -ml-2 rounded-full hover:bg-surface-container-low transition-colors duration-200 lg:hidden">
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            <h1 className="font-display-lg text-title-md text-primary dark:text-primary-fixed font-bold">EduFlow</h1>
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
          <Link href="/admin" className="bg-primary text-on-primary rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
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
          <Link href="/admin/exams" className="text-on-surface-variant hover:bg-surface-container-highest rounded-lg mx-2 flex items-center px-4 py-3 gap-md transition-all duration-200">
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
        <div className="p-md border-t border-outline-variant">
          <p className="font-label-md text-label-md text-on-surface-variant opacity-50">v1.0.4</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-20 pb-24 lg:pl-80 px-gutter min-h-screen">
        <div className="max-w-container-max mx-auto">
          <header className="mb-lg">
            <h2 className="font-headline-lg-mobile lg:font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-xs">Yönetici Paneli</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Eğitim içeriklerini ve soru bankasını buradan yönetebilirsiniz.</p>
          </header>

          {/* Main Tabs */}
          <div className="flex gap-base mb-md overflow-x-auto no-scrollbar">
            <button className="bg-primary text-on-primary px-gutter py-base rounded-full font-label-md text-label-md whitespace-nowrap">İçerik Yönetimi</button>
            <button className="bg-surface-container-high text-on-surface-variant px-gutter py-base rounded-full font-label-md text-label-md whitespace-nowrap hover:bg-surface-container-highest transition-colors">Test İstatistikleri</button>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
            {/* Left Column: Bulk Upload & Topic Creation */}
            <div className="lg:col-span-4 space-y-md">
              
              {/* Add New Topic */}
              <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center gap-base mb-md">
                  <span className="material-symbols-outlined text-secondary">add_circle</span>
                  <h3 className="font-title-md text-title-md text-on-surface">Yeni Konu (Ünite) Ekle</h3>
                </div>
                <form action={handleAddTopic} ref={topicFormRef} className="space-y-sm">
                  <input type="text" name="title" placeholder="Konu Başlığı (Örn: İsveç Tarihi)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-body-md" required />
                  <input type="text" name="category" placeholder="Kategori (Örn: Tarih & Kültür)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-body-md" required />
                  <textarea name="description" placeholder="Açıklama (Opsiyonel)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-body-md" rows={2}></textarea>
                  
                  <div className="border-t border-outline-variant pt-2 mt-2 space-y-3">
                    <label className="block text-[11px] font-bold text-primary uppercase">Çalışma Materyalleri</label>
                    
                    <div className="space-y-1">
                      <span className="block text-[10px] font-semibold text-on-surface-variant">Okuma Dökümanı (PDF)</span>
                      <div className="grid grid-cols-1 gap-1">
                        <input type="file" name="pdfFile" accept=".pdf" className="w-full text-xs bg-surface border border-outline-variant rounded-lg p-1" />
                        <input type="url" name="pdfUrl" placeholder="Veya PDF Bağlantı Linki (https://...)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-sm text-body-sm text-xs" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-semibold text-on-surface-variant">Ses Kaydı (MP3)</span>
                      <div className="grid grid-cols-1 gap-1">
                        <input type="file" name="audioFile" accept="audio/*" className="w-full text-xs bg-surface border border-outline-variant rounded-lg p-1" />
                        <input type="url" name="audioUrl" placeholder="Veya Ses Bağlantı Linki (https://...)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-sm text-body-sm text-xs" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-semibold text-on-surface-variant">Video Anlatım (MP4/YouTube)</span>
                      <div className="grid grid-cols-1 gap-1">
                        <input type="file" name="videoFile" accept="video/*" className="w-full text-xs bg-surface border border-outline-variant rounded-lg p-1" />
                        <input type="url" name="videoUrl" placeholder="Veya Video/YouTube Linki (https://...)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-sm text-body-sm text-xs" />
                      </div>
                    </div>
                  </div>


                  <button type="submit" className="w-full bg-secondary text-on-secondary py-2 rounded-lg font-title-md text-title-md active:scale-95 transition-transform">Konuyu Oluştur</button>
                </form>
              </div>

              {/* Topics List */}
              <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm max-h-[450px] overflow-y-auto">
                <div className="flex items-center gap-base mb-md sticky top-0 bg-white pb-2 border-b border-outline-variant">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                  <h3 className="font-title-md text-title-md text-on-surface">Mevcut Konular</h3>
                </div>
                {topics.length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic">Henüz konu eklenmedi.</p>
                ) : (
                  <ul className="space-y-3">
                    {topics.map(topic => {
                      const hasPdf = topic.materials?.some((m: any) => m.type === 'READ');
                      const hasAudio = topic.materials?.some((m: any) => m.type === 'LISTEN');
                      const hasVideo = topic.materials?.some((m: any) => m.type === 'WATCH');

                      const pdfUrlVal = topic.materials?.find((m: any) => m.type === 'READ')?.url || '';
                      const audioUrlVal = topic.materials?.find((m: any) => m.type === 'LISTEN')?.url || '';
                      const videoUrlVal = topic.materials?.find((m: any) => m.type === 'WATCH')?.url || '';

                      const isEditing = editingTopicId === topic.id;

                      return (
                        <li key={topic.id} className="bg-surface-container-lowest border border-outline-variant p-3 rounded-lg flex flex-col gap-2 hover:border-primary transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-on-surface text-sm">{topic.title}</div>
                              <div className="text-[11px] text-on-surface-variant">{topic.category}</div>
                            </div>
                            <div className="flex gap-1 text-[9px] font-bold">
                              <span className={`px-1 rounded ${hasPdf ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-surface-variant text-outline opacity-40'}`}>PDF</span>
                              <span className={`px-1 rounded ${hasAudio ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-surface-variant text-outline opacity-40'}`}>SES</span>
                              <span className={`px-1 rounded ${hasVideo ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-surface-variant text-outline opacity-40'}`}>VİDEO</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1 border-t border-outline-variant/30 pt-1 text-xs">
                            <code className="text-[10px] bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded truncate max-w-[120px]" title={topic.id}>
                              {topic.id}
                            </code>
                            <div className="flex gap-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(topic.id);
                                  alert('ID Kopyalandı!');
                                }}
                                className="text-primary hover:text-primary-dark font-bold flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-[12px]">content_copy</span>
                                Kopyala
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  if (isEditing) {
                                    setEditingTopicId(null);
                                  } else {
                                    setEditingTopicId(topic.id);
                                    setEditPdfUrl(pdfUrlVal);
                                    setEditAudioUrl(audioUrlVal);
                                    setEditVideoUrl(videoUrlVal);
                                  }
                                }}
                                className="text-secondary hover:text-secondary-dark font-bold flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-[12px]">{isEditing ? 'close' : 'edit'}</span>
                                {isEditing ? 'Kapat' : 'Materyal'}
                              </button>
                            </div>
                          </div>

                          {isEditing && (
                            <form onSubmit={(e) => handleUpdateMaterials(topic.id, e)} className="border-t border-outline-variant/60 pt-2 mt-1 space-y-3 bg-surface-container-low p-2 rounded">
                              <div className="text-[10px] font-bold text-primary mb-1">ÇALIŞMA MATERYALLERİ GÜNCELLE</div>
                              
                              <div className="space-y-1">
                                <label className="block text-[9px] font-semibold text-on-surface-variant">Okuma PDF (Belge)</label>
                                <input 
                                  type="file" 
                                  name="pdfFile" 
                                  accept=".pdf" 
                                  className="w-full text-xs bg-white border border-outline-variant rounded p-1 mb-1" 
                                />
                                <input 
                                  type="url" 
                                  name="pdfUrl" 
                                  value={editPdfUrl} 
                                  onChange={(e) => setEditPdfUrl(e.target.value)} 
                                  className="w-full bg-white border border-outline-variant rounded p-1 text-xs" 
                                  placeholder="Veya PDF Bağlantı Linki (https://...)"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[9px] font-semibold text-on-surface-variant">Ses MP3 (Audio)</label>
                                <input 
                                  type="file" 
                                  name="audioFile" 
                                  accept="audio/*" 
                                  className="w-full text-xs bg-white border border-outline-variant rounded p-1 mb-1" 
                                />
                                <input 
                                  type="url" 
                                  name="audioUrl" 
                                  value={editAudioUrl} 
                                  onChange={(e) => setEditAudioUrl(e.target.value)} 
                                  className="w-full bg-white border border-outline-variant rounded p-1 text-xs" 
                                  placeholder="Veya MP3 Bağlantı Linki (https://...)"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[9px] font-semibold text-on-surface-variant">Video MP4 / YouTube</label>
                                <input 
                                  type="file" 
                                  name="videoFile" 
                                  accept="video/*" 
                                  className="w-full text-xs bg-white border border-outline-variant rounded p-1 mb-1" 
                                />
                                <input 
                                  type="url" 
                                  name="videoUrl" 
                                  value={editVideoUrl} 
                                  onChange={(e) => setEditVideoUrl(e.target.value)} 
                                  className="w-full bg-white border border-outline-variant rounded p-1 text-xs" 
                                  placeholder="Veya Video Linki (https://...)"
                                />
                              </div>

                              <button type="submit" className="w-full bg-primary text-on-primary font-bold py-1.5 px-2 rounded text-xs active:scale-95 transition-all mt-1">
                                Kaydet ve Güncelle
                              </button>
                            </form>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Bulk Upload CSV */}
              <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center gap-base mb-md">
                  <span className="material-symbols-outlined text-secondary">cloud_upload</span>
                  <h3 className="font-title-md text-title-md text-on-surface">Toplu Soru Yükleme</h3>
                </div>
                
                <form action={handleCsvUpload} className="space-y-base">
                  <input type="text" name="topicId" placeholder="Hedef Konu ID (Zorunlu)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-body-md" required />
                  
                  <div className="flex items-center gap-xs px-xs">
                    <input type="checkbox" name="isTest" id="bulkIsTest" value="true" className="w-4 h-4 accent-primary cursor-pointer" />
                    <label htmlFor="bulkIsTest" className="text-xs text-on-surface-variant cursor-pointer select-none">
                      Deneme Sınavı (Test) Sorusu Olarak İşaretle
                    </label>
                  </div>

                  <label className="group block border-2 border-dashed border-outline-variant rounded-xl p-md text-center hover:border-primary hover:bg-surface-container-low transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-on-surface-variant text-3xl group-hover:text-primary">table_view</span>
                    <p className="font-label-md text-label-md text-on-surface-variant mt-xs">CSV Yükle - Sorular</p>
                    <input type="file" name="file" accept=".csv" className="hidden" onChange={(e) => e.target.form?.requestSubmit()} />
                  </label>
                </form>
              </div>
              
              <div className="bg-primary-container p-md rounded-xl shadow-sm text-on-primary-container">
                <h4 className="font-title-md text-title-md mb-xs">İpucu</h4>
                <p className="font-body-sm text-body-sm opacity-80">CSV başlıkları tam olarak şu şekilde olmalıdır: text, optionA, optionB, optionC, optionD, correctAnswer, explanation</p>
              </div>
            </div>

            {/* Right Column: Manual Forms */}
            <div className="lg:col-span-8 space-y-md">
              {/* Add Manual Question */}
              <div className="bg-white p-md lg:p-lg rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Manuel Test/Çalışma Sorusu Ekle</h3>
                  <span className="material-symbols-outlined text-primary-fixed-dim">post_add</span>
                </div>
                <form action={handleAddQuestion} ref={questionFormRef} className="space-y-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="md:col-span-2 flex gap-4">
                       <input type="text" name="topicId" placeholder="Hedef Konu ID" className="flex-grow bg-surface-bright border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary font-body-md text-body-md" required />
                       <label className="flex items-center gap-2 font-label-md text-label-md text-on-surface cursor-pointer">
                          <input type="checkbox" name="isTest" value="true" className="w-5 h-5 accent-primary" />
                          Test Sorusu Mu?
                       </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Soru Kökü</label>
                      <textarea name="text" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md" placeholder="Soruyu buraya yazın..." rows={3} required></textarea>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Seçenek A</label>
                      <input type="text" name="optionA" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-base focus:ring-2 focus:ring-primary font-body-md text-body-md" placeholder="A seçeneği" required />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Seçenek B</label>
                      <input type="text" name="optionB" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-base focus:ring-2 focus:ring-primary font-body-md text-body-md" placeholder="B seçeneği" required />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Seçenek C</label>
                      <input type="text" name="optionC" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-base focus:ring-2 focus:ring-primary font-body-md text-body-md" placeholder="C seçeneği" required />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Seçenek D</label>
                      <input type="text" name="optionD" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-base focus:ring-2 focus:ring-primary font-body-md text-body-md" placeholder="D seçeneği" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="md:col-span-1">
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Doğru Cevap</label>
                      <select name="correctAnswer" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-base focus:ring-2 focus:ring-primary font-body-md text-body-md" required>
                        <option value="">Seçiniz</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Çözüm/Açıklama</label>
                      <input type="text" name="explanation" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-base focus:ring-2 focus:ring-primary font-body-md text-body-md" placeholder="Neden bu cevap doğru? (Çalışma sorusu ise gösterilir)" />
                    </div>
                  </div>
                  <div className="pt-md border-t border-outline-variant flex justify-end">
                    <button type="submit" className="bg-primary text-on-primary px-lg py-3 rounded-full font-title-md flex items-center gap-base active:scale-95 transition-all">
                      <span className="material-symbols-outlined">save</span>
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>

              {/* Add Manual Flashcard & CSV */}
              <div className="bg-white p-md lg:p-lg rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Flashcard Ekle</h3>
                  <span className="material-symbols-outlined text-tertiary">style</span>
                </div>
                
                {/* Flashcard CSV Upload Section */}
                <div className="mb-8 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl border-dashed">
                  <h4 className="font-title-md text-title-md text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">cloud_upload</span>
                    Toplu Flashcard Yükle (CSV)
                  </h4>
                  <form action={handleFlashcardCsvUpload} className="flex flex-col md:flex-row gap-4 items-center">
                    <input type="text" name="topicId" placeholder="Hedef Konu ID (Zorunlu)" className="flex-grow bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-body-md w-full" required />
                    <label className="w-full md:w-auto flex-shrink-0 bg-surface-container-high hover:bg-tertiary hover:text-on-tertiary text-on-surface-variant transition-colors rounded-lg p-3 cursor-pointer text-center font-label-md flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">upload_file</span>
                      CSV Seç ve Yükle
                      <input type="file" name="file" accept=".csv" className="hidden" onChange={(e) => e.target.form?.requestSubmit()} />
                    </label>
                  </form>
                  <p className="text-xs text-on-surface-variant mt-2 opacity-80">Gerekli başlıklar: frontText, backText</p>
                </div>

                <hr className="border-outline-variant mb-8" />

                {/* Manual Flashcard Form */}
                <h4 className="font-title-md text-title-md text-on-surface mb-4">Manuel Tekli Ekleme</h4>
                <form action={handleAddFlashcard} ref={flashcardFormRef} className="space-y-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Hedef Konu ID</label>
                    <input type="text" name="topicId" placeholder="Konu ID giriniz" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary font-body-md text-body-md" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Ön Yüz (Soru)</label>
                      <textarea name="frontText" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md" placeholder="Örn: 'Avrupa Birliği'ne kaç yılında girildi?'" rows={3} required></textarea>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Arka Yüz (Cevap)</label>
                      <textarea name="backText" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md" placeholder="Örn: '1995'" rows={3} required></textarea>
                    </div>
                  </div>
                  <div className="pt-md border-t border-outline-variant flex justify-end">
                    <button type="submit" className="bg-tertiary text-on-tertiary px-lg py-3 rounded-full font-title-md flex items-center gap-base active:scale-95 transition-all">
                      <span className="material-symbols-outlined">save</span>
                      Flashcard Kaydet
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-4 bg-surface dark:bg-background border-t border-outline-variant shadow-sm z-50 md:hidden">
        <button className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 active:scale-95 transition-transform duration-150">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-label-md text-label-md">Topics</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 active:scale-95 transition-transform duration-150">
          <span className="material-symbols-outlined">quiz</span>
          <span className="font-label-md text-label-md">Practice</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 active:scale-95 transition-transform duration-150">
          <span className="material-symbols-outlined">leaderboard</span>
          <span className="font-label-md text-label-md">Analysis</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary-container text-on-secondary-container rounded-xl px-3 py-1 active:scale-95 transition-transform duration-150">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-md text-label-md">Profile</span>
        </button>
      </nav>
    </div>
  );
}

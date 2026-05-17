'use client';

import React, { useState } from 'react';
import { deleteFlashcard, updateFlashcard } from '@/actions/admin.actions';

type Flashcard = {
  id: string;
  frontText: string;
  backText: string;
  topic: {
    id: string;
    title: string;
  };
};

export default function FlashcardBankClient({ initialFlashcards, topics }: { initialFlashcards: Flashcard[], topics: {id: string, title: string}[] }) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);

  const filteredFlashcards = selectedTopic === 'all' 
    ? flashcards 
    : flashcards.filter(f => f.topic.id === selectedTopic);

  const handleDelete = async (id: string) => {
    if (confirm('Bu flashcardı silmek istediğinizden emin misiniz?')) {
      const result = await deleteFlashcard(id);
      if (result.success) {
        setFlashcards(flashcards.filter(f => f.id !== id));
      } else {
        alert(result.error);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFlashcard) return;

    const formData = new FormData(e.currentTarget);
    const result = await updateFlashcard(editingFlashcard.id, formData);
    
    if (result.success) {
      setFlashcards(flashcards.map(f => {
        if (f.id === editingFlashcard.id) {
          return {
            ...f,
            frontText: formData.get('frontText') as string,
            backText: formData.get('backText') as string,
          };
        }
        return f;
      }));
      setEditingFlashcard(null);
      alert('Flashcard başarıyla güncellendi.');
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      {/* Filtreleme Çubuğu */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="material-symbols-outlined text-primary">filter_list</span>
          <span className="font-title-md text-on-surface whitespace-nowrap">Konuya Göre Süz:</span>
          <select 
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md text-body-md w-full sm:w-64 focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tüm Konular</option>
            {topics.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
        <div className="text-on-surface-variant font-label-md">
          Toplam: <span className="font-bold text-primary">{filteredFlashcards.length}</span> flashcard gösteriliyor
        </div>
      </div>

      {/* Flashcard Tablosu */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {filteredFlashcards.length === 0 ? (
          <div className="p-xl text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">style</span>
            <h3 className="font-title-md text-title-md text-on-surface">Bu konuya ait flashcard bulunamadı</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider w-1/4">Konu</th>
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider w-1/3">Ön Yüz (Soru)</th>
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider w-1/3">Arka Yüz (Cevap)</th>
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlashcards.map((f) => (
                  <tr key={f.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors group">
                    <td className="p-4 align-top font-body-sm text-on-surface">
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold inline-block mb-1">Flashcard</span>
                      <div className="mt-1">{f.topic.title}</div>
                    </td>
                    <td className="p-4 align-top font-body-md text-on-surface font-medium">
                      {f.frontText}
                    </td>
                    <td className="p-4 align-top font-body-md text-on-surface-variant italic">
                      {f.backText}
                    </td>
                    <td className="p-4 align-top text-right">
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingFlashcard(f)}
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors text-primary"
                          title="Düzenle"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(f.id)}
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-error hover:text-on-error flex items-center justify-center transition-colors text-error"
                          title="Sil"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Düzenleme Modalı */}
      {editingFlashcard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-outline-variant p-4 flex justify-between items-center">
              <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">style</span>
                Flashcard Düzenle
              </h3>
              <button onClick={() => setEditingFlashcard(null)} className="p-2 rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Ön Yüz (Soru)</label>
                <textarea name="frontText" defaultValue={editingFlashcard.frontText} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md" rows={3} required></textarea>
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Arka Yüz (Cevap)</label>
                <textarea name="backText" defaultValue={editingFlashcard.backText} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md" rows={3} required></textarea>
              </div>

              <div className="pt-6 border-t border-outline-variant flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingFlashcard(null)} className="px-6 py-2 rounded-full font-title-md text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors">İptal</button>
                <button type="submit" className="px-6 py-2 rounded-full font-title-md text-on-primary bg-primary hover:bg-primary-dark transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

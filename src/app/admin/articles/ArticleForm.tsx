'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createArticle, updateArticle } from '@/actions/article.actions';

export default function ArticleForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    metaDescription: initialData?.metaDescription || '',
    keywords: initialData?.keywords || '',
    readingTime: initialData?.readingTime || 5,
    imageUrl: initialData?.imageUrl || '',
    isPublished: initialData?.isPublished ?? false,
    content: initialData?.content || '',
  });

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    initialData?.faqs || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const dataToSubmit = {
      ...formData,
      readingTime: parseInt(formData.readingTime as any) || 5,
      faqs: faqs.map((f, i) => ({ ...f, order: i }))
    };

    let res;
    if (initialData?.id) {
      res = await updateArticle(initialData.id, dataToSubmit);
    } else {
      res = await createArticle(dataToSubmit);
    }

    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push('/admin/articles');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 bg-error/10 text-error rounded-xl font-body-md">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
        <h3 className="font-title-lg font-bold text-on-surface border-b border-outline-variant/30 pb-4">Genel Bilgiler & SEO</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Makale Başlığı</label>
            <input 
              type="text" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Örn: İsveç Vatandaşlık Testi Ne Kadar Zor?"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-md font-bold text-on-surface-variant uppercase tracking-wider">URL (Slug)</label>
            <input 
              type="text" 
              name="slug" 
              required
              value={formData.slug} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              placeholder="Örn: hur-svart-ar-medborgarskapstestet"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Meta Açıklama (Description)</label>
            <textarea 
              name="metaDescription" 
              required
              value={formData.metaDescription} 
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Google arama sonuçlarında çıkacak kısa açıklama..."
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Anahtar Kelimeler (Virgülle Ayırın)</label>
            <input 
              type="text" 
              name="keywords" 
              value={formData.keywords} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Örn: vatandaşlık testi, isveç, sınav"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Okunma Süresi (Dakika)</label>
            <input 
              type="number" 
              name="readingTime" 
              min="1"
              value={formData.readingTime} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
          <input 
            type="checkbox" 
            id="isPublished"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-5 h-5 rounded text-primary focus:ring-primary"
          />
          <label htmlFor="isPublished" className="font-title-md font-bold text-on-surface">Makaleyi Yayınla</label>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
        <h3 className="font-title-lg font-bold text-on-surface border-b border-outline-variant/30 pb-4">Makale İçeriği (Markdown)</h3>
        
        <div className="space-y-2">
          <textarea 
            name="content" 
            required
            value={formData.content} 
            onChange={handleChange}
            rows={15}
            className="w-full px-4 py-4 rounded-xl border border-outline-variant/50 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm leading-relaxed"
            placeholder="# Başlık 1&#10;## Başlık 2&#10;Makale içeriği buraya gelecek..."
          />
        </div>
      </div>

      <div className="bg-white dark:bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <h3 className="font-title-lg font-bold text-on-surface">Sıkça Sorulan Sorular (FAQ JSON-LD)</h3>
          <button 
            type="button" 
            onClick={handleAddFaq}
            className="text-primary hover:text-primary/80 font-bold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">add</span> Ekle
          </button>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-2xl border border-outline-variant/30 bg-surface relative group">
              <button 
                type="button"
                onClick={() => handleRemoveFaq(index)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-error/10 text-error opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <div className="space-y-4 pr-8">
                <div className="space-y-2">
                  <label className="font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Soru {index + 1}</label>
                  <input 
                    type="text" 
                    value={faq.question} 
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md font-bold text-on-surface-variant uppercase tracking-wider">Cevap {index + 1}</label>
                  <textarea 
                    value={faq.answer} 
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className="text-on-surface-variant text-sm text-center py-4">Bu makale için henüz SSS eklenmemiş.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.push('/admin/articles')}
          className="px-6 py-3 rounded-xl font-bold text-on-surface hover:bg-surface-container-high transition-colors"
        >
          İptal
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          {initialData?.id ? 'Değişiklikleri Kaydet' : 'Makaleyi Oluştur'}
        </button>
      </div>
    </form>
  );
}

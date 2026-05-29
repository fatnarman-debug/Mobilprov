'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { deleteArticle } from '@/actions/article.actions';

export default function ArticlesClient({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return;
    setIsDeleting(id);
    const res = await deleteArticle(id);
    if (res.error) {
      alert(res.error);
      setIsDeleting(null);
    } else {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-md">
      <div className="flex justify-end">
        <Link 
          href="/admin/articles/new" 
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Makale Yaz
        </Link>
      </div>

      <div className="bg-white dark:bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-sm uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-outline-variant/30">Makale Başlığı</th>
                <th className="p-4 font-bold border-b border-outline-variant/30">URL (Slug)</th>
                <th className="p-4 font-bold border-b border-outline-variant/30">Durum</th>
                <th className="p-4 font-bold border-b border-outline-variant/30">Okunma Süresi</th>
                <th className="p-4 font-bold border-b border-outline-variant/30 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="p-4">
                    <div className="font-title-md font-bold text-on-surface text-base">{article.title}</div>
                    <div className="text-xs text-on-surface-variant line-clamp-1 mt-1">{article.metaDescription}</div>
                  </td>
                  <td className="p-4 text-sm font-mono text-primary">{article.slug}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {article.isPublished ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-on-surface-variant">{article.readingTime} dk</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/artiklar/${article.slug}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                        title="Görüntüle"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="w-8 h-8 rounded-lg bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center text-secondary transition-colors"
                        title="Düzenle"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={isDeleting === article.id}
                        className="w-8 h-8 rounded-lg bg-error/10 hover:bg-error/20 flex items-center justify-center text-error transition-colors disabled:opacity-50"
                        title="Sil"
                      >
                        <span className="material-symbols-outlined text-[18px]">{isDeleting === article.id ? 'hourglass_empty' : 'delete'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    Henüz hiç makale bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

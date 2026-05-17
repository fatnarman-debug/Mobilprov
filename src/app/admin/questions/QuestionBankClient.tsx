'use client';

import React, { useState } from 'react';
import { deleteQuestion, updateQuestion } from '@/actions/admin.actions';

type Question = {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  difficulty: string;
  isTest: boolean;
  topic: {
    id: string;
    title: string;
  };
};

export default function QuestionBankClient({ initialQuestions, topics }: { initialQuestions: Question[], topics: {id: string, title: string}[] }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const filteredQuestions = selectedTopic === 'all' 
    ? questions 
    : questions.filter(q => q.topic.id === selectedTopic);

  const handleDelete = async (id: string) => {
    if (confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      const result = await deleteQuestion(id);
      if (result.success) {
        setQuestions(questions.filter(q => q.id !== id));
      } else {
        alert(result.error);
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingQuestion) return;

    const formData = new FormData(e.currentTarget);
    const result = await updateQuestion(editingQuestion.id, formData);
    
    if (result.success) {
      // Local state güncellemesi
      setQuestions(questions.map(q => {
        if (q.id === editingQuestion.id) {
          return {
            ...q,
            text: formData.get('text') as string,
            optionA: formData.get('optionA') as string,
            optionB: formData.get('optionB') as string,
            optionC: formData.get('optionC') as string,
            optionD: formData.get('optionD') as string,
            correctAnswer: formData.get('correctAnswer') as string,
            explanation: formData.get('explanation') as string,
            isTest: formData.get('isTest') === 'true',
          };
        }
        return q;
      }));
      setEditingQuestion(null);
      alert('Soru başarıyla güncellendi.');
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
          Toplam: <span className="font-bold text-primary">{filteredQuestions.length}</span> soru gösteriliyor
        </div>
      </div>

      {/* Soru Tablosu */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        {filteredQuestions.length === 0 ? (
          <div className="p-xl text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">inventory_2</span>
            <h3 className="font-title-md text-title-md text-on-surface">Bu konuya ait soru bulunamadı</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider">Tür / Konu</th>
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider w-1/2">Soru Kökü & Seçenekler</th>
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-center">Doğru Cevap</th>
                  <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors group">
                    <td className="p-4 align-top">
                      <div className="mb-2">
                        {q.isTest ? (
                          <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold">Test</span>
                        ) : (
                          <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">Çalışma</span>
                        )}
                      </div>
                      <div className="font-body-sm text-on-surface mt-2">{q.topic.title}</div>
                    </td>
                    <td className="p-4 align-top font-body-md text-on-surface">
                      <div className="font-bold mb-2">{q.text}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-on-surface-variant">
                        <div className={q.correctAnswer === 'A' ? 'font-bold text-primary' : ''}>A) {q.optionA}</div>
                        <div className={q.correctAnswer === 'B' ? 'font-bold text-primary' : ''}>B) {q.optionB}</div>
                        <div className={q.correctAnswer === 'C' ? 'font-bold text-primary' : ''}>C) {q.optionC}</div>
                        <div className={q.correctAnswer === 'D' ? 'font-bold text-primary' : ''}>D) {q.optionD}</div>
                      </div>
                      {q.explanation && (
                        <div className="mt-2 text-xs italic bg-surface-variant p-2 rounded text-on-surface-variant">
                          Çözüm: {q.explanation}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container font-bold mt-1">
                        {q.correctAnswer}
                      </span>
                    </td>
                    <td className="p-4 align-top text-right">
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingQuestion(q)}
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors text-primary"
                          title="Düzenle"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(q.id)}
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
      {editingQuestion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-outline-variant p-4 flex justify-between items-center">
              <h3 className="font-headline-sm text-on-surface">Soruyu Düzenle</h3>
              <button onClick={() => setEditingQuestion(null)} className="p-2 rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="flex gap-4 mb-2">
                 <label className="flex items-center gap-2 font-label-md text-on-surface cursor-pointer">
                    <input type="checkbox" name="isTest" defaultChecked={editingQuestion.isTest} value="true" className="w-5 h-5 accent-primary" />
                    Test Sorusu Mu?
                 </label>
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">Soru Kökü</label>
                <textarea name="text" defaultValue={editingQuestion.text} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md" rows={3} required></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">A Seçeneği</label>
                  <input type="text" name="optionA" defaultValue={editingQuestion.optionA} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" required />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">B Seçeneği</label>
                  <input type="text" name="optionB" defaultValue={editingQuestion.optionB} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" required />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">C Seçeneği</label>
                  <input type="text" name="optionC" defaultValue={editingQuestion.optionC} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" required />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface-variant mb-1">D Seçeneği</label>
                  <input type="text" name="optionD" defaultValue={editingQuestion.optionD} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-1">
                  <label className="block font-label-md text-on-surface-variant mb-1">Doğru Cevap</label>
                  <select name="correctAnswer" defaultValue={editingQuestion.correctAnswer} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" required>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-label-md text-on-surface-variant mb-1">Çözüm / Açıklama</label>
                  <input type="text" name="explanation" defaultValue={editingQuestion.explanation || ''} className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" />
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingQuestion(null)} className="px-6 py-2 rounded-full font-title-md text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors">İptal</button>
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

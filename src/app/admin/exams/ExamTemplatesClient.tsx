'use client';

import React, { useRef } from 'react';
import { createExamTemplate, deleteExamTemplate, addExamTopicRule, deleteExamTopicRule, generateMockExam, deleteMockExam } from '@/actions/exam.actions';

type Topic = { id: string, title: string };
type ExamTopicRule = { id: string, topic: Topic, questionCount: number };
type ExamTemplate = { id: string, title: string, durationMin: number, rules: ExamTopicRule[] };
type MockExam = { id: string, title: string, durationMin: number, createdAt: Date, template: { title: string } | null, _count: { questions: number } };

export default function ExamTemplatesClient({ templates, topics, mockExams }: { templates: ExamTemplate[], topics: Topic[], mockExams: MockExam[] }) {
  const templateFormRef = useRef<HTMLFormElement>(null);

  const handleAddTemplate = async (formData: FormData) => {
    const result = await createExamTemplate(formData);
    if (result.error) alert(result.error);
    else {
      alert(result.success);
      templateFormRef.current?.reset();
    }
  };

  const handleAddRule = async (formData: FormData) => {
    const result = await addExamTopicRule(formData);
    if (result.error) alert(result.error);
    else alert(result.success);
  };

  const handleGenerateExam = async (e: React.FormEvent<HTMLFormElement>, templateId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('templateId', templateId);
    
    const title = prompt('Oluşturulacak Sabit Sınavın Adını Girin (Örn: Deneme Sınavı 1):');
    if (!title) return;
    formData.append('title', title);

    const result = await generateMockExam(formData);
    if (result.error) alert(result.error);
    else alert(result.success);
  };

  return (
    <div className="space-y-xl">
      {/* Üretilmiş Sabit Sınavlar Bölümü */}
      <div>
        <h2 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified</span>
          Üretilmiş Sabit Sınavlar (Yayında)
        </h2>
        {mockExams.length === 0 ? (
          <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
            <p className="font-body-md text-on-surface-variant">Henüz hiç sabit deneme sınavı üretilmedi. Aşağıdaki şablonlardan birinin yanındaki "Sınav Üret" butonuna basarak ilk denemeyi oluşturun.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            {mockExams.map(exam => (
              <div key={exam.id} className="bg-surface-container-lowest p-md rounded-xl border border-primary shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-primary text-on-primary px-3 py-1 rounded-bl-lg text-xs font-bold">
                  YAYINDA
                </div>
                <h3 className="font-title-md text-title-md text-on-surface mt-2">{exam.title}</h3>
                <p className="font-body-sm text-on-surface-variant mb-4">Şablon: {exam.template?.title || 'Bilinmiyor'}</p>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">timer</span>
                    {exam.durationMin} dk
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                    {exam._count.questions} Soru
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (confirm(`'${exam.title}' sınavını silmek istediğinizden emin misiniz?`)) {
                      await deleteMockExam(exam.id);
                    }
                  }}
                  className="w-full py-2 rounded-lg border border-error text-error hover:bg-error hover:text-on-error transition-colors text-sm font-bold flex justify-center items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Sınavı Sil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-outline-variant" />

      {/* Şablon Yönetimi Bölümü */}
      <div>
        <h2 className="font-headline-sm text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">tune</span>
          Sınav Şablonları & Kurallar
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
      {/* Left Column: Yeni Şablon Ekle */}
      <div className="lg:col-span-4 space-y-md">
        <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-base mb-md">
            <span className="material-symbols-outlined text-secondary">assignment_add</span>
            <h3 className="font-title-md text-title-md text-on-surface">Yeni Şablon Oluştur</h3>
          </div>
          <form action={handleAddTemplate} ref={templateFormRef} className="space-y-sm">
            <input type="text" name="title" placeholder="Şablon Adı (Örn: Tam Sınav)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-body-md" required />
            <input type="number" name="durationMin" placeholder="Süre (Dakika)" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-xs font-body-md text-body-md" required min="1" />
            <button type="submit" className="w-full bg-secondary text-on-secondary py-2 rounded-lg font-title-md text-title-md active:scale-95 transition-transform">Şablonu Kaydet</button>
          </form>
        </div>
      </div>

      {/* Right Column: Şablonlar Listesi ve Kuralları */}
      <div className="lg:col-span-8 space-y-md">
        {templates.length === 0 ? (
          <div className="bg-white p-xl rounded-xl border border-outline-variant shadow-sm text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">hourglass_empty</span>
            <h3 className="font-title-md text-title-md text-on-surface">Henüz Sınav Şablonu Yok</h3>
            <p className="font-body-md text-on-surface-variant mt-2">Sol taraftaki formu kullanarak yeni bir sınav şablonu oluşturun.</p>
          </div>
        ) : (
          templates.map(template => {
            const totalQuestions = template.rules.reduce((sum, r) => sum + r.questionCount, 0);

            return (
              <div key={template.id} className="bg-white p-md lg:p-lg rounded-xl border border-outline-variant shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant">
                  <div>
                    <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">timer</span>
                      {template.title}
                    </h3>
                    <p className="text-on-surface-variant font-body-sm mt-1">Süre: {template.durationMin} dk | Toplam Soru: {totalQuestions}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form onSubmit={(e) => handleGenerateExam(e, template.id)}>
                      <button 
                        type="submit"
                        className="bg-primary text-on-primary px-4 py-2 rounded-lg font-title-sm flex items-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
                        disabled={totalQuestions === 0}
                        title={totalQuestions === 0 ? "Önce kural ekleyin" : "Bu şablonu kullanarak yeni sabit bir sınav üretir"}
                      >
                        <span className="material-symbols-outlined text-[18px]">magic_button</span>
                        Sınav Üret
                      </button>
                    </form>
                    <button 
                      onClick={async () => {
                        if (confirm('Bu sınav şablonunu tamamen silmek istiyor musunuz?')) {
                          const result = await deleteExamTemplate(template.id);
                          if (result.error) alert(result.error);
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-surface-container hover:bg-error hover:text-on-error flex items-center justify-center transition-colors text-error"
                      title="Şablonu Sil"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete_forever</span>
                    </button>
                  </div>
                </div>

                {/* Mevcut Kurallar */}
                <div className="mb-6">
                  <h4 className="font-title-sm text-on-surface-variant mb-3 uppercase tracking-wider text-xs">Soru Dağılımı Kuralları</h4>
                  {template.rules.length === 0 ? (
                    <p className="text-sm italic text-on-surface-variant bg-surface-container-lowest p-3 rounded-lg border border-dashed border-outline-variant">
                      Henüz bu şablona konu ve soru sayısı kuralı eklenmedi. Sınav başlayabilmesi için kural ekleyin.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {template.rules.map(rule => (
                        <div key={rule.id} className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant p-3 rounded-lg hover:border-primary transition-colors">
                          <span className="font-body-md text-on-surface">{rule.topic.title}</span>
                          <div className="flex items-center gap-4">
                            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">
                              {rule.questionCount} Soru
                            </span>
                            <button 
                              onClick={async () => {
                                await deleteExamTopicRule(rule.id);
                              }}
                              className="text-error hover:text-error-dark transition-colors"
                              title="Kuralı Sil"
                            >
                              <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Kural Ekleme Formu */}
                <form action={handleAddRule} className="bg-surface-container-lowest p-4 rounded-xl border border-dashed border-outline flex flex-col md:flex-row gap-3 items-end">
                  <input type="hidden" name="examTemplateId" value={template.id} />
                  <div className="flex-grow w-full">
                    <label className="block font-label-md text-on-surface-variant mb-1 text-xs">Konu Seç</label>
                    <select name="topicId" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" required>
                      <option value="">Seçiniz</option>
                      {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block font-label-md text-on-surface-variant mb-1 text-xs">Soru Adedi</label>
                    <input type="number" name="questionCount" className="w-full bg-surface-bright border border-outline-variant rounded-lg p-2 font-body-md" required min="1" placeholder="Örn: 5" />
                  </div>
                  <button type="submit" className="w-full md:w-auto bg-primary text-on-primary px-4 py-2 rounded-lg font-title-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Ekle
                  </button>
                </form>

              </div>
            );
          })
        )}
      </div>
      </div>
      </div>
    </div>
  );
}

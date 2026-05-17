'use client';

import React, { useState } from 'react';
import { updateUserSubscription, deleteUser, createUser } from '@/actions/user.actions';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isPaid: boolean;
  subscriptionEndsAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  _count?: {
    progress: number;
    testResults: number;
  };
};

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaid, setFilterPaid] = useState('all'); // all, paid, free
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Filtreleme mantığı
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterPaid === 'paid') return matchesSearch && user.isPaid;
    if (filterPaid === 'free') return matchesSearch && !user.isPaid;
    return matchesSearch;
  });

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.currentTarget);
    const result = await updateUserSubscription(editingUser.id, formData);

    if (result.success) {
      alert(result.success);
      // Yerel state'i güncelle (Sayfa yenilenmesine gerek kalmadan)
      const isPaid = formData.get('isPaid') === 'on';
      const endsAtStr = formData.get('subscriptionEndsAt') as string;
      const endsAt = endsAtStr ? new Date(endsAtStr) : null;

      setUsers(users.map(u => u.id === editingUser.id ? { ...u, isPaid, subscriptionEndsAt: endsAt } : u));
      setEditingUser(null);
    } else {
      alert(result.error);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);

    if (result.success) {
      alert(result.success);
      window.location.reload(); // En kolay yol veriyi tazelemektir.
    } else {
      alert(result.error);
    }
  };

  const isExpired = (date: Date | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date: Date | null) => {
    if (!date) return false;
    const now = new Date();
    const diffTime = Math.abs(new Date(date).getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7 && new Date(date) >= now;
  };

  return (
    <div className="space-y-md">
      {/* İstatistik ve Filtreleme */}
      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Toplam</span>
            <span className="font-headline-sm text-primary font-bold">{users.length}</span>
          </div>
          <div className="w-px bg-outline-variant"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Premium</span>
            <span className="font-headline-sm text-tertiary font-bold">{users.filter(u => u.isPaid).length}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="İsim veya E-posta ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant rounded-full py-2 pl-10 pr-4 font-body-md focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <select 
            value={filterPaid}
            onChange={(e) => setFilterPaid(e.target.value)}
            className="bg-surface-bright border border-outline-variant rounded-full py-2 px-4 font-body-md focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">Tüm Üyeler</option>
            <option value="paid">Sadece Premium</option>
            <option value="free">Sadece Ücretsiz</option>
          </select>
          <button 
            onClick={() => setIsAddingUser(true)}
            className="bg-primary text-on-primary px-4 py-2 rounded-full font-title-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Kullanıcı Ekle
          </button>
        </div>
      </div>

      {/* Kullanıcı Tablosu */}
      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider">Kullanıcı</th>
                <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-center">Durum</th>
                <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider">Abonelik Bitiş</th>
                <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider">Kayıt / Son Giriş</th>
                <th className="p-4 font-label-md text-on-surface-variant uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">Aradığınız kriterlere uygun kullanıcı bulunamadı.</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-surface-container-lowest transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg uppercase">
                          {user.name ? user.name.charAt(0) : user.email.charAt(0)}
                        </div>
                        <div>
                          <div className="font-title-md text-on-surface font-bold">{user.name || 'İsimsiz Kullanıcı'} {user.role === 'ADMIN' && <span className="ml-2 text-[10px] bg-error text-on-error px-2 py-0.5 rounded-full align-middle">ADMIN</span>}</div>
                          <div className="font-body-sm text-on-surface-variant">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {user.isPaid ? (
                        <span className="inline-flex items-center gap-1 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold">
                          <span className="material-symbols-outlined text-[14px]">star</span> VIP
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-bold">
                          FREE
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.isPaid ? (
                        user.subscriptionEndsAt ? (
                          <div className={`font-body-sm flex items-center gap-1 ${isExpired(user.subscriptionEndsAt) ? 'text-error font-bold' : isExpiringSoon(user.subscriptionEndsAt) ? 'text-secondary font-bold' : 'text-on-surface'}`}>
                            <span className="material-symbols-outlined text-[16px]">
                              {isExpired(user.subscriptionEndsAt) ? 'cancel' : isExpiringSoon(user.subscriptionEndsAt) ? 'warning' : 'event'}
                            </span>
                            {new Date(user.subscriptionEndsAt).toLocaleDateString('tr-TR')}
                            {isExpired(user.subscriptionEndsAt) && <span className="text-xs ml-1">(Bitti)</span>}
                            {isExpiringSoon(user.subscriptionEndsAt) && <span className="text-xs ml-1">(Yakında)</span>}
                          </div>
                        ) : (
                          <span className="text-sm italic text-on-surface-variant">Süresiz</span>
                        )
                      ) : (
                        <span className="text-on-surface-variant">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-body-sm text-on-surface">
                        <span className="text-on-surface-variant mr-1">Kayıt:</span> 
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                      <div className="font-body-sm mt-1">
                        <span className="text-on-surface-variant mr-1">Son:</span>
                        {user.lastLoginAt ? (
                          <span className="text-primary font-medium">{new Date(user.lastLoginAt).toLocaleDateString('tr-TR')}</span>
                        ) : (
                          <span className="italic text-on-surface-variant">Hiç girmedi</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors text-primary"
                          title="Üyeliği Düzenle"
                        >
                          <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                        </button>
                        <button 
                          onClick={async () => {
                            if(confirm(`${user.email} kullanıcısını sistemden tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) {
                              await deleteUser(user.id);
                            }
                          }}
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-error hover:text-on-error flex items-center justify-center transition-colors text-error"
                          title="Kullanıcıyı Sil"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Üyelik Düzenleme Modalı */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="bg-surface-container-low border-b border-outline-variant p-4 flex justify-between items-center">
              <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                Üyelik Düzenle
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-2 rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-lg">
                  {editingUser.name ? editingUser.name.charAt(0) : editingUser.email.charAt(0)}
                </div>
                <div>
                  <div className="font-title-md">{editingUser.name || 'İsimsiz'}</div>
                  <div className="font-body-sm text-on-surface-variant">{editingUser.email}</div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-outline-variant rounded-lg hover:bg-surface-container-lowest transition-colors">
                  <input 
                    type="checkbox" 
                    name="isPaid" 
                    defaultChecked={editingUser.isPaid} 
                    className="w-5 h-5 accent-primary"
                  />
                  <div>
                    <div className="font-title-sm text-on-surface">Premium (VIP) Hesap</div>
                    <div className="font-body-sm text-on-surface-variant">Bu kullanıcıyı ücretli abone yap.</div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block font-title-sm text-on-surface mb-2">Abonelik Bitiş Tarihi</label>
                <input 
                  type="date" 
                  name="subscriptionEndsAt" 
                  defaultValue={editingUser.subscriptionEndsAt ? new Date(editingUser.subscriptionEndsAt).toISOString().split('T')[0] : ''}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                />
                <p className="text-xs text-on-surface-variant mt-1 italic">Süresiz (Lifetime) erişim için boş bırakın.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingUser(null)} className="px-5 py-2 rounded-full font-title-sm text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors">İptal</button>
                <button type="submit" className="px-5 py-2 rounded-full font-title-sm text-on-primary bg-primary hover:bg-primary-dark transition-colors">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kullanıcı Ekleme Modalı */}
      {isAddingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="bg-surface-container-low border-b border-outline-variant p-4 flex justify-between items-center">
              <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Yeni Kullanıcı Ekle
              </h3>
              <button onClick={() => setIsAddingUser(false)} className="p-2 rounded-full hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-title-sm text-on-surface mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  name="name" 
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>

              <div>
                <label className="block font-title-sm text-on-surface mb-1">E-posta</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                  placeholder="ornek@mail.com"
                />
              </div>

              <div>
                <label className="block font-title-sm text-on-surface mb-1">Şifre</label>
                <input 
                  type="text" 
                  name="password" 
                  defaultValue="123456"
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">Varsayılan şifre "123456" olarak belirlenmiştir.</p>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-outline-variant rounded-lg hover:bg-surface-container-lowest transition-colors">
                  <input 
                    type="checkbox" 
                    name="isPaid" 
                    className="w-5 h-5 accent-primary"
                  />
                  <div>
                    <div className="font-title-sm text-on-surface">Premium (VIP) Hesap</div>
                    <div className="font-body-sm text-on-surface-variant">Bu kullanıcı ödeme duvarına takılmasın.</div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block font-title-sm text-on-surface mb-1">Abonelik Bitiş Tarihi</label>
                <input 
                  type="date" 
                  name="subscriptionEndsAt" 
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md focus:ring-2 focus:ring-primary outline-none"
                />
                <p className="text-[11px] text-on-surface-variant mt-1 italic">Boş bırakılırsa süresiz erişim hakkı tanınır.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddingUser(false)} className="px-5 py-2 rounded-full font-title-sm text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors">İptal</button>
                <button type="submit" className="px-5 py-2 rounded-full font-title-sm text-on-primary bg-primary hover:bg-primary-dark transition-colors">Kullanıcıyı Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

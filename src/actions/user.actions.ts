'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function updateUserSubscription(userId: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const isPaid = formData.get('isPaid') === 'on';
  const subscriptionEndsAtStr = formData.get('subscriptionEndsAt') as string;

  let subscriptionEndsAt: Date | null = null;
  if (subscriptionEndsAtStr) {
    subscriptionEndsAt = new Date(subscriptionEndsAtStr);
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPaid,
        subscriptionEndsAt
      }
    });

    revalidatePath('/admin/users');
    return { success: 'Kullanıcı abonelik bilgileri başarıyla güncellendi.' };
  } catch (error) {
    console.error(error);
    return { error: 'Kullanıcı güncellenirken hata oluştu.' };
  }
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    revalidatePath('/admin/users');
    return { success: 'Kullanıcı sistemden tamamen silindi.' };
  } catch (error) {
    return { error: 'Kullanıcı silinirken hata meydana geldi.' };
  }
}

import bcrypt from 'bcryptjs';

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string || '123456';
  const isPaid = formData.get('isPaid') === 'on';
  const subscriptionEndsAtStr = formData.get('subscriptionEndsAt') as string;

  if (!email) {
    return { error: 'E-posta adresi zorunludur.' };
  }

  let subscriptionEndsAt: Date | null = null;
  if (subscriptionEndsAtStr) {
    subscriptionEndsAt = new Date(subscriptionEndsAtStr);
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        isPaid,
        subscriptionEndsAt
      }
    });

    revalidatePath('/admin/users');
    return { success: 'Yeni kullanıcı başarıyla eklendi!' };
  } catch (error) {
    console.error(error);
    return { error: 'Kullanıcı oluşturulurken bir hata meydana geldi.' };
  }
}

export async function changeUserPassword(userId: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || (session.user.id !== userId && session.user.role !== 'ADMIN')) {
    return { error: 'Yetkisiz erişim. Sadece kendi şifrenizi değiştirebilirsiniz.' };
  }
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword) {
    return { error: 'Lütfen tüm şifre alanlarını doldurun.' };
  }

  if (newPassword.length < 6) {
    return { error: 'Yeni şifre en az 6 karakter uzunluğunda olmalıdır.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { error: 'Kullanıcı bulunamadı.' };
    }

    // Verify current password hash
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return { error: 'Mevcut şifreniz hatalı.' };
    }

    // Hash and update to new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash
      }
    });

    return { success: 'Şifreniz başarıyla güncellendi!' };
  } catch (error) {
    console.error(error);
    return { error: 'Şifre güncellenirken bir hata oluştu.' };
  }
}

export async function updateUserLanguage(userId: string, nativeLanguage: string) {
  const session = await auth();
  if (!session || !session.user || (session.user.id !== userId && session.user.role !== 'ADMIN')) {
    return { error: 'Yetkisiz erişim.' };
  }
  if (!userId || !nativeLanguage) {
    return { error: 'Geçersiz parametreler.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        nativeLanguage
      }
    });

    revalidatePath('/profile');
    return { success: 'Dil tercihiniz başarıyla güncellendi!' };
  } catch (error) {
    console.error(error);
    return { error: 'Dil güncellenirken bir hata oluştu.' };
  }
}

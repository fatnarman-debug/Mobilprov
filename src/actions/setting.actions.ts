'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function updatePlatformSettings(formData: FormData) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz erişim.' };
  }

  const siteName = formData.get('siteName') as string;
  const contactEmail = formData.get('contactEmail') as string;
  const maintenanceMode = formData.get('maintenanceMode') === 'on';
  const freeDailyQuestionLimit = parseInt(formData.get('freeDailyQuestionLimit') as string);
  const passingScorePercentage = parseInt(formData.get('passingScorePercentage') as string);
  const seoTitle = formData.get('seoTitle') as string;
  const seoDescription = formData.get('seoDescription') as string;

  try {
    const settings = await prisma.platformSetting.upsert({
      where: { id: 'global_settings' },
      update: {
        siteName,
        contactEmail,
        maintenanceMode,
        freeDailyQuestionLimit: isNaN(freeDailyQuestionLimit) ? 20 : freeDailyQuestionLimit,
        passingScorePercentage: isNaN(passingScorePercentage) ? 60 : passingScorePercentage,
        seoTitle,
        seoDescription
      },
      create: {
        id: 'global_settings',
        siteName,
        contactEmail,
        maintenanceMode,
        freeDailyQuestionLimit: isNaN(freeDailyQuestionLimit) ? 20 : freeDailyQuestionLimit,
        passingScorePercentage: isNaN(passingScorePercentage) ? 60 : passingScorePercentage,
        seoTitle,
        seoDescription
      }
    });

    revalidatePath('/', 'layout'); // Tüm siteyi yenile
    return { success: 'Platform ayarları başarıyla güncellendi.', settings };
  } catch (error) {
    console.error(error);
    return { error: 'Ayarlar güncellenirken bir hata meydana geldi.' };
  }
}

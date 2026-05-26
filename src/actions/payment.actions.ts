'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function createCheckoutSession(userId: string) {
  const session = await auth();
  if (!session || !session.user || (session.user.id !== userId && session.user.role !== 'ADMIN')) {
    throw new Error('Unauthorized');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: {
              name: 'EduFlow Premium',
              description: 'Eğitim platformuna tam erişim (Sınırısız)',
            },
            unit_amount: 49900, // 499.00 TRY
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      mode: 'payment',
      success_url: `${origin}/payment/success`,
      cancel_url: `${origin}/payment?userId=${userId}&canceled=true`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Stripe Checkout Session Creation Failed:', error);
    return { url: null, error: error instanceof Error ? error.message : 'Stripe authentication/connection error' };
  }
}

export async function bypassPayment(userId: string) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return { error: 'Yetkisiz işlem.' };
  }

  if (!userId) {
    return { error: 'Kullanıcı ID gereklidir.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPaid: true
      }
    });

    revalidatePath('/profile');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Payment bypass failed:', error);
    return { error: 'Bypass işlemi sırasında bir hata oluştu.' };
  }
}

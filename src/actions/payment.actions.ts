'use server';

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function createCheckoutSession(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const headersList = headers();
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
}

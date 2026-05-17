import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Webhook Error: ' + err.message }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;

    if (userId) {
      // Update the user's status to paid
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isPaid: true },
        });
        console.log(`User ${userId} successfully upgraded to Paid status.`);
      } catch (dbError) {
        console.error(`Failed to update user ${userId} in database:`, dbError);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    } else {
      console.warn('Checkout session completed but no userId found in metadata.');
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

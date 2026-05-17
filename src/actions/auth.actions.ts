'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { createCheckoutSession } from './payment.actions';

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return { error: 'E-posta ve şifre zorunludur.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: 'Bu e-posta adresi zaten kullanımda.' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        isPaid: false,
      }
    });

    // Instead of redirecting to the payment page, we can generate the Stripe session directly
    // and redirect the user to Stripe Checkout.
    const sessionUrl = await createCheckoutSession(newUser.id);
    if (sessionUrl.url) {
      redirect(sessionUrl.url);
    } else {
      redirect(`/payment?userId=${newUser.id}`);
    }

  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error && error.message === 'NEXT_REDIRECT') {
        throw error;
    }
    console.error('Registration Error:', error);
    return { error: 'Kayıt işlemi sırasında bir hata oluştu.' };
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'E-posta ve şifre zorunludur.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Geçersiz e-posta veya şifre.' };
        default:
          return { error: 'Giriş yapılırken bir hata oluştu.' };
      }
    }
    throw error;
  }
  
  // Checking payment state after successful login requires fetching the user again 
  // since signIn with redirect: false doesn't return the user object directly.
  const user = await prisma.user.findUnique({ where: { email }});
  
  if (user && !user.isPaid) {
     const sessionUrl = await createCheckoutSession(user.id);
     if (sessionUrl.url) {
       redirect(sessionUrl.url);
     } else {
       redirect(`/payment?userId=${user.id}`);
     }
  }

  redirect('/dashboard');
}

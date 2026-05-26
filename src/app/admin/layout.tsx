import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin – Sverigemedborgarskapsprov.com',
  description: 'Administrationspanel för Sverigemedborgarskapsprov.com.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

const ADMIN_EMAILS = ['fatnarman@gmail.com']

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  
  if (!session || !session.user || (session.user.role !== 'ADMIN' && !ADMIN_EMAILS.includes(session.user.email ?? ''))) {
    redirect('/')
  }

  return children
}

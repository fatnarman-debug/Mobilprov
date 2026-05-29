import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

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

  return (
    <div className="bg-surface-bright dark:bg-background text-on-surface min-h-screen selection:bg-primary/20 selection:text-primary font-sans antialiased">
      <AdminHeader userEmail={session.user.email} />
      <AdminSidebar />
      <div className="pt-16 lg:pl-72 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { publicSeo, siteName, siteUrl } from '@/lib/seo'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })

export const metadata: Metadata = {
  ...publicSeo.home,
  title: {
    default: 'Medborgarskapsprov 2026 – Öva på svenska | İsveç Vatandaşlık Sınavı',
    template: '%s | Sverigemedborgarskapsprov.com',
  },
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'education',
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#006AA7',
}

import { auth } from '@/auth'
import SelectionTranslator from '@/components/SelectionTranslator'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="sv" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Sverigemedborgarskapsprov.com',
              url: siteUrl,
              description: 'Förbered dig för det svenska medborgarskapstestet',
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans relative`}>
        {children}
        <SelectionTranslator language={session?.user?.nativeLanguage || 'TR'} />
      </body>
    </html>
  )
}

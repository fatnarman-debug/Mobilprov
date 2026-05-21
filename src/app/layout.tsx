import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://medborgarprov.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Medborgarprov.com – Öva inför medborgarskapstestet',
    template: '%s | Medborgarprov.com',
  },
  description:
    'Förbered dig för det svenska medborgarskapstestet med flashcards, övningsfrågor och provsimuleringar. Klara provet på första försöket!',
  keywords: [
    'medborgarskapsprov',
    'medborgarskapsprov övning',
    'samhällskunskapstestet 2026',
    'bli svensk medborgare',
    'medborgarskapstest Sverige',
    'medborgarprov',
  ],
  authors: [{ name: 'Medborgarprov.com' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: siteUrl,
    siteName: 'Medborgarprov.com',
    title: 'Medborgarprov.com – Öva inför medborgarskapstestet',
    description: 'Förbered dig för det svenska medborgarskapstestet med flashcards, övningsfrågor och provsimuleringar.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Medborgarprov.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medborgarprov.com – Öva inför medborgarskapstestet',
    description: 'Förbered dig för det svenska medborgarskapstestet med flashcards och övningsfrågor.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: siteUrl },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
              name: 'Medborgarprov.com',
              url: siteUrl,
              description: 'Förbered dig för det svenska medborgarskapstestet',
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}

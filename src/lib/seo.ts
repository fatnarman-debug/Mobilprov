import type { Metadata } from 'next'

export const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://sverigemedborgarskapsprov.com').replace('http://', 'https://')
export const siteName = 'Sverigemedborgarskapsprov.com'
export const ogImage = '/og-image.svg'

const defaultKeywords = [
  'medborgarskapsprov',
  'medborgarskapstest',
  'svenskt medborgarskap',
  'samhällskunskapstestet',
  'medborgarskapsprov 2026',
  'övningsfrågor medborgarskapsprov',
  'İsveç vatandaşlık sınavı',
  'İsveç vatandaşlık testi',
  'İsveççe vatandaşlık sınavı soruları',
  'svenskt medborgarskapsprov',
  'svensk medborgarskapsprov',
  'svenskt medborgarskapstest',
  'svensk medborgarskapstest',
  'svenskt medborgarskapsprov 2026',
  'svenskt medborgarskapstest 2026',
]

type SeoInput = {
  title: string
  description: string
  path?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
}

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function seoMetadata({
  title,
  description,
  path = '/',
  type = 'website',
  noIndex = false,
  keywords = [],
  publishedTime,
  modifiedTime,
}: SeoInput): Metadata {
  const url = absoluteUrl(path)

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: url,
      languages: {
        'sv-SE': url,
        'tr-TR': url,
        'x-default': url,
      },
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type,
      locale: 'sv_SE',
      alternateLocale: ['tr_TR'],
      url,
      siteName,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteName} – medborgarskapsprov` }],
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export const publicSeo = {
  home: seoMetadata({
    title: 'Svenskt Medborgarskapsprov 2026 | İsveç Vatandaşlık Sınavı',
    description:
      'Öva inför det svenska medborgarskapsprovet 2026 med frågor, flashcards och provsimuleringar. İsveç vatandaşlık sınavına Türkçe destekli İsveççe hazırlanın.',
    path: '/',
  }),
  ovning: seoMetadata({
    title: 'Gratis övningsfrågor till medborgarskapsprovet | İsveç Vatandaşlık Testi',
    description:
      'Träna gratis med svenska övningsfrågor inför medborgarskapsprovet. Türkçe açıklamalarla İsveç vatandaşlık sınavı sorularına çalışın.',
    path: '/ovning',
    keywords: ['gratis medborgarskapsprov', 'medborgarskapsprov frågor', 'İsveç vatandaşlık soruları'],
  }),
  flashcards: seoMetadata({
    title: 'Flashcards för medborgarskapsprov 2026 | İsveççe Vatandaşlık Kartları',
    description:
      'Lär dig viktiga fakta om Sverige med interaktiva flashcards inför medborgarskapsprovet. İsveç vatandaşlık sınavı için hızlı tekrar kartları.',
    path: '/ovning/flashcards',
    keywords: ['medborgarskapsprov flashcards', 'sverige flashcards', 'İsveççe flashcard'],
  }),
  articles: seoMetadata({
    title: 'Svenskt Medborgarskapsprov & Test: Artiklar & Guider 2026',
    description:
      'Läs guider och artiklar om det svenska medborgarskapsprovet och medborgarskapstestet 2026. İsveç vatandaşlık sınavı için Türkçe destekli rehberler.',
    path: '/artiklar',
    keywords: [
      'medborgarskapsprov guide',
      'sverige i fokus',
      'İsveç vatandaşlık rehberi',
      'svenskt medborgarskapsprov artiklar',
      'medborgarskapstest guider',
    ],
  }),
}

export function privateSeo(title: string, description: string, path: string): Metadata {
  return seoMetadata({ title, description, path, noIndex: true })
}

import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://sverigemedborgarskapsprov.com').replace('http://', 'https://')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dbArticles = await prisma.article.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true }
  })

  const articlePages = dbArticles.map(a => ({
    url: `${siteUrl}/artiklar/${a.slug}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/ovning`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/ovning/flashcards`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${siteUrl}/artiklar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    ...articlePages,
  ]
}


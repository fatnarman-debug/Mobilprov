import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sverigemedborgarskapsprov.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ovning',
          '/ovning/',
          '/ovning/flashcards',
          '/artiklar',
          '/artiklar/',
        ],
        disallow: [
          '/admin/',
          '/dashboard/',
          '/profile/',
          '/api/',
          '/auth/',
          '/payment/',
          '/test/',
          '/analysis/',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot'],
        allow: ['/'],
        disallow: ['/admin/', '/dashboard/', '/profile/', '/api/', '/auth/', '/payment/', '/test/', '/analysis/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

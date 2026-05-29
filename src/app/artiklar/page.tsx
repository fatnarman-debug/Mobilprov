import Link from 'next/link'
import prisma from '@/lib/db'
import { publicSeo } from '@/lib/seo'

export const metadata = publicSeo.articles

export const revalidate = 3600; // Cache for 1 hour

export default async function ArtiklarPage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' }
  });
  return (
    <div style={{ background: 'linear-gradient(135deg, #002244 0%, #003566 40%, #006AA7 100%)', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <span style={{ color: '#FECC02' }}>🇸🇪</span>
            <span>SVERIGEMEDBORGARSKAPSPROV</span>
            <span style={{ color: '#FECC02' }}>.com</span>
          </Link>
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all" style={{ background: '#FECC02', color: '#002244' }}>
            Registrera dig
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Artiklar & <span style={{ color: '#FECC02' }}>Guider</span>
          </h1>
          <p className="text-white/80 text-xl md:text-2xl">
            Allt du behöver veta om medborgarskapstestet – på ett ställe.
          </p>
        </div>

        <div className="grid gap-6">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/artiklar/${article.slug}`}
              className="block rounded-2xl p-6 transition-all hover:scale-[1.01] group"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(254,204,2,0.15)', color: '#FECC02', border: '1px solid rgba(254,204,2,0.3)' }}>
                  📖 Guide
                </span>
                <span className="text-white/75 text-sm">{article.readingTime} min läsning</span>
                <span className="text-white/75 text-sm">· {new Date(article.publishedAt).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <h2 className="text-white font-bold text-xl md:text-2xl mb-2 group-hover:text-yellow-300 transition-colors leading-snug">
                {article.title}
              </h2>
              <p className="text-white/90 text-base md:text-lg line-clamp-2">{article.metaDescription}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: '#FECC02' }}>
                Läs mer <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-white/75 text-sm">
        <p>© 2025 Sverigemedborgarskapsprov.com</p>
      </footer>
    </div>
  )
}

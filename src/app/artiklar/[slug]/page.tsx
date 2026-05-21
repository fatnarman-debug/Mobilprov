import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles } from '@/lib/articles'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `https://medborgarprov.com/artiklar/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  }
}

// Basit markdown → HTML dönüştürücü
function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-yellow-300 mt-5 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-white/80 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-white/80 list-decimal">$2</li>')
    .replace(/^---$/gm, '<hr class="border-white/10 my-6"/>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-yellow-300 underline hover:text-yellow-200" target="_blank">$1</a>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-sm text-yellow-200">$1</code>')
    .replace(/\n\n/g, '</p><p class="text-white/75 leading-relaxed my-3">')
    .replace(/^(?!<[h|l|h])(.+)$/gm, (line) => line.trim() ? line : '')
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) notFound()

  const htmlContent = renderMarkdown(article!.content)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Organization', name: 'Medborgarprov.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Medborgarprov.com',
      url: 'https://medborgarprov.com',
    },
    mainEntityOfPage: `https://medborgarprov.com/artiklar/${article.slug}`,
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #002244 0%, #003566 40%, #006AA7 100%)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <span style={{ color: '#FECC02' }}>🇸🇪</span>
            <span>MEDBORGARPROV</span>
            <span style={{ color: '#FECC02' }}>.com</span>
          </Link>
          <Link href="/" className="px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all" style={{ background: '#FECC02', color: '#002244' }}>
            Registrera dig
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-white/40 text-xs mb-8">
          <Link href="/" className="hover:text-white/70">Hem</Link>
          <span>›</span>
          <Link href="/artiklar" className="hover:text-white/70">Artiklar</Link>
          <span>›</span>
          <span className="text-white/60 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Article header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(254,204,2,0.15)', color: '#FECC02', border: '1px solid rgba(254,204,2,0.3)' }}>
              📖 Guide
            </span>
            <span className="text-white/40 text-xs">⏱ {article.readingTime} min läsning</span>
            <span className="text-white/40 text-xs">· Uppdaterad {article.updatedAt}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            {article.metaDescription}
          </p>
        </div>

        {/* Quick practice CTA */}
        <div
          className="flex items-center justify-between gap-4 p-5 rounded-2xl mb-10"
          style={{ background: 'rgba(254,204,2,0.1)', border: '1px solid rgba(254,204,2,0.25)' }}
        >
          <div>
            <p className="text-white font-semibold text-sm">Öva på riktiga provfrågor</p>
            <p className="text-white/50 text-xs mt-0.5">Gratis – ingen registrering krävs</p>
          </div>
          <Link
            href="/ovning"
            className="px-5 py-2.5 rounded-xl text-sm font-bold flex-shrink-0 hover:scale-105 transition-all"
            style={{ background: '#FECC02', color: '#002244' }}
          >
            Öva nu →
          </Link>
        </div>

        {/* Article content */}
        <article
          className="prose-custom leading-relaxed"
          dangerouslySetInnerHTML={{ __html: `<p class="text-white/75 leading-relaxed my-3">${htmlContent}</p>` }}
        />

        {/* Bottom CTA */}
        <div
          className="mt-14 rounded-3xl p-8 text-center"
          style={{ background: 'rgba(254,204,2,0.08)', border: '1px solid rgba(254,204,2,0.2)' }}
        >
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-xl font-extrabold text-white mb-2">
            Redo att börja öva?
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Testa dina kunskaper med gratis övningsfrågor och flashcards – direkt, utan registrering.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ovning" className="px-7 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all" style={{ background: '#FECC02', color: '#002244' }}>
              📝 Starta gratis övning
            </Link>
            <Link href="/ovning/flashcards" className="px-7 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-all" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
              📇 Prova flashcards
            </Link>
          </div>
        </div>

        {/* More articles */}
        <div className="mt-12">
          <h2 className="text-white font-bold text-lg mb-5">Fler artiklar</h2>
          <div className="grid gap-4">
            {articles.filter(a => a.slug !== article.slug).slice(0, 3).map(a => (
              <Link
                key={a.slug}
                href={`/artiklar/${a.slug}`}
                className="flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <span className="text-2xl">📖</span>
                <div>
                  <p className="text-white font-semibold text-sm leading-snug">{a.title}</p>
                  <p className="text-white/50 text-xs mt-1">{a.readingTime} min läsning</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-white/30 text-xs">
        <p>© 2025 Medborgarprov.com</p>
      </footer>
    </div>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articles } from '@/lib/articles'
import { absoluteUrl, ogImage, seoMetadata, siteName } from '@/lib/seo'

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
  return seoMetadata({
    title: `${article.title} | İsveç Vatandaşlık Sınavı Rehberi`,
    description: `${article.metaDescription} Türkçe destekli İsveççe hazırlık rehberiyle medborgarskapsprovet için çalışın.`,
    path: `/artiklar/${article.slug}`,
    type: 'article',
    keywords: article.keywords,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  })
}

// Basit markdown → HTML dönüştürücü
function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let inParagraph = false;

  const closeParagraph = () => {
    if (inParagraph) {
      html += '</p>\n';
      inParagraph = false;
    }
  };

  const closeList = () => {
    if (inList) {
      if (listType === 'ul') {
        html += '</ul>\n';
      } else if (listType === 'ol') {
        html += '</ol>\n';
      }
      inList = false;
      listType = null;
    }
  };

  const parseInline = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      closeParagraph();
      closeList();
      continue;
    }

    // Horizontal Rule
    if (line === '---') {
      closeParagraph();
      closeList();
      html += '<hr />\n';
      continue;
    }

    // Headings
    if (line.startsWith('## ')) {
      closeParagraph();
      closeList();
      const content = line.substring(3).trim();
      html += `<h2>${parseInline(content)}</h2>\n`;
      continue;
    }

    if (line.startsWith('### ')) {
      closeParagraph();
      closeList();
      const content = line.substring(4).trim();
      html += `<h3>${parseInline(content)}</h3>\n`;
      continue;
    }

    // Unordered list item
    if (line.startsWith('- ')) {
      closeParagraph();
      if (!inList || listType !== 'ul') {
        closeList();
        html += '<ul>\n';
        inList = true;
        listType = 'ul';
      }
      const content = line.substring(2).trim();
      html += `<li>${parseInline(content)}</li>\n`;
      continue;
    }

    // Ordered list item
    if (/^\d+\.\s/.test(line)) {
      closeParagraph();
      if (!inList || listType !== 'ol') {
        closeList();
        html += '<ol>\n';
        inList = true;
        listType = 'ol';
      }
      const match = line.match(/^(\d+)\.\s(.*)/);
      const content = match ? match[2].trim() : line;
      html += `<li>${parseInline(content)}</li>\n`;
      continue;
    }

    // Normal paragraph
    closeList();
    if (!inParagraph) {
      html += '<p>';
      inParagraph = true;
    } else {
      html += ' ';
    }
    html += parseInline(line);
  }

  closeParagraph();
  closeList();
  return html;
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
    author: { '@type': 'Organization', name: 'Sverigemedborgarskapsprov.com' },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl('/'),
    },
    image: absoluteUrl(ogImage),
    inLanguage: ['sv-SE', 'tr-TR'],
    mainEntityOfPage: absoluteUrl(`/artiklar/${article.slug}`),
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #002244 0%, #003566 40%, #006AA7 100%)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-white/75 text-sm mb-8">
          <Link href="/" className="hover:text-white transition-colors">Hem</Link>
          <span>›</span>
          <Link href="/artiklar" className="hover:text-white transition-colors">Artiklar</Link>
          <span>›</span>
          <span className="text-white/90 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Article header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(254,204,2,0.15)', color: '#FECC02', border: '1px solid rgba(254,204,2,0.3)' }}>
              📖 Guide
            </span>
            <span className="text-white/75 text-sm">⏱ {article.readingTime} min läsning</span>
            <span className="text-white/75 text-sm">· Uppdaterad {article.updatedAt}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-white/95 text-xl md:text-2xl leading-relaxed">
            {article.metaDescription}
          </p>
        </div>

        {/* Quick practice CTA */}
        <div
          className="flex items-center justify-between gap-4 p-5 rounded-2xl mb-10"
          style={{ background: 'rgba(254,204,2,0.1)', border: '1px solid rgba(254,204,2,0.25)' }}
        >
          <div>
            <p className="text-white font-semibold text-base">Öva på riktiga provfrågor</p>
            <p className="text-white/80 text-sm mt-0.5">Gratis – ingen registrering krävs</p>
          </div>
          <Link
            href="/ovning"
            className="px-5 py-2.5 rounded-xl text-base font-bold flex-shrink-0 hover:scale-105 transition-all"
            style={{ background: '#FECC02', color: '#002244' }}
          >
            Öva nu →
          </Link>
        </div>

        {/* Article content */}
        <article
          className="prose-custom leading-relaxed text-white/90 text-xl md:text-2xl"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Bottom CTA */}
        <div
          className="mt-14 rounded-3xl p-8 text-center"
          style={{ background: 'rgba(254,204,2,0.08)', border: '1px solid rgba(254,204,2,0.2)' }}
        >
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Redo att börja öva?
          </h2>
          <p className="text-white/90 text-base mb-6">
            Testa dina kunskaper med gratis övningsfrågor och flashcards – direkt, utan registrering.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ovning" className="px-7 py-3 rounded-2xl font-bold text-base hover:scale-105 transition-all" style={{ background: '#FECC02', color: '#002244' }}>
              📝 Starta gratis övning
            </Link>
            <Link href="/ovning/flashcards" className="px-7 py-3 rounded-2xl font-bold text-base hover:scale-105 transition-all" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
              📇 Prova flashcards
            </Link>
          </div>
        </div>

        {/* More articles */}
        <div className="mt-12">
          <h2 className="text-white font-bold text-xl md:text-2xl mb-5">Fler artiklar</h2>
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
                  <p className="text-white font-semibold text-base leading-snug">{a.title}</p>
                  <p className="text-white/80 text-sm mt-1">{a.readingTime} min läsning</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-white/75 text-sm">
        <p>© 2025 Sverigemedborgarskapsprov.com</p>
      </footer>
    </div>
  )
}

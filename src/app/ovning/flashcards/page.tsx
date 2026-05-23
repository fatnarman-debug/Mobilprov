import Link from 'next/link'
import prisma from '@/lib/db'
import { auth } from '@/auth'
import { publicSeo } from '@/lib/seo'
import FlashcardDemoClient from './FlashcardDemoClient'

export const metadata = publicSeo.flashcards

async function getFreeFlashcards() {
  try {
    return await prisma.flashcard.findMany({
      take: 15,
      include: { topic: { select: { title: true } } },
      orderBy: { createdAt: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function FlashcardsPage() {
  const session = await auth()
  const userLang = session?.user?.nativeLanguage || 'TR'
  const cards = await getFreeFlashcards()


  return (
    <div style={{ background: 'linear-gradient(135deg, #002244 0%, #003566 40%, #006AA7 100%)', minHeight: '100vh' }}>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <span style={{ color: '#FECC02' }}>🇸🇪</span>
            <span>SVERIGEMEDBORGARSKAPSPROV</span>
            <span style={{ color: '#FECC02' }}>.com</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/ovning" className="text-white/70 text-sm hover:text-white transition-colors hidden sm:block">
              Övningsfrågor
            </Link>
            <Link
              href="/"
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{ background: '#FECC02', color: '#002244' }}
            >
              Registrera dig
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: 'rgba(254,204,2,0.15)', border: '1px solid rgba(254,204,2,0.3)', color: '#FECC02' }}>
            📇 {cards.length} GRATIS FLASHCARDS
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Öva med interaktiva<br />
            <span style={{ color: '#FECC02' }}>flashcards</span>
          </h1>
          <p className="text-white/90 text-lg max-w-xl mx-auto">
            Tryck på kortet för att se svaret. Bläddra igenom alla kort i din egen takt.
          </p>
        </div>

        {/* Flashcard Player */}
        {cards.length === 0 ? (
          <div className="text-center text-white/70 py-16">
            <div className="text-5xl mb-4">📇</div>
            <p>Flashcards laddas snart.</p>
          </div>
        ) : (
          <FlashcardDemoClient cards={cards} userLang={userLang} />
        )}

        {/* CTA */}
        <div
          className="mt-16 rounded-3xl p-10 text-center"
          style={{ background: 'rgba(254,204,2,0.08)', border: '1px solid rgba(254,204,2,0.2)' }}
        >
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Vill du ha tillgång till alla 200+ flashcards?
          </h2>
          <p className="text-white/90 mb-8 max-w-lg mx-auto">
            Skapa ett konto för att öva på alla ämnen, följa dina framsteg och ta hela provsimuleringen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: '#FECC02', color: '#002244' }}
            >
              🚀 Skapa konto gratis
            </Link>
            <Link
              href="/ovning"
              className="px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            >
              📝 Gratis övningsfrågor
            </Link>
          </div>
        </div>

        {/* SEO text */}
        <div className="mt-12 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          <h2 className="text-white/85 text-base font-semibold mb-2">Varför använda flashcards för medborgarskapsprov?</h2>
          <p>
            Flashcards är ett av de mest effektiva sätten att memorera information. Genom upprepning och 
            aktiv återkallning förbättrar du din förmåga att minnas fakta om Sverige – perfekt för att 
            förbereda dig för medborgarskapstestet. Våra flashcards täcker alla viktiga ämnen: Sveriges 
            historia, demokrati, riksdag, kommuner och dina rättigheter som medborgare.
          </p>
        </div>
      </main>

      <footer className="text-center py-8 text-white/55 text-xs">
        <p>© 2025 Sverigemedborgarskapsprov.com · Alla rättigheter förbehållna</p>
      </footer>
    </div>
  )
}

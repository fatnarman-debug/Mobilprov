import prisma from '@/lib/db'
import Link from 'next/link'
import { auth } from '@/auth'
import { publicSeo } from '@/lib/seo'
import OvningClient from './OvningClient'

export const metadata = publicSeo.ovning

async function getFreeQuestions() {
  try {
    return await prisma.question.findMany({
      take: 10,
      where: { isTest: false },
      include: { topic: { select: { title: true } } },
      orderBy: { createdAt: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function OvningPage() {
  const session = await auth()
  const userLang = session?.user?.nativeLanguage || 'TR'
  const questions = await getFreeQuestions()


  return ( 
    <div className="min-h-screen bg-[#002244] selection:bg-[#FECC02]/30">
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <span style={{ color: '#FECC02' }}>🇸🇪</span>
            <span>SVERIGEMEDBORGARSKAPSPROV</span>
            <span style={{ color: '#FECC02' }}>.com</span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: '#FECC02', color: '#002244' }}
          >
            Registrera dig
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: 'rgba(254,204,2,0.15)', border: '1px solid rgba(254,204,2,0.3)', color: '#FECC02' }}>
            🆓 GRATIS – Ingen registrering krävs
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Öva på riktiga<br />
            <span style={{ color: '#FECC02' }}>medborgarskapsfrågor</span>
          </h1>
          <p className="text-white/90 text-lg max-w-xl mx-auto">
            Välj ditt svar och se direkt om du har rätt. {questions.length} gratis frågor – ingen inloggning behövs.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-6">
            {[
              { number: '500+', label: 'Övningsfrågor' },
              { number: '200+', label: 'Flashcards' },
              { number: '95%', label: 'Klarar provet' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-extrabold" style={{ color: '#FECC02' }}>{s.number}</div>
                <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Quiz */}
        {questions.length === 0 ? (
          <div className="text-center text-white/70 py-16">
            <div className="text-5xl mb-4">📝</div>
            <p>Övningsfrågor laddas snart. Kom tillbaka senare!</p>
          </div>
        ) : (
          <OvningClient questions={questions} userLang={userLang} />
        )}

        {/* CTA Section */}
        <div
          className="mt-14 rounded-3xl p-8 text-center"
          style={{ background: 'rgba(254,204,2,0.08)', border: '1px solid rgba(254,204,2,0.2)' }}
        >
          <h2 className="text-xl font-extrabold text-white mb-2">
            Vill du öva på alla 500+ frågor?
          </h2>
          <p className="text-white/80 mb-6 text-sm">
            Skapa ett konto för att få tillgång till alla frågor, flashcards och provsimuleringar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-7 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: '#FECC02', color: '#002244' }}
            >
              🚀 Skapa konto – Börja öva
            </Link>
            <Link
              href="/ovning/flashcards"
              className="px-7 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            >
              📇 Prova flashcards
            </Link>
          </div>
        </div>

        {/* SEO text */}
        <div className="mt-10 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          <h2 className="text-white/85 text-base font-semibold mb-2">Om medborgarskapstestet i Sverige</h2>
          <p>
            För att bli svensk medborgare behöver du klara medborgarskapstestet. Testet täcker ämnen som
            Sveriges historia, demokrati, samhälle, lagar och rättigheter. På Sverigemedborgarskapsprov.com kan du
            förbereda dig med hundratals övningsfrågor, interaktiva flashcards och fullständiga
            provsimuleringar – allt anpassat för att hjälpa dig klara provet på första försöket.
          </p>
        </div>
      </main>

      <footer className="text-center py-8 text-white/55 text-xs">
        <p>© 2025 Sverigemedborgarskapsprov.com · Alla rättigheter förbehållna</p>
      </footer>
      </div>
  )
}
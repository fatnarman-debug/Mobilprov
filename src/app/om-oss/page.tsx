import { Metadata } from 'next'
import Link from 'next/link'
import { absoluteUrl, siteName } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Om Oss | Medborgarskapsprov Utbildningsteam',
  description: 'Läs mer om Medborgarskapsprov Utbildningsteam. Vi är experter och pedagoger som hjälper dig att klara ditt svenska medborgarskap prov och test.',
  alternates: {
    canonical: absoluteUrl('/om-oss')
  }
}

export default function OmOssPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Person",
      "name": "Medborgarskapsprov Utbildningsteam",
      "jobTitle": "Utbildningsexperter och Pedagoger",
      "worksFor": {
        "@type": "Organization",
        "name": siteName
      },
      "url": absoluteUrl('/om-oss'),
      "description": "Ett team av erfarna SFI-lärare och pedagoger dedikerade till att hjälpa invandrare att klara det svenska medborgarskapsprovet."
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #002244 0%, #003566 40%, #006AA7 100%)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <span style={{ color: '#FECC02' }}>🇸🇪</span>
            <span>SVERIGEMEDBORGARSKAPSPROV</span>
            <span style={{ color: '#FECC02' }}>.com</span>
          </Link>
          <Link href="/ovning" className="px-4 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-all" style={{ background: '#FECC02', color: '#002244' }}>
            Börja öva
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">
          Om Oss – <span style={{ color: '#FECC02' }}>Medborgarskapsprov Utbildningsteam</span>
        </h1>
        
        <div className="space-y-8 text-lg leading-relaxed text-white/90">
          <section className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-[#FECC02] flex items-center justify-center text-3xl">
                👨‍🏫
              </div>
              <h2 className="text-2xl font-bold">Vilka är vi?</h2>
            </div>
            <p>
              Vi är <strong>Medborgarskapsprov Utbildningsteam</strong>, en engagerad grupp av erfarna SFI-lärare, samhällsvetare och pedagoger. Vårt gemensamma mål är att göra förberedelserna inför det svenska medborgarskapsprovet så enkla, tydliga och tillgängliga som möjligt för alla.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#FECC02' }}>Vår Mission</h2>
            <p className="mb-4">
              När regeringen tillkännagav att ett obligatoriskt medborgarskap prov införs från och med den 6 juni 2026, insåg vi snabbt att många blivande medborgare kände oro och stress inför testet. Det fanns ett tydligt behov av högkvalitativt och lättförståeligt studiematerial.
            </p>
            <p>
              Vår mission är att säkerställa att varje individ som strävar efter att bli svensk medborgare har tillgång till bästa möjliga verktyg för att klara sitt medborgarskap test på första försöket. Vi tror på utbildning som bygger självförtroende och främjar djupare förståelse för det svenska samhället och dess värderingar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#FECC02' }}>Vår Kvalitetsgaranti</h2>
            <p className="mb-4">
              Allt material du hittar på vår plattform – från övningsfrågor till flashcards och simuleringar – är noggrant expertgranskat. Vi baserar uteslutande vårt innehåll på den officiella kursboken <em>Sverige i fokus</em>, vilket garanterar att det du lär dig är relevant och exakt.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-start gap-3">
                <span className="text-[#FECC02]">✓</span>
                <span><strong>Pedagogiskt granskat:</strong> Varje fråga och förklaring har utformats för att vara lätt att förstå, även för dig som fortfarande lär dig svenska.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FECC02]">✓</span>
                <span><strong>Flerspråkigt stöd:</strong> Vi vet att inlärning ibland är lättare på modersmålet, därför erbjuder vi stöd på flera språk.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FECC02]">✓</span>
                <span><strong>Alltid uppdaterat:</strong> Vi följer noga de senaste riktlinjerna från UHR (Universitets- och högskolerådet) för att säkerställa att vårt material speglar de verkliga kraven.</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-16 text-center">
          <Link href="/ovning" className="inline-block px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl" style={{ background: '#FECC02', color: '#002244' }}>
            Börja din förberedelse idag
          </Link>
        </div>
      </main>
      
      <footer className="text-center py-8 text-white/75 text-sm">
        <p>© {new Date().getFullYear()} Sverigemedborgarskapsprov.com</p>
      </footer>
    </div>
  )
}

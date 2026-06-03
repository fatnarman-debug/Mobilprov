import HomeClient from './HomeClient';
import { publicSeo } from '@/lib/seo';
import prisma from '@/lib/db';

export const metadata = publicSeo.home;

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: {
      title: true,
      slug: true,
      metaDescription: true,
      publishedAt: true,
      readingTime: true,
    }
  });

  const serializedArticles = articles.map(a => ({
    ...a,
    publishedAt: a.publishedAt.toISOString(),
  }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Vem måste göra medborgarskapstestet i Sverige?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Alla över 15 år som söker svenskt medborgarskap efter den 6 juni 2026 måste göra provet. Undantag finns för personer med vissa sjukdomar eller funktionsnedsättningar."
        }
      },
      {
        "@type": "Question",
        "name": "Vad kostar ett svensk medborgarskap test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Det första provet i augusti 2026 är gratis för dem som blir inbjudna. Regeringen bestämmer senare vad provet ska kosta i framtiden."
        }
      },
      {
        "@type": "Question",
        "name": "Kommer det finnas ett språktest i svenska också?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kravet på språkprov kommer senare. Under 2026 testas provet bara dina kunskaper om samhället. Men kom ihåg att provet skrivs på svenska."
        }
      },
      {
        "@type": "Question",
        "name": "Hur kan jag förbereda mig för medborgarskapsprov?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Det bästa sättet är att läsa boken Sverige i fokus. Öva också med våra frågor, flashcards och provsimuleringar här på hemsidan."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient articles={serializedArticles} />
    </>
  );
}


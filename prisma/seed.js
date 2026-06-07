const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'fatnarman@gmail.com';
  // Use environment variable if set, otherwise fallback to the requested default
  const password = process.env.ADMIN_PASSWORD || '12345678qw.,ASX';
  
  console.log('Seeding database...');
  
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        name: 'Admin',
        passwordHash,
        role: 'ADMIN',
        isPaid: true,
        nativeLanguage: 'TR'
      }
    });
    console.log('Admin user created successfully.');
  } else {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        role: 'ADMIN',
        isPaid: true
      }
    });
    console.log('Admin user updated successfully.');
  }

  console.log('Seeding/updating database SEO articles...');
  try {
    await prisma.article.update({
      where: { slug: 'medborgarskapsprovet-2026-ny-lag' },
      data: {
        keywords: 'nya kraven för svenskt medborgarskap 2026, medborgarskapsprovet 2026, nytt krav medborgarskap sverige 2026, samhällskunskapstestet 2026, språktest medborgarskap sverige, försörjningskrav medborgarskap, migrationsverket nya regler medborgarskap',
        metaDescription: 'Vad som förändras 2026: Samhällskunskapstest, Migrationsverket nya regler för medborgarskap, språkkrav, egen försörjning och skärpta villkor.'
      }
    });
    console.log('Updated: medborgarskapsprovet-2026-ny-lag');
  } catch (err) {
    console.log('Could not update medborgarskapsprovet-2026-ny-lag (it may not exist in database yet)');
  }

  try {
    await prisma.article.update({
      where: { slug: 'medborgarskapsprov-fragor-och-svar-faq' },
      data: {
        keywords: 'medborgarskapsprov frågor och svar, vanliga frågor medborgarskapsprov, medborgarskapsprov faq, migrationsverket medborgarskapsprov, uhr medborgarskapstest, medborgarskapsprov test, medborgarskapsprov frågor',
        metaDescription: 'Svar på alla vanliga frågor om det nya medborgarskapsprovet 2026. Läs om UHR medborgarskapstest, provsimuleringar, frågor och svar på svenska.'
      }
    });
    console.log('Updated: medborgarskapsprov-fragor-och-svar-faq');
  } catch (err) {
    console.log('Could not update medborgarskapsprov-fragor-och-svar-faq (it may not exist in database yet)');
  }

  try {
    await prisma.article.update({
      where: { slug: 'medborgarskapsprov-utbildningsmaterial-sverige-i-fokus' },
      data: {
        keywords: 'sverige i fokus pdf, sverige i fokus mp3, utbildningsmaterial medborgarskapsprov, medborgarskapsprov studiematerial, sverige i fokus, uhr medborgarskapsprov',
        metaDescription: 'Lär dig allt om det officiella studiematerialet Sverige i fokus för UHR medborgarskapsprov. Ladda ner PDF, lyssna på MP3 och plugga effektivt.'
      }
    });
    console.log('Updated: medborgarskapsprov-utbildningsmaterial-sverige-i-fokus');
  } catch (err) {
    console.log('Could not update medborgarskapsprov-utbildningsmaterial-sverige-i-fokus (it may not exist in database yet)');
  }
}

  // --- NYA SEO ARTIKLAR FÖR LONG TAIL KEYWORDS ---
  console.log('Seeding new SEO articles for long-tail keywords...');
  const newArticles = [
    {
      slug: 'skillnaden-mellan-medborgarskapsprov-och-medborgarskap-test',
      title: 'Vad är skillnaden mellan Medborgarskapsprov och Medborgarskap Test?',
      metaDescription: 'Många undrar vad skillnaden är mellan medborgarskapsprov och medborgarskap test. Vi förklarar de nya kraven för svenskt medborgarskap 2026.',
      readingTime: 3,
      keywords: 'medborgarskapsprov, medborgarskap test, skillnad, medborgarskap sverige, svenskt medborgarskap, medborgarskap prov 2026',
      isPublished: true,
      content: `Många som förbereder sig för de nya kraven som införs 2026 stöter ofta på två olika begrepp: **Medborgarskapsprov** och **Medborgarskap test**. Men vad är egentligen skillnaden mellan dessa två termer? Svaret är enklare än du kanske tror.

## Samma prov, olika namn

I dagligt tal används "medborgarskapsprov" och "medborgarskap test" synonymt. Båda begreppen syftar på det obligatoriska samhällskunskapstest som regeringen, via Universitets- och högskolerådet (UHR), håller på att ta fram. 

Den officiella benämningen från myndigheterna är oftast **medborgarskapsprov** eller ett *kunskapsprov i samhällskunskap för svenskt medborgarskap*. Många sökande, särskilt de med engelsk bakgrund eller som precis har börjat lära sig svenska, använder dock ofta termen **medborgarskap test** (ett "test" av medborgarskapskunskaper).

## Vad innebär kravet 2026?

Oavsett om du kallar det *prov* eller *test*, kommer innehållet att vara detsamma. Från och med den 6 juni 2026 kommer alla som ansöker om svenskt medborgarskap att behöva bevisa att de har grundläggande kunskaper om:

- Sveriges demokratiska system
- Individens rättigheter och skyldigheter
- Hur samhället och myndigheter fungerar
- Vardagsliv och svensk kultur

Materialet som provet baseras på är den officiella boken **Sverige i fokus**. 

## Hur förbereder jag mig?

För att klara ditt [medborgarskap prov](/) behöver du studera effektivt. På vår plattform erbjuder vi:
1. Interaktiva övningsfrågor
2. Smidiga flashcards för snabb inlärning
3. Simulerade prov som efterliknar det riktiga testet

Oavsett vilket ord du använder när du söker information, är målet detsamma: att bli svensk medborgare. Börja din förberedelse i tid och säkerställ att du är redo när de nya reglerna träder i kraft.`
    },
    {
      slug: 'medborgarskap-prov-2026-exempelfragor',
      title: 'Medborgarskap prov 2026: Exempelfrågor och Tips',
      metaDescription: 'Öva på exempelfrågor inför det nya medborgarskapsprovet 2026. Testa dina kunskaper om svensk demokrati, rättigheter och samhälle.',
      readingTime: 4,
      keywords: 'medborgarskap prov 2026, exempelfrågor medborgarskapsprov, medborgarskap test frågor, öva på medborgarskapsprov, sverige i fokus frågor',
      isPublished: true,
      content: `Det nya **medborgarskapsprovet**, som blir obligatoriskt från juni 2026, kommer att testa dina kunskaper om det svenska samhället. Många undrar hur ett "medborgarskap test" egentligen kommer att se ut och vilken typ av frågor som kommer att ställas. 

Här har vi på *Medborgarskapsprov Utbildningsteam* samlat några exempelfrågor baserade på det officiella materialet *Sverige i fokus* för att ge dig en känsla av vad du kan förvänta dig.

## Exempelfrågor: Testa dig själv!

### 1. Demokratins grunder
**Vilken är Sveriges grundlag som skyddar våra viktigaste friheter och rättigheter?**
- A) Successionsordningen
- B) Regeringsformen (Rätt svar)
- C) Tryckfrihetsförordningen
- D) Yttrandefrihetsgrundlagen

*Förklaring:* Regeringsformen är den viktigaste grundlagen och slår fast att all offentlig makt i Sverige utgår från folket.

### 2. Arbete och Skatt
**Vad används skattepengarna huvudsakligen till i Sverige?**
- A) Enbart till att betala politikernas löner
- B) Vård, skola, omsorg och infrastruktur (Rätt svar)
- C) Att betala av statsskulden till andra länder
- D) Till att finansiera privata företag

*Förklaring:* Skatter betalar för vår gemensamma välfärd, såsom sjukhus, skolor och vägar.

### 3. Rättigheter och Skyldigheter
**Vad innebär Allemansrätten?**
- A) Att du får jaga och fiska var du vill
- B) Att du får röra dig fritt i naturen, så länge du inte stör eller förstör (Rätt svar)
- C) Att du får tälta i någons privata trädgård
- D) Att du får köra bil i skogen

*Förklaring:* Allemansrätten är unik för Sverige och ger alla rätt att vistas i naturen under ansvar.

## Tips för att klara ditt medborgarskap test

1. **Läs boken:** Skaffa tillgång till *Sverige i fokus*. Boken täcker exakt de områden som provet baseras på.
2. **Gör simuleringar:** Det räcker inte att bara läsa. Genom att [öva på riktiga provfrågor](/ovning) vänjer du dig vid hur frågorna är formulerade.
3. **Bygg upp ditt ordförråd:** Många frågor använder specifika samhällsbegrepp (t.ex. "välfärd", "grundlag", "riksdag"). Se till att du förstår dessa ord, inte bara memoriserar dem. Våra flashcards är perfekta för detta.

Börja i god tid – 2026 är närmare än du tror!`
    }
  ];

  for (const article of newArticles) {
    try {
      // Find if exists
      const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
      if (existing) {
        await prisma.article.update({
          where: { slug: article.slug },
          data: {
            title: article.title,
            metaDescription: article.metaDescription,
            readingTime: article.readingTime,
            keywords: article.keywords,
            isPublished: article.isPublished,
            content: article.content
          }
        });
        console.log('Updated SEO article:', article.slug);
      } else {
        await prisma.article.create({
          data: {
            slug: article.slug,
            title: article.title,
            metaDescription: article.metaDescription,
            readingTime: article.readingTime,
            keywords: article.keywords,
            isPublished: article.isPublished,
            content: article.content
          }
        });
        console.log('Created SEO article:', article.slug);
      }
    } catch (err) {
      console.log('Could not upsert article', article.slug, err.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

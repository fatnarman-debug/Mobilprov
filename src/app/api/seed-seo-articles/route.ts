import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'seo-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Clear old articles if we are re-seeding (only for development/seeding ease)
    // Note: We might not want to delete ALL articles, but for now we will delete specifically the ones we generate.
    const slugsToDelete = [
      'nya-regler-medborgarskap-6-juni-2026',
      'vad-ar-medborgarskapsprovet-2026',
      'vem-maste-skriva-medborgarskapsprovet',
      'anmalan-till-medborgarskapsprovet',
      'forberedelser-infor-medborgarskapsprovet',
      'anpassningar-medborgarskapsprov',
      'medborgarskapsprov-vs-swedex-tisus',
      'gratis-exempelfragor-medborgarskapsprov'
    ];

    await prisma.article.deleteMany({
      where: {
        slug: { in: slugsToDelete }
      }
    });

    const articlesToSeed = [
      {
        slug: 'nya-regler-medborgarskap-6-juni-2026',
        title: 'Nya regler för svenskt medborgarskap 2026: Detta gäller från 6 juni',
        metaDescription: 'Riksdagen har beslutat om nya regler för svenskt medborgarskap från 6 juni 2026. Läs om hemvisttid (8 år), försörjningskrav och medborgarskapsprov.',
        readingTime: 7,
        keywords: 'nya regler svenskt medborgarskap 2026, migrationsverket medborgarskap 2026, försörjningskrav medborgarskap, hemvisttid 8 år, medborgarskapsprov 2026, svenskt medborgarskap krav',
        content: `
Riksdagen har beslutat om historiska förändringar i den svenska medborgarskapslagen. Från och med den **6 juni 2026** börjar nya, skärpta regler att gälla för alla som vill bli svenska medborgare. Kraven på hur länge du ska ha bott i landet (hemvisttid) höjs, och det införs helt nya villkor för egen försörjning, skötsamt levnadssätt samt kunskaper i det svenska språket och samhället.

Här är en komplett guide till de nya reglerna för svenskt medborgarskap 2026 och vad de innebär för din ansökan.

## Inga övergångsregler – Pågående ansökningar drabbas
Den mest kritiska informationen för dig som redan har ansökt är att de nya reglerna **införs utan övergångsbestämmelser**. 

Detta innebär att Migrationsverket kommer att pröva alla ärenden som inte är färdigbehandlade före den 6 juni 2026 enligt det nya regelverket. Om du skickade in din ansökan under 2024 eller 2025, men inte har fått ett beslut innan den 6 juni 2026, måste du uppfylla de nya skärpta kraven (inklusive 8 års hemvist och försörjningskrav) för att bli godkänd.

## 1. Skärpt hemvisttid: Från 5 till 8 år i Sverige
Tidigare har huvudregeln varit att du ska ha bott i Sverige i fem sammanhängande år för att kunna ansöka om medborgarskap. 

* **Ny huvudregel**: Kravet höjs till **åtta (8) år** av sammanhängande hemvist i Sverige.
* **Skötsamt levnadssätt**: Kraven på ett fläckfritt register skärps. Om du har begått brott, har obetalda skulder hos Kronofogden eller andra anmärkningar om ditt levnadssätt, kommer din karenstid (tiden du måste vänta efter ett brott) att förlängas avsevärt.

## 2. Nytt försörjningskrav för medborgarskap
För första gången införs ett krav på att du måste kunna försörja dig själv för att få svenskt medborgarskap. Kravet gäller alla vuxna sökande (barn är undantagna).

För att uppfylla det nya försörjningskravet måste du:
1. **Ha en stabil inkomst**: Din inkomst måste komma från arbete eller egen näringsverksamhet och ha en viss varaktighet.
2. **Krav på inkomstnivå**: Du måste tjäna minst **tre inkomstbasbelopp** per år. Detta motsvarar för närvarande cirka **20 000 kronor i månaden före skatt**.
3. **Ingen långvarig välfärd**: Du får inte ha tagit emot ekonomiskt bistånd (försörjningsstöd) i mer än totalt **sex månader** under de senaste tre åren.

### Vilka undantas från försörjningskravet?
Det finns vissa specifika grupper som kan få dispens från försörjningskravet:
* Ålderspensionärer
* Personer med varaktig funktionsnedsättning eller sjukdom som hindrar arbete
* Studenter som läser på heltid vid svenskt universitet eller högskola och kan visa godkända studieresultat i en utbildning som leder till examen.

## 3. Obligatoriskt kunskapskrav och medborgarskapsprov
Från och med den 6 juni 2026 blir det obligatoriskt för sökande mellan **16 och 66 år** att visa kunskaper i det svenska språket samt grundläggande kunskaper om det svenska samhället.

### Hur bevisar man sina kunskaper?
Du kan styrka dina kunskaper på följande sätt:
* Godkända betyg från svensk skola (grundskola/gymnasium)
* Godkänt betyg från **SFI kurs D**
* Godkända kurser från Komvux eller folkhögskola
* **Medborgarskapsprov**: Om du inte har betyg som uppfyller kraven måste du skriva ett godkänt medborgarskapsprov.

### Hur fungerar medborgarskapsprovet?
Provet kommer att införas stegvis under 2026:
* **Augusti 2026**: Den första delen av provet lanseras. Detta testar dina kunskaper om det svenska samhället (samhällskunskapstest).
* **Senare skede**: Ett specifikt prov i det svenska språket kommer att läggas till vid ett senare tillfälle.

Universitets- och högskolerådet (UHR) ansvarar för att ta fram provet, genomföra det och registrera resultaten, medan Migrationsverket ansvarar för att utreda om du behöver skriva provet och anvisa dig till en provplats.

## Hur förbereder jag mig bäst inför de nya kraven?
Eftersom provet baseras på det officiella studiematerialet *"Sverige i fokus"* är det viktigt att börja studera i god tid. De nya reglerna ställer höga krav på din förståelse av hur det svenska samhället är uppbyggt.

Hos oss på **Sverigemedborgarskapsprov.com** kan du redan nu öva med hundratals övningsfrågor, ta del av provsimuleringar och plugga med flashcards på svenska med översättningsstöd till ditt modersmål. Börja öva gratis idag för att säkerställa att du klarar provet på första försöket!
        `,
        faqs: [
          {
            question: 'Måste jag uppfylla de nya kraven om jag ansökte innan 6 juni 2026?',
            answer: 'Ja. Eftersom det inte finns några övergångsbestämmelser kommer alla ansökningar som inte är färdigbehandlade den 6 juni 2026 att prövas enligt de nya, hårdare reglerna. Detta gäller även om du skickade in din ansökan för flera år sedan.'
          },
          {
            question: 'Hur mycket måste jag tjäna för att klara försörjningskravet för medborgarskap?',
            answer: 'Du måste ha en årlig inkomst på minst tre inkomstbasbelopp. Det innebär en månadslön på cirka 20 000 kronor före skatt från arbete eller eget företag. Dessutom får du inte ha haft försörjningsstöd i mer än sex månader totalt under de senaste tre åren.'
          },
          {
            question: 'Vad händer om jag inte har godkänt betyg i SFI kurs D?',
            answer: 'Om du inte kan bevisa dina språkkunskaper via betyg från SFI kurs D eller motsvarande skolutbildning, måste du skriva och få godkänt på det officiella medborgarskapsprovet (samhälls- och språktestet) för att kunna bli medborgare.'
          },
          {
            question: 'När kan jag skriva det nya medborgarskapsprovet?',
            answer: 'Den första delen av medborgarskapsprovet (samhällskunskapstestet) planeras att hållas i augusti 2026. Du kan endast anmäla dig till provet efter att du har fått en anvisning från Migrationsverket.'
          }
        ]
      },
      {
        slug: 'vad-ar-medborgarskapsprovet-2026',
        title: 'Vad är medborgarskapsprovet 2026? Allt du behöver veta',
        metaDescription: 'Från augusti 2026 införs ett nytt medborgarskapsprov i Sverige. Läs om hur provet är uppbyggt, vad det innehåller och hur du klarar det på första försöket.',
        readingTime: 8,
        keywords: 'medborgarskapsprov, medborgarskapstest, 2026, vad är medborgarskapsprovet, samhällskunskapsprov, sverige',
        content: `
Vägen till att bli svensk medborgare förändras från och med 2026. Regeringen och Universitets- och högskolerådet (UHR) har meddelat att ett **obligatoriskt medborgarskapsprov** införs som ett krav för alla som vill ansöka om svenskt medborgarskap.

Men vad innebär det här för dig? Måste du studera Sveriges historia, demokrati och lagar? Svaret är ja. I denna guide går vi igenom exakt vad det nya provet innebär.

## Syftet med det nya provet
Det primära syftet med samhällskunskapsprovet är att säkerställa att nya medborgare har en grundläggande förståelse för det svenska samhället. Detta inkluderar kunskap om:
- Svensk demokrati och yttrandefrihet
- Rättigheter och skyldigheter
- Sveriges historia och kultur
- Grundläggande lagar

## Hur är provet strukturerat?
Enligt de senaste direktiven från UHR kommer provet att genomföras fysiskt, på papper. Du kommer få 90 minuter på dig att svara på cirka 60 flervalsfrågor. Provet kräver en djupgående förståelse och det rekommenderas starkt att du övar på riktiga exempelfrågor.

### Vill du testa dig själv redan nu?
På Sverigemedborgarskapsprov.com har vi samlat hundratals övningsfrågor baserade på det officiella utbildningsmaterialet "Sverige i fokus". Du kan starta en gratis övning direkt och se om du har vad som krävs.
        `,
        faqs: [
          {
            question: "Vad är medborgarskapsprovet?",
            answer: "Medborgarskapsprovet är ett kunskapsprov som UHR ansvarar för och som ska användas för att uppfylla kraven på kunskaper i svenska och om det svenska samhället vid ansökan om svenskt medborgarskap. Det första provet testar grundläggande kunskaper om samhället och genomförs den 15 augusti 2026."
          },
          {
            question: "Hur är provet uppbyggt?",
            answer: "Provet består av cirka 60 flervalsfrågor (med fyra svarsalternativ) och skrivs på papper. Provtiden är 90 minuter. Provet genomförs enbart på svenska."
          }
        ]
      },
      {
        slug: 'vem-maste-skriva-medborgarskapsprovet',
        title: 'Vem får och måste skriva medborgarskapsprovet?',
        metaDescription: 'Är du osäker på om du måste göra det nya medborgarskapstestet? Vi förklarar reglerna från Migrationsverket och vem som kan bli undantagen.',
        readingTime: 6,
        keywords: 'vem får skriva medborgarskapsprovet, migrationsverket, undantag, modersmål, medborgarskapstest regler',
        content: `
Alla som ansöker om svenskt medborgarskap efter att de nya lagarna träder i kraft kommer i regel behöva visa sina kunskaper om det svenska samhället. Men det finns viktiga detaljer kring **vem** som faktiskt får och måste skriva provet.

## Beslut från Migrationsverket
Det är viktigt att förstå att du inte bara kan anmäla dig till provet hur som helst. Migrationsverket måste först bedöma din ansökan och avgöra om du omfattas av kravet. 

### Kan man slippa provet?
Ja, i vissa fall kan man uppfylla kravet på kunskaper om det svenska samhället på annat sätt (exempelvis genom vissa godkända betyg från svensk skola eller SFI). Om du uppfyller dessa krav behöver du inte skriva UHR:s prov.

### Språkkravet
Många undrar om man kan skriva provet på engelska eller arabiska. Svaret är tyvärr nej. Provet skrivs uteslutande på svenska, vilket innebär att du måste ha tillräckliga språkkunskaper för att förstå frågorna.

> Missa inte din chans! Förbered dig genom att läsa och svara på frågor i vårt interaktiva system.
        `,
        faqs: [
          {
            question: "Vem får skriva medborgarskapsprovet?",
            answer: "Det är Migrationsverket som avgör vem som får skriva provet. Du kommer bara kunna anmäla dig om du får ett brev från Migrationsverket som säger att du ska göra det. Det finns även begränsat antal platser."
          },
          {
            question: "Kan jag göra provet på mitt modersmål?",
            answer: "Nej, medborgarskapsprovet kan bara göras på svenska. Inga andra språk erbjuds."
          }
        ]
      },
      {
        slug: 'anmalan-till-medborgarskapsprovet',
        title: 'Anmälan till medborgarskapsprovet: Datum och Platser',
        metaDescription: 'När öppnar anmälan till medborgarskapsprovet 2026? Här hittar du all information om hur du anmäler dig, viktiga datum och var provet hålls.',
        readingTime: 5,
        keywords: 'anmälan medborgarskapsprov, datum, orter, uhr anmälan, boka prov',
        content: `
När det första medborgarskapsprovet går av stapeln i augusti 2026 gäller det att vara redo. UHR kommer att öppna anmälan under sommaren, och eftersom det finns ett begränsat antal platser är det viktigt att agera i tid.

## Steg för steg: Så anmäler du dig
1. **Invänta brev från Migrationsverket**: Du måste få ett formellt godkännande och en uppmaning om att skriva provet.
2. **Håll koll på anmälningsdatum**: Anmälan öppnar i början av juni 2026 på UHR:s webbplats.
3. **Boka din plats**: Antalet provplatser är begränsat, först till kvarn gäller.

## Var skrivs provet?
Under den första perioden (augusti 2026) genomförs provet uteslutande i Stockholm. Planer finns på att rulla ut det i flera städer framöver, men inledningsvis är det huvudstaden som gäller.
        `,
        faqs: [
          {
            question: "När öppnar anmälan?",
            answer: "Anmälan öppnar i början på juni 2026. Du anmäler dig via UHR:s webbplats när anmälningsperioden har startat."
          },
          {
            question: "Hur anmäler jag mig till medborgarskapsprovet?",
            answer: "Du som får ett brev från Migrationsverket kan anmäla dig till provet via UHR. Tänk på att du måste ha fått brevet för att anmälan ska vara giltig och öppen för dig."
          },
          {
            question: "Varför kan jag inte anmäla mig till medborgarskapsprovet?",
            answer: "Du kan endast anmäla dig om du har fått ett brev från Migrationsverket. Dessutom finns det ett begränsat antal platser. När platserna är fyllda går det inte längre att anmäla sig."
          },
          {
            question: "På vilka orter finns medborgarskapsprovet?",
            answer: "I augusti 2026 kan medborgarskapsprovet bara skrivas i Stockholm. Exakt plats meddelas senare."
          }
        ]
      },
      {
        slug: 'forberedelser-infor-medborgarskapsprovet',
        title: 'Hur du förbereder dig bäst inför medborgarskapsprovet',
        metaDescription: 'Lär dig hur du bäst pluggar inför det svenska medborgarskapsprovet. Få tips om studiematerial och ta gratis övningstest online.',
        readingTime: 7,
        keywords: 'förberedelser, plugga till medborgarskapsprov, sverige i fokus, övningstest, övningsfrågor, gratis',
        content: `
Att skriva ett prov på 60 frågor om Sveriges historia, geografi, lagar och samhällsstruktur kan kännas skrämmande. Men med rätt förberedelser är det fullt möjligt att klara provet med bravur.

## UHR:s Utbildningsmaterial
Regeringen och UHR hänvisar till boken/materialet "Sverige i fokus". Detta material är basen för de frågor som kommer att ställas på det riktiga provet. Att läsa igenom det är ett måste.

## Öva med provsimuleringar
Det absolut bästa sättet att lära sig är att testa sig själv. Genom att göra våra **verklighetstrogna simuleringsprov** får du en känsla för hur det riktiga provet kommer att vara. Vi ger dig:
- **90 minuters tidspress** precis som i verkligheten
- **60 frågor** blandade från olika ämnesområden
- **Flashcards** för snabbinlärning av svåra begrepp

Att öva på tid hjälper dig att hantera stressen under provdagen.
        `,
        faqs: [
          {
            question: "Hur kan jag förbereda mig inför provet?",
            answer: "Det finns ett officiellt utbildningsmaterial ('Sverige i fokus') som du kan läsa på innan provet. Du kan också använda privata övningssajter som erbjuder test och flashcards för att träna dig på formatet."
          }
        ]
      },
      {
        slug: 'anpassningar-medborgarskapsprov',
        title: 'Anpassningar vid medborgarskapsprovet',
        metaDescription: 'Har du dyslexi eller andra behov? Läs om vilka anpassningar som UHR planerar att erbjuda vid genomförandet av medborgarskapsprovet.',
        readingTime: 4,
        keywords: 'anpassningar medborgarskapsprov, dyslexi, extra tid, behov',
        content: `
Om du har en funktionsnedsättning, som till exempel dyslexi eller synnedsättning, är det viktigt att veta att myndigheter som UHR brukar erbjuda anpassningar för att alla ska ha samma chans att lyckas på provet.

Även om de exakta detaljerna kring anpassningar för just *medborgarskapsprovet* 2026 ännu inte är helt fastställda i detalj, kommer det finnas möjligheter att ansöka om stöd. Detta brukar traditionellt inkludera extra provtid.
        `,
        faqs: [
          {
            question: "Vilka anpassningar finns?",
            answer: "Information om vilka anpassningar (t.ex. extra tid) som kommer erbjudas till provet kommer inom kort att publiceras av UHR."
          }
        ]
      },
      {
        slug: 'medborgarskapsprov-vs-swedex-tisus',
        title: 'Medborgarskapsprov vs Swedex och Tisus: Vad är skillnaden?',
        metaDescription: 'Blandar du ihop Medborgarskapsprovet, Swedex och Tisus? Vi reder ut vilket prov som gör vad och vilken myndighet som ansvarar.',
        readingTime: 5,
        keywords: 'swedex, tisus, medborgarskapsprov skillnad, språkkrav',
        content: `
Det är lätt att gå vilse bland alla prov och certifieringar som finns för det svenska språket och samhället. 

- **Swedex:** Ett internationellt erkänt prov i svenska som främmande språk (nivå A2 till B2). Ansvarig: Folkuniversitetet.
- **Tisus:** Test i svenska för universitets- och högskolestudier. Detta är för dig som vill söka till universitet i Sverige. Ansvarig: Stockholms universitet.
- **Medborgarskapsprovet:** Ett nytt (2026) obligatoriskt prov i *samhällskunskap* (och senare språk) specifikt för ansökan om medborgarskap. Ansvarig: UHR.

Om ditt mål enbart är svenskt medborgarskap, är det UHR:s medborgarskapsprov som är i fokus framöver!
        `,
        faqs: [
          {
            question: "Ansvarar ni också för Swedex och Tisus-provet?",
            answer: "Nej, UHR ansvarar inte för Swedex-provet, det gör Folkuniversitetet. Tisus-provet ansvarar Stockholms universitet för."
          }
        ]
      },
      {
        slug: 'gratis-exempelfragor-medborgarskapsprov',
        title: 'Gratis exempelfrågor för medborgarskapsprovet 2026',
        metaDescription: 'Testa dina kunskaper! Här hittar du riktiga exempelfrågor som förbereder dig för det svenska medborgarskapstestet.',
        readingTime: 6,
        keywords: 'exempelfrågor, gratis test medborgarskapsprov, övningsfrågor, test online',
        content: `
Det absolut mest effektiva sättet att lära sig den stora mängden information inför medborgarskapsprovet är att repetera frågor. 

Här på vår plattform erbjuder vi en databas med över 500 frågor som rör:
1. Svensk historia (från vikingatiden till modern tid)
2. Samhälle och geografi
3. Demokrati, politik och val
4. Religion och helgdagar

## Prova gratis
Du behöver inte köpa grisen i säcken. Klicka dig vidare till vår övningssida där du helt gratis kan testa 10 frågor för att se hur väl du känner Sverige. Om du gillar systemet, kan du uppgradera till VIP för att låsa upp alla 500+ frågor och 20+ kompletta simulerade prov.
        `,
        faqs: [
          {
            question: "Finns det exempelfrågor att öva på?",
            answer: "Ja! Även om UHR kommer publicera några officiella exempelfrågor i framtiden, erbjuder plattformar som vår hundratals övningsfrågor redan nu, baserade på det officiella utbildningsmaterialet."
          }
        ]
      }
    ];

    for (const article of articlesToSeed) {
      await prisma.article.create({
        data: {
          slug: article.slug,
          title: article.title,
          metaDescription: article.metaDescription,
          readingTime: article.readingTime,
          keywords: article.keywords,
          content: article.content,
          isPublished: true,
          faqs: {
            create: article.faqs.map((faq, idx) => ({
              question: faq.question,
              answer: faq.answer,
              order: idx
            }))
          }
        }
      });
    }

    return NextResponse.json({ success: true, count: articlesToSeed.length });
  } catch (error: any) {
    console.error('Error seeding SEO articles:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

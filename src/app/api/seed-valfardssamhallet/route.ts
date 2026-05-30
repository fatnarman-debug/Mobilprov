import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'valfardssamhallet-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const topic = await prisma.topic.create({
      data: {
        title: 'Välfärdssamhället',
        description: 'Kapitel 9 - Välfärdssamhället (från Sverige i fokus).',
        category: 'Samhällskunskap',
        order: 9,
        isPublished: true,
      },
    });

    await prisma.material.create({
      data: {
        topicId: topic.id,
        type: 'PDF',
        title: 'Sverige i fokus - Kapitel 9',
        url: 'https://www.uhr.se/globalassets/_uhr.se/medborgarskapsprovet/utbildningsmaterial/sverige-i-fokus.pdf',
        order: 1,
      }
    });

    const flashcards = [
      { front: "Vad är målet med välfärdssamhället?", back: "Att ge alla invånare en grundläggande ekonomisk och social trygghet." },
      { front: "Hur finansieras den svenska välfärden i huvudsak?", back: "Genom skatter." },
      { front: "Vilka tre offentliga nivåer bidrar och ansvarar för olika delar av välfärden?", back: "Staten, regionerna och kommunerna." },
      { front: "Ge tre exempel på vad välfärdspengar används till.", back: "Sjukvård, utbildning och ekonomiskt stöd vid sjukdom eller arbetslöshet." },
      { front: "Vilka betalar skatt i Sverige för att finansiera välfärden?", back: "Både personer som arbetar och företag betalar skatt." },
      { front: "Vad är inkomstskatt?", back: "En del av den lön man får som anställd som går till stat, region och kommun." },
      { front: "Vad kallas skatten som man betalar när man köper varor och tjänster?", back: "Moms (mervärdesskatt)." },
      { front: "Vad är arbetsgivaravgifter?", back: "Avgifter som arbetsgivare betalar till staten (utöver de anställdas löner) för bl.a. sjukförsäkring och pensioner." },
      { front: "Vilken nivå i samhället (stat, region, kommun) finansierar pensioner och sjukförsäkring?", back: "Staten." },
      { front: "Vem finansierar barnbidrag och föräldraförsäkring?", back: "Staten." },
      { front: "Vilken nivå ansvarar för att finansiera arbetslöshetsförsäkring och studiestöd?", back: "Staten." },
      { front: "Vilken nivå finansierar högre utbildning och forskning inom högskolor och universitet?", back: "Staten." },
      { front: "Vad är regionernas huvudansvar i välfärden?", back: "Att erbjuda hälso- och sjukvård till alla invånare." },
      { front: "Hur många regioner finns det i Sverige?", back: "21 regioner." },
      { front: "Hur finansierar regionerna sjukvården och sina verksamheter?", back: "Genom att de tar ut skatt av sina invånare." },
      { front: "Vem är det som i huvudsak bedriver sjukvården i Sverige?", back: "Sjukvården bedrivs i offentlig regi, men det finns även privata vårdgivare (som finansieras med skattemedel)." },
      { front: "Ge exempel på vad som ingår i primärvården.", back: "Vårdcentraler, barnavårds- och mödravårdscentraler." },
      { front: "Vilka typer av sjukhus ingår i sjukhusvården?", back: "Akutsjukhus, länssjukhus och universitetssjukhus." },
      { front: "Ge exempel på övrig sjukvård som regionerna ansvarar för.", back: "Psykiatrisk vård, rehabilitering och tandvård." },
      { front: "Vem bestämmer hur mycket invånarna ska betala i kommunalskatt?", back: "Varje kommun bestämmer själva sin skattesats." },
      { front: "Vilken nivå (stat, region, kommun) har ansvar för att det finns skolor och utbildning?", back: "Kommunerna." },
      { front: "Vad menas med barnomsorg inom kommunens ansvar?", back: "Förskolor och fritidshem." },
      { front: "Vilka åldrar går barn i grundskolan i Sverige?", back: "Mellan 6 och 16 år." },
      { front: "Vilka skolformer utöver grundskolan ansvarar kommunerna för?", back: "Gymnasieskolor och kommunal vuxenutbildning." },
      { front: "Vad innebär äldreomsorg enligt svensk lag?", back: "Att kommuner ska erbjuda äldre stöd och hjälp i vardagen (t.ex. städa, laga mat, hygien)." },
      { front: "Vad är första steget inom äldreomsorgen om man behöver hjälp?", back: "Att kommunen hjälper till med vård och service så att de äldre kan bo kvar i sina egna hem." },
      { front: "Vad händer om det inte fungerar för en äldre person att bo kvar hemma?", back: "De kan flytta till ett boende anpassat för äldre personer (särskilt boende)." },
      { front: "Vad är socialtjänstens huvuduppgift i en kommun?", back: "Att ansvara för att de invånare som behöver får stöd och skydd." },
      { front: "Vilka grupper i samhället kan få hjälp av socialtjänsten?", back: "Familjer med ekonomiska problem, hemlösa, personer med missbruk eller de som utsätts för hot och våld." },
      { front: "Vilka ytterligare ansvarsområden har socialtjänsten förutom stöd vid kris?", back: "Att ge stöd till personer med funktionsnedsättning samt råd/hjälp till arbete och studier." }
    ];

    for (let i = 0; i < flashcards.length; i++) {
      await prisma.flashcard.create({
        data: {
          topicId: topic.id,
          frontText: flashcards[i].front,
          backText: flashcards[i].back,
          order: i + 1,
        }
      });
    }

    const questions = [
      { text: "Vad är huvudsyftet med det svenska välfärdssamhället?", options: ["Att staten ska tjäna så mycket pengar som möjligt.", "Att ge alla invånare en grundläggande ekonomisk och social trygghet.", "Att endast företag ska få stöd.", "Att finansiera militären."], correct: "B", expl: "Välfärden ska säkerställa att människor kan leva ett tryggt liv med tillgång till bl.a. sjukvård och utbildning." },
      { text: "Hur finansieras den svenska välfärden i första hand?", options: ["Genom lån från andra länder.", "Genom försäljning av naturresurser.", "Genom skatter.", "Endast genom avgifter på sjukhus."], correct: "C", expl: "Den absolut största delen av pengarna till skola, sjukvård och omsorg kommer från skatter." },
      { text: "Vilka av följande tre nivåer bidrar och samarbetar kring välfärden i Sverige?", options: ["Staten, regionerna och kommunerna.", "Bankerna, företagen och facket.", "EU, FN och regeringen.", "Domstolarna, polisen och riksdagen."], correct: "A", expl: "Sveriges välfärdssystem styrs och finansieras gemensamt av stat, regioner och kommuner." },
      { text: "Vilket av följande är ett exempel på en välfärdstjänst?", options: ["Att köpa en ny bil.", "Att bygga privata hus.", "Att ha tillgång till kostnadsfri grundskola.", "Att gå på bio."], correct: "C", expl: "Utbildning (skola), sjukvård och ekonomiskt stöd vid sjukdom är exempel på välfärd." },
      { text: "Vem betalar skatt i Sverige?", options: ["Bara personer som har en miljoninkomst.", "Endast utländska medborgare.", "Både personer som arbetar och företag.", "Bara personer som bor i storstäder."], correct: "C", expl: "Skatt betalas av alla som har en inkomst och även av företag." },
      { text: "Vad kallas den skatt som alla betalar när de köper varor och tjänster i butik?", options: ["Arbetsgivaravgift", "Inkomstskatt", "Moms (mervärdesskatt)", "Punktskatt"], correct: "C", expl: "Moms är en skatt på konsumtion som läggs på priset vid köp av varor och tjänster." },
      { text: "Vad är arbetsgivaravgifter?", options: ["En avgift som chefen behåller själv.", "Avgifter som arbetsgivaren betalar till staten för sina anställdas sjukförsäkring och pension.", "Det är samma sak som fackavgift.", "Avgifter för att få starta ett företag."], correct: "B", expl: "Arbetsgivaren betalar dessa avgifter utöver lönen, och pengarna går in i välfärdssystemet." },
      { text: "Vem finansierar i huvudsak pensioner, barnbidrag och studiestöd?", options: ["Kommunen", "Regionen", "Staten", "Kyrkan"], correct: "C", expl: "Det är staten som ansvarar för och finansierar de stora sociala försäkringssystemen." },
      { text: "Vilken offentlig nivå ansvarar för att finansiera och erbjuda hälso- och sjukvård i Sverige?", options: ["Staten", "Regionerna", "Kommunerna", "Arbetsförmedlingen"], correct: "B", expl: "De 21 regionerna i Sverige har som huvuduppgift att erbjuda sjukvård till invånarna." },
      { text: "Hur många regioner finns det i Sverige?", options: ["10 regioner", "15 regioner", "21 regioner", "290 regioner"], correct: "C", expl: "Sverige är indelat i 21 regioner som bland annat ansvarar för hälso- och sjukvård." },
      { text: "Hur får regionerna in pengar för att kunna driva sjukhusen?", options: ["De får enbart pengar från EU.", "De samlar in frivilliga donationer.", "De tar ut skatt av sina invånare.", "De lånar pengar från privatpersoner."], correct: "C", expl: "Regionerna har beskattningsrätt och tar ut regionskatt av invånarna." },
      { text: "Kan en privat vårdgivare i Sverige finansieras med skattemedel?", options: ["Nej, de finansieras bara av patienterna.", "Ja, många välfärdstjänster drivs av privata företag men finansieras av skattemedel.", "Bara om de är belägna utanför städerna.", "Nej, det är olagligt i Sverige."], correct: "B", expl: "Privata företag kan bedriva vård, skola och omsorg på uppdrag av regionen/kommunen och därmed finansieras via skatten." },
      { text: "Till vilken typ av sjukvård räknas vårdcentraler och mödravårdscentraler?", options: ["Specialistvård", "Primärvård", "Sjukhusvård", "Rehabilitering"], correct: "B", expl: "Vårdcentraler utgör basen i den svenska sjukvården och kallas för primärvård." },
      { text: "Var genomförs vanligtvis stora operationer och avancerad medicinsk behandling?", options: ["På vårdcentralen", "Vid primärvården", "På sjukhus (t.ex. universitetssjukhus och akutsjukhus)", "Hos kommunens socialtjänst"], correct: "C", expl: "Detta räknas som sjukhusvård (specialistsjukvård) och bedrivs på större sjukhus." },
      { text: "Vilken samhällsnivå bestämmer själv hur mycket skatt invånarna ska betala lokalt och var skolorna ska ligga?", options: ["Staten", "Regionerna", "Kommunerna", "EU"], correct: "C", expl: "Kommunerna har ett stort lokalt självstyre och bestämmer själva sin kommunalskatt." },
      { text: "Vem har huvudansvaret för att det finns förskolor, fritidshem och grundskolor?", options: ["Staten", "Regionen", "Kommunen", "Domstolarna"], correct: "C", expl: "Barnomsorg och utbildning (upp till gymnasiet) är i huvudsak kommunernas ansvar." },
      { text: "Mellan vilka åldrar går barn i grundskolan i Sverige?", options: ["7–15 år", "6–16 år", "10–18 år", "3–15 år"], correct: "B", expl: "Grundskolan och förskoleklassen omfattar vanligtvis barn mellan 6 och 16 år." },
      { text: "Erbjuder kommunerna utbildning för vuxna?", options: ["Nej, vuxna får betala sin egen skolgång privat.", "Ja, kommunerna erbjuder kommunal vuxenutbildning (Komvux).", "Bara för personer över 65 år.", "Nej, all vuxenutbildning drivs av staten."], correct: "B", expl: "Kommunal vuxenutbildning är en viktig del av det kommunala utbildningsansvaret." },
      { text: "Vad ingår i kommunens äldreomsorg enligt svensk lag?", options: ["Att betala ut statlig pension.", "Att erbjuda äldre stöd och hjälp i vardagen (t.ex. städning, hygien).", "Att operera äldre patienter på sjukhus.", "Att ge gratis medicin till alla över 65 år."], correct: "B", expl: "Kommunen ansvarar för omsorg och hjälp i hemmet, inte sjukvårdande behandlingar på sjukhus." },
      { text: "Vad är det primära målet när en äldre person börjar behöva hjälp av kommunen?", options: ["Att personen omedelbart ska flytta till ett ålderdomshem.", "Att personen ska flytta hem till sina barn.", "Att erbjuda hjälp och service så personen kan bo kvar i sitt eget hem.", "Att personen ska opereras på sjukhuset."], correct: "C", expl: "Målsättningen är att äldre ska kunna leva oberoende och bo kvar hemma så länge som möjligt." },
      { text: "Vad gör kommunen om det inte fungerar för en äldre person att bo kvar hemma längre?", options: ["De kontaktar polisen.", "Personen tvingas flytta utomlands.", "Personen kan erbjudas en plats på ett boende anpassat för äldre.", "Personen blir hemlös."], correct: "C", expl: "Kommunen erbjuder särskilda boenden (t.ex. äldreboenden) när hemvård inte räcker till." },
      { text: "Vilken verksamhet inom kommunen har som uppgift att hjälpa invånare med missbruksproblem eller som är utsatta för våld?", options: ["Tandvården", "Socialtjänsten", "Försäkringskassan", "Skatteverket"], correct: "B", expl: "Socialtjänsten ansvarar för råd, stöd, skydd och omsorg vid sociala problem." },
      { text: "Vad kan en familj med mycket knappa ekonomiska resurser ansöka om hos kommunens socialtjänst?", options: ["Studiestöd", "Barnbidrag", "Ekonomiskt bistånd (försörjningsstöd)", "Sjukpenning"], correct: "C", expl: "Socialtjänsten kan bevilja ekonomisk hjälp till den som inte kan försörja sig på annat sätt." },
      { text: "Vem finansierar högre utbildning som högskolor och universitet?", options: ["Kommunen", "Regionen", "Staten", "Privata fackförbund"], correct: "C", expl: "Staten är den nivå som ansvarar för universitet och forskning i Sverige." },
      { text: "Vilken myndighetsnivå ansvarar för arbetslöshetsförsäkringen och föräldraförsäkringen?", options: ["Kommunen", "Regionen", "Staten", "Den privata sektorn"], correct: "C", expl: "Dessa rikstäckande socialförsäkringar ligger under statens ansvar (ofta via Försäkringskassan)." },
      { text: "Var ska man vända sig i första hand om man känner sig sjuk och behöver träffa en läkare för en allmän undersökning?", options: ["Akutmottagningen på sjukhuset", "Vårdcentralen (primärvården)", "Kommunens socialtjänst", "Skatteverket"], correct: "B", expl: "Primärvården (vårdcentralen) är första instansen i det svenska sjukvårdssystemet." },
      { text: "Vad menas med att skatter finansierar välfärden gemensamt?", options: ["Att alla betalar precis lika mycket i kronor.", "Att endast företag betalar för skolan.", "Att pengarna samlas in från alla (skatt) för att betala för tjänster som alla kan använda (t.ex. vägar, skola).", "Att skatterna skickas till andra länder."], correct: "C", expl: "Gemensam finansiering innebär att man sprider kostnaderna för viktiga samhällsfunktioner över hela befolkningen." },
      { text: "Vilket av följande påståenden stämmer angående vem som arbetar med välfärd?", options: ["Det är bara anställda i den offentliga sektorn som utför välfärdstjänster.", "Endast polisen räknas till välfärden.", "Även privata företag kan utföra välfärdstjänster med skattepengar.", "Välfärden drivs helt utan skattepengar."], correct: "C", expl: "Många skolor och vårdcentraler drivs av privata aktörer, men finansieras av kommun/region via skattemedel." },
      { text: "Om en person med en funktionsnedsättning behöver råd och stöd för att klara vardagen, vilken kommunal instans ansvarar oftast för detta?", options: ["Skatteverket", "Socialtjänsten", "Tullverket", "Försvarsmakten"], correct: "B", expl: "Socialtjänsten har i uppdrag att stödja personer med funktionsnedsättning." },
      { text: "Varför uppmuntrar systemet att ju fler som jobbar och köper varor desto bättre är det för välfärden?", options: ["För att staten vill spara pengar i ladorna.", "För att det genererar mer skatteintäkter (inkomstskatt, moms) som går direkt till att bygga upp och betala för välfärden.", "För att staten vill stoppa privat konsumtion.", "För att minska antalet sjukhus."], correct: "B", expl: "Skatteintäkterna är grunden för finansieringen; fler som arbetar och konsumerar betyder mer pengar till skola och vård." }
    ];

    for (const q of questions) {
      await prisma.question.create({
        data: {
          topicId: topic.id,
          text: q.text,
          optionA: q.options[0],
          optionB: q.options[1],
          optionC: q.options[2],
          optionD: q.options[3],
          correctAnswer: q.correct,
          explanation: q.expl,
          difficulty: 'MEDIUM',
          isTest: false,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      topic: topic.title,
      flashcardsAdded: flashcards.length,
      questionsAdded: questions.length,
      message: 'Välfärdssamhället added successfully!' 
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

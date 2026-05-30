import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'arbetsmarknad-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const topic = await prisma.topic.create({
      data: {
        title: 'Arbetsmarknad och privatekonomi',
        description: 'Kapitel 8 - Arbetsmarknad, skatter, A-kassan och privatekonomi (från Sverige i fokus).',
        category: 'Samhällskunskap',
        order: 8,
        isPublished: true,
      },
    });

    await prisma.material.create({
      data: {
        topicId: topic.id,
        type: 'PDF',
        title: 'Sverige i fokus - Kapitel 8',
        url: 'https://www.uhr.se/globalassets/_uhr.se/medborgarskapsprovet/utbildningsmaterial/sverige-i-fokus.pdf',
        order: 1,
      }
    });

    const flashcards = [
      { front: "Vilka två delar kan den svenska arbetsmarknaden delas in i?", back: "Offentlig och privat sektor." },
      { front: "Vad ingår i den offentliga sektorn?", back: "Verksamheter som staten, regionerna och kommunerna ansvarar för." },
      { front: "Hur finansieras den offentliga sektorn i Sverige?", back: "Med skatter." },
      { front: "Ge fyra exempel på yrken som ofta hör till den offentliga sektorn.", back: "Sjukvårdspersonal, lärare, polis och brandman." },
      { front: "Ungefär hur många procent av arbetskraften i Sverige jobbar inom den offentliga sektorn?", back: "Cirka 30 procent." },
      { front: "Vad menas med den privata sektorn?", back: "Alla företag som ägs privat." },
      { front: "Ge exempel på arbetsplatser inom den privata sektorn.", back: "Butiker, restauranger, fabriker och byggföretag." },
      { front: "Hur stor del av arbetskraften arbetar inom den privata sektorn i Sverige?", back: "Omkring 70 procent." },
      { front: "Vilken typ av branscher är vanliga på arbetsmarknaden i stora städer?", back: "Tjänster och handel." },
      { front: "Vad hittar man ofta för branscher i mindre städer och orter?", back: "Industrier, fabriker och pappersbruk nära naturresurser." },
      { front: "Vilka är de två huvudparterna på arbetsmarknaden?", back: "Arbetsgivare och arbetstagare." },
      { front: "Vad är en arbetsgivares uppgift i relation till arbetstagaren?", back: "Att anställa och betala ut lön." },
      { front: "Vad är syftet med arbetsgivarorganisationer?", back: "Att representera arbetsgivarna och ta vara på deras intressen." },
      { front: "Vilken är den största arbetsgivarorganisationen för privata företag?", back: "Svenskt näringsliv." },
      { front: "Vilka organisationer representerar offentliga arbetsplatser?", back: "Arbetsgivarverket och SKR (Sveriges kommuner och regioner)." },
      { front: "Vad gör fackliga organisationer (fackförbund)?", back: "Representerar arbetstagarna och förhandlar om löner och arbetsvillkor." },
      { front: "Vad står bokstäverna LO för?", back: "Landsorganisationen i Sverige." },
      { front: "Vad står förkortningen TCO för?", back: "Tjänstemännens centralorganisation." },
      { front: "Vad står SACO för i arbetslivet?", back: "Sveriges akademikers centralorganisation." },
      { front: "Vilka kan vara medlemmar i ett fackförbund?", back: "De anställda (arbetstagarna) på arbetsplatserna." },
      { front: "Vad är ett kollektivavtal?", back: "Ett avtal mellan arbetsgivare och fackförbund om löner och arbetsvillkor." },
      { front: "Vilka bestämmer generellt lönerna i Sverige?", back: "Löner bestäms genom förhandlingar mellan arbetsmarknadens parter, inte av staten." },
      { front: "Varför finns det särskilda lagar på arbetsmarknaden?", back: "För att skydda anställdas rättigheter och skapa en trygg arbetsmiljö." },
      { front: "Ge tre exempel på vad lagar på arbetsmarknaden reglerar.", back: "Arbetstider, arbetsmiljö och semester." },
      { front: "Vad är arbetsgivaravgifter?", back: "Avgifter som arbetsgivaren betalar till staten för de anställdas pension och sjukförsäkring." },
      { front: "Måste alla som arbetar betala skatt på sin lön i Sverige?", back: "Ja, alla betalar skatt på lön (det är olagligt att jobba svart)." },
      { front: "Vad är A-kassan?", back: "En arbetslöshetsförsäkring som betalar ut pengar till arbetslösa medlemmar." },
      { front: "Vad krävs för att få ersättning från A-kassan?", back: "Man måste ha arbetat tillräckligt många timmar under en viss period och vara aktivt arbetssökande." },
      { front: "Hur finansieras A-kassan (arbetslöshetskassan)?", back: "Av staten och av medlemmarnas egna medlemsavgifter." },
      { front: "Vad betyder privatekonomi?", back: "Människors privata inkomster och utgifter." },
      { front: "Vad påverkar hur mycket man får i lön i Sverige?", back: "Yrke, utbildning, erfarenhet och bransch." },
      { front: "Vad är socialförsäkringar?", back: "Statligt ekonomiskt stöd, till exempel pension, sjukpenning och barnbidrag." },
      { front: "Vilken typ av lån är ofta den största delen av människors privatekonomi?", back: "Bostadslån." },
      { front: "Vad är en nackdel med att köpa saker på kredit (t.ex. kreditkort)?", back: "Räntan är ofta mycket hög på sådana lån." },
      { front: "Vilken statlig myndighet i Sverige ser till att obetalda skulder blir betalda?", back: "Kronofogdemyndigheten (ofta kallad Kronofogden)." },
      { front: "Vad kallas det när Kronofogden hjälper en person med extremt stora skulder att få ordning på sin ekonomi?", back: "Skuldsanering." },
      { front: "Vilken myndighet ska alla personer som har haft en inkomst deklarera till?", back: "Skatteverket." },
      { front: "Ungefär hur mycket av lönen betalar man i skatt i Sverige?", back: "Hur mycket man betalar beror på hur hög inkomst man har." },
      { front: "Vem tecknar kollektivavtal med varandra?", back: "Fackförbunden och arbetsgivarorganisationerna." },
      { front: "Vilka personer får ersättning från A-kassan?", back: "Arbetslösa medlemmar som aktivt söker jobb och uppfyller arbetsvillkoret." }
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
      { text: "Vilka två sektorer brukar man dela in den svenska arbetsmarknaden i?", options: ["Statlig och kommunal sektor", "Privat och offentlig sektor", "Industri- och tjänstesektor", "Lokal och global sektor"], correct: "B", expl: "Arbetsmarknaden består av privat sektor (företag) och offentlig sektor (stat, kommun, region)." },
      { text: "Vad finansierar verksamheterna i den offentliga sektorn?", options: ["Enbart donationer från företag", "EU-bidrag", "Skatter", "Banklån"], correct: "C", expl: "Offentlig sektor, t.ex. sjukvård och skola, finansieras gemensamt via skatter." },
      { text: "Vilka av följande yrken hör vanligtvis till den offentliga sektorn?", options: ["Advokat och mäklare", "Sjuksköterska och polis", "Fabriksarbetare och byggjobbare", "Restaurangägare och taxiförare"], correct: "B", expl: "Sjukvårdspersonal, lärare och poliser är anställda av region, kommun eller stat." },
      { text: "Ungefär hur stor andel av de som jobbar i Sverige är anställda i den privata sektorn?", options: ["30 procent", "50 procent", "70 procent", "90 procent"], correct: "C", expl: "Cirka 70 procent av arbetskraften jobbar i den privata sektorn." },
      { text: "Vad kännetecknar den privata sektorn?", options: ["Företagen ägs av staten", "Den består av myndigheter", "Företagen ägs privat", "Den finansieras bara av skatter"], correct: "C", expl: "Med privat sektor menas alla företag som ägs privat, t.ex. butiker och fabriker." },
      { text: "Vad kallas de två huvudaktörerna på arbetsmarknaden?", options: ["Köpare och säljare", "Arbetsgivare och arbetstagare", "Polis och domstol", "Kommun och region"], correct: "B", expl: "Arbetsmarknadens parter är arbetsgivare (som anställer) och arbetstagare (som är anställda)." },
      { text: "Vilken är den största organisationen som representerar privata företag (arbetsgivare)?", options: ["LO", "Skatteverket", "Svenskt näringsliv", "SACO"], correct: "C", expl: "Svenskt näringsliv är den största arbetsgivarorganisationen för privata företag." },
      { text: "Vad står SKR för i samband med arbetsmarknaden?", options: ["Svenska Kyrkans Råd", "Sveriges kommuner och regioner", "Statens Kriminalregister", "Sveriges Kvinnors Rättigheter"], correct: "B", expl: "SKR är arbetsgivarorganisationen för offentliga arbetsplatser inom kommun och region." },
      { text: "Vilken av följande organisationer representerar arbetstagare?", options: ["Arbetsgivarverket", "Svenskt näringsliv", "Fackförbund (t.ex. LO, TCO, SACO)", "Kronofogdemyndigheten"], correct: "C", expl: "Fackliga organisationer förhandlar och tar vara på de anställdas intressen." },
      { text: "Vad är LO ett exempel på?", options: ["Ett fackförbund / centralorganisation", "En arbetsgivare", "En bank", "Ett politiskt parti i riksdagen"], correct: "A", expl: "LO (Landsorganisationen i Sverige) är en av de största fackliga centralorganisationerna." },
      { text: "Vem bestämmer vanligtvis lönerna i Sverige?", options: ["Sveriges regering", "Arbetsmarknadens parter genom förhandlingar", "Endast arbetsgivaren ensam", "Domstolarna"], correct: "B", expl: "Löner bestäms genom avtal och förhandlingar mellan fackförbund och arbetsgivare." },
      { text: "Vad kallas det avtal som skrivs mellan fackförbund och arbetsgivare om löner och arbetsvillkor?", options: ["Köpekontrakt", "Hyresavtal", "Kollektivavtal", "Tystnadsplikt"], correct: "C", expl: "Kollektivavtalet gäller för alla anställda på arbetsplatser som omfattas av avtalet." },
      { text: "Vilket påstående stämmer om lagar på arbetsmarknaden?", options: ["Det finns inga lagar, facket bestämmer allt.", "Lagarna förbjuder folk att byta jobb.", "Lagarna skyddar anställdas rättigheter och reglerar t.ex. arbetstider och semester.", "Staten förbjuder kollektivavtal."], correct: "C", expl: "Det finns lagstiftning som sätter en miniminivå för trygghet, semester och arbetsmiljö." },
      { text: "Förutom lönen, vad måste en arbetsgivare i Sverige betala för sina anställda?", options: ["Fackavgift", "Arbetsgivaravgifter till staten (bl.a. pension, sjukförsäkring)", "Deras hyra", "Inkomstskatt för hela familjen"], correct: "B", expl: "Arbetsgivaren ansvarar för att betala in sociala avgifter, s.k. arbetsgivaravgifter." },
      { text: "Är det tillåtet i Sverige att arbeta svart (utan att betala skatt)?", options: ["Ja, om man tjänar lite pengar.", "Ja, om man kommer överens med chefen.", "Nej, det är olagligt.", "Endast under helger."], correct: "C", expl: "Alla som arbetar måste betala inkomstskatt enligt lag." },
      { text: "Vad är syftet med A-kassan (arbetslöshetskassan)?", options: ["Att betala ut lön när man är sjuk.", "Att ge ekonomisk ersättning om man blir arbetslös.", "Att låna ut pengar till bostadsköp.", "Att samla in pengar till staten."], correct: "B", expl: "A-kassan gör det möjligt för en arbetslös person som uppfyller kraven att få en inkomst." },
      { text: "Vad är ett av kraven för att få ersättning från A-kassan?", options: ["Att man väntar passivt på att bli kontaktad.", "Att man är aktivt arbetssökande.", "Att man har högsta betyg i skolan.", "Att man aldrig har varit sjukskriven."], correct: "B", expl: "För att få pengar måste man ha jobbat tillräckligt och aktivt söka nya jobb." },
      { text: "Hur finansieras A-kassans utbetalningar?", options: ["Genom kommunalskatten enbart.", "Genom lån från banker.", "Av staten och medlemmarnas egna avgifter.", "Av företagens vinster direkt."], correct: "C", expl: "Den finansieras gemensamt via statliga medel och medlemsavgifter." },
      { text: "Vad räknas som inkomster i privatekonomin?", options: ["Hyra och elräkning", "Lön och bidrag (t.ex. barnbidrag)", "Skatter och lån", "Mat och kläder"], correct: "B", expl: "Inkomster är de pengar som kommer in till hushållet." },
      { text: "Vad påverkar inte din lön på den svenska arbetsmarknaden?", options: ["Utbildning", "Bransch", "Yrke", "Din hudfärg (enligt diskrimineringslagen)"], correct: "D", expl: "Lönen baseras på meriter som erfarenhet, yrke och bransch. Det är olagligt att diskriminera." },
      { text: "Ge ett exempel på en svensk socialförsäkring.", options: ["Hemförsäkring", "Bostadslån", "Sjukpenning", "Livförsäkring hos privat bolag"], correct: "C", expl: "Staten ger trygghet genom socialförsäkringar som pension, sjukpenning och barnbidrag." },
      { text: "Vad varnar texten för när det gäller köp på kreditkort?", options: ["Att det är olagligt.", "Att kortet kan smälta.", "Att räntan ofta är väldigt hög.", "Att bankerna inte tillåter det längre."], correct: "C", expl: "Det är vanligt att handla på kredit, men sådana lån har ofta hög ränta som kan leda till skulder." },
      { text: "Vilken myndighet hjälper företag och privatpersoner att driva in obetalda skulder?", options: ["Skatteverket", "Polisen", "Kronofogdemyndigheten", "Försäkringskassan"], correct: "C", expl: "Kronofogdemyndigheten ser till att skulder blir betalda." },
      { text: "Vad menas med skuldsanering?", options: ["Att man städar sitt hus.", "Att Kronofogden hjälper personer med stora skulder att få ordning på ekonomin.", "Att man tar ett nytt banklån.", "Att man tvingas flytta utomlands."], correct: "B", expl: "Skuldsanering är en möjlighet för gravt skuldsatta att bli skuldfria efter en viss period under strikta villkor." },
      { text: "Till vilken myndighet ska man deklarera (redovisa) sin inkomst en gång om året?", options: ["Migrationsverket", "Försäkringskassan", "Skatteverket", "Arbetsförmedlingen"], correct: "C", expl: "Alla som haft inkomst under året måste deklarera till Skatteverket." },
      { text: "Vilka ansvarar generellt för sjukvård och sjukhus i den offentliga sektorn?", options: ["Regionerna", "De privata bankerna", "Kommunerna", "Riksdagen"], correct: "A", expl: "I Sverige är det regionerna (Sveriges 21 regioner) som har huvudansvaret för hälso- och sjukvård." },
      { text: "Hur stor andel av de sysselsatta arbetar inom den offentliga sektorn?", options: ["Ca 10 procent", "Ca 30 procent", "Ca 50 procent", "Ca 90 procent"], correct: "B", expl: "Ungefär 30 procent arbetar inom stat, kommun och region." },
      { text: "Är det tillåtet för arbetsgivare att teckna kollektivavtal?", options: ["Nej, bara facket får teckna dem.", "Ja, avtalet tecknas just mellan facket och arbetsgivarorganisationen.", "Ja, men de måste betala skatt för det.", "Nej, kollektivavtal är olagliga."], correct: "B", expl: "Ett kollektivavtal är en överenskommelse mellan arbetsgivare/arbetsgivarorganisation och fackförbund." },
      { text: "Vilka två är fackliga centralorganisationer utöver LO?", options: ["SVT och SR", "SACO och TCO", "SKR och DO", "A-kassan och Försäkringskassan"], correct: "B", expl: "Tjänstemännens centralorganisation (TCO) och Sveriges akademikers centralorganisation (SACO)." },
      { text: "Vem kan bli medlem i en A-kassa?", options: ["Bara arbetsgivare", "Alla som arbetar kan ansöka om medlemskap för att få inkomsttrygghet.", "Endast studenter", "Enbart pensionärer"], correct: "B", expl: "Arbetstagare går ofta med i A-kassan för att få en ekonomisk trygghet om de skulle bli arbetslösa." },
      { text: "Vad påverkar hur mycket skatt man betalar på sin lön?", options: ["Varifrån man kommer.", "Vilket fackförbund man är med i.", "Hur hög inkomst man har.", "Om man äger en bil."], correct: "C", expl: "I Sverige betalar man skatt baserat på inkomstens storlek (progressiv eller proportionell beroende på nivå)." },
      { text: "Vad är ett exempel på en vanlig utgift i privatekonomin?", options: ["Lön från arbetsgivaren", "Barnbidrag", "Hyra för boende", "Aktieutdelning"], correct: "C", expl: "Boende, mat och kläder är typiska utgifter i den privata ekonomin." },
      { text: "Vad kan fackförbunden göra om du som medlem får problem på arbetet?", options: ["De kan hjälpa och representera dig mot arbetsgivaren.", "De kan stänga ner företaget direkt.", "De kan ändra svensk lag.", "De kan betala din hyra."], correct: "A", expl: "Facket erbjuder stöd, förhandling och rättshjälp om medlemmar hamnar i tvist med arbetsgivaren." },
      { text: "Varför har bostadslån blivit en så stor del av många svenskars privatekonomi?", options: ["För att ingen vill hyra lägenhet längre.", "För att bostadspriserna i många delar av Sverige har stigit kraftigt de senaste årtiondena.", "För att bankerna tvingar folk att låna.", "För att räntan alltid är 0%."], correct: "B", expl: "Höga bostadspriser har gjort att många människor måste ta stora lån för att köpa en bostad." },
      { text: "Vad kan man göra med pengar man inte behöver använda direkt?", options: ["Deklarera bort dem.", "Spara dem på bankkonto, i fonder eller aktier.", "Skicka dem till Kronofogden.", "Investera dem i A-kassan."], correct: "B", expl: "Det är vanligt att spara pengar på bank eller investera dem för framtiden." },
      { text: "Vilken typ av arbete hittar man oftast i mindre orter och städer enligt texten?", options: ["Stora IT-bolag", "Bara banker", "Industrier, fabriker och pappersbruk", "Filmproduktion"], correct: "C", expl: "Mindre orter har ofta industrier som ligger nära de naturresurser de behöver." },
      { text: "Vilka förhandlar och kommer överens om arbetsvillkoren för de anställda?", options: ["Staten och kommunen", "De anställdas fackförbund och arbetsgivarna", "Polisen och domstolarna", "Skatteverket och Kronofogden"], correct: "B", expl: "Arbetsmarknadens parter (facket och arbetsgivarna) förhandlar fram villkoren." },
      { text: "Får staten gå in och bestämma vad ingångslönen ska vara för t.ex. sjuksköterskor i Sverige?", options: ["Ja, alltid.", "Nej, i Sverige är det parterna (facket och arbetsgivarna) som förhandlar fram löner, inte staten.", "Ja, men bara för offentlig sektor.", "Endast om lönen är under 10 000 kr."], correct: "B", expl: "Den svenska modellen bygger på att staten inte lägger sig i lönebildningen." },
      { text: "Vem betalar arbetsgivaravgifter?", options: ["Arbetstagaren själv från sin nettolön.", "A-kassan.", "Arbetsgivaren utöver den lön som betalas till den anställde.", "Fackförbundet."], correct: "C", expl: "Arbetsgivaren har skyldighet att betala in dessa avgifter till staten ovanpå bruttolönen." },
      { text: "Vad kan Kronofogdemyndigheten göra?", options: ["Skriva nya lagar om skatt.", "Beslagta pengar för att se till att skulder blir betalda.", "Bevilja asyl.", "Skriva kollektivavtal."], correct: "B", expl: "Deras uppdrag är att se till att den som ska ha betalt får sina pengar, bl.a. genom utmätning av lön eller egendom." }
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
      message: 'Arbetsmarknad added successfully!' 
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'mediernas-roll-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Konuyu Oluştur
    const topic = await prisma.topic.create({
      data: {
        title: 'Mediernas roll',
        description: 'Kapitel 6 - Mediernas roll i samhället (från Sverige i fokus).',
        category: 'Samhällskunskap',
        order: 6, // 6. bölüm
        isPublished: true,
      },
    });

    // 2. Materyali (PDF) Ekle
    await prisma.material.create({
      data: {
        topicId: topic.id,
        type: 'PDF',
        title: 'Sverige i fokus - Kapitel 6: Mediernas roll',
        url: 'https://www.uhr.se/globalassets/_uhr.se/medborgarskapsprovet/utbildningsmaterial/sverige-i-fokus.pdf',
        order: 1,
      }
    });

    // 3. Flashcards (15 adet)
    const flashcards = [
      { front: "Vilka två grundlagar skyddar mediernas frihet i Sverige?", back: "Tryckfrihetsförordningen och Yttrandefrihetsgrundlagen." },
      { front: "Vad kallas principen som ger allmänheten och journalister rätt att ta del av myndigheters handlingar?", back: "Offentlighetsprincipen." },
      { front: "Får staten bestämma vad som ska publiceras i svenska medier?", back: "Nej, medierna är fria och oberoende av staten i en demokrati." },
      { front: "Vad kallas den person som är juridiskt ansvarig för vad som publiceras i en tidning, radio eller tv?", back: "Ansvarig utgivare." },
      { front: "Har en person rätt att vara anonym om hen lämnar ett tips till en journalist?", back: "Ja, det kallas meddelarskydd (meddelarfrihet)." },
      { front: "Vilka tre medieföretag i Sverige brukar kallas för public service?", back: "Sveriges Radio (SR), Sveriges Television (SVT) och Utbildningsradion (UR)." },
      { front: "Hur finansieras public service i Sverige?", back: "Genom en avgift som tas ut via skatten (public service-avgift), inte via reklam." },
      { front: "Får public service-företagen (t.ex. SVT) sända reklam för att tjäna pengar?", back: "Nej, de får inte tjäna pengar på reklam." },
      { front: "Vad är syftet med public service?", back: "Att alla i landet ska ha tillgång till saklig information och ett brett utbud av program, oavsett ekonomi." },
      { front: "Hur får privata och kommersiella medier vanligtvis sina inkomster?", back: "Genom att sälja reklamplats och prenumerationer." },
      { front: "Är innehållet på sociala medier granskat och kontrollerat på samma sätt som i traditionella medier?", back: "Nej, vem som helst kan skapa och sprida innehåll där." },
      { front: "Vad kallas det när man granskar, ifrågasätter och kontrollerar om information är korrekt?", back: "Källkritik." },
      { front: "Kan allmänna handlingar från myndigheter vara hemliga?", back: "Ja, de kan vara hemliga om de omfattas av sekretess." },
      { front: "Varför är offentlighetsprincipen viktig för journalister?", back: "Den gör det möjligt för dem att granska politiker och myndigheters beslut." },
      { front: "Vad ska en journalist göra för att säkerställa att en nyhet är sann?", back: "Kontrollera uppgifterna med flera oberoende och pålitliga källor." }
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

    // 4. Sorular (15 adet)
    const questions = [
      { text: "Vilka grundlagar skyddar rätten att fritt sprida åsikter i svenska medier?", options: ["Regeringsformen och Successionsordningen", "Tryckfrihetsförordningen och Yttrandefrihetsgrundlagen", "Skollagen och Diskrimineringslagen", "Brottsbalken och Miljöbalken"], correct: "B", expl: "Tryckfrihetsförordningen och Yttrandefrihetsgrundlagen skyddar mediernas frihet i Sverige." },
      { text: "Vad innebär offentlighetsprincipen?", options: ["Att alla tv-program måste sändas offentligt.", "Att allmänna handlingar från myndigheter i regel är offentliga.", "Att journalister måste redovisa sina privata inkomster.", "Att politiker måste ha offentliga möten varje vecka."], correct: "B", expl: "Offentlighetsprincipen ger allmänheten och journalister rätt att begära ut handlingar från myndigheter." },
      { text: "Vilka företag ingår i svensk 'public service'?", options: ["TV4, Kanal 5 och Viaplay", "Dagens Nyheter, Svenska Dagbladet och Aftonbladet", "Sveriges Radio (SR), Sveriges Television (SVT) och Utbildningsradion (UR)", "Netflix, HBO och Spotify"], correct: "C", expl: "SR, SVT och UR är de medieföretag som har ett speciellt uppdrag som public service i Sverige." },
      { text: "Hur finansieras public service-företagen (SR, SVT, UR) i Sverige?", options: ["Genom att sälja dyra prenumerationer.", "Genom bidrag från privata företag.", "Genom reklam i pauserna.", "Genom en avgift som tas ut via skatten."], correct: "D", expl: "Public service får inte tjäna pengar på reklam utan finansieras via skatten." },
      { text: "Vad är en ansvarig utgivare?", options: ["Den person som skriver flest artiklar i en tidning.", "En politiker som övervakar vad medierna säger.", "Den person som är juridiskt ansvarig för vad som publiceras i mediet.", "En person som delar ut tidningar till hushållen."], correct: "C", expl: "Varje tidning, radio- och tv-kanal måste ha en ansvarig utgivare som ser till att lagar (t.ex. mot förtal) följs." },
      { text: "Kan du straffas för att du lämnar ett tips till en tidning i Sverige?", options: ["Ja, alltid, om tipset handlar om en myndighet.", "Nej, man har rätt att lämna uppgifter till media utan att straffas.", "Ja, om tipset publiceras anonymt.", "Endast om tipset handlar om ett privat företag."], correct: "B", expl: "En person har rätt att lämna uppgifter till media utan att straffas, och man har även rätt att vara anonym." },
      { text: "Vad kallas det när man medvetet granskar och ifrågasätter om information man läser eller hör är sann?", options: ["Källkritik", "Censur", "Yttrandefrihet", "Offentlighetsprincip"], correct: "A", expl: "Att vara källkritisk innebär att kontrollera om informationen är korrekt och vem som står bakom den." },
      { text: "Får den svenska staten bestämma vad som ska sägas i medierna?", options: ["Ja, om det handlar om utrikespolitik.", "Nej, i en demokrati är medierna fria från statlig styrning.", "Ja, men bara under valår.", "Ja, staten godkänner alla nyheter innan de sänds."], correct: "B", expl: "I Sverige är medierna fria och staten kan inte påverka vad som publiceras." },
      { text: "Vad är syftet med public service enligt svensk modell?", options: ["Att tjäna så mycket pengar som möjligt åt staten.", "Att konkurrera ut privata medier.", "Att sända reklam till alla medborgare.", "Att erbjuda saklig information och ett brett programutbud till alla oavsett ekonomi."], correct: "D", expl: "Syftet är att alla ska ha tillgång till bra och oberoende innehåll oberoende av var de bor eller hur mycket pengar de har." },
      { text: "Vilket påstående stämmer bäst om sociala medier jämfört med traditionella tidningar?", options: ["Sociala medier har alltid en ansvarig utgivare.", "Allt på sociala medier är granskat av staten.", "Innehållet på sociala medier kontrolleras inte på samma sätt och vem som helst kan publicera vad som helst.", "Sociala medier får aldrig finansieras genom reklam."], correct: "C", expl: "Eftersom vem som helst kan publicera innehåll på sociala medier, krävs det mer källkritik från läsaren." },
      { text: "Hur får privata och kommersiella tv-kanaler oftast sina inkomster?", options: ["Genom public service-avgiften.", "Enbart genom statliga bidrag.", "Genom att sälja reklamplats och prenumerationer.", "Genom att polisen samlar in pengar."], correct: "C", expl: "Kommersiella kanaler, till skillnad från public service, drivs ofta med hjälp av reklamintäkter." },
      { text: "Är alla allmänna handlingar från myndigheter offentliga och tillgängliga för alla?", options: ["Ja, utan undantag.", "Nej, vissa handlingar är hemliga (under sekretess).", "Nej, handlingar är bara tillgängliga för journalister.", "Endast kommunala handlingar är offentliga, inte statliga."], correct: "B", expl: "Huvudregeln är att handlingar är offentliga, men uppgifter kan hållas hemliga om det krävs enligt sekretesslagen." },
      { text: "Varför finns det ett statligt mediestöd (ekonomiskt stöd) till vissa nyhetsmedier i Sverige?", options: ["För att staten ska kunna bestämma vad de skriver.", "För att det är viktigt för demokratin att det finns många olika medier som ger oss nyheter.", "För att tvinga dem att sända public service-program.", "För att förbjuda utländska medier i landet."], correct: "B", expl: "Staten ger stöd för att bevara en mångfald av medier, vilket är viktigt för en fungerande demokrati." },
      { text: "Vilket ansvar har en journalist innan de publicerar en uppgift?", options: ["Att kontrollera uppgiften med flera oberoende och pålitliga källor.", "Att fråga kungen om lov.", "Att skriva så att flest personer delar artikeln på sociala medier.", "Att alltid avslöja vem som gav dem tipset."], correct: "A", expl: "En journalist ska vara noggrann och källkritisk innan publicering." },
      { text: "Vad menas med att medier ibland fungerar som en granskare av makten?", options: ["Att de bestämmer vilka som ska bli politiker.", "Att journalister undersöker och rapporterar om hur politiker och myndigheter sköter sitt arbete.", "Att tidningar betalar ut löner till riksdagsledamöter.", "Att tv-kanaler skriver Sveriges lagar."], correct: "B", expl: "Mediernas roll är bland annat att kritiskt granska de som har makt i samhället, t.ex. genom offentlighetsprincipen." }
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
      message: 'Mediernas roll added successfully!' 
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

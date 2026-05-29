import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== 'manskliga-rattigheter-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Konuyu Oluştur
    const topic = await prisma.topic.create({
      data: {
        title: 'Mänskliga rättigheter',
        description: 'Kapitel 7 - Mänskliga rättigheter (från Sverige i fokus).',
        category: 'Samhällskunskap',
        order: 7,
        isPublished: true,
      },
    });

    // 2. Materyali (PDF) Ekle
    await prisma.material.create({
      data: {
        topicId: topic.id,
        type: 'PDF',
        title: 'Sverige i fokus - Kapitel 7: Mänskliga rättigheter',
        url: 'https://www.uhr.se/globalassets/_uhr.se/medborgarskapsprovet/utbildningsmaterial/sverige-i-fokus.pdf',
        order: 1,
      }
    });

    const flashcards = [
    {
        "front": "Vilken grundlag säger att det allmänna ska motverka diskriminering i Sverige?",
        "back": "Regeringsformen."
    },
    {
        "front": "Nämn tre grunder för diskriminering som nämns i regeringsformen.",
        "back": "T.ex. kön, hudfärg, ålder, sexuell läggning eller funktionshinder."
    },
    {
        "front": "När skapades Förenta nationerna (FN)?",
        "back": "Efter andra världskriget, år 1945."
    },
    {
        "front": "Hur många länder var med och skapade FN 1945?",
        "back": "51 länder."
    },
    {
        "front": "Vad var ett av de första uppdragen för FN?",
        "back": "Att komma överens om de mänskliga rättigheterna."
    },
    {
        "front": "Vilket år presenterade FN förklaringen om de mänskliga rättigheterna?",
        "back": "År 1948."
    },
    {
        "front": "Hur många artiklar (bestämmelser) innehåller FN:s förklaring om de mänskliga rättigheterna?",
        "back": "Totalt 30 artiklar."
    },
    {
        "front": "Har alla människor enligt FN rätt till sjukvård och utbildning?",
        "back": "Ja, alla ska ha rätt till det."
    },
    {
        "front": "Vad innebär det att ha rätt till en nationalitet enligt FN?",
        "back": "Att alla har rätt att vara medborgare i ett land och ingen får fråntas sitt medborgarskap utan laglig anledning."
    },
    {
        "front": "Får man bli tvingad att tro på en viss religion enligt de mänskliga rättigheterna?",
        "back": "Nej, man har rätt att tro på vilken religion man vill, eller att inte tro alls."
    },
    {
        "front": "Vad betyder ordet diskriminering?",
        "back": "Att vissa människor behandlas sämre än andra på grund av t.ex. kön eller etnicitet."
    },
    {
        "front": "Vilken lag i Sverige förbjuder specifikt diskriminering?",
        "back": "Diskrimineringslagen."
    },
    {
        "front": "Vad är målet med Sveriges jämställdhetspolitik?",
        "back": "Att kvinnor och män ska ha samma rättigheter, skyldigheter och makt."
    },
    {
        "front": "Hur arbetar Sverige för jämställdhet i politiken?",
        "back": "Partierna uppmuntras att utse lika många kvinnor som män till valen."
    },
    {
        "front": "Får en man och en kvinna ha olika lön om de gör exakt samma arbete i Sverige?",
        "back": "Nej, lagen säger att det ska vara lika lön för lika arbete."
    },
    {
        "front": "Vad är föräldrapenningens roll för jämställdheten?",
        "back": "Den gör det möjligt för både män och kvinnor att vara hemma med barnen när de är små."
    },
    {
        "front": "Är våld i nära relationer brottsligt i Sverige?",
        "back": "Ja, det är brottsligt enligt svensk lag."
    },
    {
        "front": "Vad innebär den svenska samtyckeslagen?",
        "back": "Att den som vill ha sex med en person måste försäkra sig om att den andra deltar frivilligt."
    },
    {
        "front": "Gäller samtyckeslagen även för par som är gifta med varandra?",
        "back": "Ja, den gäller även om personerna är gifta."
    },
    {
        "front": "Vad menas med hedersrelaterat våld?",
        "back": "När en familj eller grupp använder hot eller våld för att kontrollera hur medlemmar beter sig och följer släktens regler."
    },
    {
        "front": "Drabbar hedersrelaterat våld endast flickor och kvinnor?",
        "back": "Nej, det riktas även mot pojkar, män och HBTQ-personer."
    },
    {
        "front": "Enligt regeringsformen, vems rätt ska särskilt tas till vara?",
        "back": "Barns rätt (barnets rättigheter)."
    },
    {
        "front": "Vad är FN:s grundtanke om människors värde?",
        "back": "Alla människor är födda fria och har lika värde och rättigheter."
    },
    {
        "front": "Har alla rätt till vila och semester från arbetet enligt FN?",
        "back": "Ja."
    },
    {
        "front": "Om ditt liv är i fara i ditt hemland, vilken rätt har du enligt FN?",
        "back": "Rätten att fly, söka asyl och få skydd i ett annat land."
    },
    {
        "front": "Kan en person förlora sitt medborgarskap i Sverige hur som helst?",
        "back": "Nej, ingen får fråntas sitt medborgarskap utan godkänd och saklig anledning enligt lag."
    },
    {
        "front": "Vad kallas det om en person blir retad eller sämre behandlad för sin sexuella läggning på en arbetsplats?",
        "back": "Diskriminering."
    },
    {
        "front": "Hur arbetar fackförbund och myndigheter med löner?",
        "back": "De kontrollerar arbetsplatser för att se till att lönerna är rättvisa och jämställda."
    },
    {
        "front": "Vad innebär det att ha rätt till en åsikt?",
        "back": "Att man får tänka vad man vill och dela sin åsikt med andra."
    },
    {
        "front": "Varför skapades FN efter andra världskriget?",
        "back": "För att förhindra krig i framtiden och skydda varje människas rättigheter."
    }
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
    {
        "text": "Vilket år skapades Förenta nationerna (FN)?",
        "options": [
            "1914",
            "1939",
            "1945",
            "1989"
        ],
        "correct": "C",
        "expl": "FN skapades 1945 efter andra världskriget för att förhindra framtida krig och skydda mänskliga rättigheter."
    },
    {
        "text": "När presenterade FN förklaringen om de mänskliga rättigheterna?",
        "options": [
            "1945",
            "1948",
            "1960",
            "1995"
        ],
        "correct": "B",
        "expl": "FN presenterade förklaringen om de mänskliga rättigheterna år 1948."
    },
    {
        "text": "Hur många artiklar (bestämmelser) finns det i FN:s förklaring om de mänskliga rättigheterna?",
        "options": [
            "10",
            "20",
            "30",
            "50"
        ],
        "correct": "C",
        "expl": "Förklaringen innehåller totalt 30 bestämmelser som kallas artiklar."
    },
    {
        "text": "Vilken svensk grundlag slår fast att det allmänna ska motverka diskriminering?",
        "options": [
            "Successionsordningen",
            "Tryckfrihetsförordningen",
            "Regeringsformen",
            "Yttrandefrihetsgrundlagen"
        ],
        "correct": "C",
        "expl": "Regeringsformen säger att det allmänna ska motverka diskriminering på grund av t.ex. kön, hudfärg eller ålder."
    },
    {
        "text": "Vems rättigheter betonas särskilt i den svenska Regeringsformen förutom vuxna?",
        "options": [
            "Husdjurs rättigheter",
            "Barns rätt (barnets rättigheter)",
            "Företags rättigheter",
            "Turisters rättigheter"
        ],
        "correct": "B",
        "expl": "Enligt Regeringsformen ska barns rätt särskilt tas till vara."
    },
    {
        "text": "Vad betyder ordet diskriminering enligt svensk lag?",
        "options": [
            "Att alla får lika mycket lön.",
            "Att vissa människor behandlas sämre än andra på grund av t.ex. kön eller religion.",
            "Att man har rätt att säga sin åsikt.",
            "Att polisen får arrestera vem som helst."
        ],
        "correct": "B",
        "expl": "Diskriminering innebär en orättvis och sämre behandling av vissa grupper eller individer, vilket är ett lagbrott i Sverige."
    },
    {
        "text": "Vilket av följande är INTE en diskrimineringsgrund enligt den svenska diskrimineringslagen?",
        "options": [
            "Kön",
            "Ålder",
            "Sexuell läggning",
            "Politiskt parti"
        ],
        "correct": "D",
        "expl": "Politiskt parti är inte en av de lagstadgade diskrimineringsgrunderna (vilka är kön, ålder, etnicitet, religion, sexuell läggning, funktionsnedsättning, könsöverskridande identitet/uttryck)."
    },
    {
        "text": "Vad innebär Sveriges jämställdhetspolitik?",
        "options": [
            "Att män ska ha högre lön än kvinnor.",
            "Att kvinnor ska betala mer i skatt.",
            "Att kvinnor och män ska ha samma rättigheter, skyldigheter och makt att påverka.",
            "Att bara kvinnor får bestämma i politiken."
        ],
        "correct": "C",
        "expl": "Målet med jämställdhet är att makt, skyldigheter och rättigheter ska delas lika mellan män och kvinnor."
    },
    {
        "text": "Vad gör Sverige för att få jämställdhet inom politiken?",
        "options": [
            "Förbjuder män från att rösta.",
            "Uppmuntrar partierna att utse lika många kvinnor som män till valen.",
            "Tvingar fram kvinnliga partiledare i alla partier.",
            "Har två olika riksdagar."
        ],
        "correct": "B",
        "expl": "Sverige vill ha lika många kvinnor och män i politiken och uppmuntrar därför partierna till jämn könsfördelning."
    },
    {
        "text": "Vilken princip gäller för löner i Sverige när det kommer till jämställdhet?",
        "options": [
            "Män ska alltid tjäna 10 % mer.",
            "Lönen bestäms av hur många barn man har.",
            "Lika lön för lika arbete.",
            "Kvinnor ska alltid tjäna mer än män."
        ],
        "correct": "C",
        "expl": "Lagar och fackförbund arbetar för att se till att kvinnor och män får lika lön för lika arbete."
    },
    {
        "text": "Hur hjälper föräldrapenningen till att skapa jämställdhet?",
        "options": [
            "Den tvingar alla barn att gå i skolan.",
            "Den gör det möjligt för både män och kvinnor att vara hemma med sina barn.",
            "Den betalar för alla barnens leksaker.",
            "Den ges bara till mammor."
        ],
        "correct": "B",
        "expl": "Staten informerar och uppmuntrar föräldrar att dela på föräldraledigheten så att både mammor och pappor kan vara hemma."
    },
    {
        "text": "Vad innebär den svenska samtyckeslagen?",
        "options": [
            "Man måste skriva på ett avtal innan man gifter sig.",
            "Den som vill ha sex måste försäkra sig om att den andra deltar frivilligt.",
            "Man får inte prata om sex i skolan.",
            "Föräldrar måste samtycka till sina barns yrkesval."
        ],
        "correct": "B",
        "expl": "Samtyckeslagen betyder att sex måste vara frivilligt för båda parter, oavsett civilstånd."
    },
    {
        "text": "Gäller samtyckeslagen även för personer som är gifta med varandra?",
        "options": [
            "Nej, den gäller inte för gifta par.",
            "Ja, den gäller även när personerna är gifta.",
            "Den gäller bara om de varit gifta kortare än ett år.",
            "Endast om paret inte bor ihop."
        ],
        "correct": "B",
        "expl": "Ett äktenskap ger aldrig någon rätt att tvinga fram sex; samtyckeslagen gäller i alla relationer."
    },
    {
        "text": "Vad kännetecknar hedersrelaterat våld?",
        "options": [
            "Att en person använder våld för att stjäla pengar.",
            "Att en familj eller grupp använder våld eller hot för att kontrollera medlemmars beteende enligt släktens regler.",
            "Att polisen använder våld för att skydda staten.",
            "Våld som sker på grund av trafikbråk."
        ],
        "correct": "B",
        "expl": "Hedersvåld utövas för att en individ (ofta för att skydda familjens anseende) bryter mot släktens hedersnormer."
    },
    {
        "text": "Vem kan drabbas av hedersrelaterat våld och förtryck?",
        "options": [
            "Bara flickor.",
            "Bara kvinnor och flickor.",
            "Bara unga pojkar.",
            "Flickor, kvinnor, pojkar, män och HBTQ-personer."
        ],
        "correct": "D",
        "expl": "Även om det ofta drabbar flickor och kvinnor, kan hedersvåld rikta sig mot alla familjemedlemmar som bryter mot gruppens regler."
    },
    {
        "text": "Har en person rätt att söka asyl och få skydd i ett annat land enligt FN?",
        "options": [
            "Nej, asyl finns inte i mänskliga rättigheter.",
            "Endast om personen har mycket pengar.",
            "Ja, om ens liv är i fara.",
            "Bara om personen är över 18 år."
        ],
        "correct": "C",
        "expl": "Rätten att fly, söka asyl och få skydd är en av FN:s grundläggande mänskliga rättigheter."
    },
    {
        "text": "Vilken rättighet gäller religion enligt FN:s deklaration?",
        "options": [
            "Alla måste tillhöra en statsreligion.",
            "Rätt att tro på vilken religion man vill, eller att inte tro alls.",
            "Man får bara tro på kristendomen i Europa.",
            "Religion är helt förbjudet."
        ],
        "correct": "B",
        "expl": "Religionsfrihet innebär att var och en får välja religion fritt eller välja att inte vara religiös alls."
    },
    {
        "text": "Har varje människa rätt till vila och semester från arbetet enligt FN?",
        "options": [
            "Ja, det är en mänsklig rättighet.",
            "Nej, arbetstiden är oändlig.",
            "Bara om man arbetar statligt.",
            "Nej, det bestämmer varje chef ensam."
        ],
        "correct": "A",
        "expl": "Rätten till vila, fritid och regelbunden betald semester är fastställd av FN."
    },
    {
        "text": "Vad innebär det att alla människor är födda fria?",
        "options": [
            "Att man aldrig behöver betala skatt.",
            "Att man har lika värde och rättigheter från födseln.",
            "Att lagar inte gäller för nyfödda.",
            "Att man får ta andras egendom."
        ],
        "correct": "B",
        "expl": "Det betyder att ingen människa är värd mer än någon annan och att alla har samma grundläggande rättigheter."
    },
    {
        "text": "Kan en person fråntas sitt medborgarskap utan saklig anledning?",
        "options": [
            "Ja, om politikerna ogillar personen.",
            "Ja, om personen flyttar utomlands.",
            "Nej, ingen får fråntas sitt medborgarskap utan godkänd och saklig anledning enligt lagen.",
            "Ja, när personen fyller 65 år."
        ],
        "correct": "C",
        "expl": "Rätten till en nationalitet innebär att man inte godtyckligt kan bli av med sitt medborgarskap."
    },
    {
        "text": "Har alla rätt att gå i skolan enligt mänskliga rättigheter?",
        "options": [
            "Endast barn i rika länder.",
            "Bara pojkar.",
            "Ja, alla har rätt till utbildning.",
            "Bara de som har råd att betala för skolan."
        ],
        "correct": "C",
        "expl": "Utbildning, särskilt på grundskolenivå, är en mänsklig rättighet."
    },
    {
        "text": "Vad är ett exempel på våld i nära relationer?",
        "options": [
            "När två fotbollssupportrar bråkar på gatan.",
            "Ett rån utfört av en okänd person på bussen.",
            "När en person blir utsatt för våld av en familjemedlem eller partner.",
            "När polis arresterar en brottsling."
        ],
        "correct": "C",
        "expl": "Våld i nära relationer sker inom familjen eller mellan partners."
    },
    {
        "text": "Varför sattes mänskliga rättigheter på pränt efter andra världskriget?",
        "options": [
            "För att tjäna pengar på böcker.",
            "För att förhindra framtida krig och skydda individers värde och rättigheter efter Förintelsen.",
            "För att starta fler krig.",
            "För att minska antalet länder i världen."
        ],
        "correct": "B",
        "expl": "Förödelserna under andra världskriget ledde till insikten att världen behövde en universell förklaring för att skydda människor."
    },
    {
        "text": "Är diskriminering på grund av funktionsnedsättning lagligt i Sverige?",
        "options": [
            "Ja, om arbetsplatsen är liten.",
            "Ja, om personen inte kan arbeta 100%.",
            "Nej, det är ett brott mot diskrimineringslagen.",
            "Ja, men bara i skolor."
        ],
        "correct": "C",
        "expl": "Diskrimineringslagen förbjuder orättvis behandling baserad på funktionsnedsättning i alla samhällsområden."
    },
    {
        "text": "Vad kallas idén om att män och kvinnor ska ha samma makt i samhället?",
        "options": [
            "Sekretess",
            "Offentlighetsprincipen",
            "Jämställdhet",
            "Källkritik"
        ],
        "correct": "C",
        "expl": "Jämställdhet handlar om lika villkor, makt och möjligheter oavsett kön."
    },
    {
        "text": "Kan en kvinna bli chef i Sverige med samma möjligheter som en man?",
        "options": [
            "Ja, jämställdhetspolitiken strävar efter att höja andelen kvinnliga chefer och ge samma möjligheter.",
            "Nej, lagar förbjuder kvinnor att vara chefer.",
            "Ja, men bara i förskolor.",
            "Nej, kvinnor tjänar alltid mindre pengar."
        ],
        "correct": "A",
        "expl": "Ett av målen med den svenska jämställdhetspolitiken är att bryta strukturer och säkerställa att kvinnor har samma chans till ledande positioner."
    },
    {
        "text": "Får man säga sin åsikt fritt enligt FN:s deklaration?",
        "options": [
            "Nej, åsikter måste godkännas av regeringen.",
            "Ja, alla har rätt att säga sin åsikt och dela den med andra.",
            "Bara om åsikten är positiv.",
            "Ja, men man får inte dela den på internet."
        ],
        "correct": "B",
        "expl": "Yttrandefrihet och åsiktsfrihet är en central del av de mänskliga rättigheterna."
    },
    {
        "text": "Hur många länder grundade Förenta nationerna (FN) 1945?",
        "options": [
            "10 länder",
            "51 länder",
            "100 länder",
            "Alla länder i världen"
        ],
        "correct": "B",
        "expl": "FN skapades 1945 av 51 ursprungliga medlemsländer."
    },
    {
        "text": "Får det allmänna (staten och kommunerna) i Sverige diskriminera medborgare?",
        "options": [
            "Ja, om de anser att det behövs för säkerheten.",
            "Nej, det allmänna ska motverka all diskriminering enligt Regeringsformen.",
            "Ja, men bara mot nyanlända.",
            "Ja, om personen saknar inkomst."
        ],
        "correct": "B",
        "expl": "Regeringsformen fastställer tydligt att det allmänna ska motverka diskriminering."
    },
    {
        "text": "Vilken typ av förtryck handlar ofta om att bevara en familjs 'ära' eller sociala rykte?",
        "options": [
            "Källkritik",
            "Politiskt förtryck",
            "Hedersrelaterat våld och förtryck",
            "Arbetsplatsmobbning"
        ],
        "correct": "C",
        "expl": "Hedersrelaterat våld utgår ifrån strikta normer där familjens anseende anses bero på medlemmarnas beteende."
    }
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
      message: 'Mänskliga rättigheter added successfully!' 
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

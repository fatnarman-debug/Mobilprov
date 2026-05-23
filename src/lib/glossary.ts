export type GlossaryItem = {
  term: string;
  translation: string;
  definition: string;
};

export const glossaryData: Record<string, Record<string, GlossaryItem>> = {
  TR: {
    // Existing terms
    "offentlighetsprincipen": {
      term: "Offentlighetsprincipen",
      translation: "Alenilik (Şeffaflık) İlkesi",
      definition: "Vatandaşların ve medyanın, devlet kurumlarının resmi belgelerine ve kararlarına erişebilmesini sağlayan İsveç anayasal hakkıdır."
    },
    "riksdagen": {
      term: "Riksdagen",
      translation: "İsveç Parlamentosu",
      definition: "İsveç'in yasama organı olan, yasaları yapan ve 349 milletvekilinden oluşan meclistir."
    },
    "regeringen": {
      term: "Regeringen",
      translation: "İsveç Hükümeti",
      definition: "Yönetme gücüne sahip olan, yasaları uygulayan ve başbakan ile bakanlardan oluşan organdır."
    },
    "grundlagar": {
      term: "Grundlagar",
      translation: "Anayasalar (Temel Kanunlar)",
      definition: "İsveç'in yönetim biçimini ve vatandaş haklarını güvence altına alan, değiştirilmesi zor olan 4 temel yasadır."
    },
    "motion": {
      term: "Motion",
      translation: "Milletvekili Yasa Teklifi",
      definition: "Parlamentodaki bir veya birden fazla milletvekili tarafından meclise sunulan yasa veya karar tasarısı teklifidir."
    },
    "proposition": {
      term: "Proposition",
      translation: "Hükümet Yasa Tasarısı",
      definition: "Hükümet tarafından hazırlanarak onaylanması için parlamentoya (Riksdagen) sunulan resmi yasa tasarısı teklifidir."
    },
    "statsminister": {
      term: "Statsminister",
      translation: "Başbakan",
      definition: "Hükümetin başı olan, bakanları seçen ve genel yürütmeden sorumlu en yetkili yöneticidir."
    },
    "remiss": {
      term: "Remiss",
      translation: "Görüş Alma (İstişare) Süreci",
      definition: "Bir yasa tasarısı yasalaşmadan önce, ilgili uzman kuruluşlara, mahkemelere veya STK'lara görüş bildirmeleri için gönderilmesi sürecidir."
    },
    "kommun": {
      term: "Kommun",
      translation: "Belediye (Yerel Yönetim)",
      definition: "Okullar, yaşlı bakımı, su ve temizlik gibi yerel kamu hizmetlerinden sorumlu olan yerel idari birimlerdir."
    },
    "länsstyrelsen": {
      term: "Länsstyrelsen",
      translation: "Valilik / İl İdari Kurulu",
      definition: "Hükümetin kararlarını bölge düzeyinde uygulayan, valinin başkanlık ettiği il idari temsilciliğidir."
    },
    "syftet": {
      term: "Syftet",
      translation: "Amaç / Gaye",
      definition: "Bir eylemin veya oluşumun gerçekleştirilme hedefi veya amacıdır."
    },
    "traditioner": {
      term: "Traditioner",
      translation: "Gelenekler",
      definition: "Bir toplumda veya toplulukta kuşaktan kuşağa aktarılan kültürel alışkanlıklar ve törelerdir."
    },
    "tidpunkter": {
      term: "Tidpunkter",
      translation: "Zaman dilimleri / Anlar",
      definition: "Belirli olayların gerçekleştiği zamanlar veya belirli tarihlerdir."
    },

    // New common citizenship question terms
    "firas": {
      term: "Firas",
      translation: "Kutlanır",
      definition: "Bir bayramın, yıldönümünün veya özel bir günün resmi veya geleneksel etkinliklerle gerçekleştirilmesidir."
    },
    "påsken": {
      term: "Påsken",
      translation: "Paskalya",
      definition: "Hristiyanlıkta İsa'nın yeniden dirilişini ve baharın gelişini kutlayan en önemli dini bayramlardan biridir."
    },
    "påskafton": {
      term: "Påskafton",
      translation: "Paskalya Arifesi",
      definition: "Paskalya Pazarı'ndan bir önceki gün (Cumartesi) olup, İsveç'te geleneksel olarak yumurta ve balık yemeklerinin yenildiği gündür."
    },
    "traditionellt": {
      term: "Traditionellt",
      translation: "Geleneksel olarak",
      definition: "Kuşaktan kuşağa aktarılan alışkanlıklara ve kültürel göreneklere uygun şekilde yapılan."
    },
    "innebär": {
      term: "Innebär",
      translation: "Anlamına gelir / Kapsar",
      definition: "Bir durumun, kelimenin veya kararın ne ifade ettiğini veya beraberinde ne getirdiğini açıklar."
    },
    "kallas": {
      term: "Kallas",
      translation: "Adlandırılır / Denir",
      definition: "Bir kişiye, nesneye, kavrama veya olaya belirli bir isim verilmesini ifade eder."
    },
    "staten": {
      term: "Staten",
      translation: "Devlet",
      definition: "Ülkeyi yöneten egemen güç; parlamento, hükümet, mahkemeler ve tüm kamu kurumlarının bütünü."
    },
    "kyrkan": {
      term: "Kyrkan",
      translation: "Kilise",
      definition: "Hristiyan ibadethanesi veya genel olarak Hristiyan dini teşkilatı (örn: İsveç Kilisesi)."
    },
    "rättigheter": {
      term: "Rättigheter",
      translation: "Haklar",
      definition: "Bireylerin yasal, anayasal veya ahlaki olarak sahip olduğu yetki, özgürlük ve kazanımların tamamıdır."
    },
    "skyldigheter": {
      term: "Skyldigheter",
      translation: "Yükümlülükler / Görevler",
      definition: "Vatandaşların devlete, yasalara ve topluma karşı yerine getirmek zorunda olduğu sorumluluklar."
    },
    "mänskliga": {
      term: "Mänskliga",
      translation: "İnsani / İnsan (Hakları)",
      definition: "İnsan türüne özgü veya evrensel insan hakları çerçevesindeki kavramlar."
    },
    "myndighet": {
      term: "Myndighet",
      translation: "Kamu Kurumu / Resmi Makam",
      definition: "Yasal çerçevede kamu hizmeti sunan ve devlet adına karar alan resmi yürütme kuruluşu (örn: Skatteverket)."
    },
    "offentliga": {
      term: "Offentliga",
      translation: "Kamusal / Resmi (Devlet)",
      definition: "Devlete ait olan, halka açık hizmet veya kuruluşlar sektörüdür."
    },
    "många": {
      term: "Många",
      translation: "Birçok / Çok sayıda",
      definition: "Belirli bir grubun veya nesnenin sayıca fazla olduğunu belirtir."
    },
    "finns": {
      term: "Finns",
      translation: "Vardır / Bulunur",
      definition: "Bir nesnenin, durumun veya kuralın mevcut olduğunu belirtir."
    },
    "länder": {
      term: "Länder",
      translation: "Ülkeler",
      definition: "Belirli sınırlara, yasalara ve hükümete sahip olan bağımsız coğrafi birimler."
    },
    "största": {
      term: "Största",
      translation: "En büyük",
      definition: "Boyut, miktar, sayı veya önem yönünden en üst derecede ve en ön sırada olan."
    },
    "måste": {
      term: "Måste",
      translation: "Zorundadır / -meli",
      definition: "Yasal veya ahlaki gerekçelerle yapılması kaçınılmaz veya zorunlu olan eylemler."
    },
    "religion": {
      term: "Religion",
      translation: "Din / İnanç",
      definition: "İlahi güç inancı, ahlak kuralları ve ibadet sistemlerinin oluşturduğu yapı."
    },
    "blev": {
      term: "Blev",
      translation: "Oldu / Dönüştü",
      definition: "Bir durumun veya niteliğin zamanla başka bir hale bürünmesini ifade eden fiil."
    },
    "enligt": {
      term: "Enligt",
      translation: "Göre / Uyarınca",
      definition: "Bir yasa maddesine, anayasaya veya resmi bir kaynağa dayanılarak yapılan bildirim."
    },
    "sektorn": {
      term: "Sektorn",
      translation: "Sektör / Alan",
      definition: "Ekonominin veya toplumsal çalışma hayatının belirli bir bölümüdür (kamu sektörü vb.)."
    },
    "får": {
      term: "Får",
      translation: "Edebilir / İzin verilir",
      definition: "Bir eylemi gerçekleştirmek için yasal izne, hakka veya imkana sahip olmak."
    },
    "första": {
      term: "Första",
      translation: "İlk / Birinci",
      definition: "Sıralama, zaman veya derece bakımından en başta yer alan."
    },
    "val": {
      term: "Val",
      translation: "Seçim",
      definition: "Milletvekili, belediye başkanı vb. temsilcileri belirlemek için halkın sandık başına giderek oy kullanması."
    },
    "krig": {
      term: "Krig",
      translation: "Savaş",
      definition: "Ülkeler veya büyük silahlı gruplar arasındaki açık ve organize çatışma durumu."
    },
    "barn": {
      term: "Barn",
      translation: "Çocuk",
      definition: "Henüz ergenlik çağına girmemiş, bakım ve eğitime ihtiyaç duyan genç insan."
    },
    "privata": {
      term: "Privata",
      translation: "Özel (Sektör) / Şahsi",
      definition: "Devlete ait olmayan, şahıs, dernek veya özel şirket mülkiyetindeki kuruluş veya alan."
    },
    "arbetar": {
      term: "Arbetar",
      translation: "Çalışır / Görev yapar",
      definition: "Bir iş yerinde, görevde veya hizmette emek harcayarak faaliyette bulunmak."
    },
    "demokrati": {
      term: "Demokrati",
      translation: "Demokrasi",
      definition: "Egemenliğin halka ait olduğu, temel özgürlüklerin ve yasalar önünde eşitliğin korunduğu yönetim biçimidir."
    },
    "lagar": {
      term: "Lagar",
      translation: "Yasalar / Kanunlar",
      definition: "Toplum düzenini ve adaleti sağlamak amacıyla meclis tarafından çıkarılan uyulması zorunlu kurallar."
    },
    "skatt": {
      term: "Skatt",
      translation: "Vergi",
      definition: "Devletin kamusal hizmetleri (sağlık, eğitim, yol) finanse etmek üzere vatandaşlardan topladığı zorunlu para."
    },
    "valborgsmässoafton": {
      term: "Valborgsmässoafton",
      translation: "Valborg Gecesi Arifesi",
      definition: "Baharı karşılamak için 30 Nisan akşamı dev ateşler (valborgsmässobål) yakılıp korolar halinde şarkılar söylenen gün."
    },
    "midsommarafton": {
      term: "Midsommarafton",
      translation: "Yaz Gündönümü Arifesi",
      definition: "Haziran ayında en uzun günün, çiçeklerle süslenmiş bir direk etrafında halk danslarıyla kutlandığı en meşhur İsveç bayramı."
    },
    "julafton": {
      term: "Julafton",
      translation: "Noel Arifesi",
      definition: "İsveç'te Noel kutlamalarının ana günü olan, ailelerin bir araya gelip hediyeleştiği 24 Aralık günüdür."
    },
    "jul": {
      term: "Jul",
      translation: "Noel / Christmas",
      definition: "İsa'nın doğumunun kutlandığı Hristiyan bayramıdır."
    },
    "sveriges": {
      term: "Sveriges",
      translation: "İsveç'in",
      definition: "İsveç Krallığı devletine ait olan veya onunla ilişkili olan."
    },
    "kung": {
      term: "Kung",
      translation: "Kral",
      definition: "İsveç Krallığı'nda monarşiyi temsil eden erkek devlet başkanı (temsili görevdedir)."
    },
    "drottning": {
      term: "Drottning",
      translation: "Kraliçe",
      definition: "İsveç Krallığı'nda devleti temsil eden kadın hükümdar veya kralın eşidir."
    },
    "riksdag": {
      term: "Riksdag",
      translation: "Parlamento / Meclis",
      definition: "İsveç'te yasaları yapan en yüksek siyasi yasama organıdır."
    },
    "regering": {
      term: "Regering",
      translation: "Hükümet",
      definition: "Parlamentonun çıkardığı yasaları yürütmek ve devleti idare etmekle görevli başbakan ve bakanlar heyeti."
    },
    "rösträtt": {
      term: "Rösträtt",
      translation: "Oy kullanma hakkı",
      definition: "Vatandaşların seçimlerde kendi temsilcilerini belirlemek için oy verme yasal hakkıdır."
    },
    "medborgare": {
      term: "Medborgare",
      translation: "Vatandaş / Yurttaş",
      definition: "İsveç devletine anayasal olarak bağlı olan, hak ve sorumlulukları yasalarla güvenceye alınmış birey."
    },
    "medborgarskap": {
      term: "Medborgarskap",
      translation: "Vatandaşlık / Yurttaşlık",
      definition: "Kişi ile devlet arasındaki karşılıklı sadakat, hak ve sorumluluk bağı."
    },
    "prov": {
      term: "Prov",
      translation: "Sınav / Test",
      definition: "Bilgi, yetenek veya seviyeyi ölçmek amacıyla uygulanan yazılı veya sözlü değerlendirme."
    },
    "frågor": {
      term: "Frågor",
      translation: "Sorular",
      definition: "Sınavda veya pratik sırasında bilgi seviyesini test etmek üzere yöneltilen cümleler."
    },
    "svar": {
      term: "Svar",
      translation: "Cevap / Yanıt",
      definition: "Yöneltilen bir sorunun çözümünü veya karşılığını içeren ifade."
    },
    "vanlig": {
      term: "Vanlig",
      translation: "Yaygın / Olağan",
      definition: "Çok sık karşılaşılan, olağan, standart ya da normal kabul edilen durumdur."
    }
  },
  EN: {
    // Existing terms
    "offentlighetsprincipen": {
      term: "Offentlighetsprincipen",
      translation: "Principle of Public Access",
      definition: "The constitutional right that guarantees public and media access to official government documents, records, and diaries."
    },
    "riksdagen": {
      term: "Riksdagen",
      translation: "The Swedish Parliament",
      definition: "The supreme legislative body of Sweden, consisting of 349 members elected every four years."
    },
    "regeringen": {
      term: "Regeringen",
      translation: "The Swedish Government",
      definition: "The executive body of Sweden, led by the Prime Minister and responsible for implementing laws passed by the parliament."
    },
    "grundlagar": {
      term: "Grundlagar",
      translation: "Fundamental Laws (Constitution)",
      definition: "The four primary laws that make up Sweden's written constitution, governing how the state works and protecting citizen rights."
    },
    "motion": {
      term: "Motion",
      translation: "Member's Bill (Parliamentary)",
      definition: "A formal proposal or bill submitted to the parliament by one or more individual members of the Riksdag."
    },
    "proposition": {
      term: "Proposition",
      translation: "Government Bill",
      definition: "A legislative proposal or draft bill submitted by the Government to the Parliament (Riksdagen) for debate and vote."
    },
    "statsminister": {
      term: "Statsminister",
      translation: "Prime Minister",
      definition: "The head of government in Sweden, responsible for directing executive policy and appointing government ministers."
    },
    "remiss": {
      term: "Remiss",
      translation: "Consultation / Referral Process",
      definition: "The process where draft legislation is sent to government agencies, courts, and interest groups for comments before becoming law."
    },
    "kommun": {
      term: "Kommun",
      translation: "Municipality",
      definition: "Local government units responsible for local public services like schools, preschools, eldercare, and waste management."
    },
    "länsstyrelsen": {
      term: "Länsstyrelsen",
      translation: "County Administrative Board",
      definition: "The government agency responsible for representing national interests and supervising local implementation at the county level."
    },
    "syftet": {
      term: "Syftet",
      translation: "The Purpose",
      definition: "The objective or intention behind an action or concept."
    },
    "traditioner": {
      term: "Traditioner",
      translation: "Traditions",
      definition: "Cultural habits, customs, or beliefs passed down from generation to generation."
    },
    "tidpunkter": {
      term: "Tidpunkter",
      translation: "Points in time / Moments",
      definition: "Specific dates, times, or periods when events occur."
    },

    // New terms
    "firas": {
      term: "Firas",
      translation: "is celebrated",
      definition: "The act of observing a holiday, anniversary, or special event with ceremonies or festivities."
    },
    "påsken": {
      term: "Påsken",
      translation: "Easter",
      definition: "A Christian festival celebrating the resurrection of Jesus Christ, held in spring."
    },
    "påskafton": {
      term: "Påskafton",
      translation: "Easter Eve",
      definition: "The Saturday before Easter Sunday, traditionally celebrated in Sweden with egg and fish dishes."
    },
    "traditionellt": {
      term: "Traditionellt",
      translation: "traditionally",
      definition: "In a way that is consistent with long-established customs or beliefs."
    },
    "innebär": {
      term: "Innebär",
      translation: "means / implies / involves",
      definition: "Explains what a concept, word, or decision represents or brings with it."
    },
    "kallas": {
      term: "Kallas",
      translation: "is called / named",
      definition: "Refers to the name given to a person, object, or concept."
    },
    "staten": {
      term: "Staten",
      translation: "the State",
      definition: "The government and public institutions that govern a country, including parliament, government, and courts."
    },
    "kyrkan": {
      term: "Kyrkan",
      translation: "the Church",
      definition: "A Christian house of worship or the Christian religious organization (e.g., the Church of Sweden)."
    },
    "rättigheter": {
      term: "Rättigheter",
      translation: "rights",
      definition: "Legal, constitutional, or moral entitlements and freedoms that individuals possess."
    },
    "skyldigheter": {
      term: "Skyldigheter",
      translation: "obligations / duties",
      definition: "Legal or moral responsibilities that citizens must fulfill towards the state and society."
    },
    "mänskliga": {
      term: "Mänskliga",
      translation: "human (rights)",
      definition: "Relating to the human species or universal human rights."
    },
    "myndighet": {
      term: "Myndighet",
      translation: "government agency / authority",
      definition: "A public organization responsible for executing laws and public services (e.g., Tax Agency)."
    },
    "offentliga": {
      term: "Offentliga",
      translation: "public (sector)",
      definition: "Relating to public services, facilities, or the government sector."
    },
    "många": {
      term: "Många",
      translation: "many",
      definition: "A large number of elements or people."
    },
    "finns": {
      term: "Finns",
      translation: "there is / exists",
      definition: "Indicates that an object, rule, or situation is present or exists."
    },
    "länder": {
      term: "Länder",
      translation: "countries",
      definition: "Sovereign territories governed by their own laws and governments."
    },
    "största": {
      term: "Största",
      translation: "the largest / greatest",
      definition: "The highest in size, amount, or importance."
    },
    "måste": {
      term: "Måste",
      translation: "must / has to",
      definition: "Indicates a legal or moral obligation to perform a specific action."
    },
    "religion": {
      term: "Religion",
      translation: "religion",
      definition: "A system of beliefs, worship, and moral codes concerning divine power."
    },
    "blev": {
      term: "Blev",
      translation: "became",
      definition: "Transitioned from one state or quality to another."
    },
    "enligt": {
      term: "Enligt",
      translation: "according to",
      definition: "Based on a source, law, or statement."
    },
    "sektorn": {
      term: "Sektorn",
      translation: "the sector / field",
      definition: "A specific branch of the economy or career field (e.g., public sector)."
    },
    "får": {
      term: "Får",
      translation: "may / is allowed to",
      definition: "Having legal permission or authority to perform an action."
    },
    "första": {
      term: "Första",
      translation: "first",
      definition: "The leading element in order, time, or rank."
    },
    "val": {
      term: "Val",
      translation: "election",
      definition: "A formal voting process to choose political representatives (MPs, municipal council members)."
    },
    "krig": {
      term: "Krig",
      translation: "war",
      definition: "A state of armed conflict between nations or major groups."
    },
    "barn": {
      term: "Barn",
      translation: "child / children",
      definition: "A young human being below the age of puberty."
    },
    "privata": {
      term: "Privata",
      translation: "private (sector)",
      definition: "Relating to individuals or companies, not controlled by the state."
    },
    "arbetar": {
      term: "Arbetar",
      translation: "works / serves",
      definition: "To perform labor or tasks as a job or official function."
    },
    "demokrati": {
      term: "Demokrati",
      translation: "democracy",
      definition: "A system of government based on public representation, equal rights, and the rule of law."
    },
    "lagar": {
      term: "Lagar",
      translation: "laws",
      definition: "The rules established by the parliament that all citizens must follow."
    },
    "skatt": {
      term: "Skatt",
      translation: "tax",
      definition: "A compulsory financial contribution imposed by the state to fund public services (schools, roads, etc.)."
    },
    "valborgsmässoafton": {
      term: "Valborgsmässoafton",
      translation: "Walpurgis Night",
      definition: "A traditional Swedish festival on April 30th celebrating the arrival of spring with large bonfires and choral singing."
    },
    "midsommarafton": {
      term: "Midsommarafton",
      translation: "Midsummer's Eve",
      definition: "One of Sweden's most famous holidays in June, celebrating the longest day of the year with a maypole and folk dancing."
    },
    "julafton": {
      term: "Julafton",
      translation: "Christmas Eve",
      definition: "The main day of Christmas celebrations in Sweden on December 24th, spent with family."
    },
    "jul": {
      term: "Jul",
      translation: "Christmas",
      definition: "An annual holiday commemorating the birth of Jesus Christ."
    },
    "sveriges": {
      term: "Sveriges",
      translation: "Sweden's",
      definition: "Belonging to or associated with the Kingdom of Sweden."
    },
    "kung": {
      term: "Kung",
      translation: "King",
      definition: "The male head of state in the Kingdom of Sweden (non-political, symbolic role)."
    },
    "drottning": {
      term: "Drottning",
      translation: "Queen",
      definition: "The female head of state in the Kingdom of Sweden or the wife of the king."
    },
    "riksdag": {
      term: "Riksdag",
      translation: "parliament",
      definition: "The supreme legislative body of Sweden consisting of 349 elected members."
    },
    "regering": {
      term: "Regering",
      translation: "government",
      definition: "The executive body led by the Prime Minister, responsible for implementing parliament's decisions."
    },
    "rösträtt": {
      term: "Rösträtt",
      translation: "right to vote / suffrage",
      definition: "The legal right of citizens to vote in elections."
    },
    "medborgare": {
      term: "Medborgare",
      translation: "citizen",
      definition: "A legally recognized member of a state, holding specific rights and obligations."
    },
    "medborgarskap": {
      term: "Medborgarskap",
      translation: "citizenship",
      definition: "The status of being a citizen, representing the mutual legal bond between a person and the state."
    },
    "prov": {
      term: "Prov",
      translation: "test / exam",
      definition: "A formal evaluation designed to measure knowledge, skills, or level."
    },
    "frågor": {
      term: "Frågor",
      translation: "questions",
      definition: "Sentences asked to elicit responses or evaluate knowledge during practice."
    },
    "svar": {
      term: "Svar",
      translation: "answer / response",
      definition: "The statement or option that resolves a question."
    },
    "vanlig": {
      term: "Vanlig",
      translation: "common / usual",
      definition: "Frequently encountered, customary, or standard."
    }
  }
};

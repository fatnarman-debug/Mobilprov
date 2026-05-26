'use server';

export async function translateText(text: string, targetLang: string = 'tr') {
  if (!text) {
    return { error: 'Texten kan inte vara tom.' };
  }

  const cleanText = text.trim();
  if (cleanText.length > 2000) {
    return { error: 'Texten är för lång (Max 2000 tecken).' };
  }

  try {
    const langMap: Record<string, string> = {
      en: 'en',
      tr: 'tr',
      ar: 'ar',
      es: 'es',
      uk: 'uk',
      fr: 'fr',
      fa: 'fa',
      da: 'prs' // Dari code in Google Translate
    };
    
    const lang = langMap[targetLang.toLowerCase()] || 'tr';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=sv&tl=${lang}&dt=t&q=${encodeURIComponent(cleanText)}`;
    
    console.log(`[Translation Request] Text: "${cleanText.substring(0, 50)}...", targetLang: "${targetLang}", lang: "${lang}"`);

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`[Translation Request] Google API failed with status ${res.status}`);
      throw new Error(`Google API returned status ${res.status}`);
    }

    const data = await res.json();
    
    // Parse Google Translate single char single array format
    let translation = '';
    if (data && data[0] && Array.isArray(data[0])) {
      translation = data[0].map((item: any) => item[0]).join('');
    }

    if (!translation) {
      return { error: 'Ingen översättning hittades.' };
    }

    return { translation };
  } catch (error) {
    console.error('Translation server action error:', error);
    return { error: 'Översättningstjänsten är inte tillgänglig för tillfället.' };
  }
}



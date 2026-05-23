'use server';

export async function translateText(text: string, targetLang: string = 'tr') {
  if (!text) {
    return { error: 'Metin boş olamaz.' };
  }

  const cleanText = text.trim();
  if (cleanText.length > 200) {
    return { error: 'Metin çok uzun (Maks. 200 karakter).' };
  }

  try {
    const lang = targetLang.toLowerCase() === 'en' ? 'en' : 'tr';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=sv&tl=${lang}&dt=t&q=${encodeURIComponent(cleanText)}`;
    
    console.log(`[Translation Request] Text: "${cleanText}", targetLang: "${targetLang}", lang: "${lang}"`);
    console.log(`[Translation Request] URL: "${url}"`);

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
    console.log('[Translation Request] Raw response data:', JSON.stringify(data));
    
    // Parse Google Translate single char single array format
    // data[0] contains array of translation segments: [[translation, original, ...]]
    let translation = '';
    if (data && data[0] && Array.isArray(data[0])) {
      translation = data[0].map((item: any) => item[0]).join('');
    }

    console.log(`[Translation Request] Parsed translation: "${translation}"`);

    if (!translation) {
      return { error: 'Çeviri bulunamadı.' };
    }

    return { translation };
  } catch (error) {
    console.error('Translation server action error:', error);
    return { error: 'Çeviri servisine şu anda ulaşılamıyor.' };
  }
}




import axios from 'axios';

const BASE = 'https://api.w9999.app';

// Helper functions for encoding/decoding
export function encodeWordSlug(word) {
  return word.replace(/\//g, '~');
}

export function decodeWordSlug(slug) {
  return slug.replace(/~/g, '/');
}

export async function getAllWordSlugs() {
  try {
    const url = `${BASE}/api/public/slugs`;
    const { data } = await axios.get(url);

    return Array.isArray(data)
      ? data.map(item => ({
          lang: item.lang,
          word: encodeWordSlug(item.word), // ENCODE for URL
        }))
      : [];
  } catch (e) {
    console.error('getAllWordSlugs error:', e);
    return [];
  }
}

export async function getRichWord(lang, word) {
  const encodedWord = encodeURIComponent(word);
  const url = `${BASE}/api/public/word-rich?from=${lang}&word=${encodedWord}`;
  const res = await fetch(url);

  if (res.status === 404) return null;

  // Other failures should still throw (500, 502, etc.)
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`getRichWord failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

export const generateSpeech = async (data) => {
  if (!data.text) {
    return null;
  }
  const url = `${BASE}/api/words/voice`;
  const response = await axios.post(url, data, {
    responseType: 'blob'
  });
  return response.data; // Returns the Blob
};

export async function getTopWords(languageCode, limit = 1000, pos = null) {
  try {
    let url;

    if (pos && pos !== 'words' && pos !== 'all') {
      url = `${BASE}/api/public/top-words/${languageCode}/${pos}?limit=${limit}`;
    } else {
      url = `${BASE}/api/public/top-words/${languageCode}?limit=${limit}`;
    }

    console.log(`🔄 [getTopWords] Fetching: ${url}`);
    const { data } = await axios.get(url);
    
    // ENCODE words containing '/' for URL safety
    const words = (data?.words || []).map(word => ({
      ...word,
      urlSlug: encodeWordSlug(word.text), // Add encoded version
    }));

    console.log(`✅ [getTopWords] Retrieved ${words.length} words for ${languageCode}`);
    return words;

  } catch (e) {
    console.error(`💥 [getTopWords] Error for ${languageCode} (POS: ${pos || 'mixed'}):`, e.message);
    return [];
  }
}

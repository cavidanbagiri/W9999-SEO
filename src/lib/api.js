

import axios from 'axios';

// const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://duolingopocketserver.onrender.com';
// const BASE = 'https://api.w9999.app';
const BASE = 'http://localhost:8000';


export async function getAllWordSlugs() {
  try {
    const url = `${BASE}/api/public/slugs`;
    
    const { data } = await axios.get(url);
    
    const transformed = Array.isArray(data) 
      ? data.map(item => {
          const encoded = encodeURIComponent(item.word);
          return {
            lang: item.lang,
            word: encoded
          };
        })
      : [];
    
    return transformed;
  } catch (e) {
    return [];
  }
}


export async function getRichWord(lang, word) {
  const encodedWord = encodeURIComponent(word);
  const url = `${BASE}/api/public/word-rich?from=${lang}&word=${encodedWord}`;
  const res = await fetch(url);
    
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Word not found (${res.status}): ${errorText}`);
  }
  
  const data = await res.json();
  
  return data;
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




/**
 * Unified fetcher for Top Words.
 * 
 * @param {string} languageCode - 'en', 'de', 'es', etc.
 * @param {number} limit - Number of words (default 1000)
 * @param {string|null} pos - (Optional) 'verb', 'noun', 'adjective'. 
 *                            If null/undefined, fetches mixed top words.
 */
export async function getTopWords(languageCode, limit = 1000, pos = null) {
  try {
    let url;

    // Check if we need the POS-specific endpoint
    // We ignore 'words' or 'all' if those are accidentally passed as a category
    if (pos && pos !== 'words' && pos !== 'all') {
      // Endpoint: /top-words/{lang}/{pos}
      url = `${BASE}/api/public/top-words/${languageCode}/${pos}?limit=${limit}`;
    } else {
      // Endpoint: /top-words/{lang}
      url = `${BASE}/api/public/top-words/${languageCode}?limit=${limit}`;
    }

    const { data } = await axios.get(url);
    
    // Return empty array if words is missing for safety
    return data?.words || [];

  } catch (e) {
    // Detailed error logging specifically for Server Side debugging
    console.error(`[SEO] Fetch error for ${languageCode} (POS: ${pos || 'mixed'}):`, e.message);
    return [];
  }
}

















// export async function getTopWords(languageCode, limit = 1000) {
//   try {
//     const url = `${BASE}/api/public/top-words/${languageCode}?limit=${limit}`;
//     const { data } = await axios.get(url);
//     return data?.words || [];
//   } catch (e) {
//     console.error('[SEO] top words error:', e.message);
//     return [];
//   }
// }


// export async function getTopWordsByPos(languageCode, pos, limit = 1000) {
//   try {
//     const url = `${BASE}/api/public/top-words/${languageCode}/${pos}?limit=${limit}`;
//     const { data } = await axios.get(url);
//     return data?.words || [];
//   } catch (e) {
//     console.error('[SEO] top words POS error:', e.message);
//     return [];
//   }
// }
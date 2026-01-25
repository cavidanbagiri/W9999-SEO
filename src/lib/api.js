

import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://duolingopocketserver.onrender.com';
// const BASE = 'http://localhost:8000';

export async function getWord(langFrom, langTo, word) {
  const { data } = await axios.get(
    `${BASE}/api/public/word?from=${langFrom}&to=${langTo}&word=${encodeURIComponent(word)}`
  );
  return data;
}

// NEW: Get rich word data for static page
export async function getRichWord(langFrom, langTo, word) {
  try {
    // console.log('get rich word is working')
    // console.log(langFrom)
    // console.log(langTo)
    // console.log(word)
    const { data } = await axios.get(
      `${BASE}/api/public/word-rich?from=${langFrom}&to=${langTo}&word=${encodeURIComponent(word)}`
    );
    // console.log('data uis ', data)
    return data;
  } catch (error) {
    // console.error('[SEO] Error fetching rich word data:', error.message);
    // Fallback to basic data
    return getWord(langFrom, langTo, word);
  }
}

export async function getAllWordSlugs() {
  try {
    const url = `${BASE}/api/public/slugs`;
    // console.log('[SEO] fetching', url);          // ← NEW
    const { data } = await axios.get(url);
    // console.log('[SEO] received', data?.length || 0, 'items');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[SEO] slugs error', e.message);
    return [];
  }
}
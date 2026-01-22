

import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://duolingopocketserver.onrender.com';

export async function getWord(langFrom, langTo, word) {
  const { data } = await axios.get(
    `${BASE}/api/public/word?from=${langFrom}&to=${langTo}&word=${encodeURIComponent(word)}`
  );
  return data;
}

export async function getAllWordSlugs() {
  try {
    const url = `${BASE}/api/public/slugs`;
    console.log('[SEO] fetching', url);          // ← NEW
    const { data } = await axios.get(url);
    console.log('[SEO] received', data?.length || 0, 'items');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[SEO] slugs error', e.message);
    return [];
  }
}
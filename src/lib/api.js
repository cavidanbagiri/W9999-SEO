

import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://www.w9999.app';

export async function getWord(langFrom, langTo, word) {
  const { data } = await axios.get(
    `${BASE}/api/public/word?from=${langFrom}&to=${langTo}&word=${encodeURIComponent(word)}`
  );
  return data;
}

// export async function getAllWordSlugs() {
//   const { data } = await axios.get(`${BASE}/api/public/slugs`);
//   return data; // [{lf:'en', lt:'ru', word:'hello'}, …]
// }
export async function getAllWordSlugs() {
  try {
    const { data } = await axios.get(`${BASE}/api/public/slugs`);
    return Array.isArray(data) ? data : [];   // ← never break again
  } catch {
    return [];                                // ← build continues even if API down
  }
}
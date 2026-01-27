

import axios from 'axios';

// const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://duolingopocketserver.onrender.com';
const BASE = 'https://api.w9999.app';

export async function getWord(langFrom, langTo, word) {
  const { data } = await axios.get(
    `${BASE}/api/public/word?from=${langFrom}&to=${langTo}&word=${encodeURIComponent(word)}`
  );
  return data;
}

// NEW: Get rich word data for static page
export async function getRichWord(langFrom, langTo, word) {
  try {
    const { data } = await axios.get(
      `${BASE}/api/public/word-rich?from=${langFrom}&to=${langTo}&word=${encodeURIComponent(word)}`
    );
    return data;
  } catch (error) {
    return getWord(langFrom, langTo, word);
  }
}

export async function getAllWordSlugs() {
  try {
    const url = `${BASE}/api/public/slugs`;
    const { data } = await axios.get(url);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
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
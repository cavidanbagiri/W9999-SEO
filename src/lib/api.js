const BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.w9999.app";

export async function getWord(langFrom, langTo, word) {
  const { data } = await axios.get(
    `${BASE}/api/public/word?from=${langFrom}&to=${langTo}&word=${word}`
  );
  return data;
}

export async function getAllWordSlugs() {
  const { data } = await axios.get(`${BASE}/api/public/slugs`);
  return data; // [{lf:'en', lt:'ru', word:'hello'}, ...]
}
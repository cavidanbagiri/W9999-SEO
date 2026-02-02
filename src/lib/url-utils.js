// src/lib/url-utils.js

export const LANGUAGES = {
  english: { code: 'en', label: 'English' },
  spanish: { code: 'es', label: 'Spanish' },
  russian: { code: 'ru', label: 'Russian' }
};

export const CATEGORIES = {
  words: { pos: null, label: 'Words', seoSuffix: 'Vocabulary' }, // null = all types
  verbs: { pos: 'verb', label: 'Verbs', seoSuffix: 'Action Words' },
  nouns: { pos: 'noun', label: 'Nouns', seoSuffix: 'Objects' },
  adjectives: { pos: 'adj', label: 'Adjectives', seoSuffix: 'Descriptors' }
};

export function parseSlug(slug) {
  // slug example: "english-verbs" or "russian-words"
  const parts = slug.split('-'); 
  if (parts.length < 2) return null; // Invalid slug

  const langKey = parts[0]; // "english"
  const catKey = parts[1];  // "verbs"

  const langData = LANGUAGES[langKey];
  const catData = CATEGORIES[catKey];

  if (!langData || !catData) return null;

  return {
    isValid: true,
    langKey, // "english"
    catKey,  // "verbs"
    langCode: langData.code, // "en"
    pos: catData.pos,        // "verb" or null
    humanLang: langData.label, // "English"
    humanCat: catData.label,   // "Verbs"
    seoSuffix: catData.seoSuffix
  };
}

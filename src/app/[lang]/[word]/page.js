

import { getAllWordSlugs, getRichWord } from '@/lib/api';
import WordPageContent from './components/WordPageContent';

import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_SEO_DOMAIN;

const LANG_URLS = {
  'en': `${BASE_URL}/en/words`,
  'es': `${BASE_URL}/es/words`,
  'ru': `${BASE_URL}/ru/words`,
};
// API_URL = process.env.NEXT_PUBLIC_API_URL;
// LANG_URLS = process.env.NEXT_PUBLIC_LANG_URLS;

function getTargetLanguage(lang) {
  const langMap = {
    'en': 'es',
    'es': 'en',
    'ru': 'en',
  };
  return langMap[lang] || 'en';
}

export async function generateMetadata({ params }) {
  const { lang, word } = await params;
  const decodedWord = decodeURIComponent(word);

  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const pageUrl = `${baseUrl}/${lang}/${encodeURIComponent(decodedWord)}`;

  try {
    const data = await getRichWord(lang, decodedWord);

    if (!data) {
      return {
        title: 'Word not found | w9999',
        description: 'The requested word was not found in our database.',
        alternates: { canonical: pageUrl },
        robots: { index: false, follow: false },
      };
    }

    const title = `${data.word} in ${data.source_language_name} | w9999`;
    const description = `Learn "${data.word}" (${data.level || 'Beginner'}) with pronunciation, definition, examples, and translation. Free vocabulary tool.`;

    const encoded = encodeURIComponent(decodedWord);

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      keywords: [
        data.word,
        data.translation,
        `learn ${data.word}`,
        `${data.word} meaning`,
        `${data.source_language_name} vocabulary`,
        data.level,
      ].filter(Boolean),

      alternates: {
        canonical: pageUrl,
        languages: {
          en: `${baseUrl}/en/${encoded}`,
          es: `${baseUrl}/es/${encoded}`,
          ru: `${baseUrl}/ru/${encoded}`,
          // optional:
          // 'x-default': `${baseUrl}/en/${encoded}`,
        },
      },

      openGraph: {
        title,
        description,
        url: pageUrl,
        type: 'article',
        siteName: 'w9999',
        images: [{ url: `${baseUrl}/logo.png`, width: 1200, height: 630, alt: `${data.word}` }],
      },

      robots: { index: true, follow: true },
    };
  } catch (error) {
    console.error(`Metadata generation failed for ${lang}/${decodedWord}:`, error);
    return {
      title: 'w9999 - Learn Vocabulary',
      description: 'Master 9,000+ most common words in 3 languages.',
      alternates: { canonical: pageUrl },
    };
  }
}


export async function generateStaticParams() {
  try {
    const slugs = await getAllWordSlugs();
    return slugs.map((slug) => ({
      lang: slug.lang,
      word: slug.word,
    }));
  } catch (e) {
    console.error('Failed to generate static params:', e);
    return [];
  }
}

export default async function Page({ params }) {
  const { lang, word } = await params;
  const decodedWord = decodeURIComponent(word);

  const data = await getRichWord(lang, decodedWord);

  // If the API says 404, getRichWord returns null -> we render a real Next.js 404 page
  if (!data) notFound();

  return <WordPageContent data={data} lang={lang} decodedWord={decodedWord} />;
}





import { getAllWordSlugs, getRichWord } from '@/lib/api';
import WordPageContent from './components/WordPageContent';

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
  const targetLang = getTargetLanguage(lang);

  try {
    const data = await getRichWord(lang, decodedWord);

    if (!data) {
      return {
        title: 'Word not found | w9999',
        description: 'The requested word was not found in our database.',
      };
    }

    const title = `${data.word} in ${data.source_language_name} | w9999`;
    const description = `Learn "${data.word}" (${data.level || 'Beginner'}) with pronunciation, definition, examples, and translation. Free vocabulary tool.`;
    const url = `${BASE_URL}/${lang}/${encodeURIComponent(decodedWord)}`;

    return {
      title,
      description,
      canonical: url,
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        siteName: 'w9999',
        images: [
          {
            url: `${BASE_URL}/logo.png`,
            width: 1200,
            height: 630,
            alt: `${data.word} - Learn vocabulary`,
          },
        ],
      },
      keywords: [
        data.word,
        data.translation,
        `learn ${data.word}`,
        `${data.word} meaning`,
        `${data.source_language_name} vocabulary`,
        data.level,
      ].filter(Boolean).join(', '),
      robots: 'index, follow',
      alternates: {
        languages: LANG_URLS,
      },
      other: {
        'ld+json': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'W9999',
              item: BASE_URL
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: `${lang.toUpperCase()} Words`,
              item: `${BASE_URL}/${lang}`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: data.word,
              item: url
            }
          ]
        })
      }
    };
  } catch (error) {
    console.error(`Metadata generation failed for ${lang}/${decodedWord}:`, error);
    return {
      title: 'w9999 - Learn Vocabulary',
      description: 'Master 9,000+ most common words in 3 languages.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllWordSlugs();
    return slugs.map(slug => ({
      lang: slug.lang,
      word: slug.word
    }));
  } catch (e) {
    console.error("Failed to generate static params:", e);
    return [];
  }
}

export default async function Page({ params }) {
  const { lang, word } = await params;
  const decodedWord = decodeURIComponent(word);
  const data = await getRichWord(lang, decodedWord);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Word not found</h1>
          <p className="text-gray-600">The word "{decodedWord}" was not found.</p>
        </main>
      </div>
    );
  }

  return <WordPageContent data={data} lang={lang} decodedWord={decodedWord} />;
}



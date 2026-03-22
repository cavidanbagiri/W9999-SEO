


import { getAllWordSlugs, getRichWord, decodeWordSlug } from '@/lib/api';
import WordPageContent from './components/WordPageContent';
import { notFound } from 'next/navigation';




export async function generateMetadata({ params }) {
  const { lang, word } = await params;
  
  const decodedWord = decodeWordSlug(decodeURIComponent(word));
  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const pageUrl = `${baseUrl}/${lang}/${encodeURIComponent(word)}`;

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

    // Enhanced title with emoji, rank, level
    const rankText = data.frequency_rank ? ` | Rank #${data.frequency_rank}` : '';
    const levelText = data.level ? ` (${data.level})` : '';
    const title = `🌟 "${data.word}" in ${data.source_language_name}${levelText}${rankText} | Learn with Audio & Examples | w9999`;
    
    // Enhanced description
    const description = `Learn "${data.word}"${levelText} with native pronunciation, definition, example sentences, and translation. Free vocabulary tool with audio and flashcards.`;

    // Yandex-specific title/description for Russian pages
    const isRussian = lang === 'ru';
    const yandexTitle = isRussian ? `"${data.word}" на русском языке${levelText}${rankText} | Произношение, перевод, примеры` : null;
    const yandexDescription = isRussian ? `Изучите слово "${data.word}"${levelText}. Произношение, определение, примеры предложений и перевод. Бесплатный инструмент для изучения лексики.` : null;

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,

      alternates: {
        canonical: pageUrl,
        // hreflang for other language versions of the same word (if we had them)
        // languages: {}, // optional
      },

      openGraph: {
        title,
        description,
        url: pageUrl,
        type: 'article',
        siteName: 'w9999 - Learn Languages',
        images: [{ url: `${baseUrl}/logo.png`, width: 1200, height: 630, alt: data.word }],
      },

      // Yandex-specific meta tags
      other: {
        'yandex_recommendations': 'true',
        'yandex_page_type': 'word_definition',
        'yandex_content_language': lang,
        'yandex_educational_level': data.level || 'A1-C2',
        'yandex_resource_type': 'vocabulary',
        // Russian-specific
        ...(isRussian && {
          'yandex_verified_content': 'true',
          'yandex_audience': 'russian_language_learners',
        }),
        // Add Yandex title/description if Russian
        ...(yandexTitle && { 'yandex-title': yandexTitle }),
        ...(yandexDescription && { 'yandex-description': yandexDescription }),
      },

      // Keep indexing blocked as per user preference
      robots: {
        index: false,
        follow: true,
        nocache: true,
      },
    };
  } catch (error) {
    console.error(`💥 [generateMetadata] Failed for ${lang}/${decodedWord}:`, error);
    return {
      title: 'w9999 - Learn Vocabulary',
      description: 'Master 9,000+ most common words in 3 languages.',
      alternates: { canonical: pageUrl },
      robots: { index: false, follow: true },
    };
  }
}




export async function generateStaticParams() {
  try {
    const slugs = await getAllWordSlugs();
    console.log(`📦 [generateStaticParams] Generating ${slugs.length} pages`);
    console.log('🔤 Sample slugs:', slugs.slice(0, 5)); // First 5 for verification
    
    return slugs.map((slug) => ({
      lang: slug.lang,
      word: slug.word, // Already encoded from getAllWordSlugs
    }));
  } catch (e) {
    return [];
  }
}

export default async function Page({ params }) {
  const { lang, word } = await params;
  
  // DECODE: ~ → / for API call
  const decodedWord = decodeWordSlug(decodeURIComponent(word));
  

  const data = await getRichWord(lang, decodedWord);

  if (!data) {
    notFound();
  }

  return <WordPageContent data={data} lang={lang} decodedWord={decodedWord} />;
}


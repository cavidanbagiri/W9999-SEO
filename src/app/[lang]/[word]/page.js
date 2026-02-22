


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

    const title = `${data.word} in ${data.source_language_name} | w9999`;
    const description = `Learn "${data.word}" (${data.level || 'Beginner'}) with pronunciation, definition, examples, and translation. Free vocabulary tool.`;

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,

      alternates: {
        canonical: pageUrl,
      },

      openGraph: {
        title,
        description,
        url: pageUrl,
        type: 'article',
        siteName: 'w9999',
        images: [{ url: `${baseUrl}/logo.png`, width: 1200, height: 630, alt: data.word }],
      },

      // ✅ CRITICAL CHANGE: Block indexing but allow link following
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


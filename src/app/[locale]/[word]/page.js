// src/app/[locale]/[word]/page.js
import { getAllWordSlugs, getRichWord } from '@/lib/api';
import WordPageContent from './components/WordPageContent';

export async function generateStaticParams() {
  const slugs = await getAllWordSlugs();
  return slugs.map((s) => ({ 
    locale: `${s.lf}-${s.lt}`, 
    word: encodeURIComponent(s.word),
  }));
}

//  NEW: dynamic SEO for every word page
export async function generateMetadata({ params }) {
  const { locale, word } = await params;
  const [langFrom, langTo] = locale.split('-');
  const decodedWord = decodeURIComponent(word);
  const data = await getRichWord(langFrom, langTo, decodedWord);

  if (!data) {
    return {
      title: 'Word not found | w9999',
      description: 'The requested word was not found in our database.',
    };
  }

  console.log('[SEO] data', data);

  return {
    title: `${data?.word} → ${data?.translation} | w9999 – Learn ${data?.source_language_name} to ${data?.targetLangName}`,
    description: `Learn "${data?.word}" (${data?.level}) in ${data?.source_language_name}. Translation: ${data?.translation}.}`,
    alternates: {
      canonical: `https://w9999-seo.onrender.com/${locale}/${encodeURIComponent(decodedWord)}`,
      languages: data?.target_languages?.reduce((acc, lang) => {
        acc[`${langFrom}-${lang}`] = `https://w9999-seo.onrender.com/${langFrom}-${lang}/${encodeURIComponent(decodedWord)}`;
        return acc;
      }, {}),
    },
    openGraph: {
      title: `${data?.word} → ${data?.translation}`,
      description: `Learn "${data?.word}" in ${data?.targetLangName} with audio, examples and AI explanations.`,
      url: `https://w9999-seo.onrender.com/${locale}/${encodeURIComponent(decodedWord)}`,
      siteName: 'w9999',
      images: [
        {
          url: `https://api.w9999.app/og-image?word=${encodeURIComponent(decodedWord)}&from=${langFrom}&to=${langTo}`,
          width: 1200,
          height: 630,
          alt: `${data.word} in ${data.targetLangName}`,
        },
      ],
      locale: `${langFrom}_${langTo}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data?.word} → ${data?.translation}`,
      description: `Learn "${data?.word}" in ${data?.targetLangName} with audio, examples and AI explanations.`,
      images: [`https://api.w9999.app/og-image?word=${encodeURIComponent(decodedWord)}&from=${langFrom}&to=${langTo}`],
    },
  };
}

export default async function Page({ params }) {
  const { locale, word } = await params;
  const [langFrom, langTo] = locale.split('-');
  const decodedWord = decodeURIComponent(word);
  const data = await getRichWord(langFrom, langTo, decodedWord);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Word not found
          </h1>
          <p className="text-gray-600">
            The word "{decodedWord}" was not found in our database.
          </p>
        </main>
      </div>
    );
  }

  return <WordPageContent data={data} locale={locale} decodedWord={decodedWord} />;
}


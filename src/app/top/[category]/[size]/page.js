
import { notFound } from 'next/navigation';
import { getTopWords, encodeWordSlug } from '@/lib/api';
import Link from 'next/link';

import { useEffect } from 'react';
import { yandexEvents } from '@/lib/yandexEvents';

// ============================================
// CATEGORY & LANGUAGE CONFIG
// ============================================

export function parseCategorySlug(slug) {
  const mapping = {
    'english-words':      { lang: 'en', pos: null, langName: 'English', typeLabel: 'Words' },
    'english-verbs':      { lang: 'en', pos: 'verb', langName: 'English', typeLabel: 'Verbs' },
    'english-nouns':      { lang: 'en', pos: 'noun', langName: 'English', typeLabel: 'Nouns' },
    'english-adjectives': { lang: 'en', pos: 'adjective', langName: 'English', typeLabel: 'Adjectives' },

    'russian-words':      { lang: 'ru', pos: null, langName: 'Russian', typeLabel: 'Words' },
    'russian-verbs':      { lang: 'ru', pos: 'verb', langName: 'Russian', typeLabel: 'Verbs' },
    'russian-nouns':      { lang: 'ru', pos: 'noun', langName: 'Russian', typeLabel: 'Nouns' },
    'russian-adjectives': { lang: 'ru', pos: 'adjective', langName: 'Russian', typeLabel: 'Adjectives' },

    'spanish-words':      { lang: 'es', pos: null, langName: 'Spanish', typeLabel: 'Words' },
    'spanish-verbs':      { lang: 'es', pos: 'verb', langName: 'Spanish', typeLabel: 'Verbs' },
    'spanish-nouns':      { lang: 'es', pos: 'noun', langName: 'Spanish', typeLabel: 'Nouns' },
    'spanish-adjectives': { lang: 'es', pos: 'adjective', langName: 'Spanish', typeLabel: 'Adjectives' },
  };

  return mapping[slug] || null;
}

export const dynamic = "force-static";


const keywordMap = {
  'english-words': 'top 100 english words, 100 most common words english, learn essential english vocabulary, beginner english',
  'english-verbs': 'top english verbs, most common english verbs, daily use verbs, english verb list',
  'english-nouns': 'top english nouns, most common english nouns, essential nouns, english noun frequency',
  'english-adjectives': 'top english adjectives, common english adjectives, descriptive words, english adjective list',
  'russian-words': 'top russian words, most common russian vocabulary, learn russian frequency list, russian language',
  'russian-verbs': 'russian verbs frequency, most used russian verbs, common russian actions',
  'russian-nouns': 'russian nouns list, common russian nouns, russian noun frequency',
  'russian-adjectives': 'russian adjectives, common russian descriptors, russian adjective frequency',
  'spanish-words': 'top spanish words, most common spanish vocabulary, learn spanish frequency, spanish language basics',
  'spanish-verbs': 'spanish verbs frequency, most common spanish verbs, daily spanish actions',
  'spanish-nouns': 'spanish nouns frequency, common spanish nouns, spanish noun list',
  'spanish-adjectives': 'spanish adjectives frequency, common spanish descriptors, spanish adjective list',
};

const descriptionMap = {
  'english-words': 'Master the most common English words with frequency rankings, CEFR levels, and pronunciation. Free vocabulary list for all language levels.',
  'english-verbs': 'Learn the most frequently used English verbs with examples and CEFR levels. Essential action words for fluent English.',
  'english-nouns': 'Discover the most common English nouns ranked by usage frequency. Build vocabulary with real-world examples.',
  'english-adjectives': 'Master descriptive English adjectives ranked by frequency. Learn the most useful adjectives for everyday communication.',
  'russian-words': 'Изучите самые частые русские слова с рейтингом частоты и уровнями CEFR. Бесплатный список словаря.',
  'russian-verbs': 'Выучите самые используемые русские глаголы. Существенные глаголы русского языка с примерами.',
  'russian-nouns': 'Откройте для себя самые частые русские существительные. Словарь существительных русского языка.',
  'russian-adjectives': 'Овладейте описательными русскими прилагательными. Самые полезные прилагательные русского языка.',
  'spanish-words': 'Domina las palabras en español más comunes con ranking de frecuencia y niveles CEFR. Lista de vocabulario gratuita.',
  'spanish-verbs': 'Aprende los verbos en español más frecuentes. Verbos de acción esenciales en español.',
  'spanish-nouns': 'Descubre los sustantivos en español más comunes. Lista de sustantivos ordenada por frecuencia.',
  'spanish-adjectives': 'Domina los adjetivos en español más útiles. Palabras descriptivas ordenadas por frecuencia.',
};

const features = [
  {
    icon: '📚',
    title: 'Ranked by Frequency',
    description: 'Words sorted by real-world usage data. Learn what matters most first.',
  },
  {
    icon: '🎯',
    title: 'CEFR Levels',
    description: 'Each word tagged with A1-C2 proficiency level for targeted learning.',
  },
  {
    icon: '🔊',
    title: 'Audio Pronunciation',
    description: 'Hear native speakers. Perfect your accent from day one.',
  },
  {
    icon: '💾',
    title: 'Export & Flashcards',
    description: 'Save to your device. Create custom study materials instantly.',
  },
];

export async function generateStaticParams() {
  const categories = [
    'english-words', 'english-verbs', 'english-nouns', 'english-adjectives',
    'russian-words', 'russian-verbs', 'russian-nouns', 'russian-adjectives',
    'spanish-words', 'spanish-verbs', 'spanish-nouns', 'spanish-adjectives',
  ];

  const sizes = ['100', '300', '500', '1000', '2000', '3000', '5000', '10000'];

  const params = categories.flatMap(category =>
    sizes.map(size => ({ category, size }))
  );

  console.log(`📦 [generateStaticParams] Generating ${params.length} top words pages`);
  return params;
}

export async function generateMetadata({ params }) {
  const { category, size } = await params;
  const config = parseCategorySlug(category);

  if (!config) {
    return { title: 'Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const canonicalUrl = `${baseUrl}/top/${category}/${size}`;
  
  const langMap = { 'en': 'english', 'ru': 'russian', 'es': 'spanish' };
  
  const otherLangs = {
    'es': category.replace(/^english-|^russian-/, 'spanish-'),
    'ru': category.replace(/^english-|^spanish-/, 'russian-'),
    'en': category.replace(/^russian-|^spanish-/, 'english-'),
  };

  const title = `Top ${size} ${config.langName} ${config.typeLabel} | Frequency List & CEFR Levels`;
  const description = descriptionMap[category] || `Learn the top ${size} ${config.langName} ${config.typeLabel.toLowerCase()}.`;



  // ============================================
  // YANDEX-SPECIFIC META TAGS - ADD THESE
  // ============================================
  
  // For Russian pages, create Russian-language title and description
  const ruTitle = config.lang === 'ru' 
    ? `Топ ${size} ${getRussianWordType(config.typeLabel)} | Список частотности с уровнями CEFR`
    : null;
    
  const ruDescription = config.lang === 'ru'
    ? descriptionMap[`ru-${category}`] || `Изучайте топ ${size} ${getRussianWordType(config.typeLabel).toLowerCase()} с частотным рейтингом и уровнями CEFR. Бесплатный список для всех уровней.`
    : null;

  // Function to get Russian word type
  function getRussianWordType(typeLabel) {
    const types = {
      'Words': 'русских слов',
      'Verbs': 'русских глаголов',
      'Nouns': 'русских существительных',
      'Adjectives': 'русских прилагательных'
    };
    return types[typeLabel] || 'русских слов';
  }
    ////////////////////////////////////////////////////////////////////////////////////






  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: keywordMap[category],


    // YANDEX ENHANCEMENT 1: Add Russian-language metadata for Russian pages
    ...(config.lang === 'ru' && {
      // Yandex优先考虑俄语元数据
      'yandex': {
        'title': ruTitle,
        'description': ruDescription,
        'noindex': false,
        'nofollow': false,
      },
    }),
    ////////////////////////////////////////////////////////////////////////////////////
    
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es': `${baseUrl}/top/${otherLangs.es}/${size}`,
        'ru': `${baseUrl}/top/${otherLangs.ru}/${size}`,
        'en': `${baseUrl}/top/${otherLangs.en}/${size}`,
      },
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'w9999 - Learn Languages',
      images: [{
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: `Top ${size} ${config.langName} ${config.typeLabel}`,
      }],
    },

    // YANDEX ENHANCEMENT 2: Additional Yandex-specific meta tags
    other: {
      // Tell Yandex this is a learning resource
      'yandex_recommendations': 'true',
      'yandex_page_type': config.typeLabel,
      'yandex_content_language': config.lang,
      'yandex_educational_level': 'A1-C2',
      'yandex_resource_type': 'vocabulary_list',
      // For Russian pages, add content verification
      ...(config.lang === 'ru' && {
        'yandex_verified_content': 'true',
        'yandex_audience': 'russian_language_learners',
      }),
    },
    ////////////////////////////////////////////////////////////////////////////////////

    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

// ============================================
// SCHEMA.ORG JSON-LD (THE REAL SEO POWER)
// ============================================

// ✅ UPDATED: Use urlSlug in schema
function generateSchema(category, size, words, config) {
  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const canonicalUrl = `${baseUrl}/top/${category}/${size}`;
  const typeLabel = config.typeLabel;
  const langCode = config.lang;



  // ============================================
  // YANDEX ENHANCEMENT 1: Calculate quality metrics
  // ============================================
  function calculateWordListQuality(words) {
    // Calculate how many words have complete data
    const wordsWithLevel = words.filter(w => w.level).length;
    const wordsWithPos = words.filter(w => w.pos).length;
    const wordsWithExamples = words.filter(w => w.example).length;
    
    const totalWords = words.length;
    
    return {
      completeness: Math.round((wordsWithLevel / totalWords) * 100),
      accuracy: Math.round((wordsWithPos / totalWords) * 100),
      example_coverage: Math.round((wordsWithExamples / totalWords) * 100),
      total_quality: Math.round(
        ((wordsWithLevel + wordsWithPos + wordsWithExamples) / (totalWords * 3)) * 100
      ),
    };
  }

  // ============================================
  // YANDEX ENHANCEMENT 2: Get Russian language name
  // ============================================
  function getRussianLanguageName(langName) {
    const names = {
      'English': 'Английский',
      'Russian': 'Русский',
      'Spanish': 'Испанский'
    };
    return names[langName] || langName;
  }

  const qualityMetrics = calculateWordListQuality(words);
  const russianLangName = getRussianLanguageName(config.langName);



  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": `Top ${size} ${config.langName} ${typeLabel}`,
        "headline": `Top ${size} ${config.langName} ${typeLabel} - Ranked by Frequency (2024)`,
        "description": `The ${size} most frequently used ${config.langName} ${typeLabel.toLowerCase()} with CEFR proficiency levels and examples.`,
        "inLanguage": langCode,
        "datePublished": "2024-01-01T00:00:00Z",
        "dateModified": new Date().toISOString(),
        "author": { "@type": "Organization", "@id": `${baseUrl}#organization` },
        "publisher": { "@type": "Organization", "@id": `${baseUrl}#organization` },
        "isPartOf": { "@id": `${baseUrl}#website` },
        "breadcrumb": { "@id": `${canonicalUrl}#breadcrumb` },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 1200,
          "height": 630,
        },
      // YANDEX ENHANCEMENT 3: Add Yandex-specific webpage properties
        "yandex:qualityScore": qualityMetrics.total_quality,
        "yandex:contentType": "educational",
        "yandex:audience": "language_learners",
        "yandex:difficulty": size <= 500 ? "beginner" : size <= 2000 ? "intermediate" : "advanced",
      },

      

      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Top Words", "item": `${baseUrl}/top` },
          { "@type": "ListItem", "position": 3, "name": config.langName, "item": `${baseUrl}/top/${category.split('-')[0]}-words/100` },
          { "@type": "ListItem", "position": 4, "name": `Top ${size} ${typeLabel}`, "item": canonicalUrl },
        ],
      },


      


      {
        "@type": "LearningResource",
        "@id": `${canonicalUrl}#resource`,
        "name": `Top ${size} ${config.langName} ${typeLabel}`,
        "description": `Free vocabulary frequency list: ${size} most common ${config.langName} ${typeLabel.toLowerCase()}`,
        "educationalLevel": ["A1", "A2", "B1", "B2", "C1", "C2"],
        "inLanguage": langCode,
        "learningResourceType": "Vocabulary List",
        "educationalUse": "Vocabulary Building",
        "provider": { "@type": "Organization", "@id": `${baseUrl}#organization` },
        "hasPart": words.slice(0, 100).map((w, idx) => ({
          "@type": "Thing",
          "name": w.text,
          "position": idx + 1,
          "url": `${baseUrl}/${langCode}/${w.urlSlug}`, // ✅ Use encoded slug
          "yandex:frequency": idx + 1,
          "yandex:cefrLevel": w.level || "A1",
        })),
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        // YANDEX ENHANCEMENT 5: Quality metrics for Yandex
        "yandex:quality": {
          "completeness": qualityMetrics.completeness,
          "accuracy": qualityMetrics.accuracy,
          "example_coverage": qualityMetrics.example_coverage,
          "total_quality": qualityMetrics.total_quality,
        },
        "yandex:statistics": {
          "total_words": words.length,
          "words_with_levels": words.filter(w => w.level).length,
          "words_with_examples": words.filter(w => w.example).length,
          "last_updated": new Date().toISOString().split('T')[0],
        },
      },

      {
        "@type": "ItemList",
        "@id": `${canonicalUrl}#wordlist`,
        "name": `Top ${size} ${config.langName} ${typeLabel}`,
        "description": `Ranked list of the ${size} most frequent ${config.langName} ${typeLabel.toLowerCase()}`,
        "itemListElement": words.slice(0, 100).map((w, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": w.text,
          "url": `${baseUrl}/${langCode}/${w.urlSlug}`, // ✅ Use encoded slug
          "description": `Rank #${idx + 1} | ${w.level ? `CEFR ${w.level}` : 'N/A'}${w.pos ? ` | ${w.pos}` : ''}`,
          "item": { "@type": "Thing", "name": w.text,
            // YANDEX ENHANCEMENT 6: Add word-level details
            "yandex:frequency": idx + 1,
            "yandex:cefr": w.level || "A1",
            "yandex:partOfSpeech": w.pos || "unknown",
           },
        })),
        // YANDEX ENHANCEMENT 7: ItemList-level Yandex properties
        "yandex:listType": "frequency_list",
        "yandex:language": config.lang,
        "yandex:totalItems": words.length,
        "yandex:displayedItems": Math.min(100, words.length),
      },

      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What are the top ${size} ${config.langName} ${typeLabel.toLowerCase()}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `These are the ${size} most frequently used ${config.langName} ${typeLabel.toLowerCase()} ranked by real-world usage frequency in literature, media, and conversation. Perfect for CEFR levels A1-C2.`,
            },
          },
          {
            "@type": "Question",
            "name": `How many ${config.langName} ${typeLabel.toLowerCase()} do I need to learn?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The top 1000 words cover approximately 80-90% of everyday ${config.langName} communication. Start with our top 100 list for A1 level, then progress to 500-1000 for fluency.`,
            },
          },
          {
            "@type": "Question",
            "name": "Can I download this ${typeLabel.toLowerCase()} list?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Yes! Export your word list instantly through our free w9999.app platform. Create flashcards, PDFs, and custom study materials.`,
            },
          },
          
        ],
        // YANDEX ENHANCEMENT 8: Add Yandex FAQ properties
        "yandex:faqCategory": "language_learning",
        "yandex:faqTopics": ["vocabulary", "frequency", "learning_methods"],
      },

      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        "url": baseUrl,
        "name": "w9999 - Free Language Learning",
        "inLanguage": "en",
        "potentialAction": {
          "@type": "SearchAction",
          "target": { "@type": "EntryPoint", "urlTemplate": `${baseUrl}/search?q={search_term}` },
          "query-input": "required name=search_term",
        },
        // YANDEX ENHANCEMENT 9: Website-level Yandex properties
        "yandex:siteType": "educational",
        "yandex:languages": ["en", "ru", "es"],
        "yandex:contentCategories": ["vocabulary", "frequency_lists", "language_learning"],
      },
      // YANDEX ENHANCEMENT 10: Add Organization details with Russian info
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        "name": "w9999",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Free language learning platform with frequency-based vocabulary lists",
        "sameAs": [
          "https://t.me/w9999", // Telegram is huge in Russia
          "https://vk.com/w9999", // VK is Russia's top social network
        ],
        // Russian-language organization info
        "yandex:name_ru": "w9999 - Изучение языков",
        "yandex:description_ru": "Бесплатная платформа для изучения языков с частотными словарями",
        "yandex:targetAudience": ["ru", "en", "es"],
      },
    ],
  };
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default async function TopWordsDynamicPage({ params }) {
  const { category, size } = await params;
  const config = parseCategorySlug(category);

  // console.log(`📄 [TopWordsDynamicPage] Rendering: ${category}/${size}`);

  // ADD THIS - Track scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      
      // If user scrolled to bottom (within 100px)
      if (pageHeight - scrollPosition < 100) {
        yandexEvents.trackFullScroll(config.lang);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [config.lang]);
  
  // UPDATE your word click handler
  const handleWordClick = (word, position) => {
    // Add this tracking line
    yandexEvents.trackWordClick(word.text, position, config.lang);
    
    // Your existing navigation logic
    // router.push(`/${config.lang}/${word.urlSlug}`);
  };
  

  if (!config) {
    console.log('❌ [TopWordsDynamicPage] Invalid category');
    notFound();
  }

  const limit = parseInt(size, 10);
  if (isNaN(limit) || limit <= 0) {
    console.log('❌ [TopWordsDynamicPage] Invalid size');
    notFound();
  }

  const words = await getTopWords(config.lang, limit, config.pos);

  if (!words || words.length === 0) {
    console.log('❌ [TopWordsDynamicPage] No words found');
    notFound();
  }

  console.log(`✅ [TopWordsDynamicPage] Rendering ${words.length} words`);

  const baseUrl = process.env.NEXT_PUBLIC_SEO_DOMAIN;
  const sizes = ['100', '300', '500', '1000', '2000', '3000', '5000', '10000'];
  const relatedSizes = sizes.filter(s => s !== size);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO SECTION - unchanged */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Top {size} {config.langName} {config.typeLabel}
          </h1>
          <p className="text-sm md:text-base opacity-80 mb-2">
            Most frequent {config.typeLabel.toLowerCase()} ranked by real-world usage
          </p>
          <p className="text-lg md:text-xl opacity-95 mb-8 max-w-2xl">
            Master essential {config.langName} vocabulary with CEFR levels, pronunciation, and AI explanations. Perfect for language learners at all levels.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_APP_URL}
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            Open Interactive App (Free) →
          </a>
        </div>
      </div>

      {/* FEATURES GRID - unchanged */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Our Lists?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SIZE SWITCHER - unchanged */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Other List Sizes:</h2>
          <div className="flex flex-wrap gap-3">
            {relatedSizes.map(s => (
              <Link
                key={s}
                href={`/top/${category}/${s}`}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
              >
                Top {s.toLocaleString()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* LANGUAGE SWITCHER - unchanged */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Other Languages:</h2>
          <div className="flex flex-wrap gap-3">
            {['english', 'russian', 'spanish'].map(lang => {
              const newCategory = category.replace(/^english-|^russian-|^spanish-/, `${lang}-`);
              return (
                <Link
                  key={lang}
                  href={`/top/${newCategory}/${size}`}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    category.startsWith(lang)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* WORD COUNT - unchanged */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-gray-700">
            Showing <strong className="text-gray-900">{words.length.toLocaleString()}</strong> {config.typeLabel.toLowerCase()}
          </p>
        </div>
      </div>

      {/* ✅ WORD LIST SECTION - CRITICAL FIX */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Complete {config.typeLabel} List ({words.length.toLocaleString()})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {words.map((w, idx) => (
            <Link
            onClick={() => handleWordClick(word, idx + 1)}  // Your existing onClick
              key={w.id || idx}
              href={`/${config.lang}/${w.urlSlug}`} // ✅ USE ENCODED SLUG
              className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300"
            >
              {/* Rank Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  #{idx + 1}
                </span>
                {w.frequency && (
                  <span className="text-xs text-gray-400 font-mono">
                    {(w.frequency * 100).toFixed(1)}% freq
                  </span>
                )}
              </div>

              {/* Word - DISPLAY ORIGINAL */}
              <h3 className="text-lg font-bold text-blue-600 hover:underline mb-3">
                {w.text}
              </h3>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap mt-auto">
                {w.level && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                    {w.level}
                  </span>
                )}
                {w.pos && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">
                    {w.pos}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA - unchanged */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 mt-16 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Master {config.langName}?
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Get interactive flashcards, pronunciation guides, and track your progress
          </p>
          <a
            href="https://www.w9999.app"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Start Learning Free →
          </a>
        </div>
      </div>

      {/* SCHEMA.ORG JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchema(category, size, words, config), null, 2)
        }}
      />
    </main>
  );
}



// src/app/[locale]/[word]/components/WordPageContent.js
import Script from 'next/script';
import AudioPlayer from './AudioPlayer';
import HumanRedirect from './HumanRedirect';
import CTAButton from './CTAButton';
import { Volume2, BookOpen, Star, Users, Target, Award, ChevronRight, Globe } from 'lucide-react';

export default function WordPageContent({ data, locale, decodedWord }) {
  const [langFrom, langTo] = locale.split('-');

  // Construct JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": `${data.word} - ${data.translation || 'Translation'}`,
    "description": `Learn "${data.word}" in ${data.source_language_name}. Definition, pronunciation, examples, and translation to ${data.targetLangName}.`,
    "educationalLevel": data.level ? `CEFR ${data.level}` : "Beginner",
    "learningResourceType": "Vocabulary",
    "inLanguage": langFrom,
    "translations": data.translations.map(t => ({
      "@type": "Language",
      "name": t.language_name,
      "alternateName": t.language_code
    })),
    "example": data.example_sentences.map(s => s.text).slice(0, 5),
    "dateModified": data.last_updated,
    "provider": {
      "@type": "Organization",
      "name": "w9999",
      "url": "https://www.w9999.app"
    }
  };

  return (
    <>
      {/* <head> */}
        {/* <title>{`${data.word} → ${data.translation} | w9999 - Learn ${data.source_language_name} to ${data.targetLangName}`}</title>
        <meta name="description" content={`Learn "${data.word}" (${data.level}) in ${data.source_language_name}. Definition: ${data.meanings[0]?.definition || ''}. Translation: ${data.translation}. Example: ${data.examples?.[0] || ''}`} /> */}

        {/* hreflang tags */}
        {/* {data.target_languages.map(lang => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={`${langFrom}-${lang}`}
            href={`https://www.w9999.app/${langFrom}-${lang}/${encodeURIComponent(data.word)}`}
          />
        ))} */}

        {/* JSON-LD */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      {/* </head> */}

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 transition-colors duration-200">

        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skip link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg"
          >
            Skip to main content
          </a>

          {/* Header */}
          <header className="mb-12 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    W9999
                  </h1>
                  <p className="text-gray-600 text-sm">
                    9,000+ most common words in 3 languages
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <Volume2 size={14} />
                  <span>Free audio</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1 text-purple-600">
                  <BookOpen size={14} />
                  <span>AI examples</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-gray-700">No ads</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" className="relative">
            {/* Word Header with Hero Section */}
            <section className="mb-12">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -translate-y-20 translate-x-20"></div>
                
                <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        <Globe size={14} />
                        <span>{data.source_language_name}</span>
                      </div>
                      {data.level && (
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                          CEFR {data.level}
                        </div>
                      )}
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {data.word}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      {data.ipa_pronunciation && (
                        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200">
                          <span className="text-xl text-gray-700 font-serif">
                            /{data.ipa_pronunciation}/
                          </span>
                          <div className="w-px h-6 bg-gray-200"></div>
                          <AudioPlayer
                            url={data.audioUrl}
                            label={`Pronounce ${data.word}`}
                            size="md"
                            variant="minimal"
                          />
                        </div>
                      )}
                      
                      {data.frequency_rank && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                          <Target size={16} className="text-gray-600" />
                          <span className="text-sm text-gray-700">
                            <span className="font-semibold">Rank #{data.frequency_rank}</span> in frequency
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                      <AudioPlayer
                        url={data.audioUrl}
                        label={`Play ${data.word} pronunciation`}
                        size="lg"
                        variant="primary"
                        className="w-full"
                      />
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200">
                        <Star size={18} />
                        <span className="font-semibold">Save to Flashcards</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Translation Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Primary Translation */}
              {data.translation && (
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                            {data.targetLangName}
                          </div>
                          <ChevronRight size={20} className="text-white/60" />
                        </div>
                        <p className="text-5xl font-bold text-white mb-2">{data.translation}</p>
                        <p className="text-white/80">Primary translation</p>
                      </div>
                      <AudioPlayer
                        url={data.audioUrl}
                        label={`Play ${data.translation} pronunciation`}
                        size="lg"
                        variant="light"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* All Translations Summary */}
              {data.translations.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <Globe size={20} className="text-blue-600" />
                    <span>Also in {data.translations.length} languages</span>
                  </h3>
                  <div className="space-y-4">
                    {data.translations.slice(0, 3).map((trans, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-600 uppercase">
                              {trans.language_code}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{trans.language_name}</span>
                          </div>
                          <p className="text-lg font-medium text-gray-900">{trans.translated_text}</p>
                        </div>
                        <AudioPlayer
                          url={data.audio_urls[trans.language_code]}
                          label={`Play ${trans.translated_text} in ${trans.language_name}`}
                          size="sm"
                          variant="ghost"
                        />
                      </div>
                    ))}
                    {data.translations.length > 3 && (
                      <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        + {data.translations.length - 3} more translations
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Meanings & Examples Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Meanings & Definitions */}
              {data.meanings.length > 0 && (
                <section>
                  <div className="sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen size={20} className="text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">Meanings & Definitions</h2>
                    </div>
                    <div className="space-y-4">
                      {data.meanings.map((meaning, index) => (
                        <div
                          key={index}
                          className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                              <span className="text-blue-700 font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              {meaning.pos && (
                                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold mb-3">
                                  {meaning.pos}
                                </span>
                              )}
                              <p className="text-gray-700 leading-relaxed">{meaning.definition}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Example Sentences */}
              {data.example_sentences.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star size={20} className="text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Example Sentences</h2>
                  </div>
                  <div className="space-y-6">
                    {data.example_sentences.slice(0, 5).map((sentence, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-700 font-bold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-lg italic text-gray-800 leading-relaxed">
                            "{sentence.text}"
                          </p>
                        </div>
                        {sentence.translation && (
                          <div className="ml-12 pl-4 border-l-2 border-purple-200">
                            <p className="text-gray-600">{sentence.translation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Categories & Related Words */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Categories */}
              {data.categories.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {data.categories.map((cat, index) => (
                      <div
                        key={index}
                        className="group relative"
                      >
                        <span className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-white text-gray-800 rounded-xl text-sm font-medium hover:from-gray-100 hover:to-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow">
                          {cat.name}
                        </span>
                        {cat.description && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                            {cat.description}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Words */}
              {data.related_words.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Related Words</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data.related_words.map((word, index) => (
                      <a
                        key={index}
                        href={`/${langFrom}-${langTo}/${encodeURIComponent(word.text)}`}
                        className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col items-center text-center">
                          <span className="text-lg font-semibold group-hover:text-blue-600 transition-colors text-gray-900">
                            {word.text}
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            {word.level && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                {word.level}
                              </span>
                            )}
                            {word.frequency_rank && (
                              <span className="text-xs text-gray-500">
                                #{word.frequency_rank}
                              </span>
                            )}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* CTA Section */}
            <div className=" mt-16 z-10">
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-2xl overflow-hidden">
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
                
                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                      <Award size={18} />
                      <span className="text-sm font-medium">Premium Feature</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">
                      Master "<span className="text-yellow-300">{decodedWord}</span>" with W9999
                    </h3>
                    <p className="text-blue-200 text-lg">Everything you need to remember this word</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Users size={20} />
                        </div>
                        <h4 className="font-semibold text-lg">AI Tutor</h4>
                      </div>
                      <p className="text-blue-100 text-sm">Personalized explanations & practice</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <BookOpen size={20} />
                        </div>
                        <h4 className="font-semibold text-lg">Smart Flashcards</h4>
                      </div>
                      <p className="text-blue-100 text-sm">Spaced repetition system</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Target size={20} />
                        </div>
                        <h4 className="font-semibold text-lg">Progress Tracking</h4>
                      </div>
                      <p className="text-blue-100 text-sm">Daily streaks & achievements</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-blue-200 mb-2">Join 50,000+ language learners</p>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-green-400">✓</span>
                          <span>Free forever</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-400">✓</span>
                          <span>No credit card</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-400">✓</span>
                          <span>Start in 30s</span>
                        </div>
                      </div>
                    </div>
                    <CTAButton word={decodedWord} langFrom={langFrom} langTo={langTo} />
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">W</span>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">W9999 Language Learning</p>
                  <p className="text-gray-500 text-sm">Master vocabulary with AI-powered tools</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.W9999.app"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Open full app
                </a>
                <div className="w-px h-4 bg-gray-300"></div>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Terms
                </a>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">
              © 2026 W9999. Free for everyone, forever.
            </p>
          </footer>
        </div>

        {/* Human Redirect Component (Client-side only) */}
        <HumanRedirect
          word={decodedWord}
          langFrom={langFrom}
          langTo={langTo}
        />

      </main>
    </>
  );
}















// // src/app/[locale]/[word]/components/WordPageContent.js
// import Script from 'next/script';
// import AudioPlayer from './AudioPlayer';
// import HumanRedirect from './HumanRedirect';
// import CTAButton from './CTAButton';

// export default function WordPageContent({ data, locale, decodedWord }) {
//   const [langFrom, langTo] = locale.split('-');

//   // Construct JSON-LD structured data
//   const structuredData = {
//     "@context": "https://schema.org",
//     "@type": "LearningResource",
//     "name": `${data.word} - ${data.translation || 'Translation'}`,
//     "description": `Learn "${data.word}" in ${data.source_language_name}. Definition, pronunciation, examples, and translation to ${data.targetLangName}.`,
//     "educationalLevel": data.level ? `CEFR ${data.level}` : "Beginner",
//     "learningResourceType": "Vocabulary",
//     "inLanguage": langFrom,
//     "translations": data.translations.map(t => ({
//       "@type": "Language",
//       "name": t.language_name,
//       "alternateName": t.language_code
//     })),
//     "example": data.example_sentences.map(s => s.text).slice(0, 5),
//     "dateModified": data.last_updated,
//     "provider": {
//       "@type": "Organization",
//       "name": "w9999",
//       "url": "https://www.w9999.app"
//     }
//   };

//   return (
//     <html lang={langFrom} className="scroll-smooth">
//       <head>
//         <title>{`${data.word} → ${data.translation} | w9999 - Learn ${data.source_language_name} to ${data.targetLangName}`}</title>
//         <meta name="description" content={`Learn "${data.word}" (${data.level}) in ${data.source_language_name}. Definition: ${data.meanings[0]?.definition || ''}. Translation: ${data.translation}. Example: ${data.examples?.[0] || ''}`} />

//         {/* hreflang tags */}
//         {data.target_languages.map(lang => (
//           <link
//             key={lang}
//             rel="alternate"
//             hrefLang={`${langFrom}-${lang}`}
//             href={`https://www.w9999.app/${langFrom}-${lang}/${encodeURIComponent(data.word)}`}
//           />
//         ))}

//         {/* JSON-LD */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//         />

//         {/* Critical CSS */}
//         <style>{`
//           /* Hide redirect component from bots */
//           @media print {
//             .no-print { display: none !important; }
//           }
//         `}</style>
//       </head>

//       <body className="min-h-screen bg-white text-gray-900 transition-colors duration-200">
//         {/* Skip link for accessibility */}
//         <a
//           href="#main-content"
//           className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-lg z-50"
//         >
//           Skip to main content
//         </a>

//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header */}
//           <header className="mb-12 pt-8">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h1 className="text-3xl font-bold text-primary">W9999</h1>
//                 <p className="text-gray-600 mt-1">
//                   9,000 + most common words in 3 languages
//                 </p>
//               </div>
//               <div className="text-sm text-gray-500">
//                 Free audio + AI examples • No ads
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <main id="main-content">
//             {/* Word Header */}
//             <section className="mb-12">
//               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
//                 <div>
//                   <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
//                     {data.word}
//                   </h1>

//                   {data.ipa_pronunciation && (
//                     <div className="flex items-center gap-4 mb-4">
//                       <span className="text-xl text-gray-700 font-serif">
//                         /{data.ipa_pronunciation}/
//                       </span>
//                       <AudioPlayer
//                         url={data.audioUrl}
//                         label={`Pronounce ${data.word}`}
//                         size="md"
//                       />
//                     </div>
//                   )}

//                   <div className="flex flex-wrap gap-3 mt-4">
//                     {data.level && (
//                       <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
//                         CEFR {data.level}
//                       </span>
//                     )}
//                     {data.frequency_rank && (
//                       <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
//                         Rank #{data.frequency_rank}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="flex gap-3">
//                   <AudioPlayer
//                     url={data.audioUrl}
//                     label={`Play ${data.translation}`}
//                     size="lg"
//                   />
//                 </div>
//               </div>
//             </section>

//             {/* Primary Translation */}
//             {data.translation && (
//               <section className="mb-12">
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
//                   Translation
//                 </h2>
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-sm border border-blue-100">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <span className="inline-block bg-primary text-black px-4 py-1 rounded-full text-sm font-semibold mb-2">
//                         {data.targetLangName}
//                       </span>
//                       <p className="text-4xl font-bold mt-2 text-gray-900">{data.translation}</p>
//                     </div>
//                     <AudioPlayer
//                       url={data.audioUrl}
//                       label={`Play ${data.translation} pronunciation`}
//                       size="lg"
//                     />
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* All Translations */}
//             {data.translations.length > 0 && (
//               <section className="mb-12">
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
//                   All Translations
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {data.translations.map((trans, index) => (
//                     <div
//                       key={index}
//                       className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-primary/20"
//                     >
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm font-semibold text-gray-500 uppercase">
//                           {trans.language_code}
//                         </span>
//                         <AudioPlayer
//                           url={data.audio_urls[trans.language_code]}
//                           label={`Play ${trans.translated_text} in ${trans.language_name}`}
//                           size="sm"
//                         />
//                       </div>
//                       <p className="text-lg font-medium text-gray-900">{trans.translated_text}</p>
//                       {trans.language_name && (
//                         <p className="text-sm text-gray-500 mt-1">
//                           {trans.language_name}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* Meanings & Definitions */}
//             {data.meanings.length > 0 && (
//               <section className="mb-12">
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
//                   Meanings & Definitions
//                 </h2>
//                 <div className="space-y-6">
//                   {data.meanings.map((meaning, index) => (
//                     <div
//                       key={index}
//                       className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-primary border-t border-r border-b border-gray-100"
//                     >
//                       <div className="flex items-start justify-between">
//                         <div>
//                           {meaning.pos && (
//                             <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3 border border-blue-100">
//                               {meaning.pos}
//                             </span>
//                           )}
//                           <p className="text-lg leading-relaxed text-gray-800">{meaning.definition}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* Example Sentences */}
//             {data.example_sentences.length > 0 && (
//               <section className="mb-12">
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
//                   Example Sentences
//                 </h2>
//                 <div className="space-y-6">
//                   {data.example_sentences.slice(0, 7).map((sentence, index) => (
//                     <div
//                       key={index}
//                       className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
//                     >
//                       <div className="space-y-4">
//                         <div className="flex items-start">
//                           <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
//                             {index + 1}
//                           </span>
//                           <p className="text-lg italic leading-relaxed text-gray-800">
//                             "{sentence.text}"
//                           </p>
//                         </div>
//                         {sentence.translation && (
//                           <div className="pl-9 border-l-4 border-green-500">
//                             <p className="text-gray-700">
//                               {sentence.translation}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* Categories */}
//             {data.categories.length > 0 && (
//               <section className="mb-12">
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
//                   Categories
//                 </h2>
//                 <div className="flex flex-wrap gap-3">
//                   {data.categories.map((cat, index) => (
//                     <div
//                       key={index}
//                       className="group relative"
//                     >
//                       <span className="inline-block bg-gray-50 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors cursor-help border border-gray-200">
//                         {cat.name}
//                       </span>
//                       {cat.description && (
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
//                           {cat.description}
//                           <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* Related Words */}
//             {data.related_words.length > 0 && (
//               <section className="mb-12">
//                 <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
//                   Related Words
//                 </h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                   {data.related_words.map((word, index) => (
//                     <a
//                       key={index}
//                       href={`/${langFrom}-${langTo}/${encodeURIComponent(word.text)}`}
//                       className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-gray-100 hover:border-primary/30 group"
//                     >
//                       <div className="flex flex-col items-center text-center">
//                         <span className="text-lg font-semibold group-hover:text-primary transition-colors text-gray-900">
//                           {word.text}
//                         </span>
//                         {word.level && (
//                           <span className="mt-2 px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
//                             {word.level}
//                           </span>
//                         )}
//                         {word.frequency_rank && (
//                           <span className="mt-1 text-xs text-gray-500">
//                             Rank #{word.frequency_rank}
//                           </span>
//                         )}
//                       </div>
//                     </a>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* CTA Section */}
//             {/* Compact CTA Section for Mobile */}
//             <div className="sticky bottom-6 mt-16">
//               <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-2xl">
//                 <div className="text-center">

//                   <div className='flex flex-col md:flex-row my-2 justify-between items-center'>
//                     <h3 className="text-2xl font-bold ">
//                       Master "{decodedWord}" with W9999
//                     </h3>

//                     <CTAButton word={decodedWord} langFrom={langFrom} langTo={langTo} />

//                   </div>

//                   {/* Quick Feature Points */}
//                   <div className="grid grid-cols-2 gap-3 mb-6">
//                     <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-2">
//                       <span className="text-lg">📚</span>
//                       <span>10k Words</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-2">
//                       <span className="text-lg">🤖</span>
//                       <span>AI Tutor</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-2">
//                       <span className="text-lg">🔥</span>
//                       <span>Streaks</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-2">
//                       <span className="text-lg">👥</span>
//                       <span>Community</span>
//                     </div>
//                   </div>

//                   {/* Main CTA */}
//                   <div className="space-y-4">
                    

//                     {/* Feature Highlights */}
//                     <div className="flex flex-wrap justify-between space-y-2 text-sm text-blue-100">
//                       <div className="flex items-center justify-center gap-2">
//                         <span className="text-green-400">✓</span>
//                         <span>Personalized AI explanations</span>
//                       </div>
//                       <div className="flex items-center justify-center gap-2">
//                         <span className="text-green-400">✓</span>
//                         <span>Track progress & daily streaks</span>
//                       </div>
//                       <div className="flex items-center justify-center gap-2">
//                         <span className="text-green-400">✓</span>
//                         <span>Connect with other learners</span>
//                       </div>
//                     </div>

//                     <p className="text-blue-200 text-xs pt-2 border-t border-white/20">
//                       Free App • Start in 30 seconds
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//           </main>

//           {/* Footer */}
//           <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
//             <p>
//               W9999 • Free language learning with AI •
//               <a
//                 href="https://www.W9999.app"
//                 className="text-primary hover:underline ml-1"
//               >
//                 Open full app
//               </a>
//             </p>
//           </footer>
//         </div>

//         {/* Human Redirect Component (Client-side only) */}
//         <HumanRedirect
//           word={decodedWord}
//           langFrom={langFrom}
//           langTo={langTo}
//         />
//       </body>
//     </html>
//   );
// }
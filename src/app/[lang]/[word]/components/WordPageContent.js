
import AudioPlayer from './AudioPlayer';
import HumanRedirect from './HumanRedirect';
import CTAButton from './CTAButton';
import { Volume2, BookOpen, Star, Users, Target, Award, ChevronRight, Globe } from 'lucide-react';

export default function WordPageContent({ data, lang, targetLang, decodedWord }) {
  const langFrom = lang;
  const langTo = targetLang;

  const BASE_URL = process.env.NEXT_PUBLIC_SEO_DOMAIN;

  return (
    <>
      <main 
        id="main-content" 
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 transition-colors duration-200"
        role="main"
        itemScope
        itemType="https://schema.org/DefinedTerm"
      >
        {/* Skip link for accessibility */}
        <a
          href="#word-definition"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg"
        >
          Skip to word definition
        </a>

        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="mb-12 pt-8" role="banner">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl" aria-label="w9999 logo">W</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    W9999
                  </h2>
                  <p className="text-gray-600 text-sm">
                    9,000+ most common words in 3 languages
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1 text-green-600">
                  <Volume2 size={14} aria-hidden="true" />
                  <span>Free audio</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" aria-hidden="true"></div>
                <div className="flex items-center gap-1 text-purple-600">
                  <BookOpen size={14} aria-hidden="true" />
                  <span>AI examples</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full" aria-hidden="true"></div>
                <span className="text-gray-700">No ads</span>
              </div>
            </div>
          </header>

          {/* ===== MAIN CONTENT ===== */}
          <article id="word-definition" className="relative">
            {/* Word Hero Section */}
            <section className="mb-12" aria-labelledby="word-title">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -translate-y-20 translate-x-20" aria-hidden="true"></div>
                
                <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4" role="doc-subtitle">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        <Globe size={14} aria-hidden="true" />
                        <span>{data?.source_language_name}</span>
                      </div>
                      {data?.level && (
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200">
                          CEFR {data?.level}
                        </div>
                      )}
                    </div>
                    
                    {/* ✅ SINGLE H1 - SEO CRITICAL */}
                    <h1 
                      id="word-title"
                      className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                      itemProp="name"
                    >
                      {data?.word}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      {data?.ipa_pronunciation && (
                        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200">
                          <span 
                            className="text-xl text-gray-700 font-serif"
                            itemProp="pronunciation"
                          >
                            /{data?.ipa_pronunciation}/
                          </span>
                          <div className="w-px h-6 bg-gray-200" aria-hidden="true"></div>
                          <AudioPlayer
                            text={data?.word}
                            language={data?.source_language_name}
                            size="md"
                            variant="minimal"
                            aria-label={`Pronounce ${data?.word}`}
                          />
                        </div>
                      )}
                      
                      {data?.frequency_rank && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                          <Target size={16} className="text-gray-600" aria-hidden="true" />
                          <span className="text-sm text-gray-700">
                            <span className="font-semibold">Rank #{data?.frequency_rank}</span>
                            <span className="sr-only"> in frequency ranking</span> in frequency
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
                        text={data?.word}
                        language={data?.source_language_name}
                        size="md"
                        variant="minimal"
                        aria-label={`Listen to ${data?.word}`}
                      />
                      <a 
                        href={process.env.NEXT_PUBLIC_MAIN_APP}
                        aria-label={`Save ${data?.word} to flashcards on w9999.app`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200"
                      >
                        <Star size={18} aria-hidden="true" />
                        <span className="font-semibold">Save to Flashcards</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Translation Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Primary Translation */}
              {data?.translation && (
                <div 
                  className="lg:col-span-2"
                  itemProp="translation"
                  itemScope
                  itemType="https://schema.org/Language"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                            {data?.targetLangName}
                          </div>
                          <ChevronRight size={20} className="text-white/60" aria-hidden="true" />
                        </div>
                        <p 
                          className="text-5xl font-bold text-white mb-2"
                          itemProp="name"
                        >
                          {data?.translation}
                        </p>
                        <p className="text-white/80">Primary translation</p>
                      </div>
                      <AudioPlayer
                        text={data?.translation}
                        language={data?.targetLangName}
                        size="md"
                        variant="minimal"
                        aria-label={`Pronounce ${data?.translation}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* All Translations Summary */}
              {data?.translations?.length > 0 && (
                <section 
                  className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg"
                  aria-labelledby="all-translations-heading"
                >
                  <h3 
                    id="all-translations-heading"
                    className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2"
                  >
                    <Globe size={20} className="text-blue-600" aria-hidden="true" />
                    <span>Also in {data?.translations.length} languages</span>
                  </h3>
                  <div className="space-y-4">
                    {data?.translations?.slice(0, 3)?.map((trans, index) => (
                      <div
                        key={`${trans?.language_code}-${index}`}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                        itemProp="translation"
                        itemScope
                        itemType="https://schema.org/Language"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span 
                              className="text-sm font-semibold text-gray-600 uppercase"
                              itemProp="alternateName"
                            >
                              {trans?.language_code}
                            </span>
                            <span className="text-xs text-gray-500" aria-hidden="true">•</span>
                            <span className="text-sm text-gray-500">{trans?.language_name}</span>
                          </div>
                          <p 
                            className="text-lg font-medium text-gray-900"
                            itemProp="name"
                          >
                            {trans?.translated_text}
                          </p>
                        </div>
                        <AudioPlayer
                          text={trans?.translated_text}
                          language={trans?.language_code}
                          size="md"
                          variant="minimal"
                          aria-label={`Pronounce ${trans?.translated_text} in ${trans?.language_name}`}
                        />
                      </div>
                    ))}
                    {data?.translations?.length > 3 && (
                      <button 
                        className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
                        aria-label={`Show ${data?.translations?.length - 3} more translations`}
                      >
                        + {data?.translations?.length - 3} more translations
                      </button>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Meanings & Examples Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Meanings & Definitions */}
              {data?.meanings?.length > 0 && (
                <section 
                  className="sticky top-8"
                  aria-labelledby="meanings-heading"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen size={20} className="text-blue-600" aria-hidden="true" />
                    </div>
                    <h2 id="meanings-heading" className="text-2xl font-bold text-gray-800">
                      Meanings & Definitions
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {data?.meanings?.map((meaning, index) => (
                      <article
                        key={`meaning-${index}`}
                        className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
                        itemProp="definition"
                        itemScope
                        itemType="https://schema.org/DefinedTerm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center" aria-hidden="true">
                            <span className="text-blue-700 font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            {meaning?.pos && (
                              <span 
                                className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold mb-3"
                                itemProp="partOfSpeech"
                              >
                                {meaning?.pos}
                              </span>
                            )}
                            <p 
                              className="text-gray-700 leading-relaxed"
                              itemProp="description"
                            >
                              {meaning?.definition}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Example Sentences */}
              {data?.example_sentences?.length > 0 && (
                <section 
                  aria-labelledby="examples-heading"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star size={20} className="text-purple-600" aria-hidden="true" />
                    </div>
                    <h2 id="examples-heading" className="text-2xl font-bold text-gray-800">
                      Example Sentences
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {data?.example_sentences.slice(0, 5).map((sentence, index) => (
                      <article
                        key={`sentence-${index}`}
                        className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                        itemProp="examples"
                        itemScope
                        itemType="https://schema.org/Quotation"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center" aria-hidden="true">
                            <span className="text-purple-700 font-bold text-sm">{index + 1}</span>
                          </div>
                          <p 
                            className="text-lg italic text-gray-800 leading-relaxed"
                            itemProp="text"
                          >
                            "{sentence?.text}"
                          </p>
                        </div>
                        {sentence?.translation && (
                          <div className="ml-12 pl-4 border-l-2 border-purple-200">
                            <p 
                              className="text-gray-600"
                              itemProp="description"
                            >
                              {sentence?.translation}
                            </p>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Categories & Related Words */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Categories */}
              {data?.categories?.length > 0 && (
                <section aria-labelledby="categories-heading">
                  <h3 id="categories-heading" className="text-xl font-semibold text-gray-800 mb-6">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {data?.categories?.map((cat, index) => (
                      <div
                        key={`category-${index}`}
                        className="group relative"
                      >
                        <span 
                          className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-gray-50 to-white text-gray-800 rounded-xl text-sm font-medium hover:from-gray-100 hover:to-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
                          itemProp="about"
                        >
                          {cat?.name}
                        </span>
                        {cat?.description && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover😮pacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 pointer-events-none">
                            {cat?.description}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" aria-hidden="true"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Words */}
              {data?.related_words?.length > 0 && (
                <section aria-labelledby="related-heading">
                  <h3 id="related-heading" className="text-xl font-semibold text-gray-800 mb-6">
                    Related Words
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {data?.related_words?.map((word, index) => (
                      <a
                        key={`related-${index}`}
                        href={`/${langFrom}/${encodeURIComponent(word?.text)}`}
                        className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                        rel="related"
                      >
                        <div className="flex flex-col items-center text-center">
                          <span className="text-lg font-semibold group-hover:text-blue-600 transition-colors text-gray-900">
                            {word?.text}
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            {word?.level && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                {word?.level}
                              </span>
                            )}
                            {word?.frequency_rank && (
                              <span className="text-xs text-gray-500">
                                #{word?.frequency_rank}
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
            <div className="mt-16 z-10">
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 shadow-2xl overflow-hidden">
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" aria-hidden="true"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16" aria-hidden="true"></div>
                
                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                      <Award size={18} aria-hidden="true" />
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
                          <Users size={20} aria-hidden="true" />
                        </div>
                        <h4 className="font-semibold text-lg">AI Tutor</h4>
                      </div>
                      <p className="text-blue-100 text-sm">Personalized explanations & practice</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <BookOpen size={20} aria-hidden="true" />
                        </div>
                        <h4 className="font-semibold text-lg">Smart Flashcards</h4>
                      </div>
                      <p className="text-blue-100 text-sm">Spaced repetition system</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Target size={20} aria-hidden="true" />
                        </div>
                        <h4 className="font-semibold text-lg">Progress Tracking</h4>
                      </div>
                      <p className="text-blue-100 text-sm">Daily streaks & achievements</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                      {/* <p className="text-blue-200 mb-2">Join 50,000+ language learners</p> */}
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
                    <CTAButton word={decodedWord} langFrom={langFrom}  />
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200" role="contentinfo">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold" aria-label="w9999 logo">W</span>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">W9999 Language Learning</p>
                  <p className="text-gray-500 text-sm">Master vocabulary with AI-powered tools</p>
                </div>
              </div>
              <nav className="flex items-center gap-4" aria-label="Footer links">
                <a
                  href={process.env.NEXT_PUBLIC_MAIN_APP}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  rel="noopener noreferrer"
                >
                  Open full app
                </a>
                <div className="w-px h-4 bg-gray-300" aria-hidden="true"></div>
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Terms
                </a>
              </nav>
            </div>
            <p className="text-center text-gray-500 text-sm mt-8">
              © 2026 W9999. Free for everyone, forever.
            </p>
          </footer>
        </div>

        {/* Human Redirect Component (Client-side only) */}
        {/* <HumanRedirect
          word={decodedWord}
          langFrom={langFrom}
        /> */}


          <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'w9999', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: `${lang.toUpperCase()} Words`, item: `${BASE_URL}/${lang}` },
        { '@type': 'ListItem', position: 3, name: data.word, item: `${BASE_URL}/${lang}/${encodeURIComponent(decodedWord)}` },
      ],
    }),
  }}
/>

      </main>
    </>
  );
}


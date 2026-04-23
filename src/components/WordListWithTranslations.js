'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowRightLong } from "react-icons/fa6";


export default function WordListWithTranslations({ words, config, category, size }) {
  const [nativeLang, setNativeLang] = useState(null);
  const [allWords, setAllWords] = useState(words);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for language changes
  useEffect(() => {
    // Get initial language from localStorage
    const savedLang = localStorage.getItem('w9999_native_language');
    if (savedLang && savedLang !== config.lang) {
      setNativeLang(savedLang);
      fetchWordsWithTranslation(savedLang);
    }

    // Listen for language change events from NativeLanguageSelector
    const handleLanguageChange = async (event) => {
      const newLang = event.detail;
      setNativeLang(newLang);
      if (newLang && newLang !== config.lang) {
        await fetchWordsWithTranslation(newLang);
      } else if (!newLang || newLang === config.lang) {
        // Reset to original words
        setAllWords(words);
      }
    };

    window.addEventListener('nativeLanguageChange', handleLanguageChange);
    return () => window.removeEventListener('nativeLanguageChange', handleLanguageChange);
  }, [config.lang, words]);

  const fetchWordsWithTranslation = async (langCode) => {
    setIsLoading(true);
    try {
      // Call YOUR backend API with native_lang parameter
      // const apiUrl = 'http://localhost:8000';
      const apiUrl = 'https://api.w9999.app';
      const url = `${apiUrl}/api/public/top-words/${config.lang}?limit=${words.length}&native_lang=${langCode}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Merge translations with original words
      const updatedWords = words.map((word, index) => ({
        ...word,
        translation: data.words[index]?.translation || null
      }));
      
      setAllWords(updatedWords);
    } catch (error) {
      console.error('Failed to fetch translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 pb-12">
      {/* Show selected language indicator */}
      {nativeLang && nativeLang !== config.lang && (
        <div className="mb-4 text-sm text-gray-600 flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
          <span>🌐</span>
          <span>
            Showing translations in: {nativeLang.toUpperCase()}
            {isLoading && <span className="ml-2 text-blue-500 animate-pulse">(Loading translations...)</span>}
          </span>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Complete {config.typeLabel} List ({allWords.length.toLocaleString()})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allWords.map((w, idx) => (
          <Link
            key={w.id || idx}
            href={`/${config.lang}/${w.urlSlug}`}
            className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
          >
            {/* Rank Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                #{idx + 1}
              </span>
              <FaArrowRightLong className='text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all text-lg' />
            </div>

            {/* Original Word */}
            <h3 className="text-lg font-bold text-blue-600 mb-2">
              {w.text}
            </h3>

            {/* Translation - from your backend! */}
            {/* {nativeLang && nativeLang !== config.lang && w.translation && (
              <p className="text-sm text-gray-600 mb-3 border-t border-gray-100 pt-2 mt-1">
                {w.translation}
              </p>
            )} */}
            {nativeLang && nativeLang !== config.lang && w.translation && (
            <p className="text-sm text-gray-600 mb-3 border-t border-gray-100 pt-2 mt-1">
              {w.translation}
            </p>
          )}

            {/* Loading state */}
            {nativeLang && nativeLang !== config.lang && !w.translation && isLoading && (
              <p className="text-sm text-gray-400 mb-3 border-t border-gray-100 pt-2 mt-1 animate-pulse">
                loading...
              </p>
            )}

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
  );
}





// // src/components/WordListWithTranslations.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { FaArrowRightLong } from "react-icons/fa6";

// export default function WordListWithTranslations({ words, config, category, size }) {
//   const [nativeLang, setNativeLang] = useState(null);
//   const [translatedWords, setTranslatedWords] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [allWords, setAllWords] = useState(words); // Start with original words

//   // Listen for language changes
//   useEffect(() => {
//     const savedLang = localStorage.getItem('w9999_native_language');
//     if (savedLang) {
//       setNativeLang(savedLang);
//       if (savedLang !== config.lang) { // Don't translate to same language
//         fetchWordsWithTranslation(savedLang);
//       }
//     }

//     const handleLanguageChange = async (event) => {
//       const newLang = event.detail;
//       setNativeLang(newLang);
//       if (newLang && newLang !== config.lang) {
//         await fetchWordsWithTranslation(newLang);
//       } else if (!newLang || newLang === config.lang) {
//         // Reset to original words
//         setAllWords(words);
//         setTranslatedWords({});
//       }
//     };

//     window.addEventListener('nativeLanguageChange', handleLanguageChange);
//     return () => window.removeEventListener('nativeLanguageChange', handleLanguageChange);
//   }, [config.lang]);

//   const fetchWordsWithTranslation = async (langCode) => {
//     setIsLoading(true);
//     try {
//       // Call YOUR backend API
//       const url = `${process.env.NEXT_PUBLIC_API_URL}/api/public/top-words/${config.lang}?limit=${words.length}&native_lang=${langCode}`;
//       const response = await fetch(url);
//       const data = await response.json();
      
//       // Update words with translations
//       const updatedWords = data.words.map((backendWord, index) => ({
//         ...words[index],  // Keep original data
//         translation: backendWord.translation  // Add translation
//       }));
      
//       setAllWords(updatedWords);
//     } catch (error) {
//       console.error('Failed to fetch translations:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-12">
//       {nativeLang && nativeLang !== config.lang && (
//         <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
//           <span>🌐</span>
//           <span>
//             Showing translations in: {nativeLang.toUpperCase()}
//             {isLoading && <span className="ml-2 text-blue-500 animate-pulse">(Loading...)</span>}
//           </span>
//         </div>
//       )}

//       <h2 className="text-2xl font-bold text-gray-900 mb-8">
//         Complete {config.typeLabel} List ({allWords.length.toLocaleString()})
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {allWords.map((w, idx) => (
//           <Link
//             key={w.id || idx}
//             href={`/${config.lang}/${w.urlSlug}`}
//             className="flex flex-col p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
//                 #{idx + 1}
//               </span>
//               <FaArrowRightLong className='text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all text-lg' />
//             </div>

//             {/* Original word */}
//             <h3 className="text-lg font-bold text-blue-600 mb-2">
//               {w.text}
//             </h3>

//             {/* Translation - from your backend! */}
//             {nativeLang && nativeLang !== config.lang && w.translation && (
//               <p className="text-sm text-gray-600 mb-3 border-t border-gray-100 pt-2 mt-1">
//                 {w.translation}
//               </p>
//             )}

//             {nativeLang && nativeLang !== config.lang && !w.translation && isLoading && (
//               <p className="text-sm text-gray-400 mb-3 border-t border-gray-100 pt-2 mt-1 animate-pulse">
//                 translating...
//               </p>
//             )}

//             <div className="flex gap-2 flex-wrap mt-auto">
//               {w.level && (
//                 <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
//                   {w.level}
//                 </span>
//               )}
//               {w.pos && (
//                 <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">
//                   {w.pos}
//                 </span>
//               )}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// }
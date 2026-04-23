'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

// Language configuration with flags and names
const NATIVE_LANGUAGES = [
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇺🇸', 
    nativeName: 'English'
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    flag: '🇪🇸', 
    nativeName: 'Español'
  },
  { 
    code: 'ru', 
    name: 'Russian', 
    flag: '🇷🇺', 
    nativeName: 'Русский'
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    flag: '🇮🇳', 
    nativeName: 'हिन्दी'
  },
  { 
    code: 'tr', 
    name: 'Turkish', 
    flag: '🇹🇷', 
    nativeName: 'Türkçe'
  }
];

export default function NativeLanguageSelector({ onLanguageChange, compact = false }) {
  const [selectedLang, setSelectedLang] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('w9999_native_language');
    if (savedLang) {
      const langObj = NATIVE_LANGUAGES.find(l => l.code === savedLang);
      if (langObj) {
        setSelectedLang(langObj);
        if (onLanguageChange) onLanguageChange(savedLang);
      }
    }
  }, []);

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem('w9999_native_language', lang.code);
    setIsOpen(false);
    if (onLanguageChange) onLanguageChange(lang.code);
  };

  const clearLanguage = () => {
    setSelectedLang(null);
    localStorage.removeItem('w9999_native_language');
    setIsOpen(false);
    if (onLanguageChange) onLanguageChange(null);
  };

  // Compact version for word detail page (smaller)
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:border-blue-400 transition-all text-sm"
          aria-label="Select your native language"
        >
          {selectedLang ? (
            <>
              <span className="text-base">{selectedLang.flag}</span>
              <span className="text-gray-700">{selectedLang.nativeName}</span>
            </>
          ) : (
            <>
              <span className="text-base">🌐</span>
              <span className="text-gray-500">Select your language</span>
            </>
          )}
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
              <div className="p-2">
                {NATIVE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedLang?.code === lang.code
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-medium text-sm">{lang.nativeName}</div>
                        <div className="text-xs text-gray-500">{lang.name}</div>
                      </div>
                    </div>
                    {selectedLang?.code === lang.code && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </button>
                ))}
                {selectedLang && (
                  <button
                    onClick={clearLanguage}
                    className="w-full mt-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full version for word list page (larger, more prominent)
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span>🌐</span>
            Your Native Language
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Select your language to see translations
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:border-blue-400 hover:shadow-md transition-all min-w-[200px]"
          >
            {selectedLang ? (
              <>
                <span className="text-2xl">{selectedLang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{selectedLang.nativeName}</div>
                  <div className="text-xs text-gray-500">{selectedLang.name}</div>
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl">🌐</span>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-700">Select language</div>
                  <div className="text-xs text-gray-400">For translations</div>
                </div>
              </>
            )}
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden">
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700">Choose your native language</p>
                  <p className="text-xs text-gray-500">Words will be translated to this language</p>
                </div>
                <div className="p-2 max-h-80 overflow-y-auto">
                  {NATIVE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                        selectedLang?.code === lang.code
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="text-left">
                          <div className="font-medium">{lang.nativeName}</div>
                          <div className="text-xs text-gray-500">{lang.name}</div>
                        </div>
                      </div>
                      {selectedLang?.code === lang.code && (
                        <Check size={18} className="text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
                {selectedLang && (
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button
                      onClick={clearLanguage}
                      className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear selection
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
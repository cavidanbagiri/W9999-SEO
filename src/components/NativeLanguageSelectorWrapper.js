'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamic import with ssr: false works here because this IS a Client Component
const NativeLanguageSelector = dynamic(
  () => import('@/components/NativeLanguageSelector'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
      </div>
    )
  }
);

export default function NativeLanguageSelectorWrapper() {
  const [selectedLang, setSelectedLang] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('w9999_native_language');
    if (saved) {
      setSelectedLang(saved);
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    localStorage.setItem('w9999_native_language', langCode);
    
    // Optional: Dispatch a custom event so other components can listen
    window.dispatchEvent(new CustomEvent('nativeLanguageChange', { detail: langCode }));
  };

  return <NativeLanguageSelector onLanguageChange={handleLanguageChange} />;
}
'use client';

import { useEffect } from 'react';
import { yandexEvents } from '@/lib/yandexEvents';

export default function WordListTracker({ language }) {
  useEffect(() => {
    // Track scroll to bottom
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      
      if (pageHeight - scrollPosition < 100) {
        yandexEvents.trackFullScroll(language);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [language]);
  
  // This component doesn't render anything
  return null;
}
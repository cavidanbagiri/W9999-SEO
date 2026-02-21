'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function YandexPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // This runs on every page change
    if (typeof window !== 'undefined' && window.ym) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Tell Yandex about the new page
      window.ym(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || '106948154', 'hit', url);
      
      console.log('📊 Yandex tracked page:', url);
    }
  }, [pathname, searchParams]); // Runs when URL changes
  
  // This component doesn't show anything
  return null;
}
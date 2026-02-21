'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function YandexMetrica({ counterId }) {
  // Your counter ID from Yandex
  const yandexCounterId = counterId || '106948154'; // Use the one from your code
  
  useEffect(() => {
    // This runs after component mounts
    if (typeof window !== 'undefined') {
      // Initialize Yandex Metrica with SSR support
      window.ym = window.ym || function() {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
      window.ym.l = 1 * new Date();
      
      // Create and load the script manually for better control
      const script = document.createElement('script');
      script.src = `https://mc.yandex.ru/metrika/tag.js?id=${yandexCounterId}`;
      script.async = true;
      script.onload = () => {
        // Initialize with ALL your parameters
        window.ym(yandexCounterId, 'init', {
          ssr: true,                    // Important for Next.js!
          webvisor: true,                // Session replay
          clickmap: true,                // Click tracking
          ecommerce: "dataLayer",        // For future e-commerce
          referrer: document.referrer,    // Track referrer
          url: window.location.href,      // Current URL
          accurateTrackBounce: true,      // Better bounce tracking
          trackLinks: true,                // Track outbound links
          cdn: 'https://mc.yandex.ru',     // CDN for faster loading
          defer: false                     // Load immediately
        });
        
        console.log('✅ Yandex Metrica initialized');
      };
      
      document.head.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      // Optional: cleanup if needed
    };
  }, [yandexCounterId]);
  
  return (
    <>
      {/* First method: Script component with strategy="afterInteractive" */}
      <Script
        id="yandex-metrica"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${yandexCounterId}', 'ym');

            ym(${yandexCounterId}, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: "dataLayer",
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce: true,
              trackLinks: true
            });
          `,
        }}
      />
      
      {/* Noscript fallback for users without JavaScript */}
      <noscript>
        <div>
          <img 
            src={`https://mc.yandex.ru/watch/${yandexCounterId}`} 
            style={{ position: 'absolute', left: '-9999px' }} 
            alt="" 
          />
        </div>
      </noscript>
    </>
  );
}
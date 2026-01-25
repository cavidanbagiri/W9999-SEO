// src/app/[locale]/[word]/components/HumanRedirect.js
'use client';

import { useEffect } from 'react';

export default function HumanRedirect({ word, langFrom, langTo }) {
  useEffect(() => {
    // Bot-safe human detection and redirect
    const isBot = /bot|crawl|spider|slurp|teoma|archive|track|screenshot|monitoring|prerender/i.test(
      navigator.userAgent
    );

    if (!isBot) {
      let redirectTriggered = false;

      const triggerRedirect = () => {
        if (!redirectTriggered) {
          redirectTriggered = true;
          window.open(
            `https://app.w9999.app/card-detail?word=${encodeURIComponent(word)}&langFrom=${langFrom}&langTo=${langTo}`,
            '_blank'
          );
        }
      };

      // Trigger on interaction
      const events = ['click', 'scroll', 'touchstart'];
      events.forEach((event) => {
        document.addEventListener(event, triggerRedirect, {
          once: true,
          passive: true,
        });
      });

      // Auto-redirect after 5 seconds
      const timer = setTimeout(triggerRedirect, 5000);

      return () => clearTimeout(timer);
    }
  }, [word, langFrom, langTo]);

  return null; // This component doesn't render anything
}
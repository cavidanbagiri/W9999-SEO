// Yandex Metrica events - ONLY the important ones for rankings

export const yandexEvents = {
  // Track when user clicks any word (engagement signal)
  trackWordClick(word, position, language) {
    if (typeof window.ym === 'function') {
      window.ym('106948154', 'reachGoal', 'WORD_CLICK', {
        word: word.slice(0, 50),
        position,
        language,
      });
    }
  },

  // Track when user scrolls to bottom (good engagement)
  trackFullScroll(language) {
    if (typeof window.ym === 'function') {
      window.ym('106948154', 'reachGoal', 'FULL_SCROLL', {
        language,
      });
    }
  },

  // Track time on page (automatic - no code needed)
  // Yandex tracks this automatically
};
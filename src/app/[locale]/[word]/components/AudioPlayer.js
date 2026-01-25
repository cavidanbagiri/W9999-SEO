// src/app/[locale]/[word]/components/AudioPlayer.js
'use client';

export default function AudioPlayer({ url, label, size = 'md' }) {
  const playAudio = () => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(() => {});
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <button
      onClick={playAudio}
      className={`
        rounded-full border-2 border-primary text-primary 
        hover:bg-primary hover:text-white transition-all duration-200
        flex items-center justify-center
        ${sizeClasses[size]}
      `}
      aria-label={label}
    >
      🔊
    </button>
  );
}
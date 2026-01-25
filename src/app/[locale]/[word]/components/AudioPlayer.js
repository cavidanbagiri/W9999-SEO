

// src/app/[locale]/[word]/components/AudioPlayer.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { generateSpeech } from '@/lib/api'; // Adjust path as needed
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

export default function AudioPlayer({ 
  size = 'md',
  text,
  language,
  variant = 'primary' 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef(null);
  const audioBlobUrlRef = useRef(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const variantClasses = {
    primary: 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    light: 'border-white text-white hover:bg-white/20',
    minimal: 'border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800',
    ghost: 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const playGeneratedAudio = async () => {
    if (!text || !language || isLoading || isPlaying) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      // Clean up previous blob URL if exists
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
        audioBlobUrlRef.current = null;
      }

      let lang_mapping = {
        'English': 'en',
        'Spanish': 'es',
        'Russian': 'ru',
        'Turkish': 'tr',
      }

      // Check if language is supported
      
      let audioBlob = null;
      if (lang_mapping[language]) {
        audioBlob = await generateSpeech({
          text: text,
          language: lang_mapping[language],
        });
      }
      else if(['en', 'es', 'ru', 'tr'].includes(language)){
        audioBlob = await generateSpeech({
          text: text,
          language: language,
        });
      }
      else {
        console.error('AudioPlayer: Unsupported language', language);
        return;
      }

      // Generate speech from API

      if (!audioBlob) {
        throw new Error('No audio received');
      }

      // Create URL from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      audioBlobUrlRef.current = audioUrl;
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const handleEnded = () => {
        setIsPlaying(false);
        setIsLoading(false);
        // Clean up blob URL
        if (audioBlobUrlRef.current) {
          URL.revokeObjectURL(audioBlobUrlRef.current);
          audioBlobUrlRef.current = null;
        }
        audioRef.current = null;
      };

      const handleError = (error) => {
        console.error('Audio playback failed:', error);
        setHasError(true);
        setIsPlaying(false);
        setIsLoading(false);
        // Clean up blob URL
        if (audioBlobUrlRef.current) {
          URL.revokeObjectURL(audioBlobUrlRef.current);
          audioBlobUrlRef.current = null;
        }
        audioRef.current = null;
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Add abort timeout
      const timeoutId = setTimeout(() => {
        if (audioRef.current && !audioRef.current.ended) {
          handleError(new Error('Audio playback timeout'));
        }
      }, 30000); // 30 second timeout

      const handleLoadedData = () => {
        clearTimeout(timeoutId);
      };

      audio.addEventListener('loadeddata', handleLoadedData);

      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);

      // Clean up loadeddata listener
      audio.removeEventListener('loadeddata', handleLoadedData);

    } catch (error) {
      console.error('Failed to play sound', error);
      setHasError(true);
      setIsPlaying(false);
      setIsLoading(false);
      
      // Clean up any remaining references
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
        audioBlobUrlRef.current = null;
      }
      audioRef.current = null;
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      // Stop audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setIsLoading(false);
        
        // Clean up blob URL if exists
        if (audioBlobUrlRef.current) {
          URL.revokeObjectURL(audioBlobUrlRef.current);
          audioBlobUrlRef.current = null;
        }
        audioRef.current = null;
      }
      return;
    }

    // Play generated audio
    if (text && language) {
      playGeneratedAudio();
    } else {
      setHasError(true);
      console.error('AudioPlayer: Missing text or language props');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
        audioBlobUrlRef.current = null;
      }
    };
  }, []);

  // Get appropriate icon based on state
  const getIcon = () => {
    if (isLoading) {
      return <Loader2 size={iconSize[size]} className="animate-spin" />;
    }
    if (hasError) {
      return <VolumeX size={iconSize[size]} />;
    }
    if (isPlaying) {
      return <Volume2 size={iconSize[size]} className="animate-pulse" />;
    }
    return <Volume2 size={iconSize[size]} />;
  };

  // Get button class based on state
  const getButtonClass = () => {
    const baseClasses = `
      rounded-full border-2 flex items-center justify-center 
      transition-all duration-200 ease-in-out relative
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeClasses[size]}
    `;

    if (hasError) {
      return `${baseClasses} border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-600`;
    }

    if (isPlaying) {
      return `${baseClasses} border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700`;
    }

    if (isLoading) {
      return `${baseClasses} border-gray-400 text-gray-400 cursor-wait hover:border-gray-400`;
    }

    return `${baseClasses} ${variantClasses[variant]}`;
  };

  // Get accessibility label based on text
  const getAriaLabel = () => {
    if (isLoading) return `Loading pronunciation of "${text}"...`;
    if (isPlaying) return `Stop pronunciation of "${text}"`;
    if (hasError) return `Error playing "${text}" - click to retry`;
    return `Play pronunciation of "${text}"`;
  };

  // Get title for tooltip
  const getTitle = () => {
    if (isLoading) return `Loading pronunciation...`;
    if (isPlaying) return `Playing... (click to stop)`;
    if (hasError) return `Click to retry pronunciation`;
    return `Listen to pronunciation`;
  };


  console.log('the text and language name us ', text, ' -> ',language)
  // Don't render if no text or language
  if (!text || !language) {
    console.warn('AudioPlayer: text or language prop is missing');
    return null;
  }

  return (
    <button
      onClick={handlePlay}
      className={getButtonClass()}
      aria-label={getAriaLabel()}
      disabled={isLoading}
      title={getTitle()}
      type="button"
    >
      {getIcon()}
      
      {/* Visual feedback for playing state */}
      {isPlaying && (
        <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-40"></span>
      )}
      
      {/* Error indicator dot */}
      {hasError && !isLoading && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}

// PropTypes for better development experience
AudioPlayer.propTypes = {
  text: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'light', 'minimal', 'ghost']),
};

// Optional: Display name for debugging
AudioPlayer.displayName = 'AudioPlayer';













// // src/app/[locale]/[word]/components/AudioPlayer.js
// 'use client';

// export default function AudioPlayer({ url, label, size = 'md' }) {
//   const playAudio = () => {
//     if (url) {
//       const audio = new Audio(url);
//       audio.play().catch(() => {});
//     }
//   };

//   const sizeClasses = {
//     sm: 'w-8 h-8 text-sm',
//     md: 'w-12 h-12 text-lg',
//     lg: 'w-16 h-16 text-xl',
//   };

//   return (
//     <button
//       onClick={playAudio}
//       className={`
//         rounded-full border-2 border-primary text-primary 
//         hover:bg-primary hover:text-white transition-all duration-200
//         flex items-center justify-center
//         ${sizeClasses[size]}
//       `}
//       aria-label={label}
//     >
//       🔊 
//     </button>
//   );
// }
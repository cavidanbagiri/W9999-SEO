// LogoWithBack.js (new file)
"use client";
import { useRouter } from 'next/navigation';

export default function LogoWithBack() {
  const router = useRouter();
  
  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };
  
  return (
    <div onClick={handleClick} className="flex items-center gap-3 cursor-pointer group">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
        <span className="text-white font-bold text-xl">W</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          W9999
        </h2>
        <p className="text-gray-600 text-sm">
          9,000+ most common words in 3 languages
        </p>
      </div>
    </div>
  );
}
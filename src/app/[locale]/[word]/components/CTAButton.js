
'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTAButton({ word, langFrom, langTo }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.open(
      `https://www.w9999.app`,
      '_blank'
    );
  };

  return (
    <a
      href={`https://www.w9999.app`}
      onClick={handleClick}
      className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-white to-gray-50 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 shadow-lg hover:-translate-y-1 min-w-[200px]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      <span className="relative">Save "{word}"</span>
      <div className="relative flex items-center gap-2">
        <Sparkles size={18} className="text-yellow-600" />
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}
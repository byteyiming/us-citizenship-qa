"use client";

import { useStore } from '@/lib/store';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useStore();

  return (
    <button
      onClick={toggleLanguage}
      className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
    >
      {language === 'en' ? '中文' : 'English'}
    </button>
  );
}

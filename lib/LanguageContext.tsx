'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translation, getTranslation } from './translations';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  isIndic: boolean;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  // Persist language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('lexindia_lang') as Language;
    if (savedLang) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang(savedLang);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('lexindia_lang', newLang);
  };

  const isIndic = lang !== 'en';
  const t = getTranslation(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, isIndic, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

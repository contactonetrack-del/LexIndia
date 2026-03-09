'use client';

import React, { createContext, useContext, useState } from 'react';
import { Language } from './translations';

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  isIndic: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const isIndic = lang !== 'en';

  return (
    <LanguageContext.Provider value={{ lang, setLang, isIndic }}>
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

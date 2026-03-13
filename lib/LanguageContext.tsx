'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  LOCALE_COOKIE,
  getLocaleDirection,
  getLocaleFontToken,
  type Locale,
} from '@/lib/i18n/config';
import { getMessages, type Translation } from '@/lib/i18n/messages';

type LanguageContextType = {
  lang: Locale;
  locale: Locale;
  setLang: (lang: Locale) => void;
  isIndic: boolean;
  dir: 'ltr' | 'rtl';
  fontClass: string;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function persistLocale(lang: Locale) {
  localStorage.setItem(LOCALE_COOKIE, lang);
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Locale;
}) {
  const [lang, setLang] = useState<Locale>(initialLang);

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  useEffect(() => {
    persistLocale(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = getLocaleDirection(lang);
    document.documentElement.dataset.locale = lang;
    document.documentElement.style.setProperty(
      '--font-current-locale',
      `var(${getLocaleFontToken(lang)})`
    );
  }, [lang]);

  const value = useMemo<LanguageContextType>(() => {
    const direction = getLocaleDirection(lang);

    return {
      lang,
      locale: lang,
      setLang,
      isIndic: lang !== 'en',
      dir: direction,
      fontClass: lang === 'en' ? '' : 'font-locale',
      t: getMessages(lang),
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

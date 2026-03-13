'use client';

import React from 'react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

export default function SkipToContent() {
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(
    {
      label: 'Skip to content',
    } as const,
    lang
  );

  return (
    <a 
      href="#main-content"
      className="sr-only transition-all focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-bold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {copy.label}
    </a>
  );
}

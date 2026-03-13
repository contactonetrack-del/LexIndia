'use client';

import React from 'react';
import { ArrowRight, Scale } from 'lucide-react';

import LocaleLink from '@/components/LocaleLink';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

interface ConsultationCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export function ConsultationCTA({
  title,
  description,
  buttonText,
}: ConsultationCTAProps) {
  const { lang } = useLanguage();
  const fallbackCopy = localizeTreeFromMemory(
    {
      title: 'Ready to discuss your legal matter?',
      description: 'Get matched with a verified expert. The first consultation is free.',
      buttonText: 'Find a Lawyer Now',
    } as const,
    lang
  );

  return (
    <div className="relative my-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-accent/10 p-8 text-center sm:flex sm:items-center sm:justify-between sm:gap-6 sm:text-left">
      <div className="pointer-events-none absolute -right-8 -top-8 text-primary/10">
        <Scale className="h-48 w-48" strokeWidth={1} />
      </div>

      <div className="relative z-10 mb-6 flex-1 sm:mb-0">
        <h3 className="mb-2 text-2xl font-bold text-foreground">{title ?? fallbackCopy.title}</h3>
        <p className="max-w-2xl text-muted-foreground">{description ?? fallbackCopy.description}</p>
      </div>

      <div className="relative z-10 shrink-0">
        <LocaleLink
          href="/lawyers"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90"
        >
          {buttonText ?? fallbackCopy.buttonText}
          <ArrowRight className="h-4 w-4" />
        </LocaleLink>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Scale } from 'lucide-react';

import LocaleLink from '@/components/LocaleLink';
import { getPageFallbackContent } from '@/lib/content/page-fallbacks';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { fontClass, lang, t } = useLanguage();
  const guidesLabel = getPageFallbackContent('guides', lang).title;
  const verificationLabel = getPageFallbackContent('verifyLawyers', lang).title;
  const disclaimerPageLabel = getPageFallbackContent('disclaimer', lang).title;

  return (
    <footer className="border-t border-border bg-surface py-12 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold tracking-tight text-foreground">LexIndia</span>
            </div>
            <p className={`text-sm ${fontClass}`}>{t.footer.desc}</p>
          </div>

          <div>
            <h4 className={`mb-4 font-semibold text-foreground ${fontClass}`}>{t.footer.forCitizens}</h4>
            <ul className={`space-y-2 text-sm ${fontClass}`}>
              <li><LocaleLink href="/lawyers" className="transition-colors hover:text-foreground">{t.footer.findLawyer}</LocaleLink></li>
              <li><LocaleLink href="/knowledge" className="transition-colors hover:text-foreground">{t.footer.knowledge}</LocaleLink></li>
              <li><LocaleLink href="/guides" className="transition-colors hover:text-foreground">{guidesLabel}</LocaleLink></li>
              <li><LocaleLink href="/templates" className="transition-colors hover:text-foreground">{t.footer.templates}</LocaleLink></li>
              <li><LocaleLink href="/rights" className="transition-colors hover:text-foreground">{t.footer.rights}</LocaleLink></li>
            </ul>
          </div>

          <div>
            <h4 className={`mb-4 font-semibold text-foreground ${fontClass}`}>{t.footer.forLawyers}</h4>
            <ul className={`space-y-2 text-sm ${fontClass}`}>
              <li><LocaleLink href="/pricing" className="transition-colors hover:text-foreground">{t.footer.pricing}</LocaleLink></li>
              <li><LocaleLink href="/dashboard/lawyer" className="transition-colors hover:text-foreground">{t.footer.dashboard}</LocaleLink></li>
            </ul>
          </div>

          <div>
            <h4 className={`mb-4 font-semibold text-foreground ${fontClass}`}>{t.footer.company}</h4>
            <ul className={`space-y-2 text-sm ${fontClass}`}>
              <li><LocaleLink href="/about" className="transition-colors hover:text-foreground">{t.footer.about}</LocaleLink></li>
              <li><LocaleLink href="/contact" className="transition-colors hover:text-foreground">{t.footer.contact}</LocaleLink></li>
              <li><LocaleLink href="/verify-lawyers" className="transition-colors hover:text-foreground">{verificationLabel}</LocaleLink></li>
              <li><LocaleLink href="/privacy" className="transition-colors hover:text-foreground">{t.footer.privacy}</LocaleLink></li>
              <li><LocaleLink href="/terms" className="transition-colors hover:text-foreground">{t.footer.terms}</LocaleLink></li>
              <li><LocaleLink href="/disclaimer" className="transition-colors hover:text-foreground">{disclaimerPageLabel}</LocaleLink></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm md:flex-row">
          <p className={fontClass}>
            &copy; {new Date().getFullYear()} LexIndia. {t.footer.rightsRes}
          </p>
          <div className="max-w-xl space-y-2 text-center text-xs md:text-right">
            <p>
              <strong>{t.footer.disclaimer}</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

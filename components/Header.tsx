'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  Scale,
  Search,
  User,
  X,
} from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import LocaleLink from '@/components/LocaleLink';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { getPageFallbackContent } from '@/lib/content/page-fallbacks';
import { shellCopy } from '@/lib/content/public-ui';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { type Language, languageNames } from '@/lib/translations';
import { localizeHref } from '@/lib/i18n/navigation';

export default function Header() {
  const { fontClass, lang, setLang, t } = useLanguage();
  const { data: session } = useSession();
  const { logout, openAuthModal } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userRole = session?.user?.role?.toLowerCase() ?? null;
  const guidesLabel = getPageFallbackContent('guides', lang).title;
  const noLanguagesFoundLabel = getLocalizedText(shellCopy.noLanguagesFound, lang);
  const logoutLabel = getLocalizedText(shellCopy.logout, lang);
  const copy = localizeTreeFromMemory(
    {
      selectLanguageAriaLabel: 'Select language',
      toggleMenuAriaLabel: 'Toggle menu',
    } as const,
    lang
  );

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = (Object.entries(languageNames) as [Language, string][])
    .filter(([, name]) => name.toLowerCase().includes(langSearchQuery.toLowerCase()));

  const currentPath = `${pathname || '/'}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    setIsLangMenuOpen(false);
    setLangSearchQuery('');
    router.push(localizeHref(currentPath, selectedLang));
  };

  const handleLogout = () => {
    logout();
    router.push(localizeHref('/', lang));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <LocaleLink href="/" className="flex shrink-0 items-center gap-2">
          <Scale className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight text-primary">LexIndia</span>
        </LocaleLink>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          <LocaleLink href="/lawyers" className={`whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary xl:text-base ${fontClass}`}>
            {t.nav.lawyers}
          </LocaleLink>
          <LocaleLink href="/knowledge" className={`whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary xl:text-base ${fontClass}`}>
            {t.nav.knowledge}
          </LocaleLink>
          <LocaleLink href="/guides" className={`whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary xl:text-base ${fontClass}`}>
            {guidesLabel}
          </LocaleLink>
          <LocaleLink href="/templates" className={`whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary xl:text-base ${fontClass}`}>
            {t.nav.templates}
          </LocaleLink>
          <LocaleLink href="/rights" className={`whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-primary xl:text-base ${fontClass}`}>
            {t.nav.rights}
          </LocaleLink>
          <LocaleLink href="/pricing" className={`whitespace-nowrap text-sm font-bold text-accent transition-colors hover:opacity-80 xl:text-base ${fontClass}`}>
            {t.hero.forLawyers}
          </LocaleLink>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <ThemeToggle />

          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen((open) => !open)}
              className="flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-2 text-muted-foreground transition-colors hover:border-border hover:bg-surface hover:text-primary"
              aria-label={copy.selectLanguageAriaLabel}
              aria-expanded={isLangMenuOpen}
              aria-haspopup="listbox"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden text-sm font-semibold sm:block">{languageNames[lang].split(' ')[0]}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 flex w-64 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
                <div className="border-b border-border bg-surface-hover/70 p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={`${t.common.search}...`}
                      value={langSearchQuery}
                      onChange={(event) => setLangSearchQuery(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {filteredLanguages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1">
                      {filteredLanguages.map(([code, name]) => (
                        <button
                          key={code}
                          onClick={() => handleLanguageSelect(code)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${lang === code ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-surface-hover'}`}
                        >
                          <span>{name}</span>
                          {lang === code && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">{noLanguagesFoundLabel}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!userRole ? (
            <>
              <button
                onClick={() => openAuthModal()}
                className={`hidden font-medium text-primary transition-colors hover:opacity-80 sm:block ${fontClass}`}
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => openAuthModal()}
                className={`hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:block ${fontClass}`}
              >
                {t.nav.signup}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <LocaleLink
                href={`/dashboard/${userRole}`}
                className="hidden items-center gap-2 font-medium text-foreground transition-colors hover:text-primary sm:flex"
              >
                <User className="h-5 w-5" />
                {t.dashboard.title}
              </LocaleLink>
              <button
                onClick={handleLogout}
                className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger sm:block"
                title={logoutLabel}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-primary lg:hidden"
            aria-label={copy.toggleMenuAriaLabel}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute w-full border-t border-border bg-background shadow-lg lg:hidden">
          <nav className="flex flex-col space-y-4 px-4 py-4">
            <LocaleLink href="/lawyers" onClick={() => setIsMobileMenuOpen(false)} className={`font-medium text-muted-foreground transition-colors hover:text-primary ${fontClass}`}>
              {t.nav.lawyers}
            </LocaleLink>
            <LocaleLink href="/knowledge" onClick={() => setIsMobileMenuOpen(false)} className={`font-medium text-muted-foreground transition-colors hover:text-primary ${fontClass}`}>
              {t.nav.knowledge}
            </LocaleLink>
            <LocaleLink href="/templates" onClick={() => setIsMobileMenuOpen(false)} className={`font-medium text-muted-foreground transition-colors hover:text-primary ${fontClass}`}>
              {t.nav.templates}
            </LocaleLink>
            <LocaleLink href="/guides" onClick={() => setIsMobileMenuOpen(false)} className={`font-medium text-muted-foreground transition-colors hover:text-primary ${fontClass}`}>
              {guidesLabel}
            </LocaleLink>
            <LocaleLink href="/rights" onClick={() => setIsMobileMenuOpen(false)} className={`font-medium text-muted-foreground transition-colors hover:text-primary ${fontClass}`}>
              {t.nav.rights}
            </LocaleLink>
            <LocaleLink href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={`font-bold text-accent transition-colors hover:opacity-80 ${fontClass}`}>
              {t.hero.forLawyers}
            </LocaleLink>

            {!userRole ? (
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:hidden">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className={`py-2 text-center font-medium text-primary transition-colors hover:opacity-80 ${fontClass}`}
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className={`rounded-lg bg-primary px-4 py-2.5 text-center font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 ${fontClass}`}
                >
                  {t.nav.signup}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:hidden">
                <LocaleLink
                  href={`/dashboard/${userRole}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 font-medium text-foreground transition-colors hover:text-primary"
                >
                  <User className="h-5 w-5" />
                  {t.dashboard.title}
                </LocaleLink>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg py-2 font-medium text-danger transition-colors hover:bg-danger/10"
                >
                  <LogOut className="h-5 w-5" />
                  {logoutLabel}
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

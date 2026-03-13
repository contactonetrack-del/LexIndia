import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from '@/lib/i18n/config';
import { stripLocaleFromPathname } from '@/lib/i18n/navigation';

export type ResolveRequestLocaleInput = {
  pathname?: string | null;
  routeLocale?: string | null;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
  ipCountry?: string | null;
  headerLocale?: string | null;
};

function parseAcceptLanguage(acceptLanguage: string | null | undefined): Locale | null {
  if (!acceptLanguage) return null;

  const preferred = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const entry of preferred) {
    if (isSupportedLocale(entry)) return entry;
    const base = entry.split('-')[0];
    if (isSupportedLocale(base)) return base;
  }

  return null;
}

export function resolveRequestLocale(input: ResolveRequestLocaleInput): Locale {
  if (isSupportedLocale(input.routeLocale)) return input.routeLocale;
  if (isSupportedLocale(input.headerLocale)) return input.headerLocale;

  if (input.pathname) {
    const localeFromPath = stripLocaleFromPathname(input.pathname).locale;
    if (localeFromPath) return localeFromPath;
  }

  if (isSupportedLocale(input.cookieLocale)) return input.cookieLocale;

  const acceptLanguageLocale = parseAcceptLanguage(input.acceptLanguage);
  if (acceptLanguageLocale) return acceptLanguageLocale;

  if (input.ipCountry?.toUpperCase() === 'IN') return 'hi';

  return DEFAULT_LOCALE;
}

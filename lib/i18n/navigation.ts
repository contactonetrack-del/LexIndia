import { DEFAULT_LOCALE, type Locale, isSupportedLocale } from '@/lib/i18n/config';

type PathSplit = {
  path: string;
  suffix: string;
};

function splitPathAndSuffix(input: string): PathSplit {
  const match = input.match(/^([^?#]*)(.*)$/);
  return {
    path: match?.[1] || '/',
    suffix: match?.[2] || '',
  };
}

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '') return '/';
  if (pathname === '/') return '/';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function isLocalHref(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//');
}

export function stripLocaleFromPathname(pathname: string) {
  const normalized = normalizePath(pathname);
  const segments = normalized.split('/').filter(Boolean);
  const localeSegment = segments[0];

  if (!isSupportedLocale(localeSegment)) {
    return {
      locale: null as Locale | null,
      pathname: normalized,
    };
  }

  const stripped = `/${segments.slice(1).join('/')}`;
  return {
    locale: localeSegment,
    pathname: stripped === '/' ? '/' : stripped.replace(/\/+$/, '') || '/',
  };
}

export function withLocalePrefix(pathname: string, locale: Locale = DEFAULT_LOCALE) {
  const normalized = normalizePath(pathname);
  const stripped = stripLocaleFromPathname(normalized).pathname;
  return stripped === '/' ? `/${locale}` : `/${locale}${stripped}`;
}

export function localizeHref(href: string, locale: Locale = DEFAULT_LOCALE) {
  if (!isLocalHref(href)) return href;
  const { path, suffix } = splitPathAndSuffix(href);
  return `${withLocalePrefix(path, locale)}${suffix}`;
}

export function getPathWithoutLocale(pathname: string) {
  return stripLocaleFromPathname(pathname).pathname;
}

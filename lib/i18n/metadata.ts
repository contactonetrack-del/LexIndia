import type { Metadata } from 'next';

import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getLocaleOpenGraph,
  type Locale,
} from '@/lib/i18n/config';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { SITE_URL } from '@/lib/site';

function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function buildLanguageAlternates(pathname: string) {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, absoluteUrl(withLocalePrefix(pathname, locale))])
  );

  return {
    canonical: absoluteUrl(withLocalePrefix(pathname, DEFAULT_LOCALE)),
    languages: {
      ...languages,
      'x-default': absoluteUrl(withLocalePrefix(pathname, DEFAULT_LOCALE)),
    },
  };
}

export function buildLocalizedAlternates(pathname: string, locale: Locale) {
  const alternates = buildLanguageAlternates(pathname);

  return {
    ...alternates,
    canonical: absoluteUrl(withLocalePrefix(pathname, locale)),
  };
}

export function createLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
  keywords,
}: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  keywords?: string[];
}): Metadata {
  const localizedPath = withLocalePrefix(pathname, locale);

  return {
    title,
    description,
    keywords,
    alternates: buildLocalizedAlternates(pathname, locale),
    openGraph: {
      title,
      description,
      url: absoluteUrl(localizedPath),
      siteName: 'LexIndia',
      locale: getLocaleOpenGraph(locale),
      type: 'website',
    },
  };
}

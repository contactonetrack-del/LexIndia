export const SUPPORTED_LOCALES = [
  'en',
  'hi',
  'bn',
  'te',
  'mr',
  'ta',
  'gu',
  'ur',
  'kn',
  'or',
  'pa',
  'ml',
  'bho',
  'bh',
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'lexindia_lang';
export const THEME_COOKIE = 'lexindia_theme';
export const REQUEST_LOCALE_HEADER = 'x-lexindia-locale';
export const REQUEST_PATH_HEADER = 'x-lexindia-pathname';
export const SITE_URL = 'https://lexindia.in';

export type LocaleDirection = 'ltr' | 'rtl';
export type LocaleScript =
  | 'latin'
  | 'devanagari'
  | 'bengali'
  | 'telugu'
  | 'tamil'
  | 'gujarati'
  | 'arabic'
  | 'kannada'
  | 'oriya'
  | 'gurmukhi'
  | 'malayalam';

type LocaleInfo = {
  direction: LocaleDirection;
  fontToken: string;
  openGraphLocale: string;
  script: LocaleScript;
};

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en: { direction: 'ltr', fontToken: '--font-sans', openGraphLocale: 'en_IN', script: 'latin' },
  hi: { direction: 'ltr', fontToken: '--font-devanagari', openGraphLocale: 'hi_IN', script: 'devanagari' },
  bn: { direction: 'ltr', fontToken: '--font-bengali', openGraphLocale: 'bn_IN', script: 'bengali' },
  te: { direction: 'ltr', fontToken: '--font-telugu', openGraphLocale: 'te_IN', script: 'telugu' },
  mr: { direction: 'ltr', fontToken: '--font-devanagari', openGraphLocale: 'mr_IN', script: 'devanagari' },
  ta: { direction: 'ltr', fontToken: '--font-tamil', openGraphLocale: 'ta_IN', script: 'tamil' },
  gu: { direction: 'ltr', fontToken: '--font-gujarati', openGraphLocale: 'gu_IN', script: 'gujarati' },
  ur: { direction: 'rtl', fontToken: '--font-urdu', openGraphLocale: 'ur_IN', script: 'arabic' },
  kn: { direction: 'ltr', fontToken: '--font-kannada', openGraphLocale: 'kn_IN', script: 'kannada' },
  or: { direction: 'ltr', fontToken: '--font-oriya', openGraphLocale: 'or_IN', script: 'oriya' },
  pa: { direction: 'ltr', fontToken: '--font-gurmukhi', openGraphLocale: 'pa_IN', script: 'gurmukhi' },
  ml: { direction: 'ltr', fontToken: '--font-malayalam', openGraphLocale: 'ml_IN', script: 'malayalam' },
  bho: { direction: 'ltr', fontToken: '--font-devanagari', openGraphLocale: 'bho_IN', script: 'devanagari' },
  bh: { direction: 'ltr', fontToken: '--font-devanagari', openGraphLocale: 'bh_IN', script: 'devanagari' },
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && SUPPORTED_LOCALES.includes(value as Locale));
}

export function getLocaleDirection(locale: Locale): LocaleDirection {
  return LOCALE_INFO[locale].direction;
}

export function getLocaleFontToken(locale: Locale): string {
  return LOCALE_INFO[locale].fontToken;
}

export function getLocaleOpenGraph(locale: Locale): string {
  return LOCALE_INFO[locale].openGraphLocale;
}

export function getLocaleScript(locale: Locale): LocaleScript {
  return LOCALE_INFO[locale].script;
}

import type { Locale } from '@/lib/i18n/config';

export const DISPLAY_LOCALES: Record<Locale, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  ur: 'ur-IN',
  kn: 'kn-IN',
  or: 'or-IN',
  pa: 'pa-IN',
  ml: 'ml-IN',
  bho: 'hi-IN',
  bh: 'hi-IN',
};

export function getDisplayLocale(locale: Locale): string {
  return DISPLAY_LOCALES[locale] ?? DISPLAY_LOCALES.en;
}

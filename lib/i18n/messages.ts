import languageNamesJson from '@/messages/language-names.json';
import bh from '@/messages/bh.json';
import bho from '@/messages/bho.json';
import bn from '@/messages/bn.json';
import en from '@/messages/en.json';
import gu from '@/messages/gu.json';
import hi from '@/messages/hi.json';
import kn from '@/messages/kn.json';
import ml from '@/messages/ml.json';
import mr from '@/messages/mr.json';
import or from '@/messages/or.json';
import pa from '@/messages/pa.json';
import ta from '@/messages/ta.json';
import te from '@/messages/te.json';
import ur from '@/messages/ur.json';

import { type Locale } from '@/lib/i18n/config';

export type Translation = typeof en;
export type MessageNamespace = keyof Translation;
type TranslationValue = string | TranslationTree;
type TranslationTree = { [key: string]: TranslationValue };

export const languageNames = languageNamesJson as Record<Locale, string>;

export const allTranslations = {
  en,
  hi,
  bn,
  te,
  mr,
  ta,
  gu,
  ur,
  kn,
  or,
  pa,
  ml,
  bho,
  bh,
} satisfies Record<Locale, Translation>;

function mergeWithEnglishFallback<T extends TranslationValue>(
  base: T,
  override: TranslationValue | undefined
): T {
  if (typeof base === 'string') {
    return (typeof override === 'string' ? override : base) as T;
  }

  if (!base || typeof base !== 'object' || Array.isArray(base)) {
    return ((override as T | undefined) ?? base) as T;
  }

  const overrideObject =
    override && typeof override === 'object' && !Array.isArray(override)
      ? (override as TranslationTree)
      : {};

  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => [
      key,
      mergeWithEnglishFallback(value, overrideObject[key]),
    ])
  ) as T;
}

export function getMessages(locale: Locale): Translation {
  if (locale === 'en') {
    return allTranslations.en;
  }

  return mergeWithEnglishFallback(allTranslations.en, allTranslations[locale]) as Translation;
}

export function getMessagesForNamespace<TNamespace extends MessageNamespace>(
  locale: Locale,
  namespace: TNamespace
) {
  return getMessages(locale)[namespace];
}

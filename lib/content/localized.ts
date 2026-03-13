import translationMemoryJson from '@/lib/content/translation-memory.json';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/config';

export type LocalizedText = Record<Locale, string>;
type TranslationMemory = Partial<Record<string, Partial<Record<Locale, string>>>>;

const translationMemory = translationMemoryJson as TranslationMemory;
const BHO_BH_PREFIX_REGEX = /^\u0915\u0947 \u092c\u093e\s*\n+/u;
const BHO_BH_INLINE_PREFIX_REGEX = /^\u0915\u0947 \u092c\u093e\s+/u;
const BHO_BH_TRAILING_REGEX = /\s+\u0915\u0947 \u092c\u093e$/u;
const BHO_BH_SENTENCE_ARTIFACT_REGEX =
  /\u092c\u0924\u093e\u0935\u0932 \u0917\u0907\u0932 \u092c\u093e|\u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u092c\u0924\u093e\u0935\u0932 \u0917\u0907\u0932 \u092c\u093e/u;
const OR_PIPE_ARTIFACT_REGEX = /[ \t]*\|[ \t]*/gu;

function sanitizeMemoryTranslation(value: string, locale: Locale) {
  let sanitized = value.replace(/\r\n/g, '\n').trim();

  if (locale === 'bho' || locale === 'bh') {
    sanitized = sanitized
      .replace(BHO_BH_PREFIX_REGEX, '')
      .replace(BHO_BH_INLINE_PREFIX_REGEX, '');
  }

  if (locale === 'or') {
    sanitized = sanitized
      .split('\n')
      .map((line) => line.replace(OR_PIPE_ARTIFACT_REGEX, '').trimEnd())
      .join('\n');
  }

  return sanitized.replace(/\n{3,}/g, '\n\n').trim();
}

function getMemoryTranslation(defaultValue: string, locale: Locale) {
  const translation = translationMemory[defaultValue]?.[locale];
  if (!translation) return undefined;

  const sanitized = sanitizeMemoryTranslation(translation, locale);
  const hasBhoBhArtifact =
    (locale === 'bho' || locale === 'bh') &&
    (
      BHO_BH_PREFIX_REGEX.test(sanitized) ||
      BHO_BH_INLINE_PREFIX_REGEX.test(sanitized) ||
      BHO_BH_TRAILING_REGEX.test(sanitized) ||
      BHO_BH_SENTENCE_ARTIFACT_REGEX.test(sanitized)
    );

  if (hasBhoBhArtifact) {
    const hindiFallback = translationMemory[defaultValue]?.hi;
    if (hindiFallback) {
      return sanitizeMemoryTranslation(hindiFallback, 'hi');
    }
  }

  return sanitized;
}

export function defineLocalizedText(
  defaultValue: string,
  overrides: Partial<Record<Locale, string>> = {}
): LocalizedText {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      overrides[locale] ?? getMemoryTranslation(defaultValue, locale) ?? defaultValue,
    ])
  ) as LocalizedText;
}

export function getLocalizedText(value: LocalizedText, locale: Locale): string {
  return value[locale] ?? value[DEFAULT_LOCALE];
}

export function getMemoryLocalizedText(value: string, locale: Locale): string {
  return getMemoryTranslation(value, locale) ?? value;
}

export function localizeTemplateText(
  template: string,
  locale: Locale,
  values: Record<string, string | number>
) {
  return getMemoryLocalizedText(template, locale).replace(/\{(\w+)\}/g, (_, key) =>
    String(values[key] ?? `{${key}}`)
  );
}

export function localizeTreeFromMemory<T>(
  value: T,
  locale: Locale,
  options: { skipKeys?: string[] } = {}
): T {
  if (typeof value === 'string') {
    return getMemoryLocalizedText(value, locale) as T;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => localizeTreeFromMemory(entry, locale, options)) as T;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const skipKeys = new Set(options.skipKeys ?? []);

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key,
      skipKeys.has(key) ? entry : localizeTreeFromMemory(entry, locale, options),
    ])
  ) as T;
}

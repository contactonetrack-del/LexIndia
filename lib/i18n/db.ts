import type { Locale } from '@/lib/i18n/config';

type TranslationLike = {
  locale: string;
};

export function pickTranslation<TTranslation extends TranslationLike>(
  translations: TTranslation[] | undefined,
  locale: Locale
) {
  return translations?.find((translation) => translation.locale === locale)
    ?? translations?.find((translation) => translation.locale === 'en')
    ?? null;
}

export function localizeNamedEntity<
  TEntity extends {
    name: string;
    translations?: Array<{ locale: string; name: string }>;
  },
>(entity: TEntity, locale: Locale): TEntity {
  const translation = pickTranslation(entity.translations, locale);
  return {
    ...entity,
    name: translation?.name ?? entity.name,
  };
}

export function localizeFields<
  TEntity extends Record<string, unknown>,
  TTranslation extends TranslationLike,
>(
  entity: TEntity,
  translations: TTranslation[] | undefined,
  locale: Locale,
  fields: string[]
): TEntity {
  const translation = pickTranslation(translations, locale);

  if (!translation) {
    return entity;
  }

  return {
    ...entity,
    ...Object.fromEntries(
      fields.map((field) => [field, (translation as Record<string, unknown>)[field] ?? entity[field]])
    ),
  };
}

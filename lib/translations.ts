import {
  allTranslations,
  getMessages,
  languageNames,
  type Translation,
} from '@/lib/i18n/messages';
import type { Locale } from '@/lib/i18n/config';

export type Language = Locale;
export type { Translation };
export { allTranslations, languageNames };

export function getTranslation(lang: Language): Translation {
  return getMessages(lang);
}

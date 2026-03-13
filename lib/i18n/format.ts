import { getDisplayLocale } from '@/lib/i18n/display-locale';
import { isSupportedLocale, type Locale } from '@/lib/i18n/config';

type LocaleInput = Locale | string;

function resolveFormatterLocale(locale: LocaleInput) {
  if (isSupportedLocale(locale)) {
    return getDisplayLocale(locale);
  }

  return locale;
}

function toDate(value: Date | string | number) {
  return value instanceof Date ? value : new Date(value);
}

export function formatCurrency(
  value: number,
  locale: LocaleInput,
  options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> & { currency?: string } = {}
) {
  const { currency = 'INR', ...rest } = options;

  return new Intl.NumberFormat(resolveFormatterLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    ...rest,
  }).format(value);
}

export function formatNumber(
  value: number,
  locale: LocaleInput,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat(resolveFormatterLocale(locale), options).format(value);
}

export function formatDate(
  value: Date | string | number,
  locale: LocaleInput,
  options: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(resolveFormatterLocale(locale), options).format(toDate(value));
}

export function formatTime(
  value: Date | string | number,
  locale: LocaleInput,
  options: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(resolveFormatterLocale(locale), options).format(toDate(value));
}

export function formatDateTime(
  value: Date | string | number,
  locale: LocaleInput,
  options: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(resolveFormatterLocale(locale), options).format(toDate(value));
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: LocaleInput,
  options: Intl.RelativeTimeFormatOptions = {}
) {
  return new Intl.RelativeTimeFormat(resolveFormatterLocale(locale), {
    numeric: 'auto',
    ...options,
  }).format(value, unit);
}

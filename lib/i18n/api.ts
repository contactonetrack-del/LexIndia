import type { NextRequest } from 'next/server';

import { getMemoryLocalizedText, localizeTemplateText } from '@/lib/content/localized';
import {
  LOCALE_COOKIE,
  REQUEST_LOCALE_HEADER,
  type Locale,
} from '@/lib/i18n/config';
import { resolveRequestLocale } from '@/lib/i18n/resolve';

function getCookieLocale(req: NextRequest | Request) {
  if ('cookies' in req && typeof req.cookies?.get === 'function') {
    return req.cookies.get(LOCALE_COOKIE)?.value;
  }

  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return undefined;

  const match = cookieHeader.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  return match?.[1];
}

export function getApiLocale(req: NextRequest | Request): Locale {
  const url = new URL(req.url);

  return resolveRequestLocale({
    routeLocale: url.searchParams.get('locale'),
    headerLocale: req.headers.get('x-locale') ?? req.headers.get(REQUEST_LOCALE_HEADER),
    cookieLocale: getCookieLocale(req),
    acceptLanguage: req.headers.get('accept-language'),
    ipCountry: req.headers.get('x-vercel-ip-country'),
  });
}

export function getApiLocalizedText(req: NextRequest | Request, text: string) {
  return getMemoryLocalizedText(text, getApiLocale(req));
}

export function getApiLocalizedTemplate(
  req: NextRequest | Request,
  template: string,
  values: Record<string, string | number>
) {
  return localizeTemplateText(template, getApiLocale(req), values);
}

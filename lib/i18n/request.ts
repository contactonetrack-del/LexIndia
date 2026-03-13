import { cookies, headers } from 'next/headers';

import {
  LOCALE_COOKIE,
  REQUEST_LOCALE_HEADER,
  REQUEST_PATH_HEADER,
  getLocaleDirection,
  type Locale,
} from '@/lib/i18n/config';
import { resolveRequestLocale } from '@/lib/i18n/resolve';

export async function getRequestLocale(): Promise<Locale> {
  const headerStore = await headers();
  const cookieStore = await cookies();

  return resolveRequestLocale({
    pathname: headerStore.get(REQUEST_PATH_HEADER),
    headerLocale: headerStore.get(REQUEST_LOCALE_HEADER),
    cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headerStore.get('accept-language'),
    ipCountry: headerStore.get('x-vercel-ip-country'),
  });
}

export async function getRequestDirection() {
  const locale = await getRequestLocale();
  return getLocaleDirection(locale);
}

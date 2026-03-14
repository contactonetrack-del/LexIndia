import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import {
  LOCALE_COOKIE,
  REQUEST_LOCALE_HEADER,
  REQUEST_PATH_HEADER,
} from '@/lib/i18n/config';
import { resolveRequestLocale } from '@/lib/i18n/resolve';
import { stripLocaleFromPathname, withLocalePrefix } from '@/lib/i18n/navigation';

const PROTECTED_ROUTES = ['/dashboard'];

function isIgnoredPath(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.[a-z0-9]+$/i.test(pathname)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isIgnoredPath(pathname)) {
    return NextResponse.next();
  }

  const stripped = stripLocaleFromPathname(pathname);
  const requestLocale = req.headers.get(REQUEST_LOCALE_HEADER);
  const locale = stripped.locale ?? (requestLocale && requestLocale.length > 0 ? requestLocale : null);
  const internalPathname = stripped.locale ? stripped.pathname : pathname;

  if (!locale) {
    const locale = resolveRequestLocale({
      pathname,
      cookieLocale: req.cookies.get(LOCALE_COOKIE)?.value,
      acceptLanguage: req.headers.get('accept-language'),
      ipCountry: req.headers.get('x-vercel-ip-country'),
    });

    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = withLocalePrefix(pathname, locale);

    const response = NextResponse.redirect(redirectUrl, 308);
    response.cookies.set(LOCALE_COOKIE, locale, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  const isProtected = PROTECTED_ROUTES.some((route) => internalPathname.startsWith(route));

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = `/${locale}`;
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set(REQUEST_LOCALE_HEADER, locale);
  requestHeaders.set(
    REQUEST_PATH_HEADER,
    req.headers.get(REQUEST_PATH_HEADER) ?? pathname
  );

  const response = stripped.locale
    ? NextResponse.rewrite(
        (() => {
          const rewriteUrl = req.nextUrl.clone();
          rewriteUrl.pathname = internalPathname;
          return rewriteUrl;
        })(),
        {
          request: {
            headers: requestHeaders,
          },
        }
      )
    : NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

  response.cookies.set(LOCALE_COOKIE, locale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'],
};

const DEFAULT_SITE_URL = 'https://lexindia.vercel.app';

function normalizeSiteUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function getSiteUrl(): string {
  const rawSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    DEFAULT_SITE_URL;

  const withProtocol = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;
  return normalizeSiteUrl(withProtocol);
}

export const SITE_URL = getSiteUrl();

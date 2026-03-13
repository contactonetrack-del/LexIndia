import type { MetadataRoute } from 'next';

import { SITE_URL, SUPPORTED_LOCALES } from '@/lib/i18n/config';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function localizedEntries(
  pathname: string,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  priority: number,
  lastModified = new Date()
): MetadataRoute.Sitemap {
  return SUPPORTED_LOCALES.map((locale) => ({
    url: new URL(withLocalePrefix(pathname, locale), SITE_URL).toString(),
    lastModified,
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lawyers = await prisma.lawyerProfile.findMany({
    where: { isVerified: true },
    select: { id: true, user: { select: { updatedAt: true } } },
  });

  const lawyerUrls = lawyers.flatMap((lawyer: any) =>
    localizedEntries(`/lawyers/${lawyer.id}`, 'weekly', 0.8, lawyer.user.updatedAt || new Date())
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    ...localizedEntries('/', 'weekly', 1),
    ...localizedEntries('/lawyers', 'daily', 0.9),
    ...localizedEntries('/knowledge', 'weekly', 0.8),
    ...localizedEntries('/templates', 'weekly', 0.8),
    ...localizedEntries('/rights', 'monthly', 0.8),
    ...localizedEntries('/rights/women', 'monthly', 0.7),
    ...localizedEntries('/rights/tenants', 'monthly', 0.7),
    ...localizedEntries('/rights/workers', 'monthly', 0.7),
    ...localizedEntries('/rights/consumers', 'monthly', 0.7),
    ...localizedEntries('/rights/seniors', 'monthly', 0.7),
    ...localizedEntries('/rights/cybercrime', 'monthly', 0.7),
    ...localizedEntries('/rights/arrested', 'monthly', 0.7),
    ...localizedEntries('/rights/students', 'monthly', 0.7),
    ...localizedEntries('/about', 'monthly', 0.6),
    ...localizedEntries('/contact', 'monthly', 0.5),
    ...localizedEntries('/pricing', 'monthly', 0.7),
    ...localizedEntries('/verify-lawyers', 'monthly', 0.7),
    ...localizedEntries('/privacy', 'yearly', 0.3),
    ...localizedEntries('/terms', 'yearly', 0.3),
    ...localizedEntries('/guides', 'weekly', 0.85),
    ...localizedEntries('/guides/how-to-file-fir', 'monthly', 0.8),
    ...localizedEntries('/guides/tenant-rights-india', 'monthly', 0.8),
    ...localizedEntries('/guides/understanding-bail', 'monthly', 0.8),
    ...localizedEntries('/guides/divorce-india-guide', 'monthly', 0.8),
    ...localizedEntries('/guides/domestic-violence-act-guide', 'monthly', 0.8),
    ...localizedEntries('/guides/file-consumer-complaint', 'monthly', 0.8),
    ...localizedEntries('/guides/how-to-file-rti', 'monthly', 0.8),
    ...localizedEntries('/guides/road-accident-emergency', 'monthly', 0.8),
    ...localizedEntries('/disclaimer', 'yearly', 0.3),
  ];

  return [...staticRoutes, ...lawyerUrls];
}

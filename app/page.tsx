import type { Metadata } from 'next';

import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { getRequestLocale } from '@/lib/i18n/request';

import HomePageClient from './HomePageClient';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/',
    title: `LexIndia | ${messages.hero.title}`,
    description: messages.hero.subtitle,
    keywords: ['LexIndia', messages.nav.lawyers, messages.nav.knowledge, messages.nav.templates],
  });
}

export default function Page() {
  return <HomePageClient />;
}

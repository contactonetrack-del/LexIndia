import type { Metadata } from 'next';

import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { getRequestLocale } from '@/lib/i18n/request';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/lawyers',
    title: `${messages.lawyersPage.title} | LexIndia`,
    description: messages.lawyersPage.subtitle,
    keywords: [messages.nav.lawyers, messages.lawyersPage.filters, messages.lawyersPage.bookConsultation],
  });
}

export default function LawyersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

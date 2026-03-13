import type { Metadata } from 'next';

import LegalDisclaimer from '@/components/LegalDisclaimer';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { getRequestLocale } from '@/lib/i18n/request';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/knowledge',
    title: `${messages.knowledge.title} | LexIndia`,
    description: messages.knowledge.subtitle,
    keywords: [messages.nav.knowledge, messages.knowledge.categories, messages.knowledge.popular],
  });
}

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LegalDisclaimer />
      {children}
    </>
  );
}

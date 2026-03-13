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
    pathname: '/templates',
    title: `${messages.templates.title} | LexIndia`,
    description: messages.templates.subtitle,
    keywords: [messages.nav.templates, messages.templates.category, messages.templates.downloadBtn],
  });
}

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LegalDisclaimer />
      {children}
    </>
  );
}

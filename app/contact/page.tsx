import type { Metadata } from 'next';

import ContactPageClient from '@/app/contact/ContactPageClient';
import { getContactContent } from '@/lib/content/contact';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { getRequestLocale } from '@/lib/i18n/request';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const content = getContactContent(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/contact',
    title: `${content.title} | LexIndia`,
    description: content.intro,
  });
}

export default async function ContactPage() {
  const locale = await getRequestLocale();
  const content = getContactContent(locale);
  const messages = getMessages(locale);

  return (
    <ContactPageClient
      locale={locale}
      content={content}
      labels={{
        nameLabel: messages.auth.nameLabel,
        emailLabel: messages.auth.emailLabel,
        namePlaceholder: messages.auth.namePh,
        emailPlaceholder: messages.auth.emailPh,
        knowledgeLabel: messages.nav.knowledge,
        lawyersLabel: messages.footer.findLawyer,
        loadingLabel: messages.common.loading,
      }}
    />
  );
}

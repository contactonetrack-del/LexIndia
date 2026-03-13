import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, BookOpen, Phone, Scale } from 'lucide-react';

import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';

const DISCLAIMER_SECTIONS = [
  {
    icon: Scale,
    title: '1. No lawyer-client relationship',
    content:
      'Using LexIndia, reading guides, or using AI chat does not create a lawyer-client relationship. Only a formal engagement with a licensed advocate creates one.',
  },
  {
    icon: BookOpen,
    title: '2. General information only',
    content:
      'All content, including guides, templates, AI responses, rights explainers, and listings, is for awareness. Laws and interpretations can change and vary by jurisdiction.',
  },
  {
    icon: AlertTriangle,
    title: '3. AI chat limitations',
    content:
      'AI responses may be incomplete or outdated. Do not rely solely on AI for legal decisions. Verify with qualified legal professionals and official sources.',
  },
  {
    icon: Scale,
    title: '4. Lawyer listings are not endorsements',
    content:
      'LexIndia verifies identity and enrolment but does not guarantee legal outcomes, quality, or suitability of any listed professional.',
  },
  {
    icon: BookOpen,
    title: '5. Template usage',
    content:
      'Templates are generic drafts and may not fit your specific situation. Have any legal document reviewed by a qualified lawyer before relying on it.',
  },
  {
    icon: AlertTriangle,
    title: '6. External resources',
    content:
      'Links to external websites are provided for convenience. LexIndia is not responsible for third-party content, accuracy, or availability.',
  },
  {
    icon: Scale,
    title: '7. Limitation of liability',
    content:
      'To the fullest extent permitted by law, LexIndia and its affiliates are not liable for losses arising from use of this platform or reliance on its content.',
  },
  {
    icon: BookOpen,
    title: '8. Jurisdiction',
    content: 'LexIndia operates under Indian law. Disputes are subject to jurisdiction in New Delhi, India.',
  },
  {
    icon: Scale,
    title: '9. Applicable law',
    content:
      'This disclaimer is governed by Indian law, including the Information Technology Act, Advocates Act, BCI rules, and DPDPA 2023 where applicable.',
  },
] as const;

const DISCLAIMER_PAGE = {
  title: 'Legal disclaimer',
  lastUpdated: 'Last updated: 10 March 2026',
  warningTitle: 'Important: information, not legal advice',
  warningBody:
    'LexIndia provides general legal information only. Nothing on this website constitutes legal advice or creates a lawyer-client relationship.',
  emergencyTitle: 'In case of emergency',
  emergencyBody:
    'If you are in immediate danger, call Police 100, Women Helpline 1091, or NALSA legal aid 15100. LexIndia is not an emergency service.',
  contactLine: 'If you have questions about this disclaimer, please contact us.',
  privacy: 'Privacy policy',
  terms: 'Terms of service',
  verification: 'Verification policy',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return createLocalizedMetadata({
    locale,
    pathname: '/disclaimer',
    title: `${getMemoryLocalizedText('Legal Disclaimer', locale)} | LexIndia`,
    description: getMemoryLocalizedText(
      'LexIndia legal disclaimer. The platform provides general legal information only and not legal advice.',
      locale
    ),
  });
}

export default async function DisclaimerPage() {
  const locale = await getRequestLocale();
  const sections = localizeTreeFromMemory(DISCLAIMER_SECTIONS, locale, { skipKeys: ['icon'] });
  const copy = localizeTreeFromMemory(DISCLAIMER_PAGE, locale);

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-gradient-to-r from-primary to-accent/80 py-12 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/90">
            <AlertTriangle className="h-8 w-8 text-accent-foreground" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">{copy.title}</h1>
          <p className="text-sm text-primary-foreground/85">{copy.lastUpdated}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-warning" />
            <div>
              <h2 className="mb-2 font-bold text-warning">{copy.warningTitle}</h2>
              <p className="text-sm leading-relaxed text-foreground">{copy.warningBody}</p>
            </div>
          </div>
        </div>

        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-bold text-foreground">{title}</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
          </div>
        ))}

        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <div>
              <h2 className="mb-2 font-bold text-danger">{copy.emergencyTitle}</h2>
              <p className="text-sm text-foreground">{copy.emergencyBody}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pb-4 text-center text-sm text-muted-foreground">
          <p>{copy.contactLine}</p>
          <div className="flex justify-center gap-4">
            <Link
              href={withLocalePrefix('/privacy', locale)}
              className="text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              {copy.privacy}
            </Link>
            <Link
              href={withLocalePrefix('/terms', locale)}
              className="text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              {copy.terms}
            </Link>
            <Link
              href={withLocalePrefix('/verify-lawyers', locale)}
              className="text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              {copy.verification}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Database, Eye, Lock, Mail, Shield, UserCheck } from 'lucide-react';

import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { getRequestLocale } from '@/lib/i18n/request';

const PRIVACY_SECTIONS = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Account information: name, email address, phone number, and role (Citizen or Lawyer).',
      'Lawyer-specific information: Bar Council ID, state enrollment, specializations, experience, fees, and consultation modes.',
      'Consultation data: issue descriptions, uploaded documents shared during booking, and appointment records.',
      'AI Assistant interactions: queries submitted to the AI Legal Assistant (processed server-side; not stored permanently).',
      'Usage data: pages visited, search queries, features used, IP address, browser type, and device information.',
      'Payment data: transaction references and booking amounts processed through our payment provider. We do not store card details.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To create and manage your account and provide platform services.',
      'To connect citizens with verified lawyers for legal consultations.',
      'To process consultation bookings and payments.',
      'To improve our AI Legal Assistant and knowledge base.',
      'To send transactional emails: booking confirmations, appointment reminders, and account notifications.',
      'To comply with legal obligations under Indian law.',
      'To detect and prevent fraud, abuse, or security incidents.',
    ],
  },
  {
    icon: Shield,
    title: 'Data Security',
    content: [
      'Your data is stored on secured servers with encryption at rest and in transit (TLS/SSL).',
      'Passwords are hashed using industry-standard algorithms and are never stored in plaintext.',
      'AI queries are processed server-side; API keys are never exposed to client browsers.',
      'Access to personal data is restricted to authorised personnel only.',
      'We conduct regular security reviews and follow responsible disclosure practices.',
      'In the event of a data breach affecting your rights, we will notify you as required by applicable law.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights Under DPDPA 2023',
    content: [
      'Right to access: You may request a copy of the personal data we hold about you.',
      'Right to correction: You may request correction of inaccurate or incomplete personal data.',
      'Right to erasure: You may request deletion of your personal data, subject to legal retention obligations.',
      'Right to withdraw consent: You may withdraw consent for data processing at any time by deleting your account.',
      'Right to grievance redressal: You may raise a complaint with us or the Data Protection Board of India.',
      'To exercise any of these rights, contact us at privacy@lexindia.in.',
    ],
  },
  {
    icon: Lock,
    title: 'Cookies and Tracking',
    content: [
      'We use essential cookies required for authentication and session management.',
      'We use analytics cookies to understand how users interact with our platform (aggregated, non-personal).',
      'We do not use third-party advertising cookies or sell your data to advertisers.',
      'You can manage cookie preferences in your browser settings. Disabling essential cookies may impair platform functionality.',
    ],
  },
  {
    icon: Mail,
    title: 'Data Sharing and Third Parties',
    content: [
      'We share your booking information with the lawyer you have selected for a consultation.',
      'We use trusted third-party processors for payments (Razorpay), email (Resend), and cloud hosting. They are contractually bound to protect your data.',
      'We do not sell, rent, or trade your personal data to any third party for marketing purposes.',
      'We may disclose data if required by law, court order, or governmental authority.',
    ],
  },
] as const;

const PRIVACY_PAGE = {
  legalBadge: 'Legal',
  title: 'Privacy Policy',
  intro:
    'LexIndia is committed to protecting your personal data. This policy explains what we collect, how we use it, and your rights under Indian law.',
  effective: 'Effective: 10 March 2026',
  lastUpdated: 'Last Updated: 10 March 2026',
  version: 'Version 1.0',
  applicableLawLabel: 'Applicable Law',
  applicableLawBody:
    'This Privacy Policy is governed by the Information Technology Act 2000, the Information Technology (Reasonable Security Practices) Rules 2011, and the Digital Personal Data Protection Act 2023 (DPDPA).',
  retentionTitle: 'Data Retention',
  retentionBodyOne:
    'We retain your account data for as long as your account remains active. Appointment and booking records are retained for 7 years as required by Indian financial and legal record-keeping obligations.',
  retentionBodyTwo:
    'You may delete your account at any time from your dashboard settings. Upon deletion, your personal data will be anonymised or erased within 30 days, except where retention is legally required.',
  childrenTitle: "Children's Privacy",
  childrenBody:
    'LexIndia is not intended for use by persons under 18 years of age. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected such data, please contact us immediately at',
  changesTitle: 'Changes to This Policy',
  changesBody:
    'We may update this Privacy Policy from time to time. When we make material changes, we will notify registered users by email and update the "Last Updated" date above. Continued use of LexIndia after changes constitutes acceptance of the revised policy.',
  contactTitle: 'Contact Our Privacy Team',
  contactBody:
    'For any privacy-related questions, requests, or complaints, please contact our designated Privacy Officer:',
  emailAddress: 'privacy@lexindia.in',
  emailLabel: 'Email',
  grievanceLabel: 'Grievance Officer',
  grievanceValue: 'LexIndia Privacy Team',
  responseLabel: 'Response Time',
  responseValue: 'We aim to respond to all privacy requests within 30 days.',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return createLocalizedMetadata({
    locale,
    pathname: '/privacy',
    title: `${getMemoryLocalizedText('Privacy Policy', locale)} | LexIndia`,
    description: getMemoryLocalizedText(
      'Learn how LexIndia collects, uses, and protects your personal data in compliance with Indian IT Act 2000 and the Digital Personal Data Protection Act 2023.',
      locale
    ),
  });
}

export default async function PrivacyPage() {
  const locale = await getRequestLocale();
  const sections = localizeTreeFromMemory(PRIVACY_SECTIONS, locale, { skipKeys: ['icon'] });
  const copy = localizeTreeFromMemory(PRIVACY_PAGE, locale);

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-accent" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent">{copy.legalBadge}</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
          <p className="max-w-2xl text-lg text-primary-foreground/80">{copy.intro}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-primary-foreground/75">
            <span>{copy.effective}</span>
            <span>/</span>
            <span>{copy.lastUpdated}</span>
            <span>/</span>
            <span>{copy.version}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-warning/30 bg-warning/10">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-foreground">
            <strong>{copy.applicableLawLabel}:</strong> {copy.applicableLawBody}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="rounded-2xl border border-border bg-background p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">{copy.retentionTitle}</h2>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{copy.retentionBodyOne}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.retentionBodyTwo}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">{copy.childrenTitle}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {copy.childrenBody}{' '}
              <a href="mailto:privacy@lexindia.in" className="text-primary underline">
                {copy.emailAddress}
              </a>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">{copy.changesTitle}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.changesBody}</p>
          </div>

          <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
            <h2 className="mb-4 text-xl font-bold">{copy.contactTitle}</h2>
            <p className="mb-6 text-sm text-primary-foreground/80">{copy.contactBody}</p>
            <div className="space-y-2 text-sm text-primary-foreground/85">
              <p>
                <strong className="text-primary-foreground">{copy.emailLabel}:</strong> {copy.emailAddress}
              </p>
              <p>
                <strong className="text-primary-foreground">{copy.grievanceLabel}:</strong> {copy.grievanceValue}
              </p>
              <p>
                <strong className="text-primary-foreground">{copy.responseLabel}:</strong> {copy.responseValue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

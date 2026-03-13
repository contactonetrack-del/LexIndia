import type { Metadata } from 'next';
import { AlertTriangle, Bot, CreditCard, FileText, Scale, Users } from 'lucide-react';

import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { getRequestLocale } from '@/lib/i18n/request';

const TERMS_SECTIONS = [
  {
    icon: Users,
    title: '1. Eligibility and Account',
    items: [
      'You must be at least 18 years of age to use LexIndia.',
      'You agree to provide accurate, current, and complete information during registration.',
      'You are responsible for maintaining the security of your account credentials.',
      'You must not share your account or allow unauthorised access.',
      'LexIndia reserves the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    icon: Scale,
    title: '2. Platform Nature and Scope',
    items: [
      'LexIndia is a technology platform that facilitates connections between citizens and legal professionals. It is not a law firm.',
      'LexIndia does not provide legal advice. All legal advice is provided by independent lawyers listed on the platform.',
      "The platform does not endorse any specific lawyer's advice or guarantee specific legal outcomes.",
      'Lawyer profiles are created by lawyers themselves. LexIndia verifies Bar Council registration but does not verify all profile claims.',
      'LexIndia operates only within the jurisdiction of India and provides information about Indian law.',
    ],
  },
  {
    icon: Bot,
    title: '3. AI Legal Assistant',
    items: [
      'The AI Legal Assistant provides general legal information for educational purposes only.',
      'AI responses do not constitute legal advice and should not be relied upon as a substitute for consultation with a qualified lawyer.',
      'The AI assistant may make errors. Always consult a verified lawyer for your specific legal situation.',
      'Do not share sensitive personal information (Aadhaar number, financial account details, passwords) with the AI assistant.',
      'LexIndia is not liable for any actions taken or not taken based on AI assistant responses.',
    ],
  },
  {
    icon: CreditCard,
    title: '4. Payments and Bookings',
    items: [
      'Consultation fees are set by individual lawyers and are displayed before booking.',
      'All payments are processed securely through authorised payment gateways. LexIndia does not store card details.',
      'Consultation fees include applicable GST at prevailing rates.',
      'Cancellation and refund policies are as stated at the time of booking. Platform fees may be non-refundable.',
      'LexIndia acts as a payment facilitator. Disputes regarding consultation quality should be raised with the lawyer first.',
      'In case of technical failure during payment, contact support@lexindia.in within 48 hours.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '5. Prohibited Conduct',
    items: [
      'Using the platform to harass, intimidate, or threaten any lawyer, citizen, or platform staff.',
      'Submitting false, misleading, or fraudulent information during registration or booking.',
      'Attempting to circumvent the platform to engage lawyers directly and avoid platform fees after initial contact.',
      'Posting defamatory, obscene, or illegal content in reviews, messages, or issue descriptions.',
      'Using automated tools, bots, or scrapers to extract platform data.',
      'Impersonating any person, entity, or lawyer on the platform.',
    ],
  },
  {
    icon: FileText,
    title: '6. Intellectual Property',
    items: [
      'All platform content, design, code, and trademarks are owned by LexIndia or its licensors.',
      'Legal guide articles, templates, and knowledge base content may not be reproduced without written permission.',
      'User-generated content (reviews, messages) grants LexIndia a non-exclusive licence to display and moderate such content.',
      'Legal templates are provided for general guidance. Adapt templates with professional legal advice before use.',
    ],
  },
] as const;

const TERMS_PAGE = {
  legalBadge: 'Legal',
  title: 'Terms of Service',
  intro:
    'Please read these terms carefully before using LexIndia. By registering or using our services, you agree to be bound by these terms.',
  effective: 'Effective: 10 March 2026',
  lastUpdated: 'Last Updated: 10 March 2026',
  version: 'Version 1.0',
  noticeTitle: 'Not Legal Advice',
  noticeBody:
    'LexIndia is a technology platform, not a law firm. Content on this platform, including AI responses, knowledge base articles, and legal guides, is for general informational purposes only and does not constitute legal advice.',
  liabilityTitle: '7. Limitation of Liability',
  liabilityBodyOne:
    'To the maximum extent permitted by applicable Indian law, LexIndia and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.',
  liabilityBodyTwo:
    "LexIndia's total liability for any claim arising from these terms shall not exceed the amount paid by you to LexIndia in the 3 months preceding the claim.",
  disputeTitle: '8. Governing Law and Dispute Resolution',
  disputeBodyOne:
    'These Terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts at [City], India.',
  disputeBodyTwo:
    'We encourage resolution of disputes through our grievance mechanism first. Contact us at legal@lexindia.in with your concern. We aim to resolve disputes within 30 days.',
  changesTitle: '9. Changes to These Terms',
  changesBody:
    'We may modify these Terms at any time. Material changes will be communicated via email to registered users at least 14 days before taking effect. Continued use of LexIndia after changes constitutes acceptance.',
  contactTitle: 'Questions About These Terms?',
  contactBody: 'Contact our legal team:',
  emailLabel: 'Email',
  legalEmail: 'legal@lexindia.in',
  grievanceLabel: 'Grievance Officer',
  grievanceValue: 'LexIndia Legal Team',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return createLocalizedMetadata({
    locale,
    pathname: '/terms',
    title: `${getMemoryLocalizedText('Terms of Service', locale)} | LexIndia`,
    description: getMemoryLocalizedText(
      'Read the Terms of Service for LexIndia, the Indian legal-tech platform connecting citizens with verified lawyers.',
      locale
    ),
  });
}

export default async function TermsPage() {
  const locale = await getRequestLocale();
  const sections = localizeTreeFromMemory(TERMS_SECTIONS, locale, { skipKeys: ['icon'] });
  const copy = localizeTreeFromMemory(TERMS_PAGE, locale);

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-accent" />
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

      <div className="border-b border-danger/30 bg-danger/10">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <p className="text-sm text-danger">
              <strong>{copy.noticeTitle}:</strong> {copy.noticeBody}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
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
                  {section.items.map((item) => (
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
            <h2 className="mb-4 text-xl font-bold text-foreground">{copy.liabilityTitle}</h2>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{copy.liabilityBodyOne}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.liabilityBodyTwo}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">{copy.disputeTitle}</h2>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{copy.disputeBodyOne}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.disputeBodyTwo}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">{copy.changesTitle}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{copy.changesBody}</p>
          </div>

          <div className="rounded-2xl bg-primary p-8 text-primary-foreground">
            <h2 className="mb-2 text-xl font-bold">{copy.contactTitle}</h2>
            <p className="mb-4 text-sm text-primary-foreground/80">{copy.contactBody}</p>
            <div className="space-y-1 text-sm text-primary-foreground/85">
              <p>
                <strong className="text-primary-foreground">{copy.emailLabel}:</strong> {copy.legalEmail}
              </p>
              <p>
                <strong className="text-primary-foreground">{copy.grievanceLabel}:</strong> {copy.grievanceValue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

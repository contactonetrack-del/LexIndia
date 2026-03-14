import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  FileCheck,
  Phone,
  Scale,
  Search,
  ShieldCheck,
  Star,
  XCircle,
} from 'lucide-react';

import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';

const VERIFY_LAWYERS_PAGE = {
  heroTitle: 'How LexIndia Reviews Lawyer Verification',
  heroDescription:
    'Lawyers submit verification details to LexIndia for manual review before the Verified badge is shown.',
  heroBadgeLabel: 'Verified',
  heroDescriptionSuffix: 'Here is exactly what we check and what we do not.',
  heroSupport: 'We believe in transparency. If you have questions about a specific lawyer, use our',
  heroSupportLink: 'Contact page',
  heroSupportEnd: 'to reach our trust team.',
  importantLabel: 'Important:',
  importantText:
    "Verification confirms that LexIndia reviewed the lawyer's submitted identity and Bar Council enrolment details. It does not guarantee outcomes, quality of advice, or specialization depth. Always review a lawyer's profile, ratings, and experience before booking.",
  stepsTitle: 'Our Verification Workflow',
  stepsSubtitle: 'This is the review process used for verification submissions on LexIndia.',
  stepLabelPrefix: 'STEP',
  verifiedTitle: 'Verified Means',
  notVerifiedTitle: 'Not Verified Means',
  rightsTitle: 'Your Rights as a LexIndia User',
  faqTitle: 'Frequently Asked Questions',
  reportTitle: 'Report a Concern',
  reportBody:
    "If you have a concern about a lawyer's credentials or conduct, our trust team is here to help.",
  reportAction: 'Contact Trust Team',
  findLawyersAction: 'Find Verified Lawyers',
} as const;

const VERIFICATION_STEPS = [
  {
    number: '01',
    icon: FileCheck,
    title: 'Lawyer submission',
    desc: 'A lawyer submits their Bar Council enrolment ID, identity document link, and enrolment certificate link for review.',
    color: 'bg-primary/10 border-primary/30',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/20',
  },
  {
    number: '02',
    icon: Search,
    title: 'Manual review',
    desc: 'The LexIndia trust team reviews the submitted Bar Council details and supporting documents before making a decision.',
    color: 'bg-surface border-border',
    iconColor: 'text-primary',
    iconBg: 'bg-muted',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Decision logged',
    desc: 'If the review passes, the profile gets the Verified badge. If details are incomplete or mismatched, LexIndia can request changes or reject the submission.',
    color: 'bg-accent/10 border-accent/30',
    iconColor: 'text-accent',
    iconBg: 'bg-accent/20',
  },
  {
    number: '04',
    icon: AlertTriangle,
    title: 'Re-review when needed',
    desc: 'If a lawyer updates enrolment details or a trust concern is reported, the profile can return to manual review and the badge can be removed pending checks.',
    color: 'bg-warning/10 border-warning/30',
    iconColor: 'text-warning',
    iconBg: 'bg-warning/20',
  },
] as const;

const VERIFIED_INDICATORS = [
  'Verified badge on profile',
  'Bar Council ID visible on profile',
  'At least one consultation mode listed',
  'Latest verification review approved by LexIndia',
] as const;

const NOT_VERIFIED_INDICATORS = [
  'No verification badge shown',
  'Newly onboarded (review pending)',
  'Changes requested on the latest submission',
  'Latest review not approved yet',
] as const;

const USER_RIGHTS = [
  'Report any lawyer for suspected fraud and we act within 24 hours.',
  'Request a full refund if a lawyer misrepresents their credentials.',
  'Raise a complaint about unprofessional conduct anytime.',
  'Get a copy of your booking and consultation history.',
  'Request account deletion and data erasure under DPDPA 2023.',
  'Verify any lawyer directly with your State Bar Council.',
] as const;

const FAQS = [
  {
    q: "Does LexIndia guarantee a lawyer's quality of service?",
    a: 'No. Verification confirms identity and Bar Council enrolment. It does not guarantee quality or outcome of legal advice. You should use ratings, reviews, experience years, and your own judgment when choosing a lawyer.',
  },
  {
    q: "What if I suspect a lawyer's credentials are fake?",
    a: "Report it immediately via our Contact page or email trust@lexindia.in. We take fraud seriously and suspend profiles pending investigation. You can also verify any lawyer independently at your state Bar Council's website.",
  },
  {
    q: 'Can a suspended or disqualified lawyer join LexIndia?',
    a: 'Our Bar Council check is designed to catch suspended enrolments. However, if you notice a lawyer who has been debarred, please report them and we will remove the profile immediately.',
  },
  {
    q: 'How long does verification take?',
    a: 'Review time depends on queue volume and document clarity. In most cases, LexIndia aims to review submissions within a few business days.',
  },
  {
    q: 'Is my data safe when booking through LexIndia?',
    a: 'Yes. All communication between you and the platform is encrypted. Your legal issue description is only shared with the specific lawyer you book. We do not sell personal data to third parties.',
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return createLocalizedMetadata({
    locale,
    pathname: '/verify-lawyers',
    title: `${getMemoryLocalizedText('How LexIndia Reviews Lawyer Verification', locale)} | LexIndia`,
    description: getMemoryLocalizedText(
      'Learn how LexIndia reviews lawyer verification submissions, checks submitted Bar Council details, and updates badge status after manual review.',
      locale
    ),
    keywords: [
      'verified lawyers India',
      'LexIndia verification',
      'lawyer verification process',
      'how to find trusted lawyer India',
    ],
  });
}

export default async function VerifyLawyersPage() {
  const locale = await getRequestLocale();
  const copy = localizeTreeFromMemory(VERIFY_LAWYERS_PAGE, locale);
  const steps = localizeTreeFromMemory(VERIFICATION_STEPS, locale, {
    skipKeys: ['number', 'icon', 'color', 'iconColor', 'iconBg'],
  });
  const verifiedIndicators = localizeTreeFromMemory(VERIFIED_INDICATORS, locale);
  const notVerifiedIndicators = localizeTreeFromMemory(NOT_VERIFIED_INDICATORS, locale);
  const userRights = localizeTreeFromMemory(USER_RIGHTS, locale);
  const faqs = localizeTreeFromMemory(FAQS, locale);

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <ShieldCheck className="h-9 w-9 text-accent-foreground" />
          </div>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{copy.heroTitle}</h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-primary-foreground/80">
            {copy.heroDescription} <strong className="text-primary-foreground">{copy.heroBadgeLabel}</strong>{' '}
            {copy.heroDescriptionSuffix}
          </p>
          <p className="text-sm text-primary-foreground/70">
            {copy.heroSupport}{' '}
            <Link href={withLocalePrefix('/contact', locale)} className="text-primary-foreground underline">
              {copy.heroSupportLink}
            </Link>{' '}
            {copy.heroSupportEnd}
          </p>
        </div>
      </div>

      <div className="border-b border-warning/30 bg-warning/10">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm text-warning">
              <strong>{copy.importantLabel}</strong> {copy.importantText}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-foreground">{copy.stepsTitle}</h2>
          <p className="mb-8 text-muted-foreground">{copy.stepsSubtitle}</p>
          <div className="space-y-5">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={`flex items-start gap-5 rounded-2xl border-2 p-6 ${step.color}`}>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.iconBg}`}>
                    <Icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <span className="mb-1 block text-xs font-bold tracking-widest text-muted-foreground">
                      {copy.stepLabelPrefix} {step.number}
                    </span>
                    <h3 className="mb-2 font-bold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-success/10 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-success">
              <CheckCircle className="h-5 w-5 text-success" /> {copy.verifiedTitle}
            </h3>
            <ul className="space-y-2">
              {verifiedIndicators.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-danger/30 bg-danger/10 p-6">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-danger">
              <XCircle className="h-5 w-5 text-danger" /> {copy.notVerifiedTitle}
            </h3>
            <ul className="space-y-2">
              {notVerifiedIndicators.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 rounded-2xl bg-primary p-8 text-primary-foreground">
          <div className="mb-5 flex items-center gap-3">
            <Scale className="h-6 w-6 text-accent" />
            <h2 className="text-xl font-bold">{copy.rightsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {userRights.map((right) => (
              <div key={right} className="flex items-start gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm text-primary-foreground/85">{right}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{copy.faqTitle}</h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-background p-6 shadow-sm">
                <h3 className="mb-2 text-sm font-semibold text-foreground">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-8 sm:flex-row">
          <div>
            <h3 className="mb-1 flex items-center gap-2 font-bold text-foreground">
              <Phone className="h-4 w-4 text-primary" />
              {copy.reportTitle}
            </h3>
            <p className="text-sm text-muted-foreground">{copy.reportBody}</p>
          </div>

          <div className="flex shrink-0 gap-3">
            <Link
              href={withLocalePrefix('/contact', locale)}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {copy.reportAction}
            </Link>
            <Link
              href={withLocalePrefix('/lawyers', locale)}
              className="rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              {copy.findLawyersAction}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

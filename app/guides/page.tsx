import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  Home,
  Scale,
  Shield,
  ShoppingCart,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { LeadCapture } from '@/components/ui/LeadCapture';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';

type GuideCategory = {
  icon: LucideIcon;
  title: string;
  slug: string;
  toneClass: string;
  iconClass: string;
  iconBgClass: string;
  guides: Array<{ title: string; slug: string; readTime: number }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createLocalizedMetadata({
    locale,
    pathname: '/guides',
    title: `${getMemoryLocalizedText('Understand Indian law simply', locale)} | LexIndia`,
    description: getMemoryLocalizedText(
      'plain-language legal guides covering major areas of Indian law. No jargon. Reviewed by legal professionals.',
      locale
    ),
  });
}

const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    icon: Shield,
    title: 'Emergency and Accidents',
    slug: 'emergency-law',
    toneClass: 'border-warning/30 bg-warning/10',
    iconClass: 'text-warning',
    iconBgClass: 'bg-warning/20',
    guides: [{ title: 'Road Accidents: Immediate Legal Steps and What Not to Do', slug: 'road-accident-emergency', readTime: 7 }],
  },
  {
    icon: Scale,
    title: 'Criminal Law',
    slug: 'criminal-law',
    toneClass: 'border-danger/30 bg-danger/10',
    iconClass: 'text-danger',
    iconBgClass: 'bg-danger/20',
    guides: [
      { title: 'What to Do When Arrested by Police in India', slug: 'arrested-by-police', readTime: 8 },
      { title: 'How to File an FIR: Step-by-Step Guide', slug: 'how-to-file-fir', readTime: 6 },
      { title: 'Understanding Bail: Types and How to Get Bail', slug: 'understanding-bail', readTime: 7 },
      { title: 'Anticipatory Bail: When and How to Apply', slug: 'anticipatory-bail', readTime: 6 },
      { title: 'Free Legal Aid Under NALSA: Who Qualifies', slug: 'free-legal-aid-nalsa', readTime: 5 },
    ],
  },
  {
    icon: Users,
    title: 'Family Law',
    slug: 'family-law',
    toneClass: 'border-accent/30 bg-accent/10',
    iconClass: 'text-accent',
    iconBgClass: 'bg-accent/20',
    guides: [
      { title: 'Divorce in India: Mutual Consent vs Contested', slug: 'divorce-india-guide', readTime: 10 },
      { title: 'Child Custody Laws in India Explained', slug: 'child-custody-india', readTime: 8 },
      { title: 'Maintenance and Alimony: Your Rights After Divorce', slug: 'maintenance-alimony-rights', readTime: 7 },
      { title: 'Marriage Registration in India: How to Register', slug: 'marriage-registration-india', readTime: 5 },
      { title: 'Domestic Violence Act 2005: A Complete Guide', slug: 'domestic-violence-act-guide', readTime: 9 },
    ],
  },
  {
    icon: Home,
    title: 'Property Law',
    slug: 'property-law',
    toneClass: 'border-primary/30 bg-primary/10',
    iconClass: 'text-primary',
    iconBgClass: 'bg-primary/15',
    guides: [
      { title: 'Tenant Rights in India: What Your Landlord Cannot Do', slug: 'tenant-rights-india', readTime: 8 },
      { title: 'Property Registration: Process and Documents Needed', slug: 'property-registration-guide', readTime: 7 },
      { title: 'How to Dispute an Illegal Eviction', slug: 'illegal-eviction-dispute', readTime: 6 },
      { title: 'Property Inheritance Laws in India', slug: 'property-inheritance-india', readTime: 9 },
      { title: 'RERA: Your Rights as a Home Buyer', slug: 'rera-home-buyer-rights', readTime: 7 },
    ],
  },
  {
    icon: ShoppingCart,
    title: 'Consumer Law',
    slug: 'consumer-law',
    toneClass: 'border-success/30 bg-success/10',
    iconClass: 'text-success',
    iconBgClass: 'bg-success/20',
    guides: [
      { title: 'How to File a Consumer Court Complaint in India', slug: 'file-consumer-complaint', readTime: 7 },
      { title: 'E-Commerce Fraud: Getting a Refund From Flipkart or Amazon', slug: 'ecommerce-refund-fraud', readTime: 6 },
      { title: 'Insurance Claim Rejection: How to Contest It', slug: 'insurance-claim-rejection', readTime: 7 },
      { title: 'Defective Product Claims Under Consumer Protection Act', slug: 'defective-product-claim', readTime: 6 },
    ],
  },
  {
    icon: Briefcase,
    title: 'Labour and Employment',
    slug: 'labour-law',
    toneClass: 'border-warning/30 bg-warning/10',
    iconClass: 'text-warning',
    iconBgClass: 'bg-warning/20',
    guides: [
      { title: 'Wrongful Termination in India: Your Options', slug: 'wrongful-termination-india', readTime: 8 },
      { title: 'PF (Provident Fund): How to Withdraw and Claim', slug: 'pf-withdrawal-claim-guide', readTime: 6 },
      { title: 'Gratuity: Who Gets It and How to Claim', slug: 'gratuity-claim-guide', readTime: 5 },
      { title: 'POSH Act: Filing a Sexual Harassment Complaint at Work', slug: 'posh-act-complaint-guide', readTime: 8 },
    ],
  },
  {
    icon: FileText,
    title: 'Civil and General',
    slug: 'civil-law',
    toneClass: 'border-accent/30 bg-accent/10',
    iconClass: 'text-accent',
    iconBgClass: 'bg-accent/20',
    guides: [
      { title: 'How to File an RTI (Right to Information) Application', slug: 'how-to-file-rti', readTime: 6 },
      { title: 'Cybercrime Reporting in India: Step-by-Step', slug: 'cybercrime-reporting-india', readTime: 7 },
      { title: 'How to Write a Legal Notice', slug: 'how-to-write-legal-notice', readTime: 5 },
    ],
  },
];

export default async function GuidesPage() {
  const locale = await getRequestLocale();
  const totalGuides = GUIDE_CATEGORIES.reduce((sum, category) => sum + category.guides.length, 0);
  const copy = localizeTreeFromMemory({
    badge: 'Free legal guides',
    title: 'Understand Indian law simply',
    subtitle:
      'plain-language legal guides covering major areas of Indian law. No jargon. Reviewed by legal professionals.',
    infoLabel: 'Informational only',
    infoBody:
      'These guides explain general Indian law and are not legal advice. Consult a verified lawyer for your specific situation.',
    guidesLabel: 'guides',
    readLabel: 'min read',
    ctaTitle: 'Need help with your specific case?',
    ctaBody:
      'Reading a guide is the first step. Get personalised advice from a verified Indian lawyer.',
    ctaAction: 'Find a verified lawyer',
  } as const, locale);
  const localizedCategories = localizeTreeFromMemory(GUIDE_CATEGORIES, locale, {
    skipKeys: ['icon', 'slug', 'toneClass', 'iconClass', 'iconBgClass', 'readTime'],
  });

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-gradient-to-r from-primary to-accent/80 py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-accent-foreground" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-foreground">{copy.badge}</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
          <p className="mb-6 max-w-2xl text-lg text-primary-foreground/85">
            {totalGuides}+ {copy.subtitle}
          </p>
        </div>
      </div>

      <div className="border-b border-warning/30 bg-warning/10">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs text-foreground">
              <strong>{copy.infoLabel}:</strong> {copy.infoBody}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {localizedCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.slug}>
                <div className="mb-5 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${category.iconBgClass}`}>
                    <Icon className={`h-5 w-5 ${category.iconClass}`} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    {category.guides.length} {copy.guidesLabel}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.guides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={withLocalePrefix(`/guides/${guide.slug}`, locale)}
                      className={`group rounded-xl border-2 bg-background p-5 transition-all hover:shadow-md ${category.toneClass}`}
                    >
                      <h3 className="mb-3 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {guide.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {guide.readTime} {copy.readLabel}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-8 mt-16">
          <LeadCapture />
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary to-accent/80 p-8 text-center text-primary-foreground">
          <h2 className="mb-2 text-xl font-bold">{copy.ctaTitle}</h2>
          <p className="mb-6 text-sm text-primary-foreground/85">{copy.ctaBody}</p>
          <Link
            href={withLocalePrefix('/lawyers', locale)}
            className="inline-block rounded-xl bg-accent px-8 py-3 font-bold text-accent-foreground transition-colors hover:bg-accent/85"
          >
            {copy.ctaAction}
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { BookOpen, Briefcase, Car, CheckCircle, Heart, Home, Plane, Shield } from 'lucide-react';

import JsonLd from '@/components/JsonLd';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';

const INSURANCE_PAGE = {
  heroTitle: 'Compare and buy insurance in India',
  heroBody:
    'Make informed financial decisions. Compare premiums, claim settlement ratios, and benefits side by side.',
  trustTitle: 'Why choose LexIndia Insurance?',
  trustOneTitle: 'Unbiased Comparison',
  trustOneBody: 'We do not favor any provider. Compare policies objectively based on your needs.',
  trustTwoTitle: 'Expert Knowledge',
  trustTwoBody: 'Our guides are written by certified insurance experts to help you understand the fine print.',
  trustThreeTitle: 'IRDAI Compliant',
  trustThreeBody: 'We adhere to IRDAI guidelines to keep your data and transactions secure.',
} as const;

const INSURANCE_CATEGORIES = [
  {
    name: 'Health Insurance',
    icon: Heart,
    href: '/insurance/health',
    desc: 'Protect your family against medical emergencies.',
    color: 'bg-danger/10 text-danger',
  },
  {
    name: 'Term Life Insurance',
    icon: Shield,
    href: '#',
    desc: "Secure your family's financial future.",
    color: 'bg-primary/10 text-primary',
  },
  {
    name: 'Motor Insurance',
    icon: Car,
    href: '#',
    desc: 'Comprehensive cover for your car or bike.',
    color: 'bg-warning/10 text-warning',
  },
  {
    name: 'Travel Insurance',
    icon: Plane,
    href: '#',
    desc: 'Travel with confidence and broader risk cover.',
    color: 'bg-success/10 text-success',
  },
  {
    name: 'Home Insurance',
    icon: Home,
    href: '#',
    desc: 'Protect your most valuable asset.',
    color: 'bg-accent/15 text-accent-foreground',
  },
  {
    name: 'Business Insurance',
    icon: Briefcase,
    href: '#',
    desc: 'Safeguard your enterprise.',
    color: 'bg-muted text-foreground',
  },
] as const;

export async function generateMetadata() {
  const locale = await getRequestLocale();

  return createLocalizedMetadata({
    locale,
    pathname: '/insurance',
    title: `${getMemoryLocalizedText('Insurance', locale)} | LexIndia`,
    description: getMemoryLocalizedText(
      'Compare and buy insurance policies in India across health, life, motor, and travel categories.',
      locale
    ),
  });
}

export default async function InsuranceHub() {
  const locale = await getRequestLocale();
  const copy = localizeTreeFromMemory(INSURANCE_PAGE, locale);
  const categories = localizeTreeFromMemory(INSURANCE_CATEGORIES, locale, {
    skipKeys: ['icon', 'href', 'color'],
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: getMemoryLocalizedText('LexIndia Insurance Hub', locale),
    description: getMemoryLocalizedText(
      'Compare and buy insurance policies in India across health, life, motor, and travel categories.',
      locale
    ),
    publisher: {
      '@type': 'Organization',
      name: 'LexIndia',
    },
  };

  return (
    <div className="min-h-screen bg-muted pb-20">
      <JsonLd data={schema} />

      <div className="bg-primary px-4 py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">{copy.heroTitle}</h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-primary-foreground/80">{copy.heroBody}</p>
        </div>
      </div>

      <div className="relative z-10 -mt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const href = category.href.startsWith('/') ? withLocalePrefix(category.href, locale) : category.href;

            return (
              <Link
                key={category.name}
                href={href}
                className="group rounded-2xl border border-border bg-background p-6 shadow-md transition-all hover:shadow-xl"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${category.color}`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{category.name}</h3>
                <p className="text-muted-foreground">{category.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-10 text-2xl font-bold text-foreground">{copy.trustTitle}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-bold text-foreground">{copy.trustOneTitle}</h3>
            <p className="text-sm text-muted-foreground">{copy.trustOneBody}</p>
          </div>
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-bold text-foreground">{copy.trustTwoTitle}</h3>
            <p className="text-sm text-muted-foreground">{copy.trustTwoBody}</p>
          </div>
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 font-bold text-foreground">{copy.trustThreeTitle}</h3>
            <p className="text-sm text-muted-foreground">{copy.trustThreeBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

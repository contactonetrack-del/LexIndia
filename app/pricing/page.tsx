import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Award, BarChart, Shield, Users } from 'lucide-react';

import JsonLd from '@/components/JsonLd';
import { formatPricingAmount, getPricingContent } from '@/lib/content/pricing';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const content = getPricingContent(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/pricing',
    title: `${content.pageTitle} | LexIndia`,
    description: content.metadataDescription,
  });
}

export default async function PricingPage() {
  const locale = await getRequestLocale();
  const content = getPricingContent(locale);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.schemaName,
    description: content.schemaDescription,
    publisher: {
      '@type': 'Organization',
      name: 'LexIndia',
    },
  };

  return (
    <div className="min-h-screen bg-muted pb-20">
      <JsonLd data={schema} />

      <section className="relative overflow-hidden bg-primary px-4 pb-32 pt-24 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/legalbg/1920/1080')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">{content.heroTitle}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/80">{content.heroBody}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {content.highlightChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground/90"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {content.plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col overflow-hidden rounded-2xl border-2 bg-background shadow-xl transition-transform duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? 'relative border-accent md:-translate-y-4 md:hover:-translate-y-6'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute inset-x-0 top-0 bg-accent py-2 text-center text-sm font-bold uppercase tracking-widest text-accent-foreground">
                  {content.mostPopular}
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="mb-6 min-h-[48px] text-muted-foreground">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-foreground">
                    {formatPricingAmount(plan.price, locale)}
                  </span>
                  <span className="font-medium text-muted-foreground"> {plan.periodLabel}</span>
                </div>
                <Link
                  href={withLocalePrefix(plan.href, locale)}
                  className={`block w-full rounded-xl px-6 py-4 text-center font-bold transition-colors ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg'
                      : 'bg-primary/10 text-primary hover:bg-primary/15'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              <div className="flex-1 border-t border-border bg-muted p-8">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">{content.highlightsTitle}</h2>
          <p className="text-lg text-muted-foreground">{content.highlightsBody}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{content.highlightChips[0]}</h3>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{content.highlightChips[1]}</h3>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{content.highlightChips[2]}</h3>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Award className="mx-auto mb-6 h-16 w-16 text-accent" />
          <h2 className="mb-6 text-3xl font-bold text-foreground">{content.ctaTitle}</h2>
          <p className="mb-10 text-lg text-muted-foreground">{content.ctaBody}</p>
          <Link
            href={withLocalePrefix('/verify-lawyers', locale)}
            className="inline-block rounded-xl bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
          >
            {content.ctaAction}
          </Link>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

import { getLocalizedText } from '@/lib/content/localized';
import { getRightsCategories, rightsCopy } from '@/lib/content/rights';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';

const emergencyNumbers = ['100', '1091', '15100', '1930', '14567'];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/rights',
    title: `${messages.nav.rights} | LexIndia`,
    description: getLocalizedText(rightsCopy.heroSubtitle, locale),
    keywords: ['LexIndia', messages.nav.rights, messages.nav.lawyers, messages.nav.knowledge],
  });
}

export default async function RightsPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const categories = getRightsCategories(locale);

  return (
    <div className="min-h-screen bg-muted">
      <section className="bg-gradient-to-r from-primary to-primary/80 py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{messages.nav.rights}</h1>
          <p className="max-w-3xl text-lg text-primary-foreground/80">
            {getLocalizedText(rightsCopy.heroSubtitle, locale)}
          </p>
        </div>
      </section>

      <section className="border-b border-danger/20 bg-danger/90 py-4 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 text-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <Phone className="h-4 w-4" />
            {getLocalizedText(rightsCopy.emergencyTitle, locale)}
          </div>
          <div className="flex flex-wrap gap-3">
            {emergencyNumbers.map((number) => (
              <a
                key={number}
                href={`tel:${number}`}
                className="rounded-full bg-primary-foreground/10 px-3 py-1 font-medium transition-colors hover:bg-primary-foreground/20"
              >
                {number}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.slug}
                href={withLocalePrefix(`/rights/${category.slug}`, locale)}
                className="group rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${category.surfaceClassName}`}>
                  <Icon className={`h-6 w-6 ${category.accentClassName}`} />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-foreground">{category.title}</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  {getLocalizedText(rightsCopy.cardSummary, locale)}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:text-primary/80">
                  {messages.common.viewDetails}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-bold text-foreground">{messages.nav.knowledge}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{messages.knowledge.subtitle}</p>
            <Link href={withLocalePrefix('/knowledge', locale)} className="text-sm font-semibold text-primary hover:underline">
              {messages.common.viewDetails}
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-bold text-foreground">{messages.footer.findLawyer}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{messages.lawyersPage.subtitle}</p>
            <Link href={withLocalePrefix('/lawyers', locale)} className="text-sm font-semibold text-primary hover:underline">
              {messages.footer.findLawyer}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

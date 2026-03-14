import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Phone } from 'lucide-react';
import { notFound } from 'next/navigation';

import { getLocalizedText } from '@/lib/content/localized';
import { getRightDiscoveryBundle } from '@/lib/legal-discovery';
import { rightsCategories, rightsCopy } from '@/lib/content/rights';
import { normalizeEditorialStatus } from '@/lib/editorial-review';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import prisma from '@/lib/prisma';

const emergencyNumbers = ['100', '1091', '15100', '1930', '14567'];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const resolvedParams = await params;
  const category = rightsCategories.find((entry) => entry.slug === resolvedParams.slug);

  if (!category) {
    return createLocalizedMetadata({
      locale,
      pathname: '/rights',
      title: `LexIndia | ${messages.nav.rights}`,
      description: getLocalizedText(rightsCopy.heroSubtitle, locale),
    });
  }

  return createLocalizedMetadata({
    locale,
    pathname: `/rights/${resolvedParams.slug}`,
    title: `${getLocalizedText(category.title, locale)} | LexIndia`,
    description: getLocalizedText(rightsCopy.detailsBody, locale),
  });
}

export default async function RightsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const resolvedParams = await params;
  const category = rightsCategories.find((entry) => entry.slug === resolvedParams.slug);
  const rightEntry = await prisma.rightEntry.findUnique({
    where: { slug: resolvedParams.slug },
    select: {
      editorialStatus: true,
      reviewerNotes: true,
      reviewedAt: true,
    },
  });

  if (!category || normalizeEditorialStatus(rightEntry?.editorialStatus, 'APPROVED') === 'ARCHIVED') {
    notFound();
  }

  const Icon = category.icon;
  const categoryTitle = getLocalizedText(category.title, locale);
  const editorialStatus = normalizeEditorialStatus(rightEntry?.editorialStatus, 'APPROVED');
  const isReviewed = editorialStatus === 'APPROVED';
  const discovery = await getRightDiscoveryBundle(resolvedParams.slug, locale);
  const statusLabel = isReviewed
    ? 'Reviewed rights summary'
    : editorialStatus === 'REVIEW'
      ? 'Rights summary under review'
      : 'Rights summary in progress';
  const reviewNote =
    rightEntry?.reviewerNotes ??
    (isReviewed
      ? 'This rights summary has been approved in LexIndia’s editorial workflow for public awareness use.'
      : 'This rights summary is still in editorial review. Use it as an orientation aid and speak with a lawyer for case-specific advice.');

  return (
    <div className="min-h-screen bg-muted pb-16">
      <section className="bg-gradient-to-r from-primary to-primary/80 pb-16 pt-12 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href={withLocalePrefix('/rights', locale)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {getLocalizedText(rightsCopy.backToRights, locale)}
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
              <Icon className={`h-6 w-6 ${category.accentClassName}`} />
            </div>
            <span className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
              {messages.nav.rights}
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{categoryTitle}</h1>
          <p className="max-w-3xl text-lg text-primary-foreground/80">
            {getLocalizedText(rightsCopy.detailsBody, locale)}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-primary-foreground/80">
            <span className={`rounded-full border px-3 py-1 font-semibold ${isReviewed ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}`}>
              {statusLabel}
            </span>
            {rightEntry?.reviewedAt ? (
              <span>
                Reviewed on: {new Date(rightEntry.reviewedAt).toLocaleDateString('en-IN')}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className={`border-b ${isReviewed ? 'border-success/20 bg-success/5' : 'border-warning/20 bg-warning/5'}`}>
        <div className="mx-auto max-w-4xl px-4 py-3 text-xs text-foreground sm:px-6 lg:px-8">
          <strong>Editorial note:</strong> {reviewNote}
        </div>
      </section>

      <section className="-mt-8 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-6 flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="mb-2 text-xl font-bold text-foreground">
                {getLocalizedText(rightsCopy.detailsHeading, locale)}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {getLocalizedText(rightsCopy.cardSummary, locale)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href={withLocalePrefix('/knowledge', locale)}
              className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
            >
              <h3 className="mb-1 text-sm font-semibold text-foreground">{messages.nav.knowledge}</h3>
              <p className="text-sm text-muted-foreground">{messages.knowledge.subtitle}</p>
            </Link>
            <Link
              href={withLocalePrefix('/lawyers', locale)}
              className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
            >
              <h3 className="mb-1 text-sm font-semibold text-foreground">{messages.footer.findLawyer}</h3>
              <p className="text-sm text-muted-foreground">{messages.lawyersPage.subtitle}</p>
            </Link>
          </div>

          {discovery.lawLinks.length > 0 || discovery.guideLinks.length > 0 || discovery.knowledgeLinks.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {discovery.lawLinks.length > 0 ? (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Related law sections</h3>
                  <div className="space-y-3">
                    {discovery.lawLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block">
                        <p className="text-sm font-medium text-primary hover:underline">{link.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {discovery.guideLinks.length > 0 ? (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Related guides</h3>
                  <div className="space-y-3">
                    {discovery.guideLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block">
                        <p className="text-sm font-medium text-primary hover:underline">{link.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {discovery.knowledgeLinks.length > 0 ? (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Search related FAQs</h3>
                  <div className="space-y-3">
                    {discovery.knowledgeLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block">
                        <p className="text-sm font-medium text-primary hover:underline">{link.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 rounded-xl border border-danger/20 bg-danger/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Phone className="h-4 w-4 text-danger" />
              {getLocalizedText(rightsCopy.emergencyTitle, locale)}
            </div>
            <div className="flex flex-wrap gap-2">
              {emergencyNumbers.map((number) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className="rounded-full bg-danger/10 px-3 py-1 text-sm font-medium text-danger transition-colors hover:bg-danger/20"
                >
                  {number}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={withLocalePrefix('/lawyers', locale)}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {messages.footer.findLawyer}
            </Link>
            <Link
              href={withLocalePrefix('/rights', locale)}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              {messages.nav.rights}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

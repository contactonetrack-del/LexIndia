import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink, Landmark, Scale, Shield } from 'lucide-react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import prisma from '@/lib/prisma';

const LAWS_PAGE_COPY = {
  badge: 'Indian laws explained',
  title: 'Browse important Indian laws and sections',
  subtitle:
    'Start with reviewed acts and plain-English section explainers. Use these pages to orient yourself, then move into guides, rights content, or a lawyer consultation for case-specific help.',
  statLabel: 'reviewed sections live',
  disclaimerTitle: 'General information only',
  disclaimerBody:
    'These pages explain Indian legal provisions for awareness. They do not replace tailored legal advice.',
  issueFilterTitle: 'Browse by legal issue',
  issueFilterBody:
    'Start with the practical problem you are facing. LexIndia maps issue topics to the reviewed acts and sections most commonly used for that situation.',
  allIssues: 'All issues',
  sectionsLabel: 'approved sections',
  reviewedOn: 'Reviewed on',
  openAct: 'Open act',
  officialSource: 'Official text',
  currentVersion: 'Current version',
  effectiveFrom: 'Effective from',
  mappedIssues: 'Relevant for',
  noIssueMatches: 'No reviewed acts are mapped to this issue yet.',
  quickRoutesTitle: 'Continue your research',
  quickRoutesSubtitle:
    'Each part of LexIndia solves a different part of the problem: rights orientation, how-to guides, and lawyer help.',
  rightsTitle: 'Rights summaries',
  rightsBody: 'Start with issue-led summaries if you are not sure which law applies yet.',
  guidesTitle: 'Practical guides',
  guidesBody: 'Follow step-by-step explainers for FIRs, bail, complaints, and urgent legal procedures.',
  lawyersTitle: 'Speak to a lawyer',
  lawyersBody: 'Move from general awareness to case-specific strategy with a verified lawyer.',
} as const;

type Props = {
  searchParams: Promise<{ issue?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const copy = localizeTreeFromMemory(LAWS_PAGE_COPY, locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/laws',
    title: `${copy.title} | LexIndia`,
    description: copy.subtitle,
  });
}

export default async function LawsPage({ searchParams }: Props) {
  const locale = await getRequestLocale();
  const { issue } = await searchParams;
  const copy = localizeTreeFromMemory(LAWS_PAGE_COPY, locale);
  const selectedIssue = typeof issue === 'string' && issue.trim().length > 0 ? issue.trim() : null;
  const issueTopics = await prisma.legalIssueTopic.findMany({
    orderBy: { title: 'asc' },
    select: {
      slug: true,
      title: true,
      _count: {
        select: {
          acts: true,
        },
      },
    },
  });
  const acts = await prisma.legalAct.findMany({
    where: {
      editorialStatus: 'APPROVED',
      ...(selectedIssue
        ? {
            issueTopics: {
              some: { slug: selectedIssue },
            },
          }
        : {}),
    },
    orderBy: { title: 'asc' },
    select: {
      id: true,
      slug: true,
      shortCode: true,
      title: true,
      description: true,
      sourceUrl: true,
      reviewedAt: true,
      issueTopics: {
        orderBy: { title: 'asc' },
        select: {
          slug: true,
          title: true,
        },
      },
      versions: {
        where: { isCurrent: true },
        take: 1,
        select: {
          versionLabel: true,
          status: true,
          effectiveFrom: true,
        },
      },
      sections: {
        where: { editorialStatus: 'APPROVED' },
        orderBy: { sectionKey: 'asc' },
        select: {
          id: true,
          sectionKey: true,
          title: true,
          plainEnglish: true,
        },
      },
    },
  });
  const approvedSectionCount = acts.reduce((sum, act) => sum + act.sections.length, 0);

  return (
    <div className="min-h-screen bg-muted">
      <section className="bg-gradient-to-r from-primary to-accent/80 py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <Landmark className="h-8 w-8 text-accent-foreground" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-foreground">
              {copy.badge}
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
          <p className="mb-6 max-w-3xl text-lg text-primary-foreground/85">{copy.subtitle}</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground">
            <span className="font-semibold">{approvedSectionCount}</span>
            <span>{copy.statLabel}</span>
          </div>
        </div>
      </section>

      <section className="border-b border-warning/30 bg-warning/10">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs text-foreground">
              <strong>{copy.disclaimerTitle}:</strong> {copy.disclaimerBody}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-5 max-w-3xl">
            <h2 className="mb-2 text-xl font-bold text-foreground">{copy.issueFilterTitle}</h2>
            <p className="text-sm text-muted-foreground">{copy.issueFilterBody}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={withLocalePrefix('/laws', locale)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                selectedIssue === null
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-foreground hover:border-primary/30'
              }`}
            >
              {copy.allIssues}
            </Link>
            {issueTopics.map((topic) => (
              <Link
                key={topic.slug}
                data-testid={`laws-issue-chip-${topic.slug}`}
                href={withLocalePrefix(`/laws?issue=${encodeURIComponent(topic.slug)}`, locale)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  selectedIssue === topic.slug
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-surface text-foreground hover:border-primary/30'
                }`}
              >
                {topic.title} ({topic._count.acts})
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {acts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-8 text-sm text-muted-foreground shadow-sm lg:col-span-2">
              {copy.noIssueMatches}
            </div>
          ) : null}
          {acts.map((act) => (
            <div
              key={act.id}
              data-testid={`laws-act-card-${act.slug}`}
              className="rounded-2xl border border-border bg-background p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {act.shortCode}
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{act.title}</h2>
                </div>
                <Scale className="h-5 w-5 shrink-0 text-primary" />
              </div>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {act.description}
              </p>

              <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span>
                  {act.sections.length} {copy.sectionsLabel}
                </span>
                {act.versions[0]?.versionLabel ? (
                  <span>
                    {copy.currentVersion}: {act.versions[0].versionLabel}
                  </span>
                ) : null}
                {act.versions[0]?.effectiveFrom ? (
                  <span>
                    {copy.effectiveFrom}: {new Date(act.versions[0].effectiveFrom).toLocaleDateString('en-IN')}
                  </span>
                ) : null}
                {act.reviewedAt ? (
                  <span>
                    {copy.reviewedOn}: {new Date(act.reviewedAt).toLocaleDateString('en-IN')}
                  </span>
                ) : null}
              </div>

              {act.issueTopics.length > 0 ? (
                <div className="mb-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {copy.mappedIssues}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {act.issueTopics.map((topic) => (
                      <span
                        key={topic.slug}
                        className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {topic.title}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3 rounded-xl border border-border bg-surface p-4">
                {act.sections.slice(0, 3).map((section) => (
                  <Link
                    key={section.id}
                    href={withLocalePrefix(
                      `/laws/${act.slug}/${encodeURIComponent(section.sectionKey)}`,
                      locale
                    )}
                    className="block rounded-lg border border-transparent p-2 transition-colors hover:border-primary/20 hover:bg-background"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {section.sectionKey}: {section.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{section.plainEnglish}</p>
                  </Link>
                ))}
              </div>

              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={withLocalePrefix(`/laws/${act.slug}`, locale)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {copy.openAct}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {act.sourceUrl ? (
                    <a
                      href={act.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                    >
                      {copy.officialSource}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-background p-8 shadow-sm">
          <div className="mb-6 max-w-3xl">
            <h2 className="mb-2 text-2xl font-bold text-foreground">{copy.quickRoutesTitle}</h2>
            <p className="text-sm text-muted-foreground">{copy.quickRoutesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href={withLocalePrefix('/rights', locale)}
              className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/30"
            >
              <h3 className="mb-2 text-sm font-semibold text-foreground">{copy.rightsTitle}</h3>
              <p className="text-sm text-muted-foreground">{copy.rightsBody}</p>
            </Link>
            <Link
              href={withLocalePrefix('/guides', locale)}
              className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/30"
            >
              <h3 className="mb-2 text-sm font-semibold text-foreground">{copy.guidesTitle}</h3>
              <p className="text-sm text-muted-foreground">{copy.guidesBody}</p>
            </Link>
            <Link
              href={withLocalePrefix('/lawyers', locale)}
              className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/30"
            >
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{copy.lawyersTitle}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{copy.lawyersBody}</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

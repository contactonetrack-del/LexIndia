import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ExternalLink,
  FileText,
  Landmark,
  Shield,
} from 'lucide-react';
import { notFound } from 'next/navigation';

import { getSectionDiscoveryBundle } from '@/lib/legal-discovery';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import { getSectionCrosswalkLabel, getSectionHistoryEntryLabel } from '@/lib/law-history';
import { getLawVersionStatusLabel } from '@/lib/law-status';
import prisma from '@/lib/prisma';

const SECTION_PAGE_COPY = {
  backToAct: 'Back to act',
  backToLaws: 'Browse all laws',
  reviewBadge: 'Reviewed section explainer',
  reviewLabel: 'Reviewed on',
  textHeading: 'What the section says',
  plainEnglishHeading: 'Plain-English meaning',
  punishmentHeading: 'Punishment or legal exposure',
  practicalHeading: 'Practical guidance',
  exampleHeading: 'Example scenario',
  disclaimerTitle: 'Awareness only',
  disclaimerBody:
    'This page explains a provision in plain language. It is not a substitute for legal strategy on your exact facts.',
  relatedGuides: 'Related guides',
  relatedRights: 'Related rights pages',
  relatedFaqs: 'Related FAQ searches',
  relatedLaws: 'Related law sections',
  officialSourceTitle: 'Official source',
  officialSourceBody:
    'Use the government source when you need the authoritative act text or want to confirm the latest wording.',
  sourceAuthorityLabel: 'Source authority',
  openOfficialSource: 'Open official act page',
  openOfficialPdf: 'Open official PDF',
  currentVersion: 'Current version',
  citationHistoryTitle: 'Official citation and section history',
  citationHistoryBody:
    'Use this panel when a court order, legal notice, or older article cites a legacy section number or pre-transition evidence rule.',
  versionStatus: 'Version status',
  effectiveFrom: 'Effective from',
  effectiveTo: 'Effective to',
  crosswalkTitle: 'Legacy and current-code crosswalks',
  crosswalkBody:
    'Use these links when an FIR, order, notice, or legal article still cites an older section number after the 2024 code transition.',
  aliasesTitle: 'Also searched as',
  mappedIssues: 'Relevant issues',
  needLawyerTitle: 'Need help applying this section to your case?',
  needLawyerBody:
    'Use a verified lawyer when there is a live complaint, arrest risk, urgent evidence issue, or money at stake.',
  needLawyerAction: 'Talk to a verified lawyer',
} as const;

type Props = { params: Promise<{ act: string; section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { act, section } = await params;
  const lawSection = await prisma.lawSection.findFirst({
    where: {
      sectionKey: decodeURIComponent(section),
      editorialStatus: 'APPROVED',
      act: {
        slug: act,
        editorialStatus: 'APPROVED',
      },
    },
    select: {
      sectionKey: true,
      title: true,
      plainEnglish: true,
      act: {
        select: {
          slug: true,
          title: true,
          sourceAuthority: true,
          sourceUrl: true,
          sourcePdfUrl: true,
          versions: {
            orderBy: [{ isCurrent: 'desc' }, { displayOrder: 'asc' }],
            select: {
              versionLabel: true,
              status: true,
              effectiveFrom: true,
              effectiveTo: true,
              isCurrent: true,
            },
          },
        },
      },
    },
  });

  if (!lawSection) {
    return createLocalizedMetadata({
      locale,
      pathname: '/laws',
      title: `${getMemoryLocalizedText('Indian laws explained', locale)} | LexIndia`,
      description: getMemoryLocalizedText(
        'Browse reviewed Indian laws and plain-English section explainers.',
        locale
      ),
    });
  }

  return createLocalizedMetadata({
    locale,
    pathname: `/laws/${lawSection.act.slug}/${encodeURIComponent(lawSection.sectionKey)}`,
    title: `${lawSection.sectionKey}: ${lawSection.title} | LexIndia`,
    description: lawSection.plainEnglish,
  });
}

export default async function LawSectionPage({ params }: Props) {
  const locale = await getRequestLocale();
  const { act, section } = await params;
  const copy = localizeTreeFromMemory(SECTION_PAGE_COPY, locale);
  const lawSection = await prisma.lawSection.findFirst({
    where: {
      sectionKey: decodeURIComponent(section),
      editorialStatus: 'APPROVED',
      act: {
        slug: act,
        editorialStatus: 'APPROVED',
      },
    },
    select: {
      id: true,
      sectionKey: true,
      title: true,
      sectionText: true,
      plainEnglish: true,
      punishmentSummary: true,
      practicalGuidance: true,
      exampleScenario: true,
      reviewedAt: true,
      aliases: {
        orderBy: { alias: 'asc' },
        select: {
          alias: true,
          aliasType: true,
        },
      },
      historyEntries: {
        orderBy: [{ displayOrder: 'asc' }, { eventDate: 'asc' }],
        select: {
          title: true,
          summary: true,
          entryType: true,
          eventDate: true,
          sourceLabel: true,
          sourceUrl: true,
          sourcePdfUrl: true,
        },
      },
      issueTopics: {
        orderBy: { title: 'asc' },
        select: {
          slug: true,
          title: true,
        },
      },
      act: {
        select: {
          slug: true,
          shortCode: true,
          title: true,
          sourceAuthority: true,
          sourceUrl: true,
          sourcePdfUrl: true,
          versions: {
            orderBy: [{ isCurrent: 'desc' }, { displayOrder: 'asc' }],
            select: {
              versionLabel: true,
              status: true,
              effectiveFrom: true,
              effectiveTo: true,
              isCurrent: true,
            },
          },
        },
      },
    },
  });

  if (!lawSection) {
    notFound();
  }

  const [discovery, outgoingCrosswalks, incomingCrosswalks] = await Promise.all([
    getSectionDiscoveryBundle(lawSection.act.slug, lawSection.sectionKey, locale),
    prisma.lawSectionCrosswalk.findMany({
      where: { fromSectionId: lawSection.id },
      select: {
        relationType: true,
        summary: true,
        toSection: {
          select: {
            sectionKey: true,
            title: true,
            act: {
              select: {
                slug: true,
                shortCode: true,
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.lawSectionCrosswalk.findMany({
      where: { toSectionId: lawSection.id },
      select: {
        relationType: true,
        summary: true,
        fromSection: {
          select: {
            sectionKey: true,
            title: true,
            act: {
              select: {
                slug: true,
                shortCode: true,
                title: true,
              },
            },
          },
        },
      },
    }),
  ]);
  const currentVersion =
    lawSection.act.versions.find((version) => version.isCurrent) ?? lawSection.act.versions[0] ?? null;
  const sectionCrosswalks = [
    ...outgoingCrosswalks.map((crosswalk) => ({
      direction: 'outgoing' as const,
      relationType: crosswalk.relationType,
      summary: crosswalk.summary,
      section: crosswalk.toSection,
    })),
    ...incomingCrosswalks.map((crosswalk) => ({
      direction: 'incoming' as const,
      relationType: crosswalk.relationType,
      summary: crosswalk.summary,
      section: crosswalk.fromSection,
    })),
  ];

  return (
    <div className="min-h-screen bg-muted pb-16">
      <section className="bg-gradient-to-r from-primary to-accent/80 pb-16 pt-12 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-primary-foreground/80">
            <Link
              href={withLocalePrefix('/laws', locale)}
              className="inline-flex items-center gap-1 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.backToLaws}
            </Link>
            <span>/</span>
            <Link
              href={withLocalePrefix(`/laws/${lawSection.act.slug}`, locale)}
              className="transition-colors hover:text-primary-foreground"
            >
              {copy.backToAct}
            </Link>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
              {lawSection.act.shortCode}
            </span>
            <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              {copy.reviewBadge}
            </span>
            {lawSection.reviewedAt ? (
              <span className="text-xs text-primary-foreground/80">
                {copy.reviewLabel}: {new Date(lawSection.reviewedAt).toLocaleDateString('en-IN')}
              </span>
            ) : null}
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent-foreground">
            {lawSection.sectionKey}
          </p>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{lawSection.title}</h1>
          <p className="max-w-3xl text-lg text-primary-foreground/85">{lawSection.plainEnglish}</p>
        </div>
      </section>

      <section className="border-b border-warning/30 bg-warning/10">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs text-foreground">
              <strong>{copy.disclaimerTitle}:</strong> {copy.disclaimerBody}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                <Landmark className="h-5 w-5 text-primary" />
                {copy.textHeading}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{lawSection.sectionText}</p>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-primary">
                <CheckCircle className="h-5 w-5" />
                {copy.plainEnglishHeading}
              </h2>
              <p className="text-sm leading-relaxed text-foreground">{lawSection.plainEnglish}</p>
            </div>

            {lawSection.punishmentSummary ? (
              <div className="rounded-2xl border border-danger/20 bg-danger/5 p-6">
                <h2 className="mb-3 text-lg font-bold text-danger">{copy.punishmentHeading}</h2>
                <p className="text-sm leading-relaxed text-foreground">{lawSection.punishmentSummary}</p>
              </div>
            ) : null}

            {lawSection.practicalGuidance ? (
              <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  {copy.practicalHeading}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {lawSection.practicalGuidance}
                </p>
              </div>
            ) : null}

            {lawSection.exampleScenario ? (
              <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold text-foreground">{copy.exampleHeading}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {lawSection.exampleScenario}
                </p>
              </div>
            ) : null}
          </div>

          <div className="space-y-5">
            {lawSection.act.sourceUrl ? (
              <div
                data-testid="law-section-official-source"
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="mb-2 text-sm font-bold text-foreground">{copy.officialSourceTitle}</h3>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {copy.officialSourceBody}
                </p>
                <div className="mb-4 rounded-xl border border-border bg-surface p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {copy.sourceAuthorityLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {lawSection.act.sourceAuthority ?? 'Official government source'}
                  </p>
                </div>
                <div className="space-y-3">
                  <a
                    href={lawSection.act.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {copy.openOfficialSource}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {lawSection.act.sourcePdfUrl ? (
                    <div>
                      <a
                        href={lawSection.act.sourcePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        {copy.openOfficialPdf}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {currentVersion ? (
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.currentVersion}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {copy.currentVersion}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">{currentVersion.versionLabel}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {copy.versionStatus}
                    </p>
                    <p className="mt-1 text-foreground">
                      {getLawVersionStatusLabel(currentVersion.status)}
                    </p>
                  </div>
                  {currentVersion.effectiveFrom ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {copy.effectiveFrom}
                      </p>
                      <p className="mt-1 text-foreground">
                        {new Date(currentVersion.effectiveFrom).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  ) : null}
                  {currentVersion.effectiveTo ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {copy.effectiveTo}
                      </p>
                      <p className="mt-1 text-foreground">
                        {new Date(currentVersion.effectiveTo).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {lawSection.historyEntries.length > 0 ? (
              <div
                data-testid="law-section-history"
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="mb-2 text-sm font-bold text-foreground">{copy.citationHistoryTitle}</h3>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {copy.citationHistoryBody}
                </p>
                <div className="space-y-3">
                  {lawSection.historyEntries.map((entry) => (
                    <div
                      key={`${entry.entryType}-${entry.title}-${entry.eventDate?.toISOString() ?? 'undated'}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {getSectionHistoryEntryLabel(entry.entryType)}
                        </span>
                      </div>
                      {entry.eventDate ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(entry.eventDate).toLocaleDateString('en-IN')}
                        </p>
                      ) : null}
                      {entry.summary ? (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {entry.summary}
                        </p>
                      ) : null}
                      {entry.sourceUrl ? (
                        <div className="mt-3 flex flex-wrap gap-3">
                          <a
                            href={entry.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                          >
                            {entry.sourceLabel ?? copy.openOfficialSource}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {entry.sourcePdfUrl ? (
                            <a
                              href={entry.sourcePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                            >
                              {copy.openOfficialPdf}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {sectionCrosswalks.length > 0 ? (
              <div
                data-testid="law-section-crosswalks"
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="mb-2 text-sm font-bold text-foreground">{copy.crosswalkTitle}</h3>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {copy.crosswalkBody}
                </p>
                <div className="space-y-3">
                  {sectionCrosswalks.map((crosswalk) => (
                    <div
                      key={`${crosswalk.direction}-${crosswalk.relationType}-${crosswalk.section.act.slug}-${crosswalk.section.sectionKey}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {getSectionCrosswalkLabel(crosswalk.relationType, crosswalk.direction)}
                      </p>
                      <Link
                        href={withLocalePrefix(
                          `/laws/${crosswalk.section.act.slug}/${encodeURIComponent(crosswalk.section.sectionKey)}`,
                          locale
                        )}
                        className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        {crosswalk.section.act.shortCode} {crosswalk.section.sectionKey}: {crosswalk.section.title}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">{crosswalk.section.act.title}</p>
                      {crosswalk.summary ? (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {crosswalk.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {lawSection.aliases.length > 0 ? (
              <div
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
                data-testid="law-section-aliases"
              >
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.aliasesTitle}</h3>
                <div className="flex flex-wrap gap-2">
                  {lawSection.aliases.map((alias) => (
                    <span
                      key={`${alias.aliasType}-${alias.alias}`}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {alias.alias}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {lawSection.issueTopics.length > 0 ? (
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.mappedIssues}</h3>
                <div className="flex flex-wrap gap-2">
                  {lawSection.issueTopics.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={withLocalePrefix(`/laws?issue=${encodeURIComponent(topic.slug)}`, locale)}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary/40"
                    >
                      {topic.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            {discovery.lawLinks.length > 0 ? (
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.relatedLaws}</h3>
                <div className="space-y-3">
                  {discovery.lawLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/30"
                    >
                      <p className="text-sm font-semibold text-foreground">{link.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {discovery.guideLinks.length > 0 ? (
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {copy.relatedGuides}
                </h3>
                <div className="space-y-3">
                  {discovery.guideLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/30"
                    >
                      <p className="text-sm font-semibold text-foreground">{link.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {discovery.rightLinks.length > 0 ? (
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.relatedRights}</h3>
                <div className="space-y-3">
                  {discovery.rightLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/30"
                    >
                      <p className="text-sm font-semibold text-foreground">{link.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {discovery.knowledgeLinks.length > 0 ? (
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.relatedFaqs}</h3>
                <div className="space-y-3">
                  {discovery.knowledgeLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary/30"
                    >
                      <p className="text-sm font-semibold text-foreground">{link.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
              <h3 className="mb-2 text-sm font-bold">{copy.needLawyerTitle}</h3>
              <p className="text-xs text-primary-foreground/85">{copy.needLawyerBody}</p>
              <Link
                href={withLocalePrefix('/lawyers', locale)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                {copy.needLawyerAction}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

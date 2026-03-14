import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ExternalLink,
  FileText,
  Scale,
  Shield,
} from 'lucide-react';
import { notFound } from 'next/navigation';

import { getActDiscoveryBundle } from '@/lib/legal-discovery';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import { getActRelationLabel, getLawTimelineEventLabel } from '@/lib/law-history';
import { getLawVersionStatusLabel } from '@/lib/law-status';
import prisma from '@/lib/prisma';

	const ACT_PAGE_COPY = {
	  backToLaws: 'Back to laws',
	  badge: 'Reviewed act summary',
	  reviewLabel: 'Reviewed on',
	  disclaimerTitle: 'General information only',
  disclaimerBody:
    'This act summary is for legal awareness. If your issue is urgent or fact-sensitive, use the related guides below or consult a verified lawyer.',
  sectionsHeading: 'Key sections available on LexIndia',
  sectionsBody:
    'These section pages explain the provision, what it usually means in practice, and what evidence or next steps matter most.',
  openSection: 'Open section',
  relatedLaws: 'Related law sections',
  relatedGuides: 'Related guides',
  relatedRights: 'Related rights pages',
  relatedFaqs: 'Related FAQ searches',
  officialSourceTitle: 'Official source',
  officialSourceBody:
    'Always cross-check the latest authoritative text on the government source before relying on any section wording.',
  sourceAuthorityLabel: 'Source authority',
  openOfficialSource: 'Open official act page',
  openOfficialPdf: 'Open official PDF',
	  versionTitle: 'Current version status',
	  versionLabel: 'Version label',
	  versionStatus: 'Status',
	  currentLabel: 'Current',
	  commencementDate: 'Commencement date',
	  effectiveFrom: 'Effective from',
	  effectiveTo: 'Effective to',
	  updateSummary: 'Update note',
  versionTimelineTitle: 'Version timeline',
  historyTimelineTitle: 'Act history and update timeline',
  historyTimelineBody:
    'Use this timeline when an older notice, court order, or legal article cites a legacy code, an amendment stage, or a pre-commencement position.',
  codeTransitionTitle: 'Code transition',
  codeTransitionBody:
    'LexIndia links old and current code references so citizens can understand legacy FIRs, orders, and legal notices after the 2024 code transition.',
  mappedIssues: 'Relevant issues',
  askLawyerTitle: 'Need advice on your exact facts?',
  askLawyerBody:
    'Move from general legal awareness to case-specific strategy with a verified Indian lawyer.',
  askLawyerAction: 'Find a verified lawyer',
  noSections: 'No approved sections are live for this act yet.',
} as const;

type Props = { params: Promise<{ act: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { act } = await params;
  const legalAct = await prisma.legalAct.findUnique({
    where: { slug: act },
    select: {
      slug: true,
      title: true,
      description: true,
      sourceAuthority: true,
      sourceUrl: true,
      sourcePdfUrl: true,
      editorialStatus: true,
      versions: {
        orderBy: [{ isCurrent: 'desc' }, { displayOrder: 'asc' }],
        select: {
          versionLabel: true,
          status: true,
          commencementDate: true,
          effectiveFrom: true,
          effectiveTo: true,
          updateSummary: true,
          isCurrent: true,
        },
      },
      issueTopics: {
        orderBy: { title: 'asc' },
        select: {
          slug: true,
          title: true,
        },
      },
    },
  });

  if (!legalAct || legalAct.editorialStatus !== 'APPROVED') {
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
    pathname: `/laws/${legalAct.slug}`,
    title: `${legalAct.title} | LexIndia`,
    description: legalAct.description,
  });
}

export default async function ActDetailPage({ params }: Props) {
  const locale = await getRequestLocale();
  const { act } = await params;
  const copy = localizeTreeFromMemory(ACT_PAGE_COPY, locale);
  const legalAct = await prisma.legalAct.findUnique({
    where: { slug: act },
    select: {
      id: true,
      slug: true,
      shortCode: true,
      title: true,
      description: true,
      sourceAuthority: true,
      sourceUrl: true,
      sourcePdfUrl: true,
      editorialStatus: true,
      versions: {
        orderBy: [{ isCurrent: 'desc' }, { displayOrder: 'asc' }],
        select: {
          versionLabel: true,
          status: true,
          commencementDate: true,
          effectiveFrom: true,
          effectiveTo: true,
          updateSummary: true,
          isCurrent: true,
        },
      },
      issueTopics: {
        orderBy: { title: 'asc' },
        select: {
          slug: true,
          title: true,
        },
      },
      timelineEvents: {
        orderBy: [{ displayOrder: 'asc' }, { eventDate: 'asc' }],
        select: {
          title: true,
          summary: true,
          eventType: true,
          eventDate: true,
          sourceLabel: true,
          sourceUrl: true,
        },
      },
      reviewerNotes: true,
      reviewedAt: true,
      sections: {
        where: { editorialStatus: 'APPROVED' },
        orderBy: { sectionKey: 'asc' },
        select: {
          id: true,
          sectionKey: true,
          title: true,
          plainEnglish: true,
          reviewedAt: true,
        },
      },
    },
  });

  if (!legalAct || legalAct.editorialStatus !== 'APPROVED') {
    notFound();
  }

  const [discovery, outgoingRelations, incomingRelations] = await Promise.all([
    getActDiscoveryBundle(legalAct.slug, locale),
    prisma.legalActRelation.findMany({
      where: { fromActId: legalAct.id },
      select: {
        relationType: true,
        summary: true,
        effectiveFrom: true,
        toAct: {
          select: {
            slug: true,
            shortCode: true,
            title: true,
          },
        },
      },
    }),
    prisma.legalActRelation.findMany({
      where: { toActId: legalAct.id },
      select: {
        relationType: true,
        summary: true,
        effectiveFrom: true,
        fromAct: {
          select: {
            slug: true,
            shortCode: true,
            title: true,
          },
        },
      },
    }),
  ]);
  const currentVersion = legalAct.versions[0] ?? null;
  const actRelations = [
    ...outgoingRelations.map((relation) => ({
      direction: 'outgoing' as const,
      relationType: relation.relationType,
      summary: relation.summary,
      effectiveFrom: relation.effectiveFrom,
      act: relation.toAct,
    })),
    ...incomingRelations.map((relation) => ({
      direction: 'incoming' as const,
      relationType: relation.relationType,
      summary: relation.summary,
      effectiveFrom: relation.effectiveFrom,
      act: relation.fromAct,
    })),
  ];

  return (
    <div className="min-h-screen bg-muted pb-16">
      <section className="bg-gradient-to-r from-primary to-accent/80 pb-16 pt-12 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href={withLocalePrefix('/laws', locale)}
            className="mb-6 inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.backToLaws}
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground/80">
              {legalAct.shortCode}
            </span>
            <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              {copy.badge}
            </span>
            {legalAct.reviewedAt ? (
              <span className="text-xs text-primary-foreground/80">
                {copy.reviewLabel}: {new Date(legalAct.reviewedAt).toLocaleDateString('en-IN')}
              </span>
            ) : null}
          </div>

          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{legalAct.title}</h1>
          <p className="max-w-3xl text-lg text-primary-foreground/85">{legalAct.description}</p>
        </div>
      </section>

      <section className="border-b border-warning/30 bg-warning/10">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
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
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{copy.sectionsHeading}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.sectionsBody}</p>
                </div>
              </div>

              {legalAct.sections.length === 0 ? (
                <p className="text-sm text-muted-foreground">{copy.noSections}</p>
              ) : (
                <div className="space-y-4">
                  {legalAct.sections.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-xl border border-border bg-surface p-5"
                    >
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            {section.sectionKey}
                          </p>
                          <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                        </div>
                        {section.reviewedAt ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                            <CheckCircle className="h-3.5 w-3.5" />
                            {new Date(section.reviewedAt).toLocaleDateString('en-IN')}
                          </span>
                        ) : null}
                      </div>
                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {section.plainEnglish}
                      </p>
                      <Link
                        href={withLocalePrefix(
                          `/laws/${legalAct.slug}/${encodeURIComponent(section.sectionKey)}`,
                          locale
                        )}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        {copy.openSection}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {legalAct.sourceUrl ? (
              <div
                data-testid="act-official-source"
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
                    {legalAct.sourceAuthority ?? 'Official government source'}
                  </p>
                </div>
                <div className="space-y-3">
                  <a
                    href={legalAct.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {copy.openOfficialSource}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {legalAct.sourcePdfUrl ? (
                    <div>
                      <a
                        href={legalAct.sourcePdfUrl}
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
              <div
                data-testid="act-current-version"
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.versionTitle}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {copy.versionLabel}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">{currentVersion.versionLabel}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {copy.versionStatus}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">
                      {getLawVersionStatusLabel(currentVersion.status)}
                    </p>
                  </div>
                  {currentVersion.commencementDate ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {copy.commencementDate}
                      </p>
                      <p className="mt-1 text-foreground">
                        {new Date(currentVersion.commencementDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  ) : null}
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
                  {currentVersion.updateSummary ? (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {copy.updateSummary}
                      </p>
                      <p className="mt-1 text-muted-foreground">{currentVersion.updateSummary}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {legalAct.versions.length > 0 ? (
              <div
                data-testid="act-version-timeline"
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.versionTimelineTitle}</h3>
                <div className="space-y-4">
                  {legalAct.versions.map((version) => (
                    <div
                      key={`${version.versionLabel}-${version.status}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{version.versionLabel}</p>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {getLawVersionStatusLabel(version.status)}
                        </span>
	                        {version.isCurrent ? (
	                          <span className="rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success">
	                            {copy.currentLabel}
	                          </span>
	                        ) : null}
	                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                        {version.commencementDate ? (
                          <div>
                            <p className="font-semibold uppercase tracking-wide">{copy.commencementDate}</p>
                            <p className="mt-1 text-foreground">
                              {new Date(version.commencementDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        ) : null}
                        {version.effectiveFrom ? (
                          <div>
                            <p className="font-semibold uppercase tracking-wide">{copy.effectiveFrom}</p>
                            <p className="mt-1 text-foreground">
                              {new Date(version.effectiveFrom).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        ) : null}
                        {version.effectiveTo ? (
                          <div>
                            <p className="font-semibold uppercase tracking-wide">{copy.effectiveTo}</p>
                            <p className="mt-1 text-foreground">
                              {new Date(version.effectiveTo).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        ) : null}
                      </div>
                      {version.updateSummary ? (
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          {version.updateSummary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {legalAct.timelineEvents.length > 0 ? (
              <div
                data-testid="act-history-timeline"
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="mb-2 text-sm font-bold text-foreground">{copy.historyTimelineTitle}</h3>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {copy.historyTimelineBody}
                </p>
                <div className="space-y-3">
                  {legalAct.timelineEvents.map((event) => (
                    <div
                      key={`${event.eventType}-${event.title}-${event.eventDate?.toISOString() ?? 'undated'}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          {getLawTimelineEventLabel(event.eventType)}
                        </span>
                      </div>
                      {event.eventDate ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(event.eventDate).toLocaleDateString('en-IN')}
                        </p>
                      ) : null}
                      {event.summary ? (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {event.summary}
                        </p>
                      ) : null}
                      {event.sourceUrl ? (
                        <a
                          href={event.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                          {event.sourceLabel ?? copy.openOfficialSource}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {actRelations.length > 0 ? (
              <div
                data-testid="act-code-transitions"
                className="rounded-2xl border border-border bg-background p-5 shadow-sm"
              >
                <h3 className="mb-2 text-sm font-bold text-foreground">{copy.codeTransitionTitle}</h3>
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {copy.codeTransitionBody}
                </p>
                <div className="space-y-3">
                  {actRelations.map((relation) => (
                    <div
                      key={`${relation.direction}-${relation.relationType}-${relation.act.slug}`}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {getActRelationLabel(relation.relationType, relation.direction)}
                      </p>
                      <Link
                        href={withLocalePrefix(`/laws/${relation.act.slug}`, locale)}
                        className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        {relation.act.shortCode} - {relation.act.title}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      {relation.effectiveFrom ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {copy.effectiveFrom}: {new Date(relation.effectiveFrom).toLocaleDateString('en-IN')}
                        </p>
                      ) : null}
                      {relation.summary ? (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {relation.summary}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {legalAct.issueTopics.length > 0 ? (
              <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-foreground">{copy.mappedIssues}</h3>
                <div className="flex flex-wrap gap-2">
                  {legalAct.issueTopics.map((topic) => (
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
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  {copy.relatedFaqs}
                </h3>
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
              <h3 className="mb-2 text-sm font-bold">{copy.askLawyerTitle}</h3>
              <p className="text-xs text-primary-foreground/85">{copy.askLawyerBody}</p>
              <Link
                href={withLocalePrefix('/lawyers', locale)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                {copy.askLawyerAction}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

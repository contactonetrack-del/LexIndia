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
import { GUIDE_CATEGORY_REGISTRY } from '@/lib/content/guides-registry';
import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { getEditorialStatusLabel, normalizeEditorialStatus } from '@/lib/editorial-review';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import prisma from '@/lib/prisma';

type GuideCategoryDecoration = {
  icon: LucideIcon;
  toneClass: string;
  iconClass: string;
  iconBgClass: string;
};

const GUIDE_CATEGORY_DECORATIONS: Record<string, GuideCategoryDecoration> = {
  'emergency-law': {
    icon: Shield,
    toneClass: 'border-warning/30 bg-warning/10',
    iconClass: 'text-warning',
    iconBgClass: 'bg-warning/20',
  },
  'criminal-law': {
    icon: Scale,
    toneClass: 'border-danger/30 bg-danger/10',
    iconClass: 'text-danger',
    iconBgClass: 'bg-danger/20',
  },
  'family-law': {
    icon: Users,
    toneClass: 'border-accent/30 bg-accent/10',
    iconClass: 'text-accent',
    iconBgClass: 'bg-accent/20',
  },
  'property-law': {
    icon: Home,
    toneClass: 'border-primary/30 bg-primary/10',
    iconClass: 'text-primary',
    iconBgClass: 'bg-primary/15',
  },
  'consumer-law': {
    icon: ShoppingCart,
    toneClass: 'border-success/30 bg-success/10',
    iconClass: 'text-success',
    iconBgClass: 'bg-success/20',
  },
  'labour-law': {
    icon: Briefcase,
    toneClass: 'border-warning/30 bg-warning/10',
    iconClass: 'text-warning',
    iconBgClass: 'bg-warning/20',
  },
  'civil-law': {
    icon: FileText,
    toneClass: 'border-accent/30 bg-accent/10',
    iconClass: 'text-accent',
    iconBgClass: 'bg-accent/20',
  },
};

function getGuideStatusStyles(status: string, hasPublishedContent: boolean) {
  const normalizedStatus = normalizeEditorialStatus(status, hasPublishedContent ? 'APPROVED' : 'DRAFT');

  if (normalizedStatus === 'APPROVED' && hasPublishedContent) {
    return {
      label: 'Reviewed',
      className: 'border-success/30 bg-success/10 text-success',
    };
  }

  if (normalizedStatus === 'REVIEW') {
    return {
      label: getEditorialStatusLabel(normalizedStatus),
      className: 'border-warning/30 bg-warning/10 text-warning',
    };
  }

  return {
    label: hasPublishedContent ? getEditorialStatusLabel(normalizedStatus) : 'Topic in progress',
    className: 'border-border bg-surface text-muted-foreground',
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createLocalizedMetadata({
    locale,
    pathname: '/guides',
    title: `${getMemoryLocalizedText('Understand Indian law simply', locale)} | LexIndia`,
    description: getMemoryLocalizedText(
      'Plain-language legal guides for India. Reviewed guides are clearly marked, and in-progress topics are labelled before publication.',
      locale
    ),
  });
}

export default async function GuidesPage() {
  const locale = await getRequestLocale();
  const totalGuides = GUIDE_CATEGORY_REGISTRY.reduce((sum, category) => sum + category.guides.length, 0);
  const guideEntries = await prisma.guideEntry.findMany({
    where: {
      editorialStatus: {
        not: 'ARCHIVED',
      },
    },
    select: {
      slug: true,
      editorialStatus: true,
      hasPublishedContent: true,
    },
  });
  const guideEntryMap = new Map<
    string,
    { slug: string; editorialStatus: string; hasPublishedContent: boolean }
  >(guideEntries.map((entry) => [entry.slug, entry]));
  const reviewedGuideCount = guideEntries.filter(
    (entry) => entry.editorialStatus === 'APPROVED' && entry.hasPublishedContent
  ).length;

  const copy = localizeTreeFromMemory({
    badge: 'Legal guide library',
    title: 'Understand Indian law simply',
    subtitle:
      'Approved guides are reviewed by legal professionals. Topics still being drafted are clearly labelled before publication.',
    statLabel: 'reviewed guides live',
    infoLabel: 'Informational only',
    infoBody:
      'These guides explain general Indian law and are not legal advice. Use the review badges to distinguish approved guides from in-progress topics.',
    guidesLabel: 'guides',
    readLabel: 'min read',
    ctaTitle: 'Need help with your specific case?',
    ctaBody:
      'Reading a guide is the first step. Get personalised advice from a verified Indian lawyer.',
    ctaAction: 'Find a verified lawyer',
  } as const, locale);

  const localizedCategories = localizeTreeFromMemory(GUIDE_CATEGORY_REGISTRY, locale, {
    skipKeys: ['slug', 'readTime'],
  }).map((category) => ({
    ...category,
    ...(GUIDE_CATEGORY_DECORATIONS[category.slug] ?? GUIDE_CATEGORY_DECORATIONS['civil-law']),
  }));

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-gradient-to-r from-primary to-accent/80 py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-accent-foreground" />
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-foreground">{copy.badge}</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{copy.title}</h1>
          <p className="mb-6 max-w-2xl text-lg text-primary-foreground/85">{copy.subtitle}</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground">
            <span className="font-semibold">{reviewedGuideCount}</span>
            <span>
              / {totalGuides} {copy.statLabel}
            </span>
          </div>
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
                  {category.guides.map((guide) => {
                    const guideEntry = guideEntryMap.get(guide.slug);
                    const guideStatus = getGuideStatusStyles(
                      guideEntry?.editorialStatus ?? 'DRAFT',
                      guideEntry?.hasPublishedContent ?? false
                    );

                    return (
                      <Link
                        key={guide.slug}
                        href={withLocalePrefix(`/guides/${guide.slug}`, locale)}
                        className={`group rounded-xl border-2 bg-background p-5 transition-all hover:shadow-md ${category.toneClass}`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <h3 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                            {guide.title}
                          </h3>
                          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${guideStatus.className}`}>
                            {guideStatus.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {guide.readTime} {copy.readLabel}
                          </span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                      </Link>
                    );
                  })}
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

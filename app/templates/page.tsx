'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Download, FileText, Search, ShieldAlert } from 'lucide-react';

import LocaleLink from '@/components/LocaleLink';
import {
  HighlightBanner,
  PageContainer,
  PageShell,
  SurfaceCard,
} from '@/components/ui/theme-primitives';
import { getMemoryLocalizedText, localizeTemplateText } from '@/lib/content/localized';
import { getTemplatesContent } from '@/lib/content/templates';
import { formatNumber } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';
import type { TemplateAvailabilityStatus } from '@/lib/template-availability';
import type { TemplateEditorialStatus } from '@/lib/template-review';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  downloads: number;
  content: string;
  previewText?: string;
  availabilityStatus: TemplateAvailabilityStatus;
  editorialStatus: TemplateEditorialStatus;
  isReadyForDownload: boolean;
  hasPlaceholderText: boolean;
  reviewerNotes?: string | null;
  reviewedAt?: string | null;
}

export default function TemplatesPage() {
  const { fontClass, lang, t } = useLanguage();
  const content = getTemplatesContent(lang);
  const searchTemplatesLabel = t.templates.searchPlaceholder;
  const filterCategoryLabel = getMemoryLocalizedText('Filter by category', lang);
  const templateUiCopy = {
    previewOnly: getMemoryLocalizedText('Preview only', lang),
    readyToDownload: getMemoryLocalizedText('Ready to download', lang),
    editorialReviewPending: getMemoryLocalizedText('Editorial review pending', lang),
    editorialApproved: getMemoryLocalizedText('Editorially approved', lang),
    editorialDraft: getMemoryLocalizedText('Draft', lang),
    editorialArchived: getMemoryLocalizedText('Archived', lang),
    lawyerDraftCta: getMemoryLocalizedText('Request lawyer draft', lang),
    textDownloadLabel: getMemoryLocalizedText('Download TXT', lang),
    previewNotice: getMemoryLocalizedText(
      'This entry is still a sample placeholder. Use a verified lawyer for a custom draft or reviewed version.',
      lang
    ),
  };

  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('locale', lang);

    if (searchQuery) params.set('search', searchQuery);
    if (activeCategory !== 'All') params.set('category', activeCategory);

    fetch(`/api/templates?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setTemplates(data.templates || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [activeCategory, lang, searchQuery]);

  const formatDownloads = (downloads: number) => {
    return formatNumber(downloads, lang, {
      notation: downloads >= 1000 ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    });
  };

  const getEditorialLabel = (status: TemplateEditorialStatus) => {
    if (status === 'APPROVED') return templateUiCopy.editorialApproved;
    if (status === 'DRAFT') return templateUiCopy.editorialDraft;
    if (status === 'ARCHIVED') return templateUiCopy.editorialArchived;
    return templateUiCopy.editorialReviewPending;
  };

  return (
    <PageShell>
      <PageContainer className="max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${fontClass}`}>
            {t.templates.title}
          </h1>
          <p className={`mx-auto max-w-2xl text-lg text-muted-foreground ${fontClass}`}>
            {t.templates.subtitle}
          </p>
        </div>

        <div className="relative mx-auto mb-6 max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="template-search" className="sr-only">
            {searchTemplatesLabel}
          </label>
          <input
            id="template-search"
            type="text"
            placeholder={t.templates.searchPlaceholder}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={`w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-foreground outline-none shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${fontClass}`}
          />
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label={filterCategoryLabel}>
          {content.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              aria-pressed={activeCategory === category.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'border border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground'} ${fontClass}`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="mb-8 rounded-xl border border-warning/30 bg-warning/10 p-4 text-warning">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p className={`text-sm ${fontClass}`}>
              <strong>{content.disclaimer.title}</strong> {content.disclaimer.body}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <SurfaceCard key={index} className="animate-pulse rounded-2xl p-6">
                <div className="mb-4 flex justify-between">
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                  <div className="h-6 w-16 rounded bg-muted" />
                </div>
                <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="mt-1 h-4 w-5/6 rounded bg-muted" />
              </SurfaceCard>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <SurfaceCard className="rounded-2xl p-12 text-center">
            <p className={`text-muted-foreground ${fontClass}`}>
              {t.common.noResults}
              {searchQuery ? ` "${searchQuery}"` : ''}
            </p>
          </SurfaceCard>
        ) : (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {templates.map((template) => (
              <SurfaceCard
                key={template.id}
                className="flex h-full flex-col rounded-2xl p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground ${fontClass}`}>
                      {template.category}
                    </span>
                    <span className={`rounded-md bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground ${fontClass}`}>
                      {getEditorialLabel(template.editorialStatus)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        template.isReadyForDownload
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      } ${fontClass}`}
                    >
                      {template.isReadyForDownload
                        ? templateUiCopy.readyToDownload
                        : templateUiCopy.previewOnly}
                    </span>
                  </div>
                </div>

                <h3 className={`mb-2 text-xl font-bold text-foreground ${fontClass}`}>{template.title}</h3>
                <p className={`mb-6 flex-1 text-sm text-muted-foreground ${fontClass}`}>
                  {template.description}
                </p>

                {!template.isReadyForDownload ? (
                  <div className="mb-6 rounded-xl border border-warning/30 bg-warning/10 p-3">
                    <p className={`text-xs leading-relaxed text-warning ${fontClass}`}>
                      <strong>{templateUiCopy.editorialReviewPending}:</strong>{' '}
                      {templateUiCopy.previewNotice}
                    </p>
                    {template.reviewerNotes ? (
                      <p className={`mt-2 text-xs leading-relaxed text-warning/90 ${fontClass}`}>
                        {template.reviewerNotes}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  {template.isReadyForDownload ? (
                    <>
                      <span className={`flex items-center gap-1 text-xs text-muted-foreground ${fontClass}`}>
                        <Download className="h-3 w-3" />
                        {formatDownloads(template.downloads)} {content.downloadsLabel}
                      </span>
                      <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(template.content || `# ${template.title}\n\n${template.description}`)}`}
                        download={`${template.id}-template.txt`}
                        aria-label={localizeTemplateText('Download {title} as text file', lang, {
                          title: template.title,
                        })}
                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 ${fontClass}`}
                      >
                        <Download className="h-4 w-4" />
                        {templateUiCopy.textDownloadLabel}
                      </a>
                    </>
                  ) : (
                    <>
                      <span className={`text-xs text-muted-foreground ${fontClass}`}>
                        {templateUiCopy.editorialReviewPending}
                      </span>
                      <LocaleLink
                        href="/lawyers"
                        className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 ${fontClass}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                        {templateUiCopy.lawyerDraftCta}
                      </LocaleLink>
                    </>
                  )}
                </div>
              </SurfaceCard>
            ))}
          </div>
        )}

        <HighlightBanner className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className={`mb-2 text-2xl font-bold text-foreground ${fontClass}`}>
              {content.upsell.title}
            </h2>
            <p className={`text-muted-foreground ${fontClass}`}>{content.upsell.description}</p>
          </div>
          <LocaleLink
            href="/lawyers"
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground transition-colors hover:opacity-90 ${fontClass}`}
          >
            {content.upsell.button}
            <ArrowRight className="h-5 w-5" />
          </LocaleLink>
        </HighlightBanner>
      </PageContainer>
    </PageShell>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Landmark,
  Scale,
  Search,
  Shield,
  Smartphone,
} from 'lucide-react';

import LocaleLink from '@/components/LocaleLink';
import { ConsultationCTA } from '@/components/ui/ConsultationCTA';
import { FAQSkeleton } from '@/components/ui/Skeletons';
import { LeadCapture } from '@/components/ui/LeadCapture';
import {
  HighlightBanner,
  PageContainer,
  PageShell,
  SurfaceCard,
} from '@/components/ui/theme-primitives';
import { getKnowledgeContent } from '@/lib/content/knowledge';
import { useLanguage } from '@/lib/LanguageContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  faqs: FAQ[];
}

const RESOURCE_ICONS = [Landmark, Smartphone];

export default function KnowledgeBase() {
  const { fontClass, lang, t } = useLanguage();
  const content = getKnowledgeContent(lang);
  const searchAriaLabel = t.knowledge.searchPlaceholder;

  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`/api/knowledge?locale=${lang}`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [lang]);

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      faqs: searchQuery
        ? category.faqs.filter((faq) => {
            const normalizedQuery = searchQuery.toLowerCase();
            return (
              faq.question.toLowerCase().includes(normalizedQuery) ||
              faq.answer.toLowerCase().includes(normalizedQuery)
            );
          })
        : category.faqs,
    }))
    .filter((category) => category.faqs.length > 0);

  return (
    <PageShell>
      <PageContainer className="max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className={`mb-4 text-3xl font-bold text-foreground md:text-4xl ${fontClass}`}>
            {t.knowledge.title}
          </h1>
          <p className={`mx-auto mb-8 max-w-3xl text-lg text-muted-foreground ${fontClass}`}>
            {t.knowledge.subtitle}
          </p>

          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <label htmlFor="knowledge-search" className="sr-only">
              {searchAriaLabel}
            </label>
            <input
              id="knowledge-search"
              type="text"
              placeholder={t.knowledge.searchPlaceholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={`w-full rounded-xl border border-border bg-background py-4 pl-12 pr-4 text-lg text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${fontClass}`}
            />
          </div>
        </div>

        <HighlightBanner className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h2 className={`mb-1 text-lg font-bold text-foreground ${fontClass}`}>
                {content.freeAid.title}
              </h2>
              <p className={`text-sm text-muted-foreground ${fontClass}`}>
                {content.freeAid.description}
              </p>
            </div>
          </div>
          <a
            href={content.freeAid.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 ${fontClass}`}
          >
            {content.freeAid.button}
            <ExternalLink className="h-4 w-4" />
          </a>
        </HighlightBanner>

        <ConsultationCTA
          title={content.cta.title}
          description={content.cta.description}
          buttonText={content.cta.button}
        />

        <div className="mb-12">
          <h2 className={`mb-6 text-2xl font-bold text-foreground ${fontClass}`}>
            {content.officialResourcesTitle}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {content.officialResources.map((resource, index) => {
              const Icon = RESOURCE_ICONS[index] ?? BookOpen;

              return (
                <SurfaceCard
                  key={resource.id}
                  className="group rounded-2xl p-6 transition-colors hover:border-primary/30"
                >
                  <a href={resource.href} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className={`mb-2 flex items-center gap-2 text-lg font-bold text-foreground ${fontClass}`}>
                      {resource.title}
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </h3>
                    <p className={`text-sm text-muted-foreground ${fontClass}`}>
                      {resource.description}
                    </p>
                  </a>
                </SurfaceCard>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <FAQSkeleton />
          ) : filteredCategories.length === 0 ? (
            <SurfaceCard className="rounded-2xl p-12 text-center">
              <p className={`mb-4 text-muted-foreground ${fontClass}`}>
                {searchQuery ? `${t.common.noResults} "${searchQuery}"` : t.common.noResults}
              </p>
              <LocaleLink
                href="/lawyers"
                className={`inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 ${fontClass}`}
              >
                {content.emptyState.button}
              </LocaleLink>
            </SurfaceCard>
          ) : (
            filteredCategories.map((section, index) => {
              const Icon = RESOURCE_ICONS[index] ?? Shield;

              return (
                <SurfaceCard key={section.id} className="overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-border bg-surface px-6 py-4">
                    <Icon className="h-6 w-6 text-primary" />
                    <h2 className={`text-xl font-bold text-foreground ${fontClass}`}>{section.name}</h2>
                  </div>
                  <div className="divide-y divide-border">
                    {section.faqs.map((item) => {
                      const isOpen = openQ === item.id;

                      return (
                        <div key={item.id} className="px-6 py-4">
                          <button
                            onClick={() => setOpenQ(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <h3 className={`pr-4 text-lg font-medium text-foreground ${fontClass}`}>
                              {item.question}
                            </h3>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                            )}
                          </button>
                          {isOpen && (
                            <div className={`mt-4 leading-relaxed text-muted-foreground ${fontClass}`}>
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SurfaceCard>
              );
            })
          )}
        </div>

        <div className="mb-8 mt-16">
          <LeadCapture />
        </div>

        <div className="mt-12 text-center">
          <p className={`mb-4 text-muted-foreground ${fontClass}`}>{content.emptyState.title}</p>
          <LocaleLink
            href="/lawyers"
            className={`inline-flex rounded-xl bg-accent px-8 py-3 font-bold text-accent-foreground transition-colors hover:opacity-90 ${fontClass}`}
          >
            {content.emptyState.button}
          </LocaleLink>
        </div>
      </PageContainer>
    </PageShell>
  );
}

'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import {
  Award,
  CheckCircle,
  ChevronDown,
  Clock,
  Filter,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Star,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import LocaleLink from '@/components/LocaleLink';
import { LawyersGridSkeleton } from '@/components/ui/Skeletons';
import { useLanguage } from '@/lib/LanguageContext';
import { getBookingCopy } from '@/lib/content/booking';
import {
  formatLawyerCompactExperience,
  formatLawyerCurrency,
  getLawyerDirectoryCopy,
} from '@/lib/content/lawyers';
import { getTranslation } from '@/lib/translations';

interface Lawyer {
  id: string;
  city: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  isVerified: boolean;
  subscriptionTier: string;
  user: { name: string | null; image: string | null; email: string | null };
  languages: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
  modes: { id: string; mode: string }[];
}

function LawyersContent() {
  const { lang, fontClass } = useLanguage();
  const t = getTranslation(lang);
  const bookingCopy = getBookingCopy(lang);
  const searchParams = useSearchParams();
  const specializationLabel = t.dashboard.specializations.replace(/:$/, '');
  const verificationLabel = t.dashboard.statsVerified;
  const copy = getLawyerDirectoryCopy(lang);

  const specializationOptions = [
    { value: 'Criminal Law', label: t.categories.c1 },
    { value: 'Family Law', label: t.categories.c2 },
    { value: 'Property Law', label: t.categories.c3 },
    { value: 'Corporate Law', label: t.categories.c4 },
    { value: 'Civil Law', label: t.categories.c5 },
    { value: 'Cyber Law', label: t.categories.c6 },
  ];

  const sortOptions = [
    { value: 'rating', label: t.lawyersPage.rating },
    { value: 'fee_asc', label: t.lawyersPage.fees },
    { value: 'experience', label: t.lawyersPage.experience },
  ];

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchLaw, setSearchLaw] = useState(searchParams.get('q') || '');
  const [searchCity, setSearchCity] = useState(searchParams.get('loc') || '');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('rating');

  const fetchLawyers = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set('locale', lang);
    if (searchLaw) params.set('search', searchLaw);
    if (searchCity) params.set('city', searchCity);
    if (selectedSpec) params.set('specialization', selectedSpec);
    if (verifiedOnly) params.set('verified', 'true');

    try {
      const response = await fetch(`/api/lawyers?${params.toString()}`);
      const data = await response.json();
      const results: Lawyer[] = data.lawyers || [];

      if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
      else if (sort === 'fee_asc') results.sort((a, b) => a.consultationFee - b.consultationFee);
      else if (sort === 'experience') results.sort((a, b) => b.experienceYears - a.experienceYears);

      setLawyers(results);
    } catch (error) {
      console.error('Failed to fetch lawyers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [lang, searchCity, searchLaw, selectedSpec, sort, verifiedOnly]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const clearFilters = () => {
    setSelectedSpec('');
    setVerifiedOnly(false);
  };

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className={`mb-6 text-3xl font-bold text-foreground ${fontClass}`}>
            {t.categories.title}
          </h1>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              fetchLawyers();
            }}
            className="flex flex-col gap-2 rounded-xl border border-border bg-background p-2 shadow-sm sm:flex-row"
          >
            <div className="flex flex-1 items-center rounded-lg border border-border bg-surface px-4 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <Search className="h-5 w-5 text-muted-foreground" />
              <label htmlFor="search-law" className="sr-only">
                {t.common.search}
              </label>
              <input
                id="search-law"
                type="text"
                value={searchLaw}
                onChange={(event) => setSearchLaw(event.target.value)}
                placeholder={t.hero.searchLaw}
                className={`w-full border-none bg-transparent px-3 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 ${fontClass}`}
              />
            </div>
            <div className="flex flex-1 items-center rounded-lg border border-border bg-surface px-4 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <label htmlFor="search-city" className="sr-only">
                {t.lawyersPage.location}
              </label>
              <input
                id="search-city"
                type="text"
                value={searchCity}
                onChange={(event) => setSearchCity(event.target.value)}
                placeholder={t.hero.searchCity}
                className={`w-full border-none bg-transparent px-3 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 ${fontClass}`}
              />
            </div>
            <button
              type="submit"
              className={`whitespace-nowrap rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 ${fontClass}`}
            >
              {t.hero.searchBtn}
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <button
            aria-expanded={isMobileFilterOpen}
            aria-controls="filter-panel"
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 font-medium text-muted-foreground lg:hidden"
            onClick={() => setIsMobileFilterOpen((open) => !open)}
          >
            <Filter className="h-5 w-5" />
            {t.lawyersPage.filters} {selectedSpec || verifiedOnly ? `(${copy.activeState})` : ''}
          </button>

          <aside
            id="filter-panel"
            className={`lg:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}
            aria-label={t.lawyersPage.filters}
          >
            <div className="sticky top-24 rounded-xl border border-border bg-background p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">{t.lawyersPage.filters}</h2>
                <button
                  onClick={clearFilters}
                  className={`text-sm font-medium text-primary hover:underline ${fontClass}`}
                >
                  {t.lawyersPage.clearFilters}
                </button>
              </div>

              <div className="mb-6">
                <h3 className={`mb-3 font-semibold text-foreground ${fontClass}`}>
                  {specializationLabel}
                </h3>
                <div className="space-y-2">
                  {specializationOptions.map((spec) => (
                    <label key={spec.value} className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSpec === spec.value}
                        onChange={() => setSelectedSpec(selectedSpec === spec.value ? '' : spec.value)}
                        className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className={`text-sm text-muted-foreground ${fontClass}`}>{spec.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`mb-3 font-semibold text-foreground ${fontClass}`}>
                  {verificationLabel}
                </h3>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={() => setVerifiedOnly((value) => !value)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {t.lawyersPage.verifiedOnly}
                  </span>
                </label>
              </div>
            </div>
          </aside>

          <div className="space-y-6 lg:w-3/4">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-medium text-muted-foreground">
                {isLoading ? t.common.loading : `${lawyers.length} ${t.categories.lawyers}`}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="sr-only">
                  {t.common.sort}
                </label>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:ring-primary"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <LawyersGridSkeleton count={4} />
            ) : lawyers.length === 0 ? (
              <div className="rounded-xl border border-border bg-background p-12 text-center">
                <h3 className={`mb-2 text-xl font-bold text-foreground ${fontClass}`}>
                  {t.lawyersPage.noLawyers}
                </h3>
                <p className={`text-sm text-muted-foreground ${fontClass}`}>{copy.noLawyersBody}</p>
                <button
                  onClick={clearFilters}
                  className={`mt-4 font-medium text-primary hover:underline ${fontClass}`}
                >
                  {t.lawyersPage.clearFilters}
                </button>
              </div>
            ) : (
              lawyers.map((lawyer) => (
                <article
                  key={lawyer.id}
                  className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 transition-shadow hover:shadow-md sm:flex-row"
                >
                  <div className="flex gap-4 sm:w-2/3">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                      {lawyer.user.image ? (
                        <Image
                          src={lawyer.user.image}
                          alt={lawyer.user.name ?? copy.defaultImageAlt}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                          {(lawyer.user.name ?? 'L')[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-xl font-bold text-foreground">{lawyer.user.name}</h3>
                        {lawyer.isVerified && (
                          <CheckCircle className="h-5 w-5 text-success" aria-label={copy.verifiedLawyerAria} />
                        )}
                        {lawyer.subscriptionTier === 'ELITE' && (
                          <span
                            className="flex items-center gap-1 rounded bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-xs font-bold text-primary-foreground shadow-sm"
                            title={copy.eliteTitle}
                          >
                            <Award className="h-3.5 w-3.5" />
                            {copy.eliteBadge}
                          </span>
                        )}
                        {lawyer.subscriptionTier === 'PRO' && (
                          <span
                            className="flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground shadow-sm"
                            title={copy.proTitle}
                          >
                            <Award className="h-3.5 w-3.5" />
                            {copy.proBadge}
                          </span>
                        )}
                      </div>
                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {lawyer.city || copy.emptyValue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {lawyer.experienceYears
                            ? formatLawyerCompactExperience(lawyer.experienceYears, lang)
                            : copy.emptyValue}
                        </span>
                      </div>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {lawyer.specializations?.length > 0 ? (
                          lawyer.specializations.map((spec) => (
                            <span key={spec.id} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                              {spec.name}
                            </span>
                          ))
                        ) : null}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className={`font-medium ${fontClass}`}>
                          {t.lawyersPage.languages}:
                        </span>{' '}
                        {lawyer.languages?.length > 0
                          ? lawyer.languages.map((entry) => entry.name).join(', ')
                          : copy.emptyValue}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between border-t border-border pt-4 sm:w-1/3 sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <div className="mb-4 flex flex-col sm:items-end">
                      <div className="mb-2 flex items-center gap-1 rounded bg-success/10 px-2 py-1 text-sm font-bold text-success">
                        <Star className="h-4 w-4 fill-current" />
                        {lawyer.rating.toFixed(1)}
                        <span className="ml-1 font-normal text-success/80">({lawyer.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {lawyer.consultationFee > 0 ? (
                          <>
                            <span className="text-lg font-medium text-muted-foreground line-through">
                              {formatLawyerCurrency(lawyer.consultationFee, lang)}
                            </span>
                            <span className="text-2xl font-bold text-success">{formatLawyerCurrency(0, lang)}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold tracking-tight text-foreground">{formatLawyerCurrency(0, lang)}</span>
                        )}
                      </div>
                      <div className="mt-1 rounded bg-success/10 px-2 py-1 text-xs font-bold text-success">
                        {bookingCopy.firstConsultationFree}
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <div className="mb-2 flex justify-center gap-3" aria-label={copy.availableConsultationModes}>
                        {lawyer.modes.some((mode) => mode.mode === 'VIDEO') && (
                          <Video className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        )}
                        {lawyer.modes.some((mode) => mode.mode === 'CALL') && (
                          <Phone className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        )}
                        {lawyer.modes.some((mode) => mode.mode === 'CHAT') && (
                          <MessageSquare className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        )}
                      </div>
                      <LocaleLink
                        href={`/lawyers/${lawyer.id}`}
                        className="block w-full rounded-lg border border-primary py-2.5 text-center font-semibold text-primary transition-colors hover:bg-primary/10"
                      >
                        {t.lawyersPage.viewProfile}
                      </LocaleLink>
                      <LocaleLink
                        href={`/book/${lawyer.id}`}
                        className="block w-full rounded-lg bg-primary py-2.5 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {t.lawyersPage.bookConsultation}
                      </LocaleLink>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LawyersDirectory() {
  return (
    <Suspense fallback={<LawyersGridSkeleton count={4} />}>
      <LawyersContent />
    </Suspense>
  );
}



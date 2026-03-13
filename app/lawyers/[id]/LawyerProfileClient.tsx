'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Star,
  Video,
} from 'lucide-react';

import LocaleLink from '@/components/LocaleLink';
import { useLanguage } from '@/lib/LanguageContext';
import { getBookingCopy } from '@/lib/content/booking';
import {
  formatLawyerConsultationCount,
  formatLawyerCurrency,
  formatLawyerLongExperience,
  getLawyerModeLabel,
  getLawyerProfileCopy,
} from '@/lib/content/lawyers';

interface LawyerDetail {
  id: string;
  city: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  isVerified: boolean;
  barCouncilID: string | null;
  bio: string | null;
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
    createdAt: string;
  };
  languages: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
  modes: { id: string; mode: string }[];
  appointments: { id: string }[];
}

const MODE_ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  VIDEO: Video,
  CALL: Phone,
  CHAT: MessageSquare,
};

export default function LawyerProfileClient({ id }: { id: string }) {
  const { lang, t } = useLanguage();
  const [lawyer, setLawyer] = useState<LawyerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const copy = getLawyerProfileCopy(lang);
  const bookingCopy = getBookingCopy(lang);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`/api/lawyers/${id}?locale=${lang}`);
        if (cancelled) return;

        if (response.status === 404) {
          setError('not_found');
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          setError('fetch_error');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (!cancelled) {
          setLawyer(data.lawyer);
          setIsLoading(false);
          fetch(`/api/lawyers/${id}/view`, { method: 'POST' }).catch(console.error);
        }
      } catch {
        if (!cancelled) {
          setError('fetch_error');
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, lang]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error === 'not_found' || (!lawyer && !error)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-warning" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.notFoundTitle}</h1>
        <p className="mb-6 text-muted-foreground">{copy.notFoundBody}</p>
        <LocaleLink
          href="/lawyers"
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {copy.seeAllLawyers}
        </LocaleLink>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-danger" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.errorTitle}</h1>
        <p className="mb-6 text-muted-foreground">{copy.errorBody}</p>
        <LocaleLink
          href="/lawyers"
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {copy.backToLawyers}
        </LocaleLink>
      </div>
    );
  }

  const lawyerDetails = lawyer as LawyerDetail;
  const completedConsultations = lawyerDetails.appointments?.length ?? 0;
  const memberSince = new Date(lawyerDetails.user.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-muted">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          <LocaleLink
            href="/lawyers"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.backToLawyers}
          </LocaleLink>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted sm:h-28 sm:w-28">
                  {lawyerDetails.user.image ? (
                    <Image
                      src={lawyerDetails.user.image}
                      alt={lawyerDetails.user.name ?? copy.defaultImageAlt}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-3xl font-bold text-primary-foreground">
                      {(lawyerDetails.user.name ?? 'L')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground">{lawyerDetails.user.name}</h1>
                    {lawyerDetails.isVerified && (
                      <span className="flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {t.dashboard.statsVerified}
                      </span>
                    )}
                  </div>

                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {lawyerDetails.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatLawyerLongExperience(lawyerDetails.experienceYears, lang)}
                    </span>
                    <span>
                      {copy.memberSincePrefix} {memberSince}
                    </span>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    {lawyerDetails.specializations?.length > 0 ? (
                      lawyerDetails.specializations.map((specialization) => (
                        <span
                          key={specialization.id}
                          className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {specialization.name}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium italic text-muted-foreground">
                        {copy.specialtyNotSpecified}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 font-bold text-success">
                      <Star className="h-4 w-4 fill-current" />
                      {lawyerDetails.rating.toFixed(1)}
                      <span className="ml-1 font-normal text-muted-foreground">
                        ({lawyerDetails.reviewCount} {t.lawyersPage.reviews})
                      </span>
                    </div>
                    {completedConsultations > 0 && (
                      <span className="text-muted-foreground">
                        {formatLawyerConsultationCount(completedConsultations, lang)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-bold text-foreground">{copy.about}</h2>
              {lawyerDetails.bio ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{lawyerDetails.bio}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">{copy.noBio}</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t.lawyersPage.languages}</h2>
              <div className="flex flex-wrap gap-2">
                {lawyerDetails.languages.length > 0 ? (
                  lawyerDetails.languages.map((language) => (
                    <span
                      key={language.id}
                      className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground"
                    >
                      {language.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm italic text-muted-foreground">{copy.notListed}</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">{copy.consultationModes}</h2>
              <div className="space-y-3">
                {lawyerDetails.modes.length > 0 ? (
                  lawyerDetails.modes.map((mode) => {
                    const ModeIcon = MODE_ICON_COMPONENTS[mode.mode] ?? MessageSquare;

                    return (
                      <div key={mode.id} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ModeIcon className="h-4 w-4" />
                        </div>
                        {getLawyerModeLabel(mode.mode, lang)}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm italic text-muted-foreground">{copy.modesNotSpecified}</span>
                )}
              </div>
            </div>

            {lawyerDetails.isVerified && (
              <div className="rounded-2xl border border-success/30 bg-success/10 p-6">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <div>
                    <h3 className="mb-1 font-bold text-success">{copy.verifiedLawyerTitle}</h3>
                    <p className="text-sm leading-relaxed text-success/90">
                      {copy.verifiedLawyerBody}
                      {lawyerDetails.barCouncilID && (
                        <span className="mt-1 block">
                          {copy.barCouncilId}: <strong>{lawyerDetails.barCouncilID}</strong>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-warning/30 bg-warning/10 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-xs leading-relaxed text-warning">{copy.legalWarning}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm lg:sticky lg:top-24">
              <div className="mb-5 text-center">
                {lawyerDetails.consultationFee > 0 ? (
                  <>
                    <div className="text-3xl font-bold text-foreground">
                      {formatLawyerCurrency(lawyerDetails.consultationFee, lang)}
                    </div>
                    <div className="text-sm text-muted-foreground">{copy.perConsultation}</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-success">{bookingCopy.free}</div>
                    <div className="text-sm text-muted-foreground">{copy.firstConsultation}</div>
                  </>
                )}
              </div>

              <LocaleLink
                href={`/book/${lawyerDetails.id}`}
                className="mb-3 block w-full rounded-xl bg-primary py-3.5 text-center font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.lawyersPage.bookConsultation}
              </LocaleLink>

              <p className="mb-5 text-center text-xs text-muted-foreground">
                {bookingCopy.securePaymentNote}
              </p>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.lawyersPage.rating}</span>
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-current text-warning" />
                    {lawyerDetails.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.lawyersPage.experience}</span>
                  <span className="font-semibold text-foreground">
                    {lawyerDetails.experienceYears
                      ? formatLawyerLongExperience(lawyerDetails.experienceYears, lang)
                      : copy.notListed}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.lawyersPage.location}</span>
                  <span className="font-semibold text-foreground">{lawyerDetails.city || copy.notListed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.dashboard.statsVerified}</span>
                  <span
                    className={`font-semibold ${
                      lawyerDetails.isVerified ? 'text-success' : 'text-muted-foreground'
                    }`}
                  >
                    {lawyerDetails.isVerified ? t.dashboard.statsVerified : copy.pending}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <BookOpen className="mb-2 h-5 w-5 text-accent" />
              <h3 className="mb-1 text-sm font-bold text-foreground">{copy.needToCompare}</h3>
              <p className="mb-3 text-xs text-muted-foreground">{copy.compareBody}</p>
              <LocaleLink
                href="/lawyers"
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {copy.seeAllLawyers}
                <ExternalLink className="h-3 w-3" />
              </LocaleLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

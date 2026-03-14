'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Loader2,
  MessageSquare,
  Phone,
  ShieldCheck,
  Upload,
  User,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

import LocaleLink from '@/components/LocaleLink';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import { formatCurrency as formatLocalizedCurrency, formatDateTime, formatTime } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';
import { getBookingCopy, getBookingDisplayLocale } from '@/lib/content/booking';

interface LawyerInfo {
  id: string;
  consultationFee: number;
  isVerified: boolean;
  user: { name: string | null; image: string | null };
  specializations: { name: string }[];
  modes: { mode: string }[];
}
const MODE_ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  VIDEO: Video,
  CALL: Phone,
  CHAT: MessageSquare,
  IN_PERSON: User,
};

function withTime(dateStr: string, timeSlot: string) {
  const [hour, min] = timeSlot.split(':').map(Number);
  const date = new Date(`${dateStr}T00:00:00`);
  date.setHours(hour, min, 0, 0);
  return date;
}

function buildDateTime(dateStr: string, timeSlot: string): string {
  const date = withTime(dateStr, timeSlot);
  return date.toISOString();
}

function formatTimeSlot(timeSlot: string, locale: string) {
  return formatTime(withTime('2000-01-01', timeSlot), locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatSchedule(dateStr: string, timeSlot: string, locale: string) {
  return formatDateTime(withTime(dateStr, timeSlot), locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number, locale: string) {
  return formatLocalizedCurrency(amount, locale);
}

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as Window & { Razorpay?: unknown }).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function BookingPageClient({ lawyerId }: { lawyerId: string }) {
  const { lang, t } = useLanguage();
  const { data: session, status: sessionStatus } = useSession();
  const copy = getBookingCopy(lang);
  const bookingUiCopy = localizeTreeFromMemory(
    {
      paymentDescription: 'Book a consultation with {name}',
      confirmBooking: 'Confirm and continue to payment',
      verifiedLawyer: 'Verified lawyer',
      loadingSlots: 'Loading available slots...',
      blockedDate: 'This lawyer is unavailable on the selected date. Please choose another day.',
      noSlots: 'No slots are available on this date. Please choose another day.',
      slotsUnavailable: 'Unable to load this lawyer availability right now.',
    } as const,
    lang
  );
  const displayLocale = getBookingDisplayLocale(lang);

  const [lawyer, setLawyer] = useState<LawyerInfo | null>(null);
  const [lawyerLoading, setLawyerLoading] = useState(true);
  const [lawyerError, setLawyerError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [issueDesc, setIssueDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    id: string;
    date: string;
    mode: string;
  } | null>(null);

  const loadLawyer = useCallback(async () => {
    if (!lawyerId) {
      setLawyerError('not_found');
      setLawyerLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/lawyers/${lawyerId}?locale=${lang}`);
      if (response.status === 404) {
        setLawyerError('not_found');
        return;
      }
      if (!response.ok) throw new Error('fetch_failed');

      const data = await response.json();
      setLawyer(data.lawyer);
    } catch {
      setLawyerError('fetch_failed');
    } finally {
      setLawyerLoading(false);
    }
  }, [lang, lawyerId]);

  useEffect(() => {
    loadLawyer();
  }, [loadLawyer]);

  useEffect(() => {
    if (!selectedDate || !lawyerId) {
      setAvailableSlots([]);
      setAvailabilityError(null);
      return;
    }

    let cancelled = false;

    const loadAvailability = async () => {
      setAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const response = await fetch(`/api/lawyers/${lawyerId}/availability?date=${selectedDate}`, {
          headers: {
            [REQUEST_LOCALE_HEADER]: lang,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? bookingUiCopy.slotsUnavailable);
        }

        if (!cancelled) {
          const nextSlots = Array.isArray(data.availableSlots) ? data.availableSlots : [];
          setAvailableSlots(nextSlots);
          setSelectedTime((current) => (nextSlots.includes(current) ? current : ''));
          if (data.isBlockedDate) {
            setAvailabilityError(bookingUiCopy.blockedDate);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setAvailableSlots([]);
          setAvailabilityError(
            error instanceof Error ? error.message : bookingUiCopy.slotsUnavailable
          );
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    };

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [bookingUiCopy.blockedDate, bookingUiCopy.slotsUnavailable, lang, lawyerId, selectedDate]);

  const total = lawyer ? lawyer.consultationFee : 0;

  const handleConfirmBooking = async () => {
    if (!session?.user || !lawyer) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const isoDate = buildDateTime(selectedDate, selectedTime);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({
          lawyerId: lawyer.id,
          date: isoDate,
          mode: selectedMode,
          notes: issueDesc,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        setSubmitError(copy.slotTaken);
        toast.error(copy.slotTaken);
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        const message = t.common.error;
        setSubmitError(message);
        toast.error(message);
        setIsSubmitting(false);
        return;
      }

      const { appointment, razorpayOrderId, amount, currency } = data;

      if (razorpayOrderId) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          setSubmitError(copy.paymentLoadFailed);
          toast.error(copy.paymentLoadFailed);
          setIsSubmitting(false);
          return;
        }

        const rootStyles = getComputedStyle(document.documentElement);
        const primaryToken = rootStyles.getPropertyValue('--primary').trim() || '221 64% 33%';
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SPdmB9aXnSTcC5',
          amount,
          currency,
          name: 'LexIndia',
          description: bookingUiCopy.paymentDescription.replace(
            '{name}',
            lawyer.user.name ?? copy.legalExpert
          ),
          order_id: razorpayOrderId,
          handler: async (paymentResponse: any) => {
            toast.loading(t.common.loading, { id: 'payment-verify' });
            try {
              const verifyResponse = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  [REQUEST_LOCALE_HEADER]: lang,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              });

              if (verifyResponse.ok) {
                setConfirmedAppointment({
                  id: appointment.id,
                  date: formatSchedule(selectedDate, selectedTime, displayLocale),
                  mode: selectedMode,
                });
                setStep(4);
                toast.success(copy.confirmedTitle, { id: 'payment-verify' });
              } else {
                toast.error(copy.paymentVerifyFailed, { id: 'payment-verify' });
              }
            } catch {
              toast.error(t.common.error, { id: 'payment-verify' });
            }
          },
          prefill: {
            name: session.user.name,
            email: session.user.email,
          },
          theme: { color: `hsl(${primaryToken})` },
        };

        const razorpay = new ((window as unknown as Window & { Razorpay: any }).Razorpay)(options);
        razorpay.on('payment.failed', () => {
          toast.error(t.common.error);
        });
        razorpay.open();
        setIsSubmitting(false);
        return;
      }

      setConfirmedAppointment({
        id: appointment.id,
        date: formatSchedule(selectedDate, selectedTime, displayLocale),
        mode: selectedMode,
      });
      setStep(4);
      toast.success(copy.confirmedTitle);
      setIsSubmitting(false);
    } catch {
      setSubmitError(copy.networkError);
      toast.error(copy.networkError);
      setIsSubmitting(false);
    }
  };

  if (lawyerLoading || sessionStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (lawyerError === 'not_found' || !lawyer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-warning" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.lawyerNotFoundTitle}</h1>
        <LocaleLink
          href="/lawyers"
          className="mt-4 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t.nav.lawyers}
        </LocaleLink>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4 text-center">
        <User className="mb-4 h-12 w-12 text-primary" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.signInTitle}</h1>
        <p className="mb-6 text-muted-foreground">{copy.signInBody}</p>
        <LocaleLink
          href="/"
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t.auth.loginBtn}
        </LocaleLink>
      </div>
    );
  }

  if (step === 4 && confirmedAppointment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">{copy.confirmedTitle}</h2>
          <p className="mb-8 text-muted-foreground">{copy.confirmedMessage}</p>
          <div className="mb-8 space-y-2 rounded-xl bg-surface p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{copy.modeLabel}</span>
              <span className="font-medium text-foreground">
                {copy.modes[confirmedAppointment.mode as keyof typeof copy.modes] ?? confirmedAppointment.mode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{copy.amountLabel}</span>
              <span className="font-medium text-foreground">{formatCurrency(total, displayLocale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{copy.bookingIdLabel}</span>
              <span className="text-xs font-medium text-foreground">
                {confirmedAppointment.id.slice(0, 16)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{copy.scheduleLabel}</span>
              <span className="font-medium text-foreground">{confirmedAppointment.date}</span>
            </div>
          </div>
          <LocaleLink
            href="/dashboard/citizen"
            className="block w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {copy.goToDashboard}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const availableModes = lawyer.modes.map((mode) => mode.mode);

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => (step > 1 ? setStep((value) => value - 1) : window.history.back())}
            className="rounded-full bg-surface p-2 shadow-sm transition-colors hover:bg-surface-hover"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t.lawyersPage.bookConsultation}</h1>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex justify-between">
            {copy.steps.map((label, index) => (
              <span
                key={label}
                className={`text-sm font-medium ${step >= index + 1 ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="h-2 w-full rounded-full bg-border">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          <div className="flex items-center gap-4 border-b border-border bg-primary p-6 text-primary-foreground">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary-foreground/20 bg-primary/80">
              {lawyer.user.image ? (
                <Image
                  src={lawyer.user.image}
                  alt={lawyer.user.name ?? copy.legalExpert}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl font-bold">{(lawyer.user.name ?? 'L')[0]}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{lawyer.user.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-primary-foreground/80">
                <span>{lawyer.specializations[0]?.name ?? copy.legalExpert}</span>
                <span>&bull;</span>
                <span className="font-semibold text-primary-foreground">
                  {formatCurrency(lawyer.consultationFee, displayLocale)}
                </span>
                {lawyer.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded border border-success/30 bg-success/20 px-2 py-0.5 text-xs font-bold text-success">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {bookingUiCopy.verifiedLawyer}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">{copy.selectMode}</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {availableModes.map((mode) => {
                      const ModeIcon = MODE_ICON_COMPONENTS[mode] ?? MessageSquare;

                      return (
                        <button
                          key={mode}
                          data-testid={`booking-mode-${mode}`}
                          onClick={() => setSelectedMode(mode)}
                          className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                            selectedMode === mode
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/30'
                          }`}
                        >
                          <div className="mb-2">
                            <ModeIcon className="h-6 w-6" />
                          </div>
                          <span className="font-medium">
                            {copy.modes[mode as keyof typeof copy.modes] ?? mode}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">{copy.selectDate}</h3>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      data-testid="booking-date-input"
                      value={selectedDate}
                      onChange={(event) => {
                        setSelectedDate(event.target.value);
                        setSelectedTime('');
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-3 pl-10 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">{copy.selectTime}</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {availabilityLoading ? (
                        <div className="col-span-full flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {bookingUiCopy.loadingSlots}
                        </div>
                      ) : availabilityError ? (
                        <div data-testid="booking-availability-message" className="col-span-full rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                          {availabilityError}
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div data-testid="booking-availability-message" className="col-span-full rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
                          {bookingUiCopy.noSlots}
                        </div>
                      ) : (
                        availableSlots.map((time) => (
                          <button
                            key={time}
                            data-testid={`booking-time-${time.replace(':', '-')}`}
                            onClick={() => setSelectedTime(time)}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                              selectedTime === time
                                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-surface'
                            }`}
                          >
                            <Clock className="h-4 w-4" />
                            {formatTimeSlot(time, displayLocale)}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  data-testid="booking-continue-step1"
                  disabled={!selectedMode || !selectedDate || !selectedTime}
                  className="mt-4 w-full rounded-xl bg-accent py-4 font-bold text-accent-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.common.continue}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{copy.issueTitle}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{copy.issueHint}</p>
                  <textarea
                    rows={5}
                    value={issueDesc}
                    onChange={(event) => setIssueDesc(event.target.value)}
                    placeholder={copy.issuePlaceholder}
                    className="w-full resize-none rounded-xl border border-border bg-surface p-4 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    maxLength={2000}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{issueDesc.length}/2000</p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{copy.uploadTitle}</h3>
                  <div className="cursor-not-allowed rounded-xl border-2 border-dashed border-border bg-surface/50 p-8 text-center opacity-60">
                    <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">{copy.uploadComingSoon}</p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={issueDesc.trim().length < 20}
                  className="w-full rounded-xl bg-accent py-4 font-bold text-accent-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.common.continue}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-surface/50 p-6">
                  <h3 className="mb-4 border-b border-border pb-4 text-lg font-bold text-foreground">
                    {copy.orderSummary}
                  </h3>
                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{copy.lawyerLabel}</span>
                      <span className="font-medium text-foreground">{lawyer.user.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{copy.scheduleLabel}</span>
                      <span className="font-medium text-foreground">
                        {formatSchedule(selectedDate, selectedTime, displayLocale)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{copy.modeLabel}</span>
                      <span className="font-medium text-foreground">
                        {copy.modes[selectedMode as keyof typeof copy.modes] ?? selectedMode}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.lawyersPage.fees}</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(lawyer.consultationFee, displayLocale)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-border pt-2 text-lg font-bold">
                      <span className="text-foreground">{copy.totalLabel}</span>
                      <span className="text-foreground">{formatCurrency(total, displayLocale)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4 text-sm text-muted-foreground">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                  <p>{copy.securePaymentNote}</p>
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3 text-danger">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-sm">{submitError}</p>
                  </div>
                )}

                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t.common.loading}
                    </>
                  ) : (
                    bookingUiCopy.confirmBooking
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  {copy.termsPrefix}
                  <LocaleLink href="/terms" className="underline">
                    {t.footer.terms}
                  </LocaleLink>
                  {copy.termsSuffix}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

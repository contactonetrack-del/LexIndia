'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Scale,
  FileText,
  Calendar,
  BookOpen,
  User,
  LogOut,
  Clock,
  Video,
  Phone,
  MessageSquare,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Star,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import LocaleLink from '@/components/LocaleLink';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { formatDate, formatNumber, formatTime } from '@/lib/i18n/format';
import type { Locale } from '@/lib/i18n/config';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';
import ReviewModal from '@/components/dashboard/ReviewModal';

interface Appointment {
  id: string;
  date: string;
  mode: string;
  status: string;
  paymentStatus?: string;
  amount?: number | null;
  notes: string | null;
  review?: { id: string } | null;
  lawyer: {
    id: string;
    city: string;
    consultationFee: number;
    user: { name: string | null; image: string | null };
    specializations: { name: string }[];
  };
}

type AppointmentCardCopy = {
  pending: string;
  confirmed: string;
  completed: string;
  cancelled: string;
  modeVideo: string;
  modeCall: string;
  modeChat: string;
  legalExpert: string;
  profile: string;
  invoice: string;
  messageWorkspace: string;
  joinVideoCall: string;
  leaveReview: string;
};

const MODE_ICON_COMPONENTS: Record<string, LucideIcon> = {
  VIDEO: Video,
  CALL: Phone,
  CHAT: MessageSquare,
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'border-warning/30 bg-warning/10 text-warning',
  CONFIRMED: 'border-success/30 bg-success/10 text-success',
  COMPLETED: 'border-primary/30 bg-primary/10 text-primary',
  CANCELLED: 'border-border bg-muted text-muted-foreground',
};

function AppointmentCard({
  appointment,
  copy,
  lang,
  onReviewClick,
}: {
  appointment: Appointment;
  copy: AppointmentCardCopy;
  lang: Locale;
  onReviewClick?: () => void;
}) {
  const date = new Date(appointment.date);
  const isUpcoming = date > new Date() && appointment.status !== 'CANCELLED';
  const statusClassName = STATUS_CLASSES[appointment.status] ?? STATUS_CLASSES.PENDING;

  const statusLabelByCode: Record<string, string> = {
    PENDING: copy.pending,
    CONFIRMED: copy.confirmed,
    COMPLETED: copy.completed,
    CANCELLED: copy.cancelled,
  };

  const statusLabel = statusLabelByCode[appointment.status] ?? copy.pending;
  const hasInvoice =
    appointment.amount !== null &&
    appointment.amount !== undefined &&
    appointment.amount > 0 &&
    (appointment.status === 'CONFIRMED' ||
      appointment.status === 'COMPLETED' ||
      appointment.paymentStatus === 'PAID');

  const needsReview = appointment.status === 'COMPLETED' && !appointment.review;
  const ModeIcon = MODE_ICON_COMPONENTS[appointment.mode] ?? MessageSquare;
  const modeLabel =
    appointment.mode === 'VIDEO'
      ? copy.modeVideo
      : appointment.mode === 'CALL'
        ? copy.modeCall
        : appointment.mode === 'CHAT'
          ? copy.modeChat
          : appointment.mode;

  return (
    <div
      className={`flex gap-4 rounded-xl border p-4 ${
        isUpcoming ? 'border-primary/20 bg-background shadow-sm' : 'border-border bg-background'
      }`}
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
        {appointment.lawyer.user.image ? (
          <Image
            src={appointment.lawyer.user.image}
            alt={appointment.lawyer.user.name ?? copy.legalExpert}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-lg font-bold">{(appointment.lawyer.user.name ?? copy.legalExpert)[0]}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-foreground">{appointment.lawyer.user.name}</h4>
          <span className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${statusClassName}`}>
            <span className="h-3.5 w-3.5">
              {appointment.status === 'CANCELLED' ? <XCircle className="h-3.5 w-3.5" /> : null}
              {appointment.status === 'PENDING' ? <AlertCircle className="h-3.5 w-3.5" /> : null}
              {(appointment.status === 'CONFIRMED' || appointment.status === 'COMPLETED') ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : null}
            </span>
            {statusLabel}
          </span>
        </div>

        <p className="mb-2 text-xs text-muted-foreground">
          {appointment.lawyer.specializations[0]?.name ?? copy.legalExpert}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(date, lang, { day: 'numeric', month: 'short', year: 'numeric' })}
            {' · '}
            {formatTime(date, lang, { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="flex items-center gap-1">
            <ModeIcon className="h-3.5 w-3.5" />
            {modeLabel}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {appointment.lawyer.city}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-center gap-2">
        <LocaleLink
          href={`/lawyers/${appointment.lawyer.id}`}
          className="flex items-center gap-1 rounded-lg border border-primary/25 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5"
          aria-label={copy.profile}
        >
          {copy.profile}
          <ChevronRight className="h-3 w-3" />
        </LocaleLink>

        {hasInvoice ? (
          <LocaleLink
            href={`/dashboard/invoice/${appointment.id}`}
            target="_blank"
            className="flex items-center gap-1 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success transition-colors hover:bg-success/15"
            aria-label={copy.invoice}
          >
            <FileText className="h-3 w-3" />
            {copy.invoice}
          </LocaleLink>
        ) : null}

        <LocaleLink
          href={`/dashboard/chat/${appointment.id}`}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {copy.messageWorkspace}
        </LocaleLink>

        {appointment.status === 'CONFIRMED' && appointment.mode === 'VIDEO' ? (
          <LocaleLink
            href={`/dashboard/room/${appointment.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            <Video className="h-3.5 w-3.5" />
            {copy.joinVideoCall}
          </LocaleLink>
        ) : null}

        {needsReview && onReviewClick ? (
          <button
            onClick={onReviewClick}
            className="flex items-center gap-1.5 rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-semibold text-warning transition-colors hover:bg-warning/15"
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            {copy.leaveReview}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function CitizenDashboardClient({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) {
  const { lang, fontClass } = useLanguage();
  const t = getTranslation(lang);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [reviewAppt, setReviewAppt] = useState<{ id: string; name: string } | null>(null);

  const fetchAppointments = useCallback(() => {
    fetch(`/api/appointments?locale=${lang}`)
      .then((response) => response.json())
      .then((data) => setAppointments(data.appointments ?? []))
      .catch(() => setAppointments([]))
      .finally(() => setApptLoading(false));
  }, [lang]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const UPCOMING_STATUSES = new Set(['PENDING', 'CONFIRMED']);
  const upcoming = appointments.filter((appointment) => UPCOMING_STATUSES.has(appointment.status));
  const past = appointments.filter((appointment) => !UPCOMING_STATUSES.has(appointment.status));

  const localizedCopy = localizeTreeFromMemory({
    bookNew: 'Book new',
    noAppointmentsBody:
      'Book your first consultation with a verified lawyer to get personalized legal advice.',
    findVerifiedLawyer: 'Find a verified lawyer',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    modeVideo: 'Video',
    modeCall: 'Call',
    modeChat: 'Chat',
    legalExpert: 'Legal expert',
    profile: 'Profile',
    invoice: 'Invoice',
    messageWorkspace: 'Message workspace',
    joinVideoCall: 'Join video call',
    leaveReview: 'Leave a review',
  } as const, lang);

  const copy = {
    legalGuides: t.nav.knowledge,
    legalGuidesDescription: t.knowledge.subtitle,
    myBookings: t.dashboard.myAppointments,
    upcomingCount: `${formatNumber(upcoming.length, lang)} ${t.dashboard.upcoming.toLowerCase()}`,
    myAppointments: t.dashboard.myAppointments,
    bookNew: localizedCopy.bookNew,
    noAppointmentsTitle: t.dashboard.noAppointments,
    noAppointmentsBody: localizedCopy.noAppointmentsBody,
    findVerifiedLawyer: localizedCopy.findVerifiedLawyer,
    upcomingHeading: t.dashboard.upcoming,
    pastHeading: `${t.dashboard.past} & ${localizedCopy.cancelled}`,
    pending: localizedCopy.pending,
    confirmed: localizedCopy.confirmed,
    completed: localizedCopy.completed,
    cancelled: localizedCopy.cancelled,
    modeVideo: localizedCopy.modeVideo,
    modeCall: localizedCopy.modeCall,
    modeChat: localizedCopy.modeChat,
    legalExpert: localizedCopy.legalExpert,
    profile: localizedCopy.profile,
    invoice: localizedCopy.invoice,
    messageWorkspace: localizedCopy.messageWorkspace,
    joinVideoCall: localizedCopy.joinVideoCall,
    leaveReview: localizedCopy.leaveReview,
  } as const;
  const quickActions = [
    {
      icon: Scale,
      label: t.dashboard.findLawyer,
      href: '/lawyers',
      description: t.dashboard.findLawyerDesc,
      isAnchor: false,
    },
    {
      icon: BookOpen,
      label: copy.legalGuides,
      href: '/guides',
      description: copy.legalGuidesDescription,
      isAnchor: false,
    },
    {
      icon: FileText,
      label: t.dashboard.legalTemplates,
      href: '/templates',
      description: t.dashboard.legalTemplatesDesc,
      isAnchor: false,
    },
    {
      icon: Calendar,
      label: copy.myBookings,
      href: '#my-appointments',
      description: copy.upcomingCount,
      isAnchor: true,
    },
  ] as const;
  const renderQuickAction = ({
    icon: Icon,
    label,
    href,
    description,
    isAnchor,
  }: (typeof quickActions)[number]) => {
    const card = (
      <>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </>
    );

    if (isAnchor) {
      return (
        <Link
          key={`${label}-${href}`}
          href={href}
          className={`group rounded-2xl border border-border bg-background p-5 transition-all hover:shadow-md ${fontClass}`}
        >
          {card}
        </Link>
      );
    }

    return (
      <LocaleLink
        key={`${label}-${href}`}
        href={href}
        className={`group rounded-2xl border border-border bg-background p-5 transition-all hover:shadow-md ${fontClass}`}
      >
        {card}
      </LocaleLink>
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-gradient-to-r from-primary to-accent/70 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15">
                <User className="h-7 w-7" />
              </div>
              <div className={fontClass}>
                <p className="text-sm text-primary-foreground/85">{t.dashboard.welcome},</p>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-sm text-primary-foreground/85">{user.email}</p>
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className={`flex items-center gap-2 text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground ${fontClass}`}
            >
              <LogOut className="h-4 w-4" />
              {t.dashboard.signOut}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h2 className={`mb-4 text-xl font-bold text-foreground ${fontClass}`}>{t.dashboard.quickActions}</h2>
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickActions.map(renderQuickAction)}
        </div>

        <div id="my-appointments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{copy.myAppointments}</h2>
            <LocaleLink href="/lawyers" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">
              {copy.bookNew}
            </LocaleLink>
          </div>

          {apptLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-12 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Calendar className="h-10 w-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">{copy.noAppointmentsTitle}</h3>
              <p className="mx-auto mb-8 max-w-sm text-muted-foreground">{copy.noAppointmentsBody}</p>
              <LocaleLink
                href="/lawyers"
                className="inline-block rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {copy.findVerifiedLawyer}
              </LocaleLink>
            </div>
          ) : (
            <>
              {upcoming.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {copy.upcomingHeading} ({upcoming.length})
                  </h3>
                  <div className="space-y-3">
                    {upcoming.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        copy={copy}
                        lang={lang}
                        onReviewClick={() =>
                          setReviewAppt({
                            id: appointment.id,
                            name: appointment.lawyer.user.name ?? copy.legalExpert,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {past.length > 0 ? (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {copy.pastHeading}
                  </h3>
                  <div className="space-y-3 opacity-80">
                    {past.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        copy={copy}
                        lang={lang}
                        onReviewClick={() =>
                          setReviewAppt({
                            id: appointment.id,
                            name: appointment.lawyer.user.name ?? copy.legalExpert,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={Boolean(reviewAppt)}
        onClose={() => setReviewAppt(null)}
        appointmentId={reviewAppt?.id || ''}
        lawyerName={reviewAppt?.name || ''}
        onSuccess={fetchAppointments}
      />
    </div>
  );
}

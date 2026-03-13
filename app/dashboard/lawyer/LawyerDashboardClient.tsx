'use client';

import React, { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  Loader2,
  LogOut,
  MessageSquare,
  Phone,
  Save,
  Scale,
  Settings,
  Star,
  Users,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import CaseWorkspace from '@/components/dashboard/CaseWorkspace';
import LocaleLink from '@/components/LocaleLink';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import { formatCurrency, formatDate, formatDateTime, formatNumber } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';

interface IncomingAppointment {
  id: string;
  date: string;
  mode: string;
  status: string;
  notes: string | null;
  amount?: number | null;
  payoutStatus?: string;
  paymentStatus?: string;
  citizen: { name: string | null; email: string | null };
}

interface ProfileData {
  id?: string;
  userId?: string;
  barCouncilID?: string | null;
  rating: number;
  reviewCount: number;
  profileViews?: number;
  isVerified: boolean;
  experienceYears: number;
  city: string;
  state?: string | null;
  bio?: string | null;
  consultationFee: number;
  consultationModes?: string[];
  subscriptionTier?: string | null;
  subscriptionExpiry?: string | Date | null;
  languages?: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
  modes?: { id: string; mode: string }[];
}

type Tab = 'appointments' | 'edit-profile' | 'subscriptions';
type SubscriptionTier = 'PRO' | 'ELITE';

type RazorpaySuccessPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { on: (event: string, handler: () => void) => void; open: () => void };
type RazorpayConstructor = new (options: {
  key?: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessPayload) => unknown;
  prefill: { name: string; email: string };
}) => RazorpayInstance;

const MODE_ICON_COMPONENTS: Record<string, LucideIcon> = {
  VIDEO: Video,
  CALL: Phone,
  CHAT: MessageSquare,
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'border-warning/30 bg-warning/10 text-warning',
  CONFIRMED: 'border-success/30 bg-success/10 text-success',
  CANCELLED: 'border-danger/30 bg-danger/10 text-danger',
  COMPLETED: 'border-primary/30 bg-primary/10 text-primary',
};

const UPCOMING_STATUSES = new Set(['PENDING', 'CONFIRMED']);

const SUBSCRIPTION_PLANS: Array<{
  tier: SubscriptionTier;
  label: string;
  price: number;
  features: string[];
  panelClassName: string;
  buttonClassName: string;
}> = [
  {
    tier: 'PRO',
    label: 'Pro',
    price: 999,
    features: ['Visible PRO badge', 'Boosted directory ranking', 'Zero platform commission escrow'],
    panelClassName: 'border-primary/30 bg-primary/5',
    buttonClassName: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    tier: 'ELITE',
    label: 'Elite',
    price: 2499,
    features: ['Premium ELITE badge', 'Priority ranking', 'Dedicated account manager'],
    panelClassName: 'border-accent/40 bg-accent/10',
    buttonClassName: 'bg-accent text-accent-foreground hover:bg-accent/85',
  },
];

function getModeLabel(
  mode: string,
  labels: { modeVideo: string; modeCall: string; modeChat: string }
) {
  if (mode === 'VIDEO') return labels.modeVideo;
  if (mode === 'CALL') return labels.modeCall;
  if (mode === 'CHAT') return labels.modeChat;
  return mode;
}

export default function LawyerDashboardClient({
  user,
  profile: initialProfile,
}: {
  user: { name?: string | null; email?: string | null };
  profile: ProfileData | null;
}) {
  const { lang, fontClass, t } = useLanguage();
  const localizedCopy = localizeTreeFromMemory({
    viewProfile: 'View public profile',
    profileCompleteness: 'Profile completeness',
    profileHint: 'Complete your profile details in edit profile to rank higher in searches.',
    profileComplete: 'Your profile is fully complete.',
    fundsInEscrow: 'Funds in escrow',
    pendingVerification: 'Pending verification by clients',
    settledEarnings: 'Settled earnings',
    totalPayouts: 'Total lifetime payouts completed',
    verified: 'Verified',
    pending: 'Pending',
    years: 'yrs',
    modeVideo: 'Video',
    modeCall: 'Call',
    modeChat: 'Chat',
    noAppointments: 'No appointments yet',
    noAppointmentsBody:
      'When citizens book consultations with you, they appear here. Complete your profile to attract more clients.',
    enhanceProfile: 'Enhance profile',
    receipt: 'Receipt',
    messageWorkspace: 'Message workspace',
    joinVideoCall: 'Join video call',
    caseFile: 'Case file',
    closeFile: 'Close file',
    markComplete: 'Mark complete',
    statusUpdated: 'Appointment status updated.',
    statusFailed: 'Failed to update status.',
    networkError: 'Network error. Please try again.',
    completionDone: 'Consultation marked completed and funds marked eligible.',
    completionFailed: 'Failed to mark complete.',
    editHeading: 'Edit your profile',
    bio: 'Professional bio',
    bioHint: 'Visible on your public profile',
    bioPlaceholder: 'Describe your expertise, experience, and approach to legal practice.',
    city: 'City',
    state: 'State',
    expYears: 'Years of experience',
    fee: 'Consultation fee (INR per hour)',
    noteLabel: 'Note',
    noteBody:
      'Specializations, languages, and consultation modes can be updated via hello@lexindia.in while self-service settings are in beta.',
    saveChanges: 'Save changes',
    preview: 'Preview profile',
    saved: 'Profile updated successfully.',
    subscriptions: 'Subscription and badges',
    subscriptionBody: 'Boost your visibility and rank higher in search results across LexIndia.',
    currentTier: 'Current tier',
    activeUntil: 'Active until',
    currentPlan: 'Current plan',
    basicTier: 'Basic',
    recommended: 'Recommended',
    perMonth: 'per month',
    upgradeTo: 'Upgrade to',
    paymentLoadFailed: 'Failed to load payment SDK.',
    paymentVerifyFailed: 'Payment verification failed.',
    paymentFailed: 'Payment failed.',
    paymentInitError: 'An error occurred while initializing payment.',
    paymentSuccess: 'Subscription upgraded successfully. Reloading.',
    legalPortal: t.dashboard.lawyerPortal,
    cancelled: t.common.cancel,
    signOut: t.dashboard.signOut,
    pendingStatus: 'Pending',
    confirmedStatus: 'Confirmed',
    completedStatus: 'Completed',
    membership: 'Membership',
    subscriptionName: 'LexIndia Subscription',
    tierDescription: '{tier} tier subscription',
    proTier: 'Pro',
    eliteTier: 'Elite',
    clientFallback: 'Client',
  } as const, lang);
  const copy = {
    ...localizedCopy,
    legalPortal: t.dashboard.lawyerPortal,
    cancelled: localizedCopy.cancelled,
    signOut: t.dashboard.signOut,
    membership: localizedCopy.membership,
  } as const;

  const [activeTab, setActiveTab] = useState<Tab>('appointments');
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);
  const [appointments, setAppointments] = useState<IncomingAppointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState<Record<string, boolean>>({});
  const [openWorkspaceId, setOpenWorkspaceId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    bio: profile?.bio ?? '',
    city: profile?.city ?? '',
    state: profile?.state ?? '',
    experienceYears: profile?.experienceYears ?? 0,
    consultationFee: profile?.consultationFee ?? 0,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [purchasingTier, setPurchasingTier] = useState<SubscriptionTier | null>(null);

  const getSubscriptionLabel = useCallback(
    (tier?: string | null) => {
      if (tier === 'PRO') return copy.proTier;
      if (tier === 'ELITE') return copy.eliteTier;
      return copy.basicTier;
    },
    [copy.basicTier, copy.eliteTier, copy.proTier]
  );

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    setEditForm({
      bio: profile?.bio ?? '',
      city: profile?.city ?? '',
      state: profile?.state ?? '',
      experienceYears: profile?.experienceYears ?? 0,
      consultationFee: profile?.consultationFee ?? 0,
    });
  }, [profile]);

  const fetchAppointments = useCallback(() => {
    setApptLoading(true);
    fetch(`/api/appointments?locale=${lang}`)
      .then((response) => response.json())
      .then((data) => setAppointments(data.appointments ?? []))
      .catch(() => setAppointments([]))
      .finally(() => setApptLoading(false));
  }, [lang]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatus = async (appointmentId: string, status: string) => {
    setStatusLoading((prev) => ({ ...prev, [appointmentId]: true }));
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        toast.error(copy.statusFailed);
        return;
      }
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, status } : appointment
        )
      );
      toast.success(copy.statusUpdated);
    } catch {
      toast.error(copy.networkError);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const markComplete = async (appointmentId: string) => {
    setStatusLoading((prev) => ({ ...prev, [appointmentId]: true }));
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/complete`, {
        method: 'POST',
        headers: {
          [REQUEST_LOCALE_HEADER]: lang,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? copy.completionFailed);
        return;
      }
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: 'COMPLETED', payoutStatus: 'ELIGIBLE' }
            : appointment
        )
      );
      toast.success(copy.completionDone);
    } catch {
      toast.error(copy.networkError);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [appointmentId]: false }));
    }
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess(false);
    try {
      const response = await fetch('/api/lawyers/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({
          bio: editForm.bio,
          city: editForm.city,
          state: editForm.state,
          experienceYears: Number(editForm.experienceYears),
          consultationFee: Number(editForm.consultationFee),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.profile) {
        const message = data.error ?? copy.statusFailed;
        setEditError(message);
        toast.error(message);
        return;
      }
      setProfile((prev) => (prev ? { ...prev, ...data.profile } : data.profile));
      setEditSuccess(true);
      toast.success(copy.saved);
    } catch {
      setEditError(copy.networkError);
      toast.error(copy.networkError);
    } finally {
      setEditLoading(false);
    }
  };

  const handlePurchaseSubscription = async (tier: SubscriptionTier) => {
    setPurchasingTier(tier);
    try {
      const loadScript = () =>
        new Promise((resolve: (loaded: boolean) => void) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      const loaded = await loadScript();
      if (!loaded) throw new Error(copy.paymentLoadFailed);

      const orderResponse = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({ tier }),
      });
      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.error ?? copy.paymentInitError);

      const Razorpay = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay;
      if (!Razorpay) throw new Error(copy.paymentLoadFailed);

      const payment = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: copy.subscriptionName,
        description: copy.tierDescription.replace('{tier}', getSubscriptionLabel(tier)),
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              [REQUEST_LOCALE_HEADER]: lang,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok || !verifyData.success) {
            toast.error(copy.paymentVerifyFailed);
            return;
          }
          toast.success(copy.paymentSuccess);
          window.setTimeout(() => window.location.reload(), 1500);
        },
        prefill: { name: user.name ?? '', email: user.email ?? '' },
      });
      payment.on('payment.failed', () => toast.error(copy.paymentFailed));
      payment.open();
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.paymentInitError;
      toast.error(message || copy.paymentInitError);
    } finally {
      setPurchasingTier(null);
    }
  };

  const upcomingAppointments = useMemo(
    () => appointments.filter((appointment) => UPCOMING_STATUSES.has(appointment.status)),
    [appointments]
  );
  const pastAppointments = useMemo(
    () => appointments.filter((appointment) => !UPCOMING_STATUSES.has(appointment.status)),
    [appointments]
  );

  const escrowFunds = useMemo(
    () =>
      appointments
        .filter(
          (appointment) =>
            ['PENDING', 'ELIGIBLE', 'DISPUTED'].includes(appointment.payoutStatus || '') &&
            appointment.status !== 'CANCELLED'
        )
        .reduce((total, appointment) => total + (appointment.amount || 0), 0),
    [appointments]
  );

  const settledFunds = useMemo(
    () =>
      appointments
        .filter((appointment) => appointment.payoutStatus === 'SETTLED')
        .reduce((total, appointment) => total + (appointment.amount || 0), 0),
    [appointments]
  );

  const localizedPlans = useMemo(
    () =>
      localizeTreeFromMemory(SUBSCRIPTION_PLANS, lang, {
        skipKeys: ['tier', 'price', 'panelClassName', 'buttonClassName'],
      }),
    [lang]
  );

  const profileCompleteness = useMemo(() => {
    if (!profile) return 0;
    const checks = [
      Boolean(profile.city),
      Boolean(profile.state),
      Boolean(profile.experienceYears),
      Boolean(profile.consultationFee),
      Boolean(profile.barCouncilID),
      Boolean(profile.bio?.trim()),
      (profile.languages ?? []).length > 0,
      (profile.specializations ?? []).length > 0,
      (profile.modes ?? []).length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const statusLabel = (status: string) => {
    if (status === 'PENDING') return copy.pendingStatus;
    if (status === 'CONFIRMED') return copy.confirmedStatus;
    if (status === 'COMPLETED') return copy.completedStatus;
    if (status === 'CANCELLED') return copy.cancelled;
    return status;
  };

  const renderAppointment = (appointment: IncomingAppointment) => {
    const ModeIcon = MODE_ICON_COMPONENTS[appointment.mode] ?? MessageSquare;
    const statusClass = STATUS_CLASSES[appointment.status] ?? 'border-border bg-muted text-muted-foreground';
    const formattedDate = formatDateTime(appointment.date, lang, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const hasInvoice =
      (appointment.amount ?? 0) > 0 &&
      (appointment.status === 'CONFIRMED' ||
        appointment.status === 'COMPLETED' ||
        appointment.paymentStatus === 'PAID');
    const isLoading = statusLoading[appointment.id] ?? false;
    const workspaceOpen = openWorkspaceId === appointment.id;

    return (
      <React.Fragment key={appointment.id}>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {(appointment.citizen.name ?? 'C')[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{appointment.citizen.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formattedDate} {' · '}
                  <span className="inline-flex items-center gap-1">
                    <ModeIcon className="h-3.5 w-3.5" />
                    {getModeLabel(appointment.mode, copy)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                {statusLabel(appointment.status)}
              </span>
              {hasInvoice ? (
                <LocaleLink
                  href={`/dashboard/invoice/${appointment.id}`}
                  target="_blank"
                  className="flex items-center gap-1.5 rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success transition-colors hover:bg-success/15"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {copy.receipt}
                </LocaleLink>
              ) : null}
              <LocaleLink
                href={`/dashboard/chat/${appointment.id}`}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                {copy.messageWorkspace}
              </LocaleLink>
              {appointment.mode === 'VIDEO' ? (
                <LocaleLink
                  href={`/dashboard/room/${appointment.id}`}
                  className="flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <Video className="h-3.5 w-3.5" />
                  {copy.joinVideoCall}
                </LocaleLink>
              ) : null}
              <button
                onClick={() => setOpenWorkspaceId(workspaceOpen ? null : appointment.id)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-hover"
              >
                <FileText className="h-3.5 w-3.5" />
                {workspaceOpen ? copy.closeFile : copy.caseFile}
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button
              onClick={() => markComplete(appointment.id)}
              disabled={isLoading || appointment.status === 'COMPLETED'}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
              {copy.markComplete}
            </button>
            <button
              onClick={() => updateStatus(appointment.id, 'CANCELLED')}
              disabled={isLoading || appointment.status === 'CANCELLED'}
              className="flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-3.5 w-3.5" />
              {copy.cancelled}
            </button>
          </div>
        </div>

        {workspaceOpen ? (
          <div className="rounded-xl border border-border bg-muted/30 px-4 pb-4 pt-1">
            <CaseWorkspace
              appointmentId={appointment.id}
              citizenName={appointment.citizen?.name ?? copy.clientFallback}
            />
          </div>
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="bg-gradient-to-r from-primary to-accent/80 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/20">
              <Scale className="h-7 w-7" />
            </div>
            <div className={fontClass}>
              <p className="text-sm text-primary-foreground/85">{copy.legalPortal}</p>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-primary-foreground/85">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile?.id ? (
              <LocaleLink
                href={`/lawyers/${profile.id}`}
                target="_blank"
                className="hidden items-center gap-1.5 text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground sm:flex"
              >
                <ExternalLink className="h-4 w-4" />
                {copy.viewProfile}
              </LocaleLink>
            ) : null}
            <Link
              href="/api/auth/signout"
              className={`flex items-center gap-2 text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground ${fontClass}`}
            >
              <LogOut className="h-4 w-4" />
              {copy.signOut}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {profile ? (
          <div className="mb-6 rounded-2xl border border-border bg-background p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{copy.profileCompleteness}</h3>
              <span className={`text-sm font-bold ${profileCompleteness === 100 ? 'text-success' : 'text-primary'}`}>
                {profileCompleteness}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-700 ${profileCompleteness === 100 ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${profileCompleteness}%` }}
              />
            </div>
            {profileCompleteness < 100 ? (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <AlertCircle className="h-4 w-4 text-warning" />
                {copy.profileHint}
              </p>
            ) : (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-success">
                <CheckCircle className="h-4 w-4" />
                {copy.profileComplete}
              </p>
            )}
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-warning/30 bg-background p-5 shadow-sm">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-warning" />
              {copy.fundsInEscrow}
            </p>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(escrowFunds, lang)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy.pendingVerification}</p>
          </div>
          <div className="rounded-2xl border border-success/30 bg-background p-5 shadow-sm">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-success" />
              {copy.settledEarnings}
            </p>
            <p className="text-3xl font-bold text-success">{formatCurrency(settledFunds, lang)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{copy.totalPayouts}</p>
          </div>
        </div>

        {profile ? (
          <div className={`mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4 ${fontClass}`}>
            {[
              { icon: Star, label: t.dashboard.statsRating, value: profile.rating.toFixed(1), tone: 'text-warning', surface: 'bg-warning/10' },
              { icon: Users, label: t.dashboard.statsReviews, value: formatNumber(profile.reviewCount, lang), tone: 'text-primary', surface: 'bg-primary/10' },
              { icon: CheckCircle, label: t.dashboard.statsVerified, value: profile.isVerified ? copy.verified : copy.pending, tone: profile.isVerified ? 'text-success' : 'text-warning', surface: profile.isVerified ? 'bg-success/10' : 'bg-warning/10' },
              { icon: Calendar, label: t.dashboard.statsExperience, value: `${formatNumber(profile.experienceYears, lang)} ${copy.years}`, tone: 'text-accent', surface: 'bg-accent/15' },
            ].map(({ icon: Icon, label, value, tone, surface }) => (
              <div key={label} className="rounded-2xl border border-border bg-background p-4 text-center shadow-sm">
                <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${surface}`}>
                  <Icon className={`h-5 w-5 ${tone}`} />
                </div>
                <div className={`text-xl font-bold ${tone}`}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mb-6 flex w-fit gap-1 rounded-xl border border-border bg-surface p-1">
          {[
            { id: 'appointments' as Tab, icon: Calendar, label: t.dashboard.appointments },
            { id: 'edit-profile' as Tab, icon: Settings, label: t.dashboard.editProfile },
            { id: 'subscriptions' as Tab, icon: Award, label: copy.membership },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === id ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'appointments' ? (
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            {apptLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-border bg-muted/40 p-10 text-center">
                <h3 className="mb-2 text-xl font-bold text-foreground">{copy.noAppointments}</h3>
                <p className="mx-auto mb-6 max-w-xl text-sm text-muted-foreground">{copy.noAppointmentsBody}</p>
                <button
                  onClick={() => setActiveTab('edit-profile')}
                  className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {copy.enhanceProfile}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">{upcomingAppointments.map((appointment) => renderAppointment(appointment))}</div>
                ) : null}
                {pastAppointments.length > 0 ? (
                  <details className="rounded-xl border border-border bg-surface/70 p-4">
                    <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {`${t.dashboard.past} (${pastAppointments.length})`}
                    </summary>
                    <div className="mt-3 space-y-2">{pastAppointments.map((appointment) => renderAppointment(appointment))}</div>
                  </details>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === 'edit-profile' ? (
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">{copy.editHeading}</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {copy.bio}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">({copy.bioHint})</span>
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, bio: event.target.value }))}
                  rows={4}
                  maxLength={2000}
                  placeholder={copy.bioPlaceholder}
                  className="min-h-28 w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, city: event.target.value }))}
                  placeholder={copy.city}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  value={editForm.state}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, state: event.target.value }))}
                  placeholder={copy.state}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={editForm.experienceYears}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, experienceYears: Number(event.target.value) }))}
                  placeholder={copy.expYears}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="number"
                  min={0}
                  value={editForm.consultationFee}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, consultationFee: Number(event.target.value) }))}
                  placeholder={copy.fee}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/10 p-4 text-xs text-primary">
                <strong>{copy.noteLabel}:</strong> {copy.noteBody}
              </div>

              {editError ? (
                <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {editError}
                </div>
              ) : null}
              {editSuccess ? (
                <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {copy.saved}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {copy.saveChanges}
                </button>
                {profile?.id ? (
                  <LocaleLink
                    href={`/lawyers/${profile.id}`}
                    target="_blank"
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {copy.preview}
                  </LocaleLink>
                ) : null}
              </div>
            </form>
          </div>
        ) : null}

        {activeTab === 'subscriptions' ? (
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-foreground">{copy.subscriptions}</h2>
            <p className="mb-8 text-sm text-muted-foreground">{copy.subscriptionBody}</p>

            <div className="mb-6 rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-semibold text-muted-foreground">{copy.currentTier}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {getSubscriptionLabel(profile?.subscriptionTier)}
              </p>
              {profile?.subscriptionTier !== 'BASIC' && profile?.subscriptionExpiry ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {copy.activeUntil}: {formatDate(profile.subscriptionExpiry, lang)}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {localizedPlans.map((plan) => {
                const isCurrent = profile?.subscriptionTier === plan.tier;
                const isLoading = purchasingTier === plan.tier;
                return (
                  <div
                    key={plan.tier}
                    className={`relative rounded-2xl border p-6 transition-all ${isCurrent ? plan.panelClassName : 'border-border bg-background hover:border-primary/30'}`}
                  >
                    {plan.tier === 'ELITE' ? (
                      <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
                        {copy.recommended}
                      </span>
                    ) : null}
                    <h3 className="mb-3 text-xl font-bold text-foreground">{plan.label}</h3>
                    <p className="mb-5 text-3xl font-extrabold text-foreground">
                      {formatCurrency(plan.price, lang)}{' '}
                      <span className="text-sm font-normal text-muted-foreground">{copy.perMonth}</span>
                    </p>
                    <ul className="mb-6 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm text-foreground">
                          <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <div className="w-full rounded-xl bg-primary/10 py-3 text-center text-sm font-semibold text-primary">
                        {copy.currentPlan}
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchaseSubscription(plan.tier)}
                        disabled={purchasingTier !== null}
                        className={`w-full rounded-xl py-3 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${plan.buttonClassName}`}
                      >
                        {isLoading ? (
                          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                        ) : (
                          `${copy.upgradeTo} ${plan.label}`
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

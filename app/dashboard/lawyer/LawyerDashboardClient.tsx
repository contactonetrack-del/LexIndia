'use client';

import React, { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  Clock,
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
  Upload,
  Users,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import CaseWorkspace from '@/components/dashboard/CaseWorkspace';
import LocaleLink from '@/components/LocaleLink';
import {
  AVAILABILITY_SLOT_OVERRIDE_ACTIONS,
  AVAILABILITY_TIME_OPTIONS,
  AVAILABILITY_WEEKDAYS,
  getIndiaDateKey,
  isAvailabilityDateKey,
  isAvailabilitySlotOverrideAction,
  parseAvailabilitySlotKey,
  sortAvailabilityExceptions,
  sortAvailabilitySlotOverrides,
  serializeAvailabilitySlot,
  type AvailabilitySlotOverrideAction,
} from '@/lib/availability';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatTime,
} from '@/lib/i18n/format';
import {
  LAWYER_CONSULTATION_MODES,
  type LawyerConsultationModeValue,
} from '@/lib/lawyer-consultation';
import { useLanguage } from '@/lib/LanguageContext';
import { LAWYER_SUBSCRIPTION_PRICES } from '@/lib/subscriptions';
import { getLawyerVerificationStatus } from '@/lib/verification';

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

interface VerificationCase {
  id: string;
  status: string;
  submittedBarCouncilId?: string | null;
  identityDocumentUrl?: string | null;
  enrollmentCertificateUrl?: string | null;
  practiceCertificateUrl?: string | null;
  lawyerNotes?: string | null;
  adminNotes?: string | null;
  submittedAt: string | Date;
  reviewedAt?: string | Date | null;
}

interface NamedOption {
  id: string;
  name: string;
}

interface AvailabilitySlot {
  id?: string;
  weekday: number;
  time: string;
}

interface AvailabilityException {
  id?: string;
  dateKey: string;
}

interface AvailabilitySlotOverride {
  id?: string;
  dateKey: string;
  time: string;
  action: string;
}

interface ProfileOptionsData {
  languages: NamedOption[];
  specializations: NamedOption[];
  consultationModes: LawyerConsultationModeValue[];
}

interface ProfileData {
  id?: string;
  userId?: string;
  barCouncilID?: string | null;
  verificationStatus?: 'UNSUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'ACTION_REQUIRED';
  rating: number;
  reviewCount: number;
  profileViews?: number;
  isVerified: boolean;
  experienceYears: number;
  city: string;
  state?: string | null;
  bio?: string | null;
  consultationFee: number;
  subscriptionTier?: string | null;
  subscriptionExpiry?: string | Date | null;
  languages?: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
  modes?: { id: string; mode: string }[];
  availabilitySlots?: AvailabilitySlot[];
  availabilityExceptions?: AvailabilityException[];
  availabilitySlotOverrides?: AvailabilitySlotOverride[];
  verificationCases?: VerificationCase[];
}

type VerificationUploadKey = 'identityDocumentUrl' | 'enrollmentCertificateUrl' | 'practiceCertificateUrl';

type Tab = 'appointments' | 'edit-profile' | 'verification' | 'subscriptions';
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
  IN_PERSON: Users,
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
    price: LAWYER_SUBSCRIPTION_PRICES.PRO,
    features: ['Visible PRO badge', 'Boosted directory ranking', 'Zero platform commission escrow'],
    panelClassName: 'border-primary/30 bg-primary/5',
    buttonClassName: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    tier: 'ELITE',
    label: 'Elite',
    price: LAWYER_SUBSCRIPTION_PRICES.ELITE,
    features: ['Premium ELITE badge', 'Priority ranking', 'Dedicated account manager'],
    panelClassName: 'border-accent/40 bg-accent/10',
    buttonClassName: 'bg-accent text-accent-foreground hover:bg-accent/85',
  },
];

function getModeLabel(
  mode: string,
  labels: {
    modeVideo: string;
    modeCall: string;
    modeChat: string;
    modeInPerson: string;
  }
) {
  if (mode === 'VIDEO') return labels.modeVideo;
  if (mode === 'CALL') return labels.modeCall;
  if (mode === 'CHAT') return labels.modeChat;
  if (mode === 'IN_PERSON') return labels.modeInPerson;
  return mode;
}

function getAvailabilityOverrideActionLabel(
  action: AvailabilitySlotOverrideAction,
  labels: {
    slotOverrideActionBlock: string;
    slotOverrideActionOpen: string;
  }
) {
  return action === 'OPEN_SLOT'
    ? labels.slotOverrideActionOpen
    : labels.slotOverrideActionBlock;
}

function mergeNamedOptions(primary: NamedOption[], selected: NamedOption[] = []) {
  const optionMap = new Map<string, NamedOption>();

  [...primary, ...selected].forEach((option) => {
    const key = option.id || option.name.trim().toLowerCase();
    if (!key || optionMap.has(key)) {
      return;
    }

    optionMap.set(key, option);
  });

	return Array.from(optionMap.values()).sort((left, right) =>
	    left.name.localeCompare(right.name)
	  );
	}

	type ModeSelection = { mode: string };

	function mergeModeOptions(
	  primary: readonly LawyerConsultationModeValue[],
	  selected: ModeSelection[] = []
	) {
	  return Array.from(
	    new Set([
	      ...primary,
      ...selected
        .map((entry) => entry.mode)
        .filter(
          (mode): mode is LawyerConsultationModeValue =>
            LAWYER_CONSULTATION_MODES.includes(mode as LawyerConsultationModeValue)
        ),
    ])
  );
}

function getDocumentNameFromUrl(url?: string | null) {
  if (!url) {
    return '';
  }

  const segments = url.split('/');
  return decodeURIComponent(segments[segments.length - 1] ?? '');
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
    verificationTitle: 'Verification status',
    verified: 'Verified',
    pending: 'Pending',
    underReview: 'Under review',
    notSubmitted: 'Not submitted',
    actionRequired: 'Action required',
    verificationVerifiedHint: 'Your identity and Bar Council enrolment are verified and visible to users.',
    verificationUnderReviewHint:
      'Your Bar Council submission is on file. The badge appears after LexIndia completes manual review.',
    verificationMissingHint: 'Add your Bar Council enrolment ID to submit your profile for verification.',
    verificationActionRequiredHint:
      'Your latest verification review needs changes. Update the document links and resubmit.',
    years: 'yrs',
    modeVideo: 'Video',
    modeCall: 'Call',
    modeChat: 'Chat',
    modeInPerson: 'In person',
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
    barCouncilId: 'Bar Council enrolment ID',
    barCouncilPlaceholder: 'Enter the enrolment number used for verification',
    languagesLabel: 'Languages',
    languagesHint: 'Select every language you can consult in.',
    specializationsLabel: 'Practice areas',
    specializationsHint: 'Choose the legal categories that best describe your work.',
    consultationModesLabel: 'Consultation modes',
    consultationModesHint:
      'These options control which consultation formats citizens can book on your public profile.',
    availabilityLabel: 'Weekly availability',
    availabilityHint:
      'Pick the recurring day and time slots citizens can actually book. If no slots are selected, your profile cannot receive bookings.',
    availabilityEmptyHint: 'Select at least one weekly slot to accept bookings.',
    blockedDatesLabel: 'Blocked dates and leave days',
    blockedDatesHint:
      'Add one-off dates when you are unavailable. Citizens will not see bookable slots on these dates even if the weekday normally has open hours.',
    blockedDateAction: 'Block date',
    blockedDatesEmpty: 'No blocked dates added yet.',
    blockedDateInvalid: 'Enter a valid blocked date.',
    blockedDatePast: 'Blocked dates must be today or later.',
    blockedDateDuplicate: 'That date is already blocked.',
    slotOverridesLabel: 'Date-specific slot overrides',
    slotOverridesHint:
      'Use one-off slot overrides when you need to block a single recurring slot or open an extra consultation time on a specific date.',
    slotOverridesDateLabel: 'Date',
    slotOverridesTimeLabel: 'Time',
    slotOverridesActionLabel: 'Override action',
    slotOverrideActionBlock: 'Block this slot',
    slotOverrideActionOpen: 'Open extra slot',
    slotOverridesAdd: 'Add override',
    slotOverridesEmpty: 'No slot overrides added yet.',
    slotOverrideInvalid: 'Enter a valid override date and time.',
    slotOverridePast: 'Slot overrides must be today or later.',
    slotOverrideDuplicate: 'That override already exists.',
    slotOverrideBlockedDateConflict:
      'Remove the full-day block first before adding a slot-specific override on that date.',
    slotOverrideBlockedBadge: 'Blocked slot',
    slotOverrideOpenBadge: 'Extra slot',
    profileOptionsLoading: 'Loading profile options...',
    profileOptionsLoadFailed:
      'Unable to load the latest profile options. You can still edit your basic profile fields.',
    noteLabel: 'Note',
    noteBody:
      'Bar Council ID updates trigger a fresh verification review. Languages, practice areas, and consultation modes update your public profile and lawyer discovery listing.',
    verificationTab: 'Verification',
    verificationWorkspaceTitle: 'Verification workspace',
    verificationWorkspaceBody:
      'Upload the documents used by the LexIndia trust team to validate your Bar Council enrolment.',
    identityDocument: 'Identity document',
    enrollmentCertificate: 'Bar Council certificate',
    practiceCertificate: 'Practice certificate (optional)',
    uploadRequirements: 'Upload a PDF, JPG, or PNG up to 5 MB.',
    uploadAction: 'Upload file',
    replaceUpload: 'Replace file',
    uploading: 'Uploading...',
    uploaded: 'Uploaded',
    uploadFailed: 'Failed to upload document.',
    uploadRequired: 'Upload both identity and enrolment documents before submitting.',
    verificationNotes: 'Verification notes',
    verificationNotesPlaceholder:
      'Add any context that helps the reviewer verify your enrolment and practice details.',
    verificationSubmit: 'Submit for review',
    verificationSaved: 'Verification details submitted for review.',
    verificationHistory: 'Recent verification activity',
    latestSubmission: 'Latest submission',
    reviewedOn: 'Reviewed on',
    submittedOn: 'Submitted on',
    adminFeedback: 'Admin feedback',
    reviewPending: 'Pending admin review',
    openDocument: 'Open document',
    noVerificationHistory: 'No verification submissions yet.',
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
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
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
  const [profileOptions, setProfileOptions] = useState<ProfileOptionsData>({
    languages: profile?.languages ?? [],
    specializations: profile?.specializations ?? [],
    consultationModes: [...LAWYER_CONSULTATION_MODES],
  });
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState('');

  const [editForm, setEditForm] = useState({
    bio: profile?.bio ?? '',
    city: profile?.city ?? '',
    state: profile?.state ?? '',
    experienceYears: profile?.experienceYears ?? 0,
    consultationFee: profile?.consultationFee ?? 0,
    barCouncilID: profile?.barCouncilID ?? '',
    languages: (profile?.languages ?? []).map((language) => language.id),
    specializations: (profile?.specializations ?? []).map((specialization) => specialization.id),
    consultationModes: (profile?.modes ?? []).map((mode) => mode.mode),
    availabilitySlots: (profile?.availabilitySlots ?? []).map((slot) => serializeAvailabilitySlot(slot)),
    availabilityExceptions: (profile?.availabilityExceptions ?? []).map((entry) => entry.dateKey),
    availabilitySlotOverrides: sortAvailabilitySlotOverrides(
      (profile?.availabilitySlotOverrides ?? [])
        .filter(
          (
            entry
          ): entry is AvailabilitySlotOverride & { action: AvailabilitySlotOverrideAction } =>
            isAvailabilitySlotOverrideAction(entry.action)
        )
        .map((entry) => ({
          dateKey: entry.dateKey,
          time: entry.time,
          action: entry.action,
        }))
    ),
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [availabilityExceptionInput, setAvailabilityExceptionInput] = useState('');
  const [availabilityOverrideInput, setAvailabilityOverrideInput] = useState<{
    dateKey: string;
    time: string;
    action: AvailabilitySlotOverrideAction;
  }>({
    dateKey: '',
    time: AVAILABILITY_TIME_OPTIONS[0],
    action: 'BLOCK_SLOT',
  });
  const [verificationForm, setVerificationForm] = useState({
    barCouncilID: profile?.verificationCases?.[0]?.submittedBarCouncilId ?? profile?.barCouncilID ?? '',
    identityDocumentUrl: profile?.verificationCases?.[0]?.identityDocumentUrl ?? '',
    enrollmentCertificateUrl: profile?.verificationCases?.[0]?.enrollmentCertificateUrl ?? '',
    practiceCertificateUrl: profile?.verificationCases?.[0]?.practiceCertificateUrl ?? '',
    lawyerNotes: profile?.verificationCases?.[0]?.lawyerNotes ?? '',
  });
  const [uploadState, setUploadState] = useState<Record<VerificationUploadKey, { fileName: string; loading: boolean; error: string }>>({
    identityDocumentUrl: { fileName: '', loading: false, error: '' },
    enrollmentCertificateUrl: { fileName: '', loading: false, error: '' },
    practiceCertificateUrl: { fileName: '', loading: false, error: '' },
  });
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
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
      barCouncilID: profile?.barCouncilID ?? '',
      languages: (profile?.languages ?? []).map((language) => language.id),
      specializations: (profile?.specializations ?? []).map((specialization) => specialization.id),
      consultationModes: (profile?.modes ?? []).map((mode) => mode.mode),
      availabilitySlots: (profile?.availabilitySlots ?? []).map((slot) => serializeAvailabilitySlot(slot)),
      availabilityExceptions: (profile?.availabilityExceptions ?? []).map((entry) => entry.dateKey),
      availabilitySlotOverrides: sortAvailabilitySlotOverrides(
        (profile?.availabilitySlotOverrides ?? [])
          .filter(
            (
              entry
            ): entry is AvailabilitySlotOverride & { action: AvailabilitySlotOverrideAction } =>
              isAvailabilitySlotOverrideAction(entry.action)
          )
          .map((entry) => ({
            dateKey: entry.dateKey,
            time: entry.time,
            action: entry.action,
          }))
      ),
    });
  }, [profile]);

  useEffect(() => {
    const latestCase = profile?.verificationCases?.[0];
    setVerificationForm({
      barCouncilID: latestCase?.submittedBarCouncilId ?? profile?.barCouncilID ?? '',
      identityDocumentUrl: latestCase?.identityDocumentUrl ?? '',
      enrollmentCertificateUrl: latestCase?.enrollmentCertificateUrl ?? '',
      practiceCertificateUrl: latestCase?.practiceCertificateUrl ?? '',
      lawyerNotes: latestCase?.lawyerNotes ?? '',
    });
    setUploadState({
      identityDocumentUrl: {
        fileName: getDocumentNameFromUrl(latestCase?.identityDocumentUrl),
        loading: false,
        error: '',
      },
      enrollmentCertificateUrl: {
        fileName: getDocumentNameFromUrl(latestCase?.enrollmentCertificateUrl),
        loading: false,
        error: '',
      },
      practiceCertificateUrl: {
        fileName: getDocumentNameFromUrl(latestCase?.practiceCertificateUrl),
        loading: false,
        error: '',
      },
    });
  }, [profile]);

  useEffect(() => {
    let cancelled = false;

    const loadProfileOptions = async () => {
      setOptionsLoading(true);
      setOptionsError('');

      try {
        const response = await fetch('/api/lawyers/profile/options', {
          headers: {
            [REQUEST_LOCALE_HEADER]: lang,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? copy.profileOptionsLoadFailed);
        }

        if (!cancelled) {
          setProfileOptions({
            languages: data.languages ?? [],
            specializations: data.specializations ?? [],
            consultationModes: data.consultationModes ?? [...LAWYER_CONSULTATION_MODES],
          });
        }
      } catch (error) {
        if (!cancelled) {
          setOptionsError(
            error instanceof Error ? error.message : copy.profileOptionsLoadFailed
          );
          setProfileOptions({
            languages: profile?.languages ?? [],
            specializations: profile?.specializations ?? [],
            consultationModes: mergeModeOptions(LAWYER_CONSULTATION_MODES, profile?.modes ?? []),
          });
        }
      } finally {
        if (!cancelled) {
          setOptionsLoading(false);
        }
      }
    };

    loadProfileOptions();

    return () => {
      cancelled = true;
    };
  }, [
    copy.profileOptionsLoadFailed,
    lang,
    profile?.languages,
    profile?.modes,
    profile?.specializations,
  ]);

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

  const availableLanguageOptions = useMemo(
    () => mergeNamedOptions(profileOptions.languages, profile?.languages ?? []),
    [profile?.languages, profileOptions.languages]
  );
  const availableSpecializationOptions = useMemo(
    () => mergeNamedOptions(profileOptions.specializations, profile?.specializations ?? []),
    [profile?.specializations, profileOptions.specializations]
  );
  const availableConsultationModes = useMemo(
    () => mergeModeOptions(profileOptions.consultationModes, profile?.modes ?? []),
    [profile?.modes, profileOptions.consultationModes]
  );
  const todayDateKey = useMemo(() => getIndiaDateKey(new Date()), []);
  const weekdayLabels = useMemo(
    () =>
      ({
        0: copy.sunday,
        1: copy.monday,
        2: copy.tuesday,
        3: copy.wednesday,
        4: copy.thursday,
        5: copy.friday,
        6: copy.saturday,
      }) as Record<number, string>,
    [
      copy.friday,
      copy.monday,
      copy.saturday,
      copy.sunday,
      copy.thursday,
      copy.tuesday,
      copy.wednesday,
    ]
  );

  const toggleEditArrayValue = useCallback(
    (
      field:
        | 'languages'
        | 'specializations'
        | 'consultationModes'
        | 'availabilitySlots'
        | 'availabilityExceptions',
      value: string
    ) => {
      setEditForm((prev) => {
        const currentValues = prev[field];
        const nextValues = currentValues.includes(value)
          ? currentValues.filter((entry) => entry !== value)
          : [...currentValues, value];

        return {
          ...prev,
          [field]: nextValues,
        };
      });
    },
    []
  );

  const addAvailabilityException = useCallback(() => {
    const dateKey = availabilityExceptionInput.trim();

    if (!isAvailabilityDateKey(dateKey)) {
      setEditError(copy.blockedDateInvalid);
      toast.error(copy.blockedDateInvalid);
      return;
    }

    if (dateKey < todayDateKey) {
      setEditError(copy.blockedDatePast);
      toast.error(copy.blockedDatePast);
      return;
    }

    let added = false;
    setEditForm((prev) => {
      if (prev.availabilityExceptions.includes(dateKey)) {
        return prev;
      }

      added = true;
      return {
        ...prev,
        availabilityExceptions: sortAvailabilityExceptions([
          ...prev.availabilityExceptions.map((entry) => ({ dateKey: entry })),
          { dateKey },
        ]).map((entry) => entry.dateKey),
        availabilitySlotOverrides: prev.availabilitySlotOverrides.filter(
          (entry) => entry.dateKey !== dateKey
        ),
      };
    });

    if (!added) {
      setEditError(copy.blockedDateDuplicate);
      toast.error(copy.blockedDateDuplicate);
      return;
    }

    setEditError('');
    setEditSuccess(false);
    setAvailabilityExceptionInput('');
  }, [
    availabilityExceptionInput,
    copy.blockedDateDuplicate,
    copy.blockedDateInvalid,
    copy.blockedDatePast,
    todayDateKey,
  ]);

  const addAvailabilitySlotOverride = useCallback(() => {
    const dateKey = availabilityOverrideInput.dateKey.trim();
    const time = availabilityOverrideInput.time;
    const action = availabilityOverrideInput.action;

    if (
      !isAvailabilityDateKey(dateKey) ||
      !time ||
      !isAvailabilitySlotOverrideAction(action)
    ) {
      setEditError(copy.slotOverrideInvalid);
      toast.error(copy.slotOverrideInvalid);
      return;
    }

    if (dateKey < todayDateKey) {
      setEditError(copy.slotOverridePast);
      toast.error(copy.slotOverridePast);
      return;
    }

    let added = false;
    let blockedDateConflict = false;

    setEditForm((prev) => {
      if (prev.availabilityExceptions.includes(dateKey)) {
        blockedDateConflict = true;
        return prev;
      }

      const existing = prev.availabilitySlotOverrides.find(
        (entry) => entry.dateKey === dateKey && entry.time === time
      );

      if (existing?.action === action) {
        return prev;
      }

      added = true;

      return {
        ...prev,
        availabilitySlotOverrides: sortAvailabilitySlotOverrides([
          ...prev.availabilitySlotOverrides.filter(
            (entry) => !(entry.dateKey === dateKey && entry.time === time)
          ),
          { dateKey, time, action },
        ]),
      };
    });

    if (blockedDateConflict) {
      setEditError(copy.slotOverrideBlockedDateConflict);
      toast.error(copy.slotOverrideBlockedDateConflict);
      return;
    }

    if (!added) {
      setEditError(copy.slotOverrideDuplicate);
      toast.error(copy.slotOverrideDuplicate);
      return;
    }

    setEditError('');
    setEditSuccess(false);
    setAvailabilityOverrideInput((prev) => ({
      ...prev,
      dateKey: '',
    }));
  }, [
    availabilityOverrideInput,
    copy.slotOverrideBlockedDateConflict,
    copy.slotOverrideDuplicate,
    copy.slotOverrideInvalid,
    copy.slotOverridePast,
    todayDateKey,
  ]);

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
          barCouncilID: editForm.barCouncilID,
          languages: editForm.languages,
          specializations: editForm.specializations,
          consultationModes: editForm.consultationModes,
          availabilitySlots: editForm.availabilitySlots
            .map((slotKey) => parseAvailabilitySlotKey(slotKey))
            .filter((slot): slot is { weekday: number; time: string } => slot !== null),
          availabilityExceptions: editForm.availabilityExceptions.map((dateKey) => ({ dateKey })),
          availabilitySlotOverrides: editForm.availabilitySlotOverrides.map((entry) => ({
            dateKey: entry.dateKey,
            time: entry.time,
            action: entry.action,
          })),
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

  const handleVerificationUpload = async (
    field: VerificationUploadKey,
    kind: 'IDENTITY' | 'ENROLLMENT' | 'PRACTICE',
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setVerificationSuccess(false);
    setVerificationError('');
    setUploadState((prev) => ({
      ...prev,
      [field]: { ...prev[field], loading: true, error: '' },
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', kind);

      const response = await fetch('/api/lawyers/verification/documents', {
        method: 'POST',
        headers: {
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || typeof data.url !== 'string') {
        throw new Error(data.error ?? copy.uploadFailed);
      }

      setVerificationForm((prev) => ({
        ...prev,
        [field]: data.url,
      }));
      setUploadState((prev) => ({
        ...prev,
        [field]: {
          fileName: data.fileName ?? file.name,
          loading: false,
          error: '',
        },
      }));
      toast.success(copy.uploaded);
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.uploadFailed;
      setUploadState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          loading: false,
          error: message,
        },
      }));
      setVerificationError(message);
      toast.error(message);
    } finally {
      event.target.value = '';
    }
  };

  const handleSubmitVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!verificationForm.identityDocumentUrl || !verificationForm.enrollmentCertificateUrl) {
      setVerificationError(copy.uploadRequired);
      toast.error(copy.uploadRequired);
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');
    setVerificationSuccess(false);

    try {
      const response = await fetch('/api/lawyers/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({
          barCouncilID: verificationForm.barCouncilID,
          identityDocumentUrl: verificationForm.identityDocumentUrl,
          enrollmentCertificateUrl: verificationForm.enrollmentCertificateUrl,
          practiceCertificateUrl: verificationForm.practiceCertificateUrl,
          lawyerNotes: verificationForm.lawyerNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data.error ?? copy.networkError;
        setVerificationError(message);
        toast.error(message);
        return;
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              barCouncilID: verificationForm.barCouncilID.trim().toUpperCase(),
              isVerified: false,
              verificationCases: data.latestCase ? [data.latestCase] : prev.verificationCases,
              verificationStatus: data.verificationStatus,
            }
          : prev
      );
      setVerificationSuccess(true);
      toast.success(copy.verificationSaved);
    } catch {
      setVerificationError(copy.networkError);
      toast.error(copy.networkError);
    } finally {
      setVerificationLoading(false);
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

  const verificationStatus = useMemo(
    () => getLawyerVerificationStatus(profile ?? {}),
    [profile]
  );
  const latestVerificationCase = profile?.verificationCases?.[0] ?? null;

  const verificationMeta = useMemo(() => {
    if (verificationStatus === 'VERIFIED') {
      return {
        label: copy.verified,
        hint: copy.verificationVerifiedHint,
        tone: 'text-success',
        surface: 'bg-success/10',
        border: 'border-success/30',
      };
    }

    if (verificationStatus === 'UNDER_REVIEW') {
      return {
        label: copy.underReview,
        hint: copy.verificationUnderReviewHint,
        tone: 'text-warning',
        surface: 'bg-warning/10',
        border: 'border-warning/30',
      };
    }

    if (verificationStatus === 'ACTION_REQUIRED') {
      return {
        label: copy.actionRequired,
        hint: copy.verificationActionRequiredHint,
        tone: 'text-danger',
        surface: 'bg-danger/10',
        border: 'border-danger/30',
      };
    }

    return {
      label: copy.notSubmitted,
      hint: copy.verificationMissingHint,
      tone: 'text-muted-foreground',
      surface: 'bg-muted',
      border: 'border-border',
    };
  }, [
    copy.actionRequired,
    copy.notSubmitted,
    copy.underReview,
    copy.verified,
    copy.verificationActionRequiredHint,
    copy.verificationMissingHint,
    copy.verificationUnderReviewHint,
    copy.verificationVerifiedHint,
    verificationStatus,
  ]);

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

        {profile ? (
          <div className={`mb-6 rounded-2xl border bg-background p-5 shadow-sm ${verificationMeta.border}`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${verificationMeta.surface}`}>
                {verificationStatus === 'VERIFIED' ? (
                  <CheckCircle className={`h-5 w-5 ${verificationMeta.tone}`} />
                ) : (
                  <AlertCircle className={`h-5 w-5 ${verificationMeta.tone}`} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{copy.verificationTitle}</h3>
                <p className={`mt-1 text-sm font-semibold ${verificationMeta.tone}`}>{verificationMeta.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{verificationMeta.hint}</p>
                {profile.barCouncilID ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {copy.barCouncilId}: <span className="font-medium text-foreground">{profile.barCouncilID}</span>
                  </p>
                ) : null}
              </div>
            </div>
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
              { icon: CheckCircle, label: t.dashboard.statsVerified, value: verificationMeta.label, tone: verificationMeta.tone, surface: verificationMeta.surface },
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
            { id: 'verification' as Tab, icon: FileText, label: copy.verificationTab },
            { id: 'subscriptions' as Tab, icon: Award, label: copy.membership },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              data-testid={`lawyer-tab-${id}`}
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

            <form onSubmit={handleSaveProfile} className="space-y-5" data-testid="lawyer-edit-profile-form">
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
                <input
                  type="text"
                  value={editForm.barCouncilID}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, barCouncilID: event.target.value.toUpperCase() }))}
                  placeholder={copy.barCouncilPlaceholder}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {optionsLoading ? (
                <div className="rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
                  {copy.profileOptionsLoading}
                </div>
              ) : null}

              {optionsError ? (
                <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
                  {optionsError}
                </div>
              ) : null}

              <div className="space-y-5 rounded-2xl border border-border bg-surface/40 p-5">
                <div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-foreground">{copy.languagesLabel}</h3>
                    <p className="text-xs text-muted-foreground">{copy.languagesHint}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguageOptions.map((language) => {
                      const isSelected = editForm.languages.includes(language.id);
                      return (
                        <button
                          key={language.id}
                          type="button"
                          data-testid={`language-option-${language.id}`}
                          onClick={() => toggleEditArrayValue('languages', language.id)}
                          className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          {language.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {copy.specializationsLabel}
                    </h3>
                    <p className="text-xs text-muted-foreground">{copy.specializationsHint}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecializationOptions.map((specialization) => {
                      const isSelected = editForm.specializations.includes(specialization.id);
                      return (
                        <button
                          key={specialization.id}
                          type="button"
                          data-testid={`specialization-option-${specialization.id}`}
                          onClick={() =>
                            toggleEditArrayValue('specializations', specialization.id)
                          }
                          className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          {specialization.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {copy.consultationModesLabel}
                    </h3>
                    <p className="text-xs text-muted-foreground">{copy.consultationModesHint}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableConsultationModes.map((mode) => {
                      const isSelected = editForm.consultationModes.includes(mode);
                      const ModeIcon = MODE_ICON_COMPONENTS[mode] ?? MessageSquare;
                      return (
                        <button
                          key={mode}
                          type="button"
                          data-testid={`consultation-mode-option-${mode}`}
                          onClick={() => toggleEditArrayValue('consultationModes', mode)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          <ModeIcon className="h-4 w-4" />
                          {getModeLabel(mode, copy)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-foreground">{copy.availabilityLabel}</h3>
                    <p className="text-xs text-muted-foreground">{copy.availabilityHint}</p>
                  </div>
                  <div className="space-y-3">
                    {AVAILABILITY_WEEKDAYS.map((day) => (
                      <div
                        key={day.value}
                        className="rounded-xl border border-border bg-background/80 p-4"
                        data-testid={`availability-day-${day.value}`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold text-foreground">
                            {weekdayLabels[day.value] ?? day.label}
                          </h4>
                          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {editForm.availabilitySlots.some((slotKey) => slotKey.startsWith(`${day.value}:`))
                              ? `${editForm.availabilitySlots.filter((slotKey) => slotKey.startsWith(`${day.value}:`)).length} slots`
                              : copy.availabilityEmptyHint}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABILITY_TIME_OPTIONS.map((time) => {
                            const slotKey = `${day.value}:${time}`;
                            const isSelected = editForm.availabilitySlots.includes(slotKey);
                            return (
                              <button
                                key={slotKey}
                                type="button"
                                data-testid={`availability-slot-${day.value}-${time.replace(':', '-')}`}
                                onClick={() => toggleEditArrayValue('availabilitySlots', slotKey)}
                                className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-background text-foreground hover:border-primary/30 hover:bg-primary/5'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-foreground">{copy.blockedDatesLabel}</h3>
                    <p className="text-xs text-muted-foreground">{copy.blockedDatesHint}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/80 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="date"
                        min={todayDateKey}
                        data-testid="availability-exception-input"
                        value={availabilityExceptionInput}
                        onChange={(event) => setAvailabilityExceptionInput(event.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        data-testid="availability-exception-add"
                        onClick={addAvailabilityException}
                        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {copy.blockedDateAction}
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {editForm.availabilityExceptions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{copy.blockedDatesEmpty}</p>
                      ) : (
                        editForm.availabilityExceptions.map((dateKey) => (
                          <button
                            key={dateKey}
                            type="button"
                            data-testid={`availability-exception-remove-${dateKey}`}
                            onClick={() => toggleEditArrayValue('availabilityExceptions', dateKey)}
                            className="inline-flex items-center gap-2 rounded-full border border-danger/20 bg-danger/10 px-3 py-2 text-sm text-danger transition-colors hover:border-danger/40 hover:bg-danger/15"
                          >
                            <Calendar className="h-4 w-4" />
                            <span data-testid={`availability-exception-${dateKey}`}>
                              {formatDate(new Date(`${dateKey}T00:00:00+05:30`), lang, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <X className="h-4 w-4" />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-foreground">{copy.slotOverridesLabel}</h3>
                    <p className="text-xs text-muted-foreground">{copy.slotOverridesHint}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/80 p-4">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_220px_auto]">
                      <input
                        type="date"
                        min={todayDateKey}
                        data-testid="availability-override-date-input"
                        value={availabilityOverrideInput.dateKey}
                        onChange={(event) =>
                          setAvailabilityOverrideInput((prev) => ({
                            ...prev,
                            dateKey: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <select
                        data-testid="availability-override-time-select"
                        value={availabilityOverrideInput.time}
                        onChange={(event) =>
                          setAvailabilityOverrideInput((prev) => ({
                            ...prev,
                            time: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {AVAILABILITY_TIME_OPTIONS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <select
                        data-testid="availability-override-action-select"
                        value={availabilityOverrideInput.action}
                        onChange={(event) => {
                          const nextAction = event.target.value;
                          if (!isAvailabilitySlotOverrideAction(nextAction)) {
                            return;
                          }

                          setAvailabilityOverrideInput((prev) => ({
                            ...prev,
                            action: nextAction,
                          }));
                        }}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {AVAILABILITY_SLOT_OVERRIDE_ACTIONS.map((action) => (
                          <option key={action} value={action}>
                            {getAvailabilityOverrideActionLabel(action, copy)}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        data-testid="availability-override-add"
                        onClick={addAvailabilitySlotOverride}
                        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        {copy.slotOverridesAdd}
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {editForm.availabilitySlotOverrides.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{copy.slotOverridesEmpty}</p>
                      ) : (
                        editForm.availabilitySlotOverrides.map((entry) => {
                          const overrideKey = `${entry.dateKey}-${entry.time.replace(':', '-')}-${entry.action.toLowerCase()}`;
                          const isOpenSlot = entry.action === 'OPEN_SLOT';

                          return (
                            <button
                              key={overrideKey}
                              type="button"
                              data-testid={`availability-override-remove-${overrideKey}`}
                              onClick={() =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  availabilitySlotOverrides: prev.availabilitySlotOverrides.filter(
                                    (item) =>
                                      !(
                                        item.dateKey === entry.dateKey &&
                                        item.time === entry.time &&
                                        item.action === entry.action
                                      )
                                  ),
                                }))
                              }
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                                isOpenSlot
                                  ? 'border-success/20 bg-success/10 text-success hover:border-success/40 hover:bg-success/15'
                                  : 'border-warning/20 bg-warning/10 text-warning hover:border-warning/40 hover:bg-warning/15'
                              }`}
                            >
                              <Clock className="h-4 w-4" />
                              <span data-testid={`availability-override-${overrideKey}`}>
                                {formatDate(new Date(`${entry.dateKey}T00:00:00+05:30`), lang, {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}{' '}
                                •{' '}
                                {formatTime(new Date(`${entry.dateKey}T${entry.time}:00+05:30`), lang, {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}{' '}
                                • {getAvailabilityOverrideActionLabel(entry.action, copy)}
                              </span>
                              <span className="rounded-full bg-background/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                                {isOpenSlot
                                  ? copy.slotOverrideOpenBadge
                                  : copy.slotOverrideBlockedBadge}
                              </span>
                              <X className="h-4 w-4" />
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
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
                <div data-testid="lawyer-profile-save-success" className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {copy.saved}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  data-testid="lawyer-save-profile-button"
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

        {activeTab === 'verification' ? (
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-foreground">{copy.verificationWorkspaceTitle}</h2>
                <p className="text-sm text-muted-foreground">{copy.verificationWorkspaceBody}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitVerification} className="space-y-5" data-testid="lawyer-verification-form">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  data-testid="verification-bar-council-id"
                  value={verificationForm.barCouncilID}
                  onChange={(event) =>
                    setVerificationForm((prev) => ({
                      ...prev,
                      barCouncilID: event.target.value.toUpperCase(),
                    }))
                  }
                  placeholder={copy.barCouncilPlaceholder}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{copy.uploadRequirements}</p>
                  <p className="mt-1">{copy.verificationWorkspaceBody}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {([
                  {
                    field: 'identityDocumentUrl',
                    kind: 'IDENTITY',
                    label: copy.identityDocument,
                  },
                  {
                    field: 'enrollmentCertificateUrl',
                    kind: 'ENROLLMENT',
                    label: copy.enrollmentCertificate,
                  },
                  {
                    field: 'practiceCertificateUrl',
                    kind: 'PRACTICE',
                    label: copy.practiceCertificate,
                  },
                ] as const).map(({ field, kind, label }) => {
                  const state = uploadState[field];
                  const hasUploadedFile = Boolean(verificationForm[field]);
                  const inputTestId =
                    field === 'identityDocumentUrl'
                      ? 'verification-identity-document-file'
                      : field === 'enrollmentCertificateUrl'
                        ? 'verification-enrollment-certificate-file'
                        : 'verification-practice-certificate-file';

                  return (
                    <div
                      key={field}
                      className="rounded-2xl border border-border bg-background p-4"
                      data-testid={`${field}-panel`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{copy.uploadRequirements}</p>
                        </div>
                        {hasUploadedFile ? (
                          <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-success">
                            {copy.uploaded}
                          </span>
                        ) : null}
                      </div>

                      {state.fileName ? (
                        <div className="mb-3 rounded-xl border border-border bg-surface/60 px-3 py-2 text-xs text-foreground">
                          {state.fileName}
                        </div>
                      ) : null}

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5">
                        {state.loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {state.loading
                          ? copy.uploading
                          : hasUploadedFile
                            ? copy.replaceUpload
                            : copy.uploadAction}
                        <input
                          type="file"
                          accept=".pdf,image/png,image/jpeg,image/jpg"
                          data-testid={inputTestId}
                          className="sr-only"
                          onChange={(event) => handleVerificationUpload(field, kind, event)}
                        />
                      </label>

                      {verificationForm[field] ? (
                        <a
                          href={verificationForm[field]}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
                        >
                          {copy.openDocument}
                        </a>
                      ) : null}

                      {state.error ? (
                        <p className="mt-2 text-xs text-danger">{state.error}</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <textarea
                data-testid="verification-lawyer-notes"
                value={verificationForm.lawyerNotes}
                onChange={(event) =>
                  setVerificationForm((prev) => ({
                    ...prev,
                    lawyerNotes: event.target.value,
                  }))
                }
                rows={4}
                placeholder={copy.verificationNotesPlaceholder}
                className="min-h-28 w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {verificationError ? (
                <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {verificationError}
                </div>
              ) : null}
              {verificationSuccess ? (
                <div data-testid="verification-submit-success" className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {copy.verificationSaved}
                </div>
              ) : null}

              <button
                type="submit"
                data-testid="verification-submit-button"
                disabled={
                  verificationLoading ||
                  uploadState.identityDocumentUrl.loading ||
                  uploadState.enrollmentCertificateUrl.loading ||
                  uploadState.practiceCertificateUrl.loading
                }
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verificationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {copy.verificationSubmit}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {copy.latestSubmission}
              </h3>
              {latestVerificationCase ? (
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${verificationMeta.surface} ${verificationMeta.tone}`}>
                      {verificationMeta.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {copy.submittedOn}: {formatDate(latestVerificationCase.submittedAt, lang)}
                    </span>
                    {latestVerificationCase.reviewedAt ? (
                      <span className="text-xs text-muted-foreground">
                        {copy.reviewedOn}: {formatDate(latestVerificationCase.reviewedAt, lang)}
                      </span>
                    ) : null}
                  </div>

                  {latestVerificationCase.adminNotes ? (
                    <div className="rounded-xl border border-border bg-background px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {copy.adminFeedback}
                      </p>
                      <p className="mt-1 text-sm text-foreground">{latestVerificationCase.adminNotes}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{copy.reviewPending}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm">
                    {latestVerificationCase.identityDocumentUrl ? (
                      <a
                        href={latestVerificationCase.identityDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-surface-hover"
                      >
                        {copy.openDocument}: {copy.identityDocument}
                      </a>
                    ) : null}
                    {latestVerificationCase.enrollmentCertificateUrl ? (
                      <a
                        href={latestVerificationCase.enrollmentCertificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-surface-hover"
                      >
                        {copy.openDocument}: {copy.enrollmentCertificate}
                      </a>
                    ) : null}
                    {latestVerificationCase.practiceCertificateUrl ? (
                      <a
                        href={latestVerificationCase.practiceCertificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-surface-hover"
                      >
                        {copy.openDocument}: {copy.practiceCertificate}
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">{copy.noVerificationHistory}</p>
              )}
            </div>
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

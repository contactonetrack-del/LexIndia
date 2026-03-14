import type { LawyerConsultationModeValue } from '@/lib/lawyer-consultation';

export const E2E_LAWYER_USER = {
  name: 'Adv. Test Lawyer',
  email: 'lawyer-e2e@lexindia.test',
};

export const E2E_LAWYER_PROFILE = {
  id: 'e2e-lawyer-profile',
  userId: 'e2e-lawyer-user',
  barCouncilID: 'DL/2024/7788',
  verificationStatus: 'UNDER_REVIEW' as const,
  rating: 4.9,
  reviewCount: 24,
  profileViews: 128,
  isVerified: false,
  experienceYears: 9,
  city: 'New Delhi',
  state: 'Delhi',
  bio: 'Focused on property, family, and urgent procedural matters.',
  consultationFee: 1800,
  subscriptionTier: 'PRO',
  subscriptionExpiry: '2026-12-31T00:00:00.000Z',
  languages: [
    { id: 'lang-en', name: 'English' },
    { id: 'lang-hi', name: 'Hindi' },
  ],
  specializations: [
    { id: 'spec-family', name: 'Family Law' },
    { id: 'spec-property', name: 'Property Law' },
  ],
  modes: [
    { id: 'mode-video', mode: 'VIDEO' },
    { id: 'mode-call', mode: 'CALL' },
  ],
  availabilitySlots: [
    { id: 'slot-mon-10', weekday: 1, time: '10:00' },
  ],
  availabilityExceptions: [{ id: 'blocked-1', dateKey: '2026-03-20' }],
  availabilitySlotOverrides: [
    {
      id: 'override-open-1',
      dateKey: '2026-03-22',
      time: '14:30',
      action: 'OPEN_SLOT' as const,
    },
    {
      id: 'override-block-1',
      dateKey: '2026-03-23',
      time: '10:00',
      action: 'BLOCK_SLOT' as const,
    },
  ],
  verificationCases: [
    {
      id: 'case-e2e-1',
      status: 'UNDER_REVIEW',
      submittedBarCouncilId: 'DL/2024/7788',
      identityDocumentUrl: 'https://example.com/identity.pdf',
      enrollmentCertificateUrl: 'https://example.com/enrolment.pdf',
      practiceCertificateUrl: 'https://example.com/practice.pdf',
      lawyerNotes: 'Initial seeded review case.',
      adminNotes: null,
      submittedAt: '2026-03-12T10:00:00.000Z',
      reviewedAt: null,
    },
  ],
};

export const E2E_PROFILE_OPTIONS = {
  languages: [
    { id: 'lang-en', name: 'English' },
    { id: 'lang-hi', name: 'Hindi' },
    { id: 'lang-mr', name: 'Marathi' },
  ],
  specializations: [
    { id: 'spec-family', name: 'Family Law' },
    { id: 'spec-property', name: 'Property Law' },
    { id: 'spec-cyber', name: 'Cyber Law' },
  ],
  consultationModes: ['VIDEO', 'CALL', 'CHAT', 'IN_PERSON'] as LawyerConsultationModeValue[],
};

export const E2E_ADMIN_USER = {
  name: 'Ops Admin',
  email: 'admin-e2e@lexindia.test',
};

import { expect, test, type Page } from '@playwright/test';

import {
  E2E_LAWYER_PROFILE,
  E2E_PROFILE_OPTIONS,
} from '../lib/e2e-fixtures';

function routeAnonymousSession(page: Page) {
  return page.route('**/api/auth/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'null',
    });
  });
}

function routeCitizenSession(page: Page) {
  return page.route('**/api/auth/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'citizen-1',
          name: 'Citizen User',
          email: 'citizen@example.com',
          role: 'CITIZEN',
          isAdmin: false,
        },
        expires: '2099-12-31T00:00:00.000Z',
      }),
    });
  });
}

test('admin users see the dashboard link routed to admin review with pending badge', async ({ page }) => {
  await page.route('**/api/auth/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'admin-1',
          name: 'Ops Admin',
          email: 'ops@example.com',
          role: 'CITIZEN',
          isAdmin: true,
        },
        expires: '2099-12-31T00:00:00.000Z',
      }),
    });
  });

  await page.route('**/api/admin/queue-summary', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        verificationPendingCount: 2,
        templateReviewCount: 3,
        faqReviewCount: 1,
        guideReviewCount: 1,
        rightsReviewCount: 1,
        lawReviewCount: 1,
        lawSectionReviewCount: 1,
        pendingTotal: 10,
      }),
    });
  });

  await page.goto('/en');

  await expect(page.getByTestId('header-dashboard-link')).toHaveAttribute(
    'href',
    '/en/dashboard/admin'
  );
  await expect(page.getByTestId('header-admin-review-badge')).toHaveText('10');
});

test('lawyer profile editor submits taxonomy ids and consultation modes', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.route('**/api/appointments*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ appointments: [] }),
    });
  });

  await page.route('**/api/lawyers/profile/options', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(E2E_PROFILE_OPTIONS),
    });
  });

  let profilePatchBody: Record<string, unknown> | null = null;
  await page.route('**/api/lawyers/profile', async (route) => {
    if (route.request().method() !== 'PATCH') {
      await route.fallback();
      return;
    }

    profilePatchBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        profile: {
          ...E2E_LAWYER_PROFILE,
          languages: [
            ...E2E_LAWYER_PROFILE.languages,
            { id: 'lang-mr', name: 'Marathi' },
          ],
          specializations: [
            ...E2E_LAWYER_PROFILE.specializations,
            { id: 'spec-cyber', name: 'Cyber Law' },
          ],
          modes: [
            ...E2E_LAWYER_PROFILE.modes,
            { id: 'mode-in-person', mode: 'IN_PERSON' },
          ],
          availabilitySlots: [
            ...E2E_LAWYER_PROFILE.availabilitySlots,
            { id: 'slot-mon-09', weekday: 1, time: '09:00' },
          ],
          availabilityExceptions: [
            ...E2E_LAWYER_PROFILE.availabilityExceptions,
            { id: 'blocked-2', dateKey: '2026-03-25' },
          ],
          availabilitySlotOverrides: [
            ...E2E_LAWYER_PROFILE.availabilitySlotOverrides,
            { id: 'override-open-2', dateKey: '2026-03-26', time: '16:00', action: 'OPEN_SLOT' },
          ],
          verificationStatus: 'UNDER_REVIEW',
        },
      }),
    });
  });

  await page.goto('/en/e2e/lawyer-dashboard');
  await page.getByTestId('lawyer-tab-edit-profile').click();

  await expect(page.getByTestId('language-option-lang-mr')).toBeVisible();
  await page.getByTestId('language-option-lang-mr').click();
  await page.getByTestId('specialization-option-spec-cyber').click();
  await page.getByTestId('consultation-mode-option-IN_PERSON').click();
  await page.getByTestId('availability-slot-1-09-00').click();
  await page.getByTestId('availability-exception-input').fill('2026-03-25');
  await page.getByTestId('availability-exception-add').click();
  await page.getByTestId('availability-override-date-input').fill('2026-03-26');
  await page.getByTestId('availability-override-time-select').selectOption('16:00');
  await page.getByTestId('availability-override-action-select').selectOption('OPEN_SLOT');
  await page.getByTestId('availability-override-add').click();
  await page.getByTestId('lawyer-save-profile-button').click();

  await expect(page.getByTestId('lawyer-profile-save-success')).toBeVisible();
  expect(profilePatchBody).not.toBeNull();
  if (!profilePatchBody) {
    throw new Error('Expected profile patch payload to be captured.');
  }
  const submittedProfileBody: {
    languages: string[];
    specializations: string[];
    consultationModes: string[];
    availabilitySlots: Array<{ weekday: number; time: string }>;
    availabilityExceptions: Array<{ dateKey: string }>;
    availabilitySlotOverrides: Array<{ dateKey: string; time: string; action: string }>;
  } = profilePatchBody as {
    languages: string[];
    specializations: string[];
    consultationModes: string[];
    availabilitySlots: Array<{ weekday: number; time: string }>;
    availabilityExceptions: Array<{ dateKey: string }>;
    availabilitySlotOverrides: Array<{ dateKey: string; time: string; action: string }>;
  };
  expect(submittedProfileBody.languages).toEqual(['lang-en', 'lang-hi', 'lang-mr']);
  expect(submittedProfileBody.specializations).toEqual([
    'spec-family',
    'spec-property',
    'spec-cyber',
  ]);
  expect(submittedProfileBody.consultationModes).toEqual(['VIDEO', 'CALL', 'IN_PERSON']);
  expect(submittedProfileBody.availabilitySlots).toEqual(
    expect.arrayContaining([
      { weekday: 1, time: '10:00' },
      { weekday: 1, time: '09:00' },
    ])
  );
  expect(submittedProfileBody.availabilityExceptions).toEqual([
    { dateKey: '2026-03-20' },
    { dateKey: '2026-03-25' },
  ]);
  expect(submittedProfileBody.availabilitySlotOverrides).toEqual([
    { dateKey: '2026-03-22', time: '14:30', action: 'OPEN_SLOT' },
    { dateKey: '2026-03-23', time: '10:00', action: 'BLOCK_SLOT' },
    { dateKey: '2026-03-26', time: '16:00', action: 'OPEN_SLOT' },
  ]);
});

test('lawyer verification workspace submits review evidence', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.route('**/api/appointments*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ appointments: [] }),
    });
  });

  await page.route('**/api/lawyers/profile/options', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(E2E_PROFILE_OPTIONS),
    });
  });

  let uploadCount = 0;
  await page.route('**/api/lawyers/verification/documents', async (route) => {
    uploadCount += 1;

    const uploadResponses = [
      {
        documentId: 'doc-identity',
        fileName: 'identity.pdf',
        url: '/api/verification-documents/doc-identity',
      },
      {
        documentId: 'doc-enrollment',
        fileName: 'enrollment.pdf',
        url: '/api/verification-documents/doc-enrollment',
      },
      {
        documentId: 'doc-practice',
        fileName: 'practice.pdf',
        url: '/api/verification-documents/doc-practice',
      },
    ];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(uploadResponses[uploadCount - 1] ?? uploadResponses[0]),
    });
  });

  let verificationBody: Record<string, unknown> | null = null;
  await page.route('**/api/lawyers/verification', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }

    verificationBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        verificationStatus: 'UNDER_REVIEW',
        latestCase: {
          id: 'case-e2e-2',
          status: 'UNDER_REVIEW',
          submittedBarCouncilId: 'DL/2024/7788',
          identityDocumentUrl: '/api/verification-documents/doc-identity',
          enrollmentCertificateUrl: '/api/verification-documents/doc-enrollment',
          practiceCertificateUrl: '/api/verification-documents/doc-practice',
          lawyerNotes: 'Updated E2E verification submission.',
          adminNotes: null,
          submittedAt: '2026-03-13T10:00:00.000Z',
          reviewedAt: null,
        },
      }),
    });
  });

  await page.goto('/en/e2e/lawyer-dashboard');
  await page.getByTestId('lawyer-tab-verification').click();

  await page.getByTestId('verification-identity-document-file').setInputFiles({
    name: 'identity.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('identity pdf'),
  });
  await page.getByTestId('verification-enrollment-certificate-file').setInputFiles({
    name: 'enrollment.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('enrollment pdf'),
  });
  await page.getByTestId('verification-practice-certificate-file').setInputFiles({
    name: 'practice.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('practice pdf'),
  });
  await page.getByTestId('verification-lawyer-notes').fill(
    'Updated E2E verification submission.'
  );
  await page.getByTestId('verification-submit-button').click();

  await expect(page.getByTestId('verification-submit-success')).toBeVisible();
  expect(verificationBody).not.toBeNull();
  if (!verificationBody) {
    throw new Error('Expected verification submission payload to be captured.');
  }
  const submittedVerificationBody: {
    identityDocumentUrl: string;
    enrollmentCertificateUrl: string;
  } = verificationBody as {
    identityDocumentUrl: string;
    enrollmentCertificateUrl: string;
  };
  expect(submittedVerificationBody.identityDocumentUrl).toBe(
    '/api/verification-documents/doc-identity'
  );
  expect(submittedVerificationBody.enrollmentCertificateUrl).toBe(
    '/api/verification-documents/doc-enrollment'
  );
});

test('citizen booking flow handles blocked days, blocked recurring slots, and one-off extra slots', async ({ page }) => {
  await routeCitizenSession(page);

  await page.route('**/api/lawyers/e2e-lawyer-profile*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        lawyer: {
          id: 'e2e-lawyer-profile',
          consultationFee: 1800,
          isVerified: true,
          user: {
            name: 'Adv. Test Lawyer',
            image: null,
          },
          specializations: [{ name: 'Property Law' }],
          modes: [{ mode: 'VIDEO' }, { mode: 'CALL' }],
        },
      }),
    });
  });

  await page.route('**/api/lawyers/e2e-lawyer-profile/availability*', async (route) => {
    const requestUrl = new URL(route.request().url());
    const date = requestUrl.searchParams.get('date');

    if (date === '2026-03-20') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          date,
          weekday: 5,
          isBlockedDate: true,
          configuredSlots: ['10:00', '11:30'],
          openSlotOverrides: [],
          blockedSlotOverrides: [],
          bookedSlots: [],
          effectiveSlots: [],
          availableSlots: [],
        }),
      });
      return;
    }

    if (date === '2026-03-22') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          date,
          weekday: 0,
          isBlockedDate: false,
          configuredSlots: [],
          openSlotOverrides: ['14:30'],
          blockedSlotOverrides: [],
          bookedSlots: [],
          effectiveSlots: ['14:30'],
          availableSlots: ['14:30'],
        }),
      });
      return;
    }

    if (date === '2026-03-23') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          date,
          weekday: 1,
          isBlockedDate: false,
          configuredSlots: ['10:00', '11:30'],
          openSlotOverrides: [],
          blockedSlotOverrides: ['10:00'],
          bookedSlots: [],
          effectiveSlots: ['10:00', '11:30'],
          availableSlots: ['11:30'],
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        date,
        weekday: 6,
        isBlockedDate: false,
        configuredSlots: ['10:00', '11:30'],
        openSlotOverrides: [],
        blockedSlotOverrides: [],
        bookedSlots: [],
        effectiveSlots: ['10:00', '11:30'],
        availableSlots: ['10:00', '11:30'],
      }),
    });
  });

  await page.goto('/en/book/e2e-lawyer-profile');

  await page.getByTestId('booking-mode-VIDEO').click();
  await page.getByTestId('booking-date-input').fill('2026-03-20');

  await expect(page.getByTestId('booking-availability-message')).toContainText(
    'unavailable on the selected date'
  );
  await expect(page.getByTestId('booking-continue-step1')).toBeDisabled();

  await page.getByTestId('booking-date-input').fill('2026-03-22');
  await expect(page.getByTestId('booking-time-14-30')).toBeVisible();
  await page.getByTestId('booking-time-14-30').click();
  await expect(page.getByTestId('booking-continue-step1')).toBeEnabled();

  await page.getByTestId('booking-date-input').fill('2026-03-23');
  await expect(page.getByTestId('booking-time-10-00')).toHaveCount(0);
  await expect(page.getByTestId('booking-time-11-30')).toBeVisible();
  await page.getByTestId('booking-time-11-30').click();
  await expect(page.getByTestId('booking-continue-step1')).toBeEnabled();
});

test('admin review dashboard saves verification and template decisions', async ({ page }) => {
  await routeAnonymousSession(page);

  await page.route('**/api/admin/verification-cases', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        cases: [
          {
            id: 'case-1',
            status: 'UNDER_REVIEW',
            submittedBarCouncilId: 'DL/2024/7788',
            identityDocumentUrl: 'https://example.com/identity.pdf',
            enrollmentCertificateUrl: 'https://example.com/enrolment.pdf',
            practiceCertificateUrl: null,
            lawyerNotes: 'Please review urgently.',
            adminNotes: null,
            submittedAt: '2026-03-12T10:00:00.000Z',
            reviewedAt: null,
            lawyerProfile: {
              id: 'lawyer-profile-1',
              city: 'New Delhi',
              state: 'Delhi',
              barCouncilID: 'DL/2024/7788',
              isVerified: false,
              user: {
                id: 'user-1',
                name: 'Adv. Test Lawyer',
                email: 'lawyer-e2e@lexindia.test',
              },
            },
          },
        ],
      }),
    });
  });

  await page.route('**/api/admin/templates', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        templates: [
          {
            id: 'template-1',
            title: 'Consumer Complaint Notice',
            category: 'Consumer Law',
            downloads: 14,
            editorialStatus: 'REVIEW',
            reviewerNotes: null,
            reviewedAt: null,
          },
        ],
      }),
    });
  });

  await page.route('**/api/admin/faqs', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        faqs: [
          {
            id: 'faq-1',
            question: 'Can police refuse to register an FIR?',
            editorialStatus: 'REVIEW',
            reviewerNotes: null,
            reviewedAt: null,
            category: {
              id: 'category-1',
              name: 'Criminal Law',
            },
          },
        ],
      }),
    });
  });

  await page.route('**/api/admin/guides', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        guides: [
          {
            id: 'guide-1',
            slug: 'how-to-file-fir',
            title: 'How to File an FIR',
            category: 'Criminal Law',
            readTime: 6,
            hasPublishedContent: true,
            editorialStatus: 'REVIEW',
            reviewerNotes: null,
            reviewedAt: null,
          },
        ],
      }),
    });
  });

  await page.route('**/api/admin/rights', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        rights: [
          {
            id: 'right-1',
            slug: 'women',
            title: "Women's Rights",
            editorialStatus: 'REVIEW',
            reviewerNotes: null,
            reviewedAt: null,
          },
        ],
      }),
    });
  });

  await page.route('**/api/admin/laws', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        laws: [
          {
            id: 'law-1',
            slug: 'information-technology-act-2000',
            shortCode: 'ITA',
            title: 'Information Technology Act, 2000',
            description: 'Cyber-law review queue entry.',
            editorialStatus: 'REVIEW',
            reviewerNotes: null,
            reviewedAt: null,
            sections: [{ id: 'section-1', editorialStatus: 'REVIEW' }],
          },
        ],
      }),
    });
  });

  await page.route('**/api/admin/law-sections', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        lawSections: [
          {
            id: 'law-section-1',
            sectionKey: 'Section 67',
            title: 'Publishing obscene material in electronic form',
            plainEnglish: 'Needs review.',
            editorialStatus: 'REVIEW',
            reviewerNotes: null,
            reviewedAt: null,
            act: {
              id: 'law-1',
              slug: 'information-technology-act-2000',
              shortCode: 'ITA',
              title: 'Information Technology Act, 2000',
            },
          },
        ],
      }),
    });
  });

  let verificationReviewBody: Record<string, unknown> | null = null;
  await page.route('**/api/admin/verification-cases/*', async (route) => {
    verificationReviewBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        case: {
          id: 'case-1',
          status: 'APPROVED',
          submittedBarCouncilId: 'DL/2024/7788',
          identityDocumentUrl: 'https://example.com/identity.pdf',
          enrollmentCertificateUrl: 'https://example.com/enrolment.pdf',
          practiceCertificateUrl: null,
          lawyerNotes: 'Please review urgently.',
          adminNotes: 'Approved after reviewing the enrolment certificate.',
          submittedAt: '2026-03-12T10:00:00.000Z',
          reviewedAt: '2026-03-13T11:00:00.000Z',
          lawyerProfile: {
            id: 'lawyer-profile-1',
            city: 'New Delhi',
            state: 'Delhi',
            barCouncilID: 'DL/2024/7788',
            isVerified: true,
            user: {
              id: 'user-1',
              name: 'Adv. Test Lawyer',
              email: 'lawyer-e2e@lexindia.test',
            },
          },
        },
      }),
    });
  });

  let templateReviewBody: Record<string, unknown> | null = null;
  await page.route('**/api/admin/templates/*', async (route) => {
    templateReviewBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        template: {
          id: 'template-1',
          editorialStatus: 'APPROVED',
          reviewerNotes: 'Ready for public download.',
          reviewedAt: '2026-03-13T11:05:00.000Z',
        },
      }),
    });
  });

  let faqReviewBody: Record<string, unknown> | null = null;
  await page.route('**/api/admin/faqs/*', async (route) => {
    faqReviewBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        faq: {
          id: 'faq-1',
          editorialStatus: 'APPROVED',
          reviewerNotes: 'Approved after legal review.',
          reviewedAt: '2026-03-13T11:10:00.000Z',
          category: {
            id: 'category-1',
            name: 'Criminal Law',
          },
        },
      }),
    });
  });

  let guideReviewBody: Record<string, unknown> | null = null;
  await page.route('**/api/admin/guides/*', async (route) => {
    guideReviewBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        guide: {
          id: 'guide-1',
          editorialStatus: 'APPROVED',
          reviewerNotes: 'Approved and safe for public awareness use.',
          reviewedAt: '2026-03-13T11:15:00.000Z',
        },
      }),
    });
  });

  let rightReviewBody: Record<string, unknown> | null = null;
  await page.route('**/api/admin/rights/*', async (route) => {
    rightReviewBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        right: {
          id: 'right-1',
          editorialStatus: 'APPROVED',
          reviewerNotes: 'Approved for public awareness publication.',
          reviewedAt: '2026-03-13T11:20:00.000Z',
        },
      }),
    });
  });

  let lawReviewBody: Record<string, unknown> | null = null;
  await page.route('**/api/admin/laws/*', async (route) => {
    lawReviewBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        law: {
          id: 'law-1',
          editorialStatus: 'APPROVED',
          reviewerNotes: 'Approved as reviewed cyber-law act coverage.',
          reviewedAt: '2026-03-13T11:25:00.000Z',
          sections: [{ id: 'section-1', editorialStatus: 'REVIEW' }],
        },
      }),
    });
  });

  let lawSectionReviewBody: Record<string, unknown> | null = null;
  await page.route('**/api/admin/law-sections/*', async (route) => {
    lawSectionReviewBody = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        lawSection: {
          id: 'law-section-1',
          editorialStatus: 'APPROVED',
          reviewerNotes: 'Approved after section-level editorial check.',
          reviewedAt: '2026-03-13T11:30:00.000Z',
          act: {
            id: 'law-1',
            slug: 'information-technology-act-2000',
            shortCode: 'ITA',
            title: 'Information Technology Act, 2000',
          },
        },
      }),
    });
  });

  await page.goto('/en/e2e/admin-dashboard');
  const adminMain = page.locator('main');

  await expect(adminMain.getByTestId('admin-verification-pending-count').first()).toHaveText('1');
  await expect(adminMain.getByTestId('admin-template-pending-count').first()).toHaveText('1');
  await expect(adminMain.getByTestId('admin-faq-pending-count').first()).toHaveText('1');
  await expect(adminMain.getByTestId('admin-guide-pending-count').first()).toHaveText('1');
  await expect(adminMain.getByTestId('admin-rights-pending-count').first()).toHaveText('1');
  await expect(adminMain.getByTestId('admin-laws-pending-count').first()).toHaveText('1');
  await expect(adminMain.getByTestId('admin-law-sections-pending-count').first()).toHaveText('1');

  await page.getByTestId('verification-case-status-case-1').selectOption('APPROVED');
  await page.getByTestId('verification-case-notes-case-1').fill(
    'Approved after reviewing the enrolment certificate.'
  );
  await page.getByTestId('verification-case-save-case-1').click();

  await expect(adminMain.getByTestId('admin-verification-pending-count').first()).toHaveText('0');
  expect(verificationReviewBody).toEqual({
    status: 'APPROVED',
    adminNotes: 'Approved after reviewing the enrolment certificate.',
  });

  await page.getByTestId('template-review-status-template-1').selectOption('APPROVED');
  await page.getByTestId('template-review-notes-template-1').fill(
    'Ready for public download.'
  );
  await page.getByTestId('template-review-save-template-1').click();

  await expect(adminMain.getByTestId('admin-template-pending-count').first()).toHaveText('0');
  expect(templateReviewBody).toEqual({
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Ready for public download.',
  });

  await page.getByTestId('faq-review-status-faq-1').selectOption('APPROVED');
  await page.getByTestId('faq-review-notes-faq-1').fill('Approved after legal review.');
  await page.getByTestId('faq-review-save-faq-1').click();

  await expect(adminMain.getByTestId('admin-faq-pending-count').first()).toHaveText('0');
  expect(faqReviewBody).toEqual({
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Approved after legal review.',
  });

  await page.getByTestId('guide-review-status-guide-1').selectOption('APPROVED');
  await page.getByTestId('guide-review-notes-guide-1').fill(
    'Approved and safe for public awareness use.'
  );
  await page.getByTestId('guide-review-save-guide-1').click();

  await expect(adminMain.getByTestId('admin-guide-pending-count').first()).toHaveText('0');
  expect(guideReviewBody).toEqual({
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Approved and safe for public awareness use.',
  });

  await page.getByTestId('right-review-status-right-1').selectOption('APPROVED');
  await page.getByTestId('right-review-notes-right-1').fill(
    'Approved for public awareness publication.'
  );
  await page.getByTestId('right-review-save-right-1').click();

  await expect(adminMain.getByTestId('admin-rights-pending-count').first()).toHaveText('0');
  expect(rightReviewBody).toEqual({
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Approved for public awareness publication.',
  });

  await page.getByTestId('law-review-status-law-1').selectOption('APPROVED');
  await page.getByTestId('law-review-notes-law-1').fill(
    'Approved as reviewed cyber-law act coverage.'
  );
  await page.getByTestId('law-review-save-law-1').click();

  await expect(adminMain.getByTestId('admin-laws-pending-count').first()).toHaveText('0');
  expect(lawReviewBody).toEqual({
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Approved as reviewed cyber-law act coverage.',
  });

  await page.getByTestId('law-section-review-status-law-section-1').selectOption('APPROVED');
  await page.getByTestId('law-section-review-notes-law-section-1').fill(
    'Approved after section-level editorial check.'
  );
  await page.getByTestId('law-section-review-save-law-section-1').click();

  await expect(adminMain.getByTestId('admin-law-sections-pending-count').first()).toHaveText('0');
  expect(lawSectionReviewBody).toEqual({
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Approved after section-level editorial check.',
  });
});

const assert = require('node:assert/strict');

const {
  getEditorialStatusLabel,
  normalizeEditorialStatus,
} = require('../../lib/editorial-review.ts');
const {
  isAvailabilitySlotOverrideAction,
  isAvailabilityDateKey,
  getIndiaDateKey,
  getIndiaTimeKey,
  parseAvailabilitySlotKey,
  sortAvailabilityExceptions,
  sortAvailabilitySlotOverrides,
  serializeAvailabilitySlot,
} = require('../../lib/availability.ts');
const { getConfiguredAdminEmails, isAdminUser } = require('../../lib/admin.ts');
const { getDashboardPath } = require('../../lib/dashboard.ts');
const {
  getTemplateAvailability,
  normalizeTemplateEditorialStatus,
} = require('../../lib/template-review.ts');
const { getLawyerVerificationStatus } = require('../../lib/verification.ts');
const { getVerificationStorageMode } = require('../../lib/verification-storage.ts');
const {
  extractVerificationDocumentIdFromUrl,
} = require('../../lib/verification-documents.ts');
const {
  buildExpandedDiscoveryTerms,
  searchDiscoveryDocuments,
} = require('../../lib/discovery-search.ts');

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

runTest('approved verification cases resolve to VERIFIED', () => {
  assert.equal(
    getLawyerVerificationStatus({
      verificationCases: [{ status: 'APPROVED' }],
      isVerified: false,
      barCouncilID: 'DL/2012/1432',
    }),
    'VERIFIED'
  );
});

runTest('changes requested verification cases resolve to ACTION_REQUIRED', () => {
  assert.equal(
    getLawyerVerificationStatus({
      verificationCases: [{ status: 'CHANGES_REQUESTED' }],
      isVerified: false,
      barCouncilID: 'DL/2012/1432',
    }),
    'ACTION_REQUIRED'
  );
});

runTest('template availability only becomes downloadable when approved and complete', () => {
  const approved = getTemplateAvailability({
    editorialStatus: 'APPROVED',
    content:
      'This is a completed legal template with enough reviewed language to exceed the minimum content threshold without placeholder markers. It contains practical clauses, defined placeholders, and filing instructions for the intended use.',
  });
  const pending = getTemplateAvailability({
    editorialStatus: 'REVIEW',
    content:
      'This is a completed legal template with enough reviewed language to exceed the minimum content threshold without placeholder markers. It contains practical clauses, defined placeholders, and filing instructions for the intended use.',
  });

  assert.equal(approved.isReadyForDownload, true);
  assert.equal(pending.isReadyForDownload, false);
  assert.equal(pending.editorialStatus, 'REVIEW');
});

runTest('template editorial status normalization falls back safely', () => {
  assert.equal(normalizeTemplateEditorialStatus('approved'), 'APPROVED');
  assert.equal(normalizeTemplateEditorialStatus('unknown'), 'REVIEW');
  assert.equal(normalizeTemplateEditorialStatus(null), 'REVIEW');
});

runTest('editorial status helpers normalize and label guide states safely', () => {
  assert.equal(normalizeEditorialStatus('approved', 'DRAFT'), 'APPROVED');
  assert.equal(normalizeEditorialStatus('invalid', 'DRAFT'), 'DRAFT');
  assert.equal(getEditorialStatusLabel('REVIEW'), 'Under review');
  assert.equal(getEditorialStatusLabel('DRAFT'), 'In progress');
});

runTest('admin email helper recognizes configured admin users', () => {
  const previousAdminEmails = process.env.ADMIN_EMAILS;
  const previousLexIndiaAdminEmails = process.env.LEXINDIA_ADMIN_EMAILS;

  process.env.ADMIN_EMAILS = 'admin@example.com';
  process.env.LEXINDIA_ADMIN_EMAILS = 'ops@example.com';

  try {
    assert.deepEqual(getConfiguredAdminEmails(), ['ops@example.com', 'admin@example.com']);
    assert.equal(isAdminUser({ role: 'CITIZEN', email: 'ops@example.com' }), true);
    assert.equal(isAdminUser({ role: 'ADMIN', email: 'someone@example.com' }), true);
    assert.equal(isAdminUser({ role: 'LAWYER', email: 'lawyer@example.com' }), false);
  } finally {
    if (previousAdminEmails === undefined) {
      delete process.env.ADMIN_EMAILS;
    } else {
      process.env.ADMIN_EMAILS = previousAdminEmails;
    }

    if (previousLexIndiaAdminEmails === undefined) {
      delete process.env.LEXINDIA_ADMIN_EMAILS;
    } else {
      process.env.LEXINDIA_ADMIN_EMAILS = previousLexIndiaAdminEmails;
    }
  }
});

runTest('verification storage mode only enables Supabase when fully configured', () => {
  const previousProvider = process.env.LEXINDIA_VERIFICATION_STORAGE_PROVIDER;
  const previousSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousBucket = process.env.LEXINDIA_VERIFICATION_STORAGE_BUCKET;

  process.env.LEXINDIA_VERIFICATION_STORAGE_PROVIDER = 'SUPABASE';
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.LEXINDIA_VERIFICATION_STORAGE_BUCKET = 'docs';

  try {
    assert.equal(getVerificationStorageMode(), 'DATABASE');
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
    assert.equal(getVerificationStorageMode(), 'SUPABASE');
  } finally {
    if (previousProvider === undefined) {
      delete process.env.LEXINDIA_VERIFICATION_STORAGE_PROVIDER;
    } else {
      process.env.LEXINDIA_VERIFICATION_STORAGE_PROVIDER = previousProvider;
    }

    if (previousSupabaseUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = previousSupabaseUrl;
    }

    if (previousServiceRoleKey === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = previousServiceRoleKey;
    }

    if (previousBucket === undefined) {
      delete process.env.LEXINDIA_VERIFICATION_STORAGE_BUCKET;
    } else {
      process.env.LEXINDIA_VERIFICATION_STORAGE_BUCKET = previousBucket;
    }
  }
});

runTest('dashboard path prefers admin and otherwise routes by role', () => {
  assert.equal(getDashboardPath({ isAdmin: true, role: 'CITIZEN' }), '/dashboard/admin');
  assert.equal(getDashboardPath({ isAdmin: false, role: 'LAWYER' }), '/dashboard/lawyer');
  assert.equal(getDashboardPath({ isAdmin: false, role: 'CITIZEN' }), '/dashboard/citizen');
  assert.equal(getDashboardPath(null), '/dashboard/citizen');
});

runTest('availability slot keys round-trip safely', () => {
  const serialized = serializeAvailabilitySlot({ weekday: 1, time: '10:00' });
  assert.equal(serialized, '1:10:00');
  assert.deepEqual(parseAvailabilitySlotKey(serialized), { weekday: 1, time: '10:00' });
  assert.equal(parseAvailabilitySlotKey('9:25:00'), null);
});

runTest('availability exception helpers validate and sort blocked dates', () => {
  assert.equal(isAvailabilityDateKey('2026-03-25'), true);
  assert.equal(isAvailabilityDateKey('25-03-2026'), false);
  assert.deepEqual(
    sortAvailabilityExceptions([{ dateKey: '2026-03-26' }, { dateKey: '2026-03-20' }]),
    [{ dateKey: '2026-03-20' }, { dateKey: '2026-03-26' }]
  );
});

runTest('availability slot override helpers validate and sort one-off slot changes', () => {
  assert.equal(isAvailabilitySlotOverrideAction('BLOCK_SLOT'), true);
  assert.equal(isAvailabilitySlotOverrideAction('OPEN_SLOT'), true);
  assert.equal(isAvailabilitySlotOverrideAction('INVALID'), false);
  assert.deepEqual(
    sortAvailabilitySlotOverrides([
      { dateKey: '2026-03-26', time: '14:30', action: 'OPEN_SLOT' },
      { dateKey: '2026-03-20', time: '10:00', action: 'BLOCK_SLOT' },
    ]),
    [
      { dateKey: '2026-03-20', time: '10:00', action: 'BLOCK_SLOT' },
      { dateKey: '2026-03-26', time: '14:30', action: 'OPEN_SLOT' },
    ]
  );
});

runTest('India date helpers preserve local booking date and time', () => {
  const booking = new Date('2026-03-13T04:30:00.000Z');
  assert.equal(getIndiaDateKey(booking), '2026-03-13');
  assert.equal(getIndiaTimeKey(booking), '10:00');
});

runTest('verification document URL parser only accepts internal document routes', () => {
  assert.equal(
    extractVerificationDocumentIdFromUrl('/api/verification-documents/doc123'),
    'doc123'
  );
  assert.equal(
    extractVerificationDocumentIdFromUrl('https://example.com/document.pdf'),
    null
  );
  assert.equal(extractVerificationDocumentIdFromUrl(null), null);
});

runTest('discovery search expands structured code references safely', () => {
  const expanded = buildExpandedDiscoveryTerms('IPC 420');

  assert.equal(expanded.structuredReferences.includes('section 420'), true);
  assert.equal(expanded.phraseVariants.includes('ipc 420'), true);
  assert.equal(expanded.phraseVariants.includes('indian penal code 420'), true);
});

runTest('discovery search handles typo-tolerant legal queries', () => {
  const results = searchDiscoveryDocuments(
    [
      {
        documentType: 'LAW_SECTION',
        href: '/laws/hindu-marriage-act-1955/Section%2013B',
        title: 'Section 13B: Divorce by mutual consent',
        description: 'Hindu Marriage Act, 1955 - mutual consent divorce guidance.',
        searchText:
          'mutual consent divorce mutual divorce matrimonial relief sec 13b hma section 13b',
        rankBoost: 1.2,
        updatedAt: '2026-03-14T00:00:00.000Z',
      },
    ],
    'mutul consent divorse'
  );

  assert.equal(results.laws[0]?.title, 'Section 13B: Divorce by mutual consent');
});

runTest('discovery search maps legacy crosswalk queries into current law results', () => {
  const results = searchDiscoveryDocuments(
    [
      {
        documentType: 'LAW_SECTION',
        href: '/laws/bharatiya-nyaya-sanhita-2023/Section%20318',
        title: 'Section 318: Cheating',
        description: 'Bharatiya Nyaya Sanhita, 2023 - current cheating provision.',
        searchText:
          'bns bharatiya nyaya sanhita section 318 ipc 420 cheating and dishonestly inducing delivery of property',
        rankBoost: 1.2,
        updatedAt: '2026-03-14T00:00:00.000Z',
      },
    ],
    'IPC 420'
  );

  assert.equal(results.laws[0]?.title, 'Section 318: Cheating');
});

console.log('All trust workflow checks passed.');

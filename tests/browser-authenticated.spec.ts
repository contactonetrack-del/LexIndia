import { expect, test, type Page } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const AUTH_PASSWORD = 'LexIndiaE2E#2026';
const LAWYER_EMAIL = 'lawyer-auth-e2e@lexindia.test';
const ADMIN_EMAIL = 'admin-auth-e2e@lexindia.test';

let seededVerificationCaseId = '';

async function ensureAuthenticatedFixtures() {
  const hashedPassword = await bcrypt.hash(AUTH_PASSWORD, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: 'Authenticated E2E Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
    create: {
      name: 'Authenticated E2E Admin',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const lawyerUser = await prisma.user.upsert({
    where: { email: LAWYER_EMAIL },
    update: {
      name: 'Authenticated E2E Lawyer',
      password: hashedPassword,
      role: 'LAWYER',
      emailVerified: new Date(),
    },
    create: {
      name: 'Authenticated E2E Lawyer',
      email: LAWYER_EMAIL,
      password: hashedPassword,
      role: 'LAWYER',
      emailVerified: new Date(),
    },
  });

  const lawyerProfile = await prisma.lawyerProfile.upsert({
    where: { userId: lawyerUser.id },
    update: {
      city: 'New Delhi',
      state: 'Delhi',
      experienceYears: 7,
      consultationFee: 1500,
      bio: 'Authenticated E2E lawyer fixture.',
      barCouncilID: 'DL/AUTH/2026/5511',
      isVerified: false,
    },
    create: {
      userId: lawyerUser.id,
      city: 'New Delhi',
      state: 'Delhi',
      experienceYears: 7,
      consultationFee: 1500,
      bio: 'Authenticated E2E lawyer fixture.',
      barCouncilID: 'DL/AUTH/2026/5511',
      isVerified: false,
    },
  });

  await prisma.lawyerConsultationMode.deleteMany({
    where: { lawyerProfileId: lawyerProfile.id },
  });
  await prisma.lawyerConsultationMode.createMany({
    data: [{ lawyerProfileId: lawyerProfile.id, mode: 'VIDEO' }],
    skipDuplicates: true,
  });

  await prisma.availabilitySlot.deleteMany({
    where: { lawyerProfileId: lawyerProfile.id },
  });
  await prisma.availabilitySlot.createMany({
    data: [
      { lawyerProfileId: lawyerProfile.id, weekday: 1, time: '10:00' },
      { lawyerProfileId: lawyerProfile.id, weekday: 3, time: '14:30' },
    ],
    skipDuplicates: true,
  });

  await prisma.availabilityDateException.deleteMany({
    where: { lawyerProfileId: lawyerProfile.id },
  });
  await prisma.availabilitySlotOverride.deleteMany({
    where: { lawyerProfileId: lawyerProfile.id },
  });

  await prisma.lawyerVerificationCase.deleteMany({
    where: { lawyerProfileId: lawyerProfile.id },
  });

  const verificationCase = await prisma.lawyerVerificationCase.create({
    data: {
      lawyerProfileId: lawyerProfile.id,
      submittedBarCouncilId: 'DL/AUTH/2026/5511',
      lawyerNotes: 'Authenticated E2E verification review fixture.',
      status: 'UNDER_REVIEW',
    },
  });

  seededVerificationCaseId = verificationCase.id;

  return { adminUser, lawyerUser, lawyerProfile };
}

async function loginWithCredentials(
  page: Page,
  email: string,
  password: string,
  expectedDashboardPath: RegExp
) {
  await page.goto('/en');
  await page.getByTestId('header-login-button').click();
  await expect(page.getByTestId('auth-modal')).toBeVisible();

  await page.getByTestId('auth-email-input').fill(email);
  await page.getByTestId('auth-password-input').fill(password);
  await page.getByTestId('auth-submit-button').click();

  await expect(page).toHaveURL(expectedDashboardPath);
}

test.beforeAll(async () => {
  await ensureAuthenticatedFixtures();
});

test.afterAll(async () => {
  await prisma.$disconnect();
});

test('lawyer credentials can access the real protected lawyer dashboard', async ({ page }) => {
  await loginWithCredentials(page, LAWYER_EMAIL, AUTH_PASSWORD, /\/en\/dashboard\/lawyer$/);

  await expect(page).toHaveURL(/\/en\/dashboard\/lawyer$/);
  await expect(page.getByTestId('lawyer-tab-edit-profile')).toBeVisible();
  await page.getByTestId('lawyer-tab-edit-profile').click();
  await expect(page.getByTestId('lawyer-edit-profile-form')).toBeVisible();
  await expect(page.getByTestId('lawyer-save-profile-button')).toBeVisible();
});

test('admin credentials can access the real protected admin dashboard', async ({ page }) => {
  await loginWithCredentials(page, ADMIN_EMAIL, AUTH_PASSWORD, /\/en\/dashboard\/admin$/);

  await expect(page).toHaveURL(/\/en\/dashboard\/admin$/);
  await expect(page.getByTestId('admin-verification-pending-count')).toBeVisible();
  await expect(page.getByTestId(`verification-case-${seededVerificationCaseId}`)).toBeVisible();
});

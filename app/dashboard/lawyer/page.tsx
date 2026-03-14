import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { localizeFields, localizeNamedEntity } from '@/lib/i18n/db';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import prisma from '@/lib/prisma';
import LawyerDashboardClient from './LawyerDashboardClient';

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  return createLocalizedMetadata({
    locale,
    pathname: '/dashboard/lawyer',
    title: `${messages.dashboard.lawyerPortal} | LexIndia`,
    description: messages.dashboard.completeProfileDesc,
  });
}

export default async function LawyerDashboard() {
  const locale = await getRequestLocale();
  const session = await getServerSession(authOptions);
  if (!session) redirect(withLocalePrefix('/', locale));
  if (session.user.role === 'CITIZEN') redirect(withLocalePrefix('/dashboard/citizen', locale));

  const profile = await prisma.lawyerProfile.findFirst({
    where: { userId: session.user.id },
    include: {
      translations: true,
      specializations: { include: { translations: true } },
      languages: { include: { translations: true } },
      modes: true,
      availabilityExceptions: {
        select: { id: true, dateKey: true },
        orderBy: [{ dateKey: 'asc' }],
      },
      availabilitySlotOverrides: {
        select: { id: true, dateKey: true, time: true, action: true },
        orderBy: [{ dateKey: 'asc' }, { time: 'asc' }],
      },
      availabilitySlots: {
        select: { id: true, weekday: true, time: true },
        orderBy: [{ weekday: 'asc' }, { time: 'asc' }],
      },
      verificationCases: {
        select: {
          id: true,
          status: true,
          submittedBarCouncilId: true,
          identityDocumentUrl: true,
          enrollmentCertificateUrl: true,
          practiceCertificateUrl: true,
          lawyerNotes: true,
          adminNotes: true,
          submittedAt: true,
          reviewedAt: true,
        },
        orderBy: { submittedAt: 'desc' },
        take: 1,
      },
    },
  });

  const localizedProfile = profile
    ? {
        ...localizeFields(profile, profile.translations, locale, ['bio']),
        specializations: profile.specializations.map((specialization) =>
          localizeNamedEntity(specialization, locale)
        ),
        languages: profile.languages.map((language) => localizeNamedEntity(language, locale)),
      }
    : null;

  return <LawyerDashboardClient user={session.user} profile={localizedProfile} />;
}

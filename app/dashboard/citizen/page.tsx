import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getMessages } from '@/lib/i18n/messages';
import { getRequestLocale } from '@/lib/i18n/request';
import CitizenDashboardClient from './CitizenDashboardClient';

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  return createLocalizedMetadata({
    locale,
    pathname: '/dashboard/citizen',
    title: `${messages.dashboard.title} | LexIndia`,
    description: messages.dashboard.myAppointmentsDesc,
  });
}

export default async function CitizenDashboard() {
  const locale = await getRequestLocale();
  const session = await getServerSession(authOptions);
  if (!session) redirect(withLocalePrefix('/', locale));
  if (session.user.role === 'LAWYER') redirect(withLocalePrefix('/dashboard/lawyer', locale));

  return <CitizenDashboardClient user={session.user} />;
}

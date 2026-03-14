import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { isAdminUser } from '@/lib/admin';
import { authOptions } from '@/lib/auth';
import { getDashboardPath } from '@/lib/dashboard';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { getRequestLocale } from '@/lib/i18n/request';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/dashboard/admin',
    title: `Admin Review | LexIndia`,
    description: messages.dashboard.completeProfileDesc,
  });
}

export default async function AdminDashboardPage() {
  const locale = await getRequestLocale();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(withLocalePrefix('/', locale));
  }

  if (!isAdminUser(session.user)) {
    redirect(withLocalePrefix(getDashboardPath(session.user), locale));
  }

  return <AdminDashboardClient user={session.user} />;
}

import { notFound } from 'next/navigation';

import LawyerDashboardClient from '@/app/dashboard/lawyer/LawyerDashboardClient';
import { E2E_LAWYER_PROFILE, E2E_LAWYER_USER } from '@/lib/e2e-fixtures';
import { isE2EEnabled } from '@/lib/e2e';

export const dynamic = 'force-dynamic';

export default async function E2ELawyerDashboardPage() {
  if (!(await isE2EEnabled())) {
    notFound();
  }

  return <LawyerDashboardClient user={E2E_LAWYER_USER} profile={E2E_LAWYER_PROFILE} />;
}

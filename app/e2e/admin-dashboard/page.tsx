import { notFound } from 'next/navigation';

import AdminDashboardClient from '@/app/dashboard/admin/AdminDashboardClient';
import { E2E_ADMIN_USER } from '@/lib/e2e-fixtures';
import { isE2EEnabled } from '@/lib/e2e';

export const dynamic = 'force-dynamic';

export default async function E2EAdminDashboardPage() {
  if (!(await isE2EEnabled())) {
    notFound();
  }

  return <AdminDashboardClient user={E2E_ADMIN_USER} />;
}

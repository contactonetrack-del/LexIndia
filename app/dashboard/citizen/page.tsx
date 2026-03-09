import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import CitizenDashboardClient from './CitizenDashboardClient';

export const metadata = { title: 'Citizen Dashboard | LexIndia' };

export default async function CitizenDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  if (session.user.role === 'LAWYER') redirect('/dashboard/lawyer');

  return <CitizenDashboardClient user={session.user} />;
}

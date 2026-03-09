import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import LawyerDashboardClient from './LawyerDashboardClient';

export const metadata = { title: 'Lawyer Dashboard | LexIndia' };

export default async function LawyerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  if (session.user.role === 'CITIZEN') redirect('/dashboard/citizen');

  const profile = await prisma.lawyerProfile.findFirst({
    where: { userId: session.user.id },
    include: { specializations: true, languages: true, modes: true },
  });

  return <LawyerDashboardClient user={session.user} profile={profile} />;
}

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import JitsiRoomClient from './JitsiRoomClient';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { getRequestLocale } from '@/lib/i18n/request';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function VideoRoomPage(props: { params: Promise<{ appointmentId: string }> }) {
  const params = await props.params;
  const locale = await getRequestLocale();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const callbackUrl = encodeURIComponent(withLocalePrefix(`/dashboard/room/${params.appointmentId}`, locale));
    redirect(`${withLocalePrefix('/', locale)}?callbackUrl=${callbackUrl}`);
  }

  const copy = localizeTreeFromMemory({
    roomClosedTitle: 'Room closed',
    roomClosedBody: 'This consultation record does not exist or was removed.',
    returnToDashboard: 'Return to dashboard',
    accessDeniedTitle: 'Access denied',
    accessDeniedBody: 'You are not authorized to join this conference.',
    unavailableTitle: 'Consultation unavailable',
    unavailableBody: 'Video rooms are only accessible for confirmed consultations.',
    leaveRoom: 'Leave room',
    secureVideo: 'LexIndia secure video',
    appointmentPrefix: 'Appointment',
    citizenFallback: 'Citizen',
    lawyerFallback: 'Lawyer',
  } as const, locale);

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.appointmentId },
    include: {
      lawyer: { include: { user: true } },
      citizen: true,
    },
  });
  const dashboardHome = session.user.role === 'LAWYER'
    ? withLocalePrefix('/dashboard/lawyer', locale)
    : withLocalePrefix('/dashboard/citizen', locale);

  if (!appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.roomClosedTitle}</h1>
          <p className="mb-6 text-muted-foreground">{copy.roomClosedBody}</p>
          <Link
            href={dashboardHome}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {copy.returnToDashboard}
          </Link>
        </div>
      </div>
    );
  }

  const isCitizen = appointment.citizenId === session.user.id;
  const isLawyer = appointment.lawyer.userId === session.user.id;

  if (!isCitizen && !isLawyer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.accessDeniedTitle}</h1>
          <p className="mb-6 text-muted-foreground">{copy.accessDeniedBody}</p>
          <Link
            href={dashboardHome}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {copy.returnToDashboard}
          </Link>
        </div>
      </div>
    );
  }

  if (appointment.status !== 'CONFIRMED' && appointment.status !== 'COMPLETED') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.unavailableTitle}</h1>
          <p className="mb-6 text-muted-foreground">{copy.unavailableBody}</p>
          <Link
            href={dashboardHome}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {copy.returnToDashboard}
          </Link>
        </div>
      </div>
    );
  }

  const identityName = isCitizen
    ? appointment.citizen?.name || copy.citizenFallback
    : appointment.lawyer.user?.name || copy.lawyerFallback;
  const returnPath = isCitizen
    ? withLocalePrefix('/dashboard/citizen', locale)
    : withLocalePrefix('/dashboard/lawyer', locale);
  const meetingId = `LexIndia-Consultation-${appointment.id.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface p-4 text-foreground">
        <Link
          href={returnPath}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.leaveRoom}
        </Link>
        <div className="hidden text-center sm:block">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.secureVideo}</p>
          <p className="text-sm">{copy.appointmentPrefix}: {appointment.id.split('-')[0]}</p>
        </div>
        <div className="text-sm font-semibold text-muted-foreground">{identityName}</div>
      </div>

      <div className="relative w-full flex-1 bg-surface">
        <JitsiRoomClient
          roomName={meetingId}
          displayName={identityName}
          userEmail={session.user.email || ''}
        />
      </div>
    </div>
  );
}

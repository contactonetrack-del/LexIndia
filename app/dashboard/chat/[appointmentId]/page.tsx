import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ChatInterface from '@/components/chat/ChatInterface';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { getRequestLocale } from '@/lib/i18n/request';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ChatPage(props: { params: Promise<{ appointmentId: string }> }) {
  const params = await props.params;
  const locale = await getRequestLocale();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const callbackUrl = encodeURIComponent(withLocalePrefix(`/dashboard/chat/${params.appointmentId}`, locale));
    redirect(`${withLocalePrefix('/', locale)}?callbackUrl=${callbackUrl}`);
  }

  const copy = localizeTreeFromMemory({
    notFoundTitle: 'Appointment not found',
    notFoundBody: 'This consultation record does not exist or was removed.',
    deniedTitle: 'Access denied',
    deniedBody: 'You are not authorized to view this communication channel.',
    dashboardReturn: 'Return to dashboard',
    backToDashboard: 'Back to dashboard',
    secureMessaging: 'Secure messaging',
    appointmentLabel: 'Appointment',
    yourLawyer: 'Your lawyer',
    yourClient: 'Your client',
    legalNotice:
      'This chat is end-to-end bridged. Messages cannot be deleted once delivered. Treat all files attached as privileged attorney-client communication.',
  } as const, locale);
  const dashboardHome = withLocalePrefix(
    session.user.role === 'LAWYER' ? '/dashboard/lawyer' : '/dashboard/citizen',
    locale
  );

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.appointmentId },
    include: {
      lawyer: { include: { user: true } },
      citizen: true,
    },
  });

  if (!appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
           <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.notFoundTitle}</h1>
           <p className="mb-6 text-muted-foreground">{copy.notFoundBody}</p>
           <Link href={dashboardHome} className="font-semibold text-primary transition-colors hover:text-primary/80">
             {copy.dashboardReturn}
           </Link>
        </div>
      </div>
    );
  }

  const isCitizen = appointment.citizenId === session.user.id;
  const isLawyer = appointment.lawyer.userId === session.user.id;

  if (!isCitizen && !isLawyer) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
             <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.deniedTitle}</h1>
             <p className="mb-6 text-muted-foreground">{copy.deniedBody}</p>
             <Link href={dashboardHome} className="font-semibold text-primary transition-colors hover:text-primary/80">
               {copy.dashboardReturn}
             </Link>
          </div>
        </div>
      );
  }

  const otherUserName = isCitizen
    ? (appointment.lawyer.user?.name || copy.yourLawyer)
    : (appointment.citizen?.name || copy.yourClient);
  const returnPath = withLocalePrefix(
    isCitizen ? '/dashboard/citizen' : '/dashboard/lawyer',
    locale
  );

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={returnPath}
            className="flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> {copy.backToDashboard}
          </Link>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{copy.secureMessaging}</p>
            <p className="text-sm text-foreground">
              {copy.appointmentLabel}: {appointment.id.split('-')[0]}
            </p>
          </div>
        </div>

        <ChatInterface
          appointmentId={appointment.id}
          currentUserId={session.user.id}
          otherUserName={otherUserName}
        />

        <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
          {copy.legalNotice}
        </p>
      </div>
    </div>
  );
}

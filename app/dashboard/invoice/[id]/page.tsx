import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';
import InvoiceClient from './InvoiceClient';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const locale = await getRequestLocale();
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect(
      `${withLocalePrefix('/', locale)}?callbackUrl=${encodeURIComponent(withLocalePrefix(`/dashboard/invoice/${id}`, locale))}`
    );
  }

  // Fetch Appointment + related details
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      lawyer: {
        include: {
          user: true,
        }
      },
      citizen: true,
    }
  });

  if (!appointment) {
    return notFound();
  }

  // Security: Only the assigned Citizen or assigned Lawyer can view this invoice
  const isOwnerCitizen = session.user.id === appointment.citizenId;
  const isOwnerLawyer = session.user.id === appointment.lawyer.userId;
  
  if (!isOwnerCitizen && !isOwnerLawyer) {
     return notFound(); 
  }

  // Ensure an amount really exists before showing an invoice
  if ((appointment as any).amount === null || (appointment as any).amount === 0) {
    const copy = localizeTreeFromMemory({
      noInvoiceTitle: 'No invoice required',
      noInvoiceBody: 'This consultation was marked as free.',
    } as const, locale);

    return (
      <div className="flex min-h-screen items-center justify-center bg-muted p-4 text-center">
        <div>
           <h2 className="mb-2 text-2xl font-bold text-foreground">{copy.noInvoiceTitle}</h2>
           <p className="text-muted-foreground">{copy.noInvoiceBody}</p>
        </div>
      </div>
    );
  }

  return <InvoiceClient appointment={appointment as any} />;
}

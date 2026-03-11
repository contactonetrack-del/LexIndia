import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import InvoiceClient from './InvoiceClient';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/?callbackUrl=/dashboard');
  }

  const { id } = await params;

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
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div>
           <h2 className="text-2xl font-bold mb-2">No Invoice Required</h2>
           <p className="text-gray-600">This consultation was marked as free.</p>
        </div>
      </div>
    );
  }

  return <InvoiceClient appointment={appointment as any} />;
}

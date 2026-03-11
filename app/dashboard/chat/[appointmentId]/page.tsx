import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ChatInterface from '@/components/chat/ChatInterface';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ChatPage(props: { params: Promise<{ appointmentId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: params.appointmentId },
    include: {
      lawyer: { include: { user: true } },
      citizen: true,
    },
  });

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Not Found</h1>
           <p className="text-gray-500 mb-6">This consultation record does not exist or was removed.</p>
           <Link href="/dashboard" className="text-[#1E3A8A] font-semibold hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const isCitizen = appointment.citizenId === session.user.id;
  const isLawyer = appointment.lawyer.userId === session.user.id;

  if (!isCitizen && !isLawyer) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
             <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
             <p className="text-gray-500 mb-6">You are not authorized to view this communication channel.</p>
             <Link href="/dashboard" className="text-[#1E3A8A] font-semibold hover:underline">Return Admin Hub</Link>
          </div>
        </div>
      );
  }

  const otherUserName = isCitizen ? (appointment.lawyer.user?.name || 'Your Lawyer') : (appointment.citizen?.name || 'Your Client');
  const returnPath = isCitizen ? '/dashboard/citizen' : '/dashboard/lawyer';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-6 flex items-center justify-between">
           <Link href={returnPath} className="flex items-center gap-2 text-gray-500 hover:text-[#1E3A8A] transition-colors font-medium">
             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
           </Link>
           <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Secure Messaging</p>
              <p className="text-sm text-gray-700">Appt: {appointment.id.split('-')[0]}</p>
           </div>
        </div>

        <ChatInterface 
          appointmentId={appointment.id} 
          currentUserId={session.user.id} 
          otherUserName={otherUserName} 
        />
        
        <p className="text-center text-xs text-gray-400 mt-6 mt-8 max-w-xl mx-auto">
           This chat is end-to-end bridged. Messages cannot be deleted once delivered. Treat all files attached as privileged attorney-client communication.
        </p>

      </div>
    </div>
  );
}

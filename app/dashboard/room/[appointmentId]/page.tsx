import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import JitsiRoomClient from './JitsiRoomClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function VideoRoomPage(props: { params: Promise<{ appointmentId: string }> }) {
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
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Room Closed</h1>
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
             <p className="text-gray-500 mb-6">You are not authorized to join this conference.</p>
             <Link href="/dashboard" className="text-[#1E3A8A] font-semibold hover:underline">Return Admin Hub</Link>
          </div>
        </div>
      );
  }

  if (appointment.status !== 'CONFIRMED' && appointment.status !== 'COMPLETED') {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
             <h1 className="text-2xl font-bold text-gray-900 mb-2">Consultation Unavailable</h1>
             <p className="text-gray-500 mb-6">Video rooms are only accessible for confirmed consultations.</p>
             <Link href="/dashboard" className="text-[#1E3A8A] font-semibold hover:underline">Return to Dashboard</Link>
          </div>
        </div>
     );
  }

  const identityName = isCitizen ? (appointment.citizen?.name || 'Citizen') : (appointment.lawyer.user?.name || 'Lawyer');
  const returnPath = isCitizen ? '/dashboard/citizen' : '/dashboard/lawyer';
  const meetingId = `LexIndia-Consultation-${appointment.id.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black text-white shrink-0">
         <Link href={returnPath} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm">
           <ArrowLeft className="w-4 h-4" /> Leave Room
         </Link>
         <div className="text-center hidden sm:block">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">LexIndia Secure Video</p>
            <p className="text-sm">Appt: {appointment.id.split('-')[0]}</p>
         </div>
         <div className="text-sm font-semibold text-gray-300">
            {identityName}
         </div>
      </div>

      <div className="flex-1 w-full bg-slate-900 relative">
        <JitsiRoomClient 
          roomName={meetingId}
          displayName={identityName}
          userEmail={session.user.email || ''}
        />
      </div>
    </div>
  );
}

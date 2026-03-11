import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Await params starting in Next.js 15
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id || session.user.role !== 'LAWYER') {
    return NextResponse.json({ error: 'Unauthorized. Only lawyers can mark appointments as completed.' }, { status: 403 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing appointment ID' }, { status: 400 });
  }

  try {
    // 1. Get Lawyer Profile for current user
    const lawyerProfile = await prisma.lawyerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!lawyerProfile) {
      return NextResponse.json({ error: 'Lawyer profile not found' }, { status: 404 });
    }

    // 2. Find Appointment and verify it belongs to this lawyer
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    if (appointment.lawyerId !== lawyerProfile.id) {
      return NextResponse.json({ error: 'Forbidden. You do not own this appointment.' }, { status: 403 });
    }

    // 3. Ensure the appointment date has passed (can't complete future appointments)
    if (new Date(appointment.date) > new Date()) {
       return NextResponse.json({ error: 'Cannot complete an appointment before its scheduled time.' }, { status: 400 });
    }

    // 4. Update status -> 'COMPLETED', payoutStatus -> 'ELIGIBLE'
    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        payoutStatus: 'ELIGIBLE',
      },
    });

    return NextResponse.json({ success: true, appointment: updated }, { status: 200 });

  } catch (error) {
    console.error('[API /appointments/[id]/complete] Error:', error);
    return NextResponse.json({ error: 'Internal server error while completing appointment.' }, { status: 500 });
  }
}

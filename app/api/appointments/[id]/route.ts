import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// ============================================================
// PATCH /api/appointments/[id]  — update appointment status
// Only the assigned lawyer can confirm/complete/cancel.
// Citizens can cancel their own appointments.
// ============================================================

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let body: { status?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { status } = body;
  const validStatuses = ['CONFIRMED', 'CANCELLED', 'COMPLETED'];
  if (!status || !validStatuses.includes(status as string)) {
    return NextResponse.json({ error: `status must be one of: ${validStatuses.join(', ')}.` }, { status: 400 });
  }

  // Fetch the appointment with related data for permission checking
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      lawyer: { select: { userId: true } },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
  }

  const userId = session.user.id;
  const role = session.user.role;
  const isCitizen = role === 'CITIZEN' && appointment.citizenId === userId;
  const isLawyer = role === 'LAWYER' && appointment.lawyer.userId === userId;

  // Permission rules:
  // - Citizen can only CANCEL their own appointment
  // - Lawyer can CONFIRM, CANCEL, or COMPLETE their own appointment
  if (isCitizen) {
    if (status !== 'CANCELLED') {
      return NextResponse.json({ error: 'Citizens can only cancel appointments.' }, { status: 403 });
    }
    if (appointment.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Cannot cancel a completed appointment.' }, { status: 400 });
    }
  } else if (isLawyer) {
    if (appointment.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Cannot update a cancelled appointment.' }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Not authorised to update this appointment.' }, { status: 403 });
  }

  try {
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: status as string },
    });

    return NextResponse.json({ appointment: updated });
  } catch (error) {
    console.error('[Appointments PATCH] Error:', error);
    return NextResponse.json({ error: 'Failed to update appointment.' }, { status: 500 });
  }
}

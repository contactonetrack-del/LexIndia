import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'LAWYER') {
      return NextResponse.json({ error: getApiLocalizedText(request, 'Unauthorized') }, { status: 401 });
    }

    const { id } = await params; // Appointment ID

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: getApiLocalizedText(request, 'Appointment not found') }, { status: 404 });
    }

    // Only the assigned lawyer can view notes
    if (appointment.lawyerId !== session.user.id) {
       // Validate against LawyerProfile
       const lawyerProfile = await prisma.lawyerProfile.findUnique({
           where: { userId: session.user.id }
       });
       if (appointment.lawyerId !== lawyerProfile?.id) {
           return NextResponse.json({ error: getApiLocalizedText(request, 'Unauthorized') }, { status: 403 });
       }
    }

    const notes = await prisma.caseNote.findMany({
      where: { appointmentId: id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching case notes:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(request, 'Failed to fetch notes') },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'LAWYER') {
      return NextResponse.json({ error: getApiLocalizedText(request, 'Unauthorized') }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: getApiLocalizedText(request, 'Invalid note text') }, { status: 400 });
    }

    // Validate ownership
    const lawyerProfile = await prisma.lawyerProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!lawyerProfile) {
        return NextResponse.json({ error: getApiLocalizedText(request, 'Unauthorized') }, { status: 403 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment || appointment.lawyerId !== lawyerProfile.id) {
      return NextResponse.json(
        { error: getApiLocalizedText(request, 'Appointment not found or unauthorized') },
        { status: 404 }
      );
    }

    const note = await prisma.caseNote.create({
      data: {
        text,
        appointmentId: id,
        lawyerId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error('Error creating case note:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(request, 'Failed to save note') },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Unauthorized') }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Missing appointmentId') }, { status: 400 });
    }

    // Secure checking: either citizen or lawyer on that appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { lawyer: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Appointment not found') }, { status: 404 });
    }

    if (appointment.citizenId !== session.user.id && appointment.lawyer.userId !== session.user.id) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Unauthorized to view these messages') },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        text: true,
        senderId: true,
        receiverId: true,
        fileUrl: true,
        fileName: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Fetch Messages Error:', error);
    return NextResponse.json({ error: getApiLocalizedText(req, 'Internal Server Error') }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Unauthorized') }, { status: 401 });
    }

    const body = await req.json();
    const { text, appointmentId, fileUrl, fileName } = body;

    if (!appointmentId || (!text && !fileUrl)) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Missing required fields') }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { lawyer: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Appointment not found') }, { status: 404 });
    }

    const isCitizen = appointment.citizenId === session.user.id;
    const isLawyer = appointment.lawyer.userId === session.user.id;

    if (!isCitizen && !isLawyer) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Unauthorized to send message') },
        { status: 403 }
      );
    }

    const receiverId = isCitizen ? appointment.lawyer.userId : appointment.citizenId;

    const message = await prisma.message.create({
      data: {
        text: text || '',
        senderId: session.user.id,
        receiverId: receiverId,
        appointmentId,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Send Message Error:', error);
    return NextResponse.json({ error: getApiLocalizedText(req, 'Internal Server Error') }, { status: 500 });
  }
}

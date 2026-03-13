import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendBookingEmails } from '@/lib/email';
import Razorpay from 'razorpay';
import { getApiLocale, getApiLocalizedText } from '@/lib/i18n/api';
import { localizeNamedEntity } from '@/lib/i18n/db';

// ============================================================
// POST /api/appointments  — create a new appointment
// GET  /api/appointments  — fetch current user's appointments
// ============================================================

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }

  let body: { lawyerId?: unknown; date?: unknown; mode?: unknown; notes?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Invalid request body.') }, { status: 400 });
  }

  // Validate
  const { lawyerId, date, mode, notes } = body;

  if (typeof lawyerId !== 'string' || !lawyerId.trim()) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'lawyerId is required.') }, { status: 400 });
  }
  if (typeof date !== 'string' || !date.trim()) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'date is required.') }, { status: 400 });
  }
  if (typeof mode !== 'string' || !['VIDEO', 'CALL', 'CHAT'].includes(mode.toUpperCase())) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'mode must be VIDEO, CALL, or CHAT.') },
      { status: 400 }
    );
  }

  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'date must be a valid future date.') },
      { status: 400 }
    );
  }

  // Verify lawyer exists
  const lawyer = await prisma.lawyerProfile.findUnique({ where: { id: lawyerId } });
  if (!lawyer) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Lawyer not found.') }, { status: 404 });
  }

  // Prevent double-booking same time slot for same lawyer
  const conflict = await prisma.appointment.findFirst({
    where: {
      lawyerId: lawyerId as string,
      date: appointmentDate,
      status: { not: 'CANCELLED' },
    },
  });
  if (conflict) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'This time slot is already booked. Please choose another.') },
      { status: 409 }
    );
  }

  // Generate Razorpay Order
  const consultationFee = lawyer.consultationFee || 0;
  const amountInPaise = Math.round(consultationFee * 100);
  let razorpayOrderId = null;

  if (amountInPaise > 0) {
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const orderOptions = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`.substring(0, 40)
      };

      const order = await razorpay.orders.create(orderOptions);
      razorpayOrderId = order.id;
    } catch (err) {
      console.error('[Razorpay] Order creation failed:', err);
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Failed to initialize payment gateway.') },
        { status: 500 }
      );
    }
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        citizenId: session.user.id,
        lawyerId: lawyerId as string,
        date: appointmentDate,
        mode: mode.toUpperCase(),
        notes: typeof notes === 'string' ? notes.slice(0, 2000) : null,
        status: 'PENDING',
        amount: consultationFee,
        razorpayOrderId: razorpayOrderId,
      },
      include: {
        lawyer: {
          include: { user: { select: { name: true, email: true } } },
        },
        citizen: { select: { name: true, email: true } },
      },
    });

    // Send email notifications (non-fatal — errors are logged but don't break the response)
    const lawyerEmail = appointment.lawyer.user.email;
    const lawyerName  = appointment.lawyer.user.name ?? 'Lawyer';
    const citizenEmail = appointment.citizen?.email ?? session.user.email ?? '';
    const citizenName  = appointment.citizen?.name  ?? session.user.name  ?? 'Client';

    if (lawyerEmail && citizenEmail) {
      sendBookingEmails({
        citizenEmail,
        citizenName,
        lawyerEmail,
        lawyerName,
        date: appointmentDate.toISOString(),
        mode: mode.toUpperCase(),
        notes: typeof notes === 'string' ? notes.slice(0, 2000) : null,
        appointmentId: appointment.id,
      }).catch((err) => console.error('[email] Non-blocking email failure:', err));
    }

    return NextResponse.json({ 
      appointment,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR'
    }, { status: 201 });
  } catch (error) {
    console.error('[Appointments API] Create error:', error);
    return NextResponse.json({ error: getApiLocalizedText(req, 'Failed to create appointment.') }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }
  const locale = getApiLocale(req);

  try {
    const role = session.user.role;

    let appointments;

    if (role === 'LAWYER') {
      // Lawyer sees their incoming appointments
      const profile = await prisma.lawyerProfile.findUnique({
        where: { userId: session.user.id },
      });
      if (!profile) {
        return NextResponse.json({ appointments: [] });
      }
      appointments = await prisma.appointment.findMany({
        where: { lawyerId: profile.id },
        include: {
          citizen: { select: { name: true, email: true } },
        },
        orderBy: { date: 'asc' },
      });
    } else {
      // Citizen sees their own bookings
      appointments = await prisma.appointment.findMany({
        where: { citizenId: session.user.id },
        include: {
          review: { select: { id: true } },
          lawyer: {
            include: {
              user: { select: { name: true, image: true } },
              specializations: { include: { translations: true } },
            },
          },
        },
        orderBy: { date: 'asc' },
      });

      appointments = appointments.map((appointment) => ({
        ...appointment,
        lawyer: {
          ...appointment.lawyer,
          specializations: appointment.lawyer.specializations.map((specialization) =>
            localizeNamedEntity(specialization, locale)
          ),
        },
      }));
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('[Appointments API] Fetch error:', error);
    return NextResponse.json({ error: getApiLocalizedText(req, 'Failed to fetch appointments.') }, { status: 500 });
  }
}

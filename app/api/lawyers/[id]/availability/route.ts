import { NextRequest, NextResponse } from 'next/server';

import {
  getIndiaDateRange,
  getIndiaTimeKey,
  getIndiaWeekday,
  isAvailabilitySlotOverrideAction,
  sortAvailabilitySlots,
} from '@/lib/availability';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date')?.trim() ?? '';

  if (!id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Invalid lawyer ID.') }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'A valid booking date is required.') },
      { status: 400 }
    );
  }

  try {
    const weekday = getIndiaWeekday(date);
    const { start, end } = getIndiaDateRange(date);

    const lawyer = await prisma.lawyerProfile.findUnique({
      where: { id },
      select: {
        id: true,
        availabilityExceptions: {
          where: { dateKey: date },
          select: { id: true },
          take: 1,
        },
        availabilitySlotOverrides: {
          where: { dateKey: date },
          select: { time: true, action: true },
          orderBy: { time: 'asc' },
        },
        availabilitySlots: {
          where: { weekday },
          select: { weekday: true, time: true },
          orderBy: { time: 'asc' },
        },
      },
    });

    if (!lawyer) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Lawyer not found.') }, { status: 404 });
    }

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        lawyerId: id,
        status: { not: 'CANCELLED' },
        date: {
          gte: start,
          lte: end,
        },
      },
      select: { date: true },
    });

    const bookedSlotSet = new Set(bookedAppointments.map((appointment) => getIndiaTimeKey(appointment.date)));
    const configuredSlots = sortAvailabilitySlots(lawyer.availabilitySlots);
    const isBlockedDate = lawyer.availabilityExceptions.length > 0;
    const openSlotOverrides = lawyer.availabilitySlotOverrides
      .filter(
        (entry) =>
          isAvailabilitySlotOverrideAction(entry.action) && entry.action === 'OPEN_SLOT'
      )
      .map((entry) => entry.time);
    const blockedSlotOverrides = lawyer.availabilitySlotOverrides
      .filter(
        (entry) =>
          isAvailabilitySlotOverrideAction(entry.action) && entry.action === 'BLOCK_SLOT'
      )
      .map((entry) => entry.time);
    const effectiveSlots = Array.from(
      new Set([...configuredSlots.map((slot) => slot.time), ...openSlotOverrides])
    ).sort((left, right) => left.localeCompare(right));
    const blockedSlotSet = new Set(blockedSlotOverrides);

    return NextResponse.json({
      date,
      weekday,
      isBlockedDate,
      configuredSlots: configuredSlots.map((slot) => slot.time),
      openSlotOverrides,
      blockedSlotOverrides,
      bookedSlots: Array.from(bookedSlotSet).sort((left, right) => left.localeCompare(right)),
      effectiveSlots,
      availableSlots: isBlockedDate
        ? []
        : effectiveSlots.filter(
            (time) => !blockedSlotSet.has(time) && !bookedSlotSet.has(time)
          ),
    });
  } catch (error) {
    console.error('[Lawyer Availability API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load lawyer availability.') },
      { status: 500 }
    );
  }
}

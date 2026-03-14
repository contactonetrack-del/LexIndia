import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import {
  isAvailabilityDateKey,
  isAvailabilitySlotOverrideAction,
  isAvailabilityTime,
  isAvailabilityWeekday,
  sortAvailabilityExceptions,
  sortAvailabilitySlotOverrides,
  sortAvailabilitySlots,
} from '@/lib/availability';
import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import { isLawyerConsultationMode } from '@/lib/lawyer-consultation';
import prisma from '@/lib/prisma';
import { getLawyerVerificationStatus } from '@/lib/verification';

// ============================================================
// PATCH /api/lawyers/profile  — update the authenticated lawyer's own profile
// GET  /api/lawyers/profile   — fetch the authenticated lawyer's own profile
// ============================================================

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }
  if (session.user.role !== 'LAWYER') {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Only lawyers can access this endpoint.') },
      { status: 403 }
    );
  }

  try {
    const profile = await prisma.lawyerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        verificationCases: {
          select: {
            id: true,
            status: true,
            submittedBarCouncilId: true,
            identityDocumentUrl: true,
            enrollmentCertificateUrl: true,
            practiceCertificateUrl: true,
            lawyerNotes: true,
            adminNotes: true,
            submittedAt: true,
            reviewedAt: true,
          },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
        languages: { select: { id: true, name: true } },
        modes: { select: { id: true, mode: true } },
        availabilityExceptions: {
          select: { id: true, dateKey: true },
          orderBy: [{ dateKey: 'asc' }],
        },
        availabilitySlotOverrides: {
          select: { id: true, dateKey: true, time: true, action: true },
          orderBy: [{ dateKey: 'asc' }, { time: 'asc' }],
        },
        availabilitySlots: {
          select: { id: true, weekday: true, time: true },
          orderBy: [{ weekday: 'asc' }, { time: 'asc' }],
        },
        specializations: { select: { id: true, name: true } },
        user: { select: { name: true, email: true, image: true } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Profile not found.') }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        ...profile,
        verificationStatus: getLawyerVerificationStatus(profile),
      },
    });
  } catch (error) {
    console.error('[Profile API] GET error:', error);
    return NextResponse.json({ error: getApiLocalizedText(req, 'Failed to fetch profile.') }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }
  if (session.user.role !== 'LAWYER') {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Only lawyers can update their profile.') },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Invalid request body.') }, { status: 400 });
  }

  // Allowed updatable fields
  const {
    bio,
    city,
    state,
    experienceYears,
    consultationFee,
    barCouncilID,
    languages,
    specializations,
    consultationModes,
    availabilitySlots,
    availabilityExceptions,
    availabilitySlotOverrides,
  } = body;

  // Validate types of provided fields
  if (bio !== undefined && (typeof bio !== 'string' || bio.length > 2000)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'bio must be a string under 2000 characters.') },
      { status: 400 }
    );
  }
  if (city !== undefined && (typeof city !== 'string' || city.length > 100)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'city must be a string under 100 characters.') },
      { status: 400 }
    );
  }
  if (state !== undefined && (typeof state !== 'string' || state.length > 100)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'state must be a string under 100 characters.') },
      { status: 400 }
    );
  }
  if (experienceYears !== undefined && (typeof experienceYears !== 'number' || experienceYears < 0 || experienceYears > 60)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'experienceYears must be a number between 0 and 60.') },
      { status: 400 }
    );
  }
  if (consultationFee !== undefined && (typeof consultationFee !== 'number' || consultationFee < 0)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'consultationFee must be a non-negative number.') },
      { status: 400 }
    );
  }
  if (
    barCouncilID !== undefined &&
    barCouncilID !== null &&
    (typeof barCouncilID !== 'string' || barCouncilID.trim().length > 100)
  ) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'barCouncilID must be a string under 100 characters.') },
      { status: 400 }
    );
  }
  if (languages !== undefined && (!Array.isArray(languages) || languages.some((l) => typeof l !== 'string'))) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'languages must be an array of strings.') },
      { status: 400 }
    );
  }
  if (
    specializations !== undefined &&
    (!Array.isArray(specializations) || specializations.some((specialization) => typeof specialization !== 'string'))
  ) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'specializations must be an array of strings.') },
      { status: 400 }
    );
  }
  if (
    consultationModes !== undefined &&
    (!Array.isArray(consultationModes) ||
      consultationModes.some(
        (mode) => typeof mode !== 'string' || !isLawyerConsultationMode(mode.toUpperCase())
      ))
  ) {
    return NextResponse.json(
      {
        error: getApiLocalizedText(
          req,
          'consultationModes must be an array of VIDEO, CALL, CHAT, or IN_PERSON.'
        ),
      },
      { status: 400 }
    );
  }
  if (
    availabilityExceptions !== undefined &&
    (!Array.isArray(availabilityExceptions) ||
      availabilityExceptions.some((entry) => {
        if (!entry || typeof entry !== 'object') {
          return true;
        }

        const { dateKey } = entry as { dateKey?: unknown };
        return !isAvailabilityDateKey(dateKey);
      }))
  ) {
    return NextResponse.json(
      {
        error: getApiLocalizedText(
          req,
          'availabilityExceptions must be an array of valid blocked booking dates.'
        ),
      },
      { status: 400 }
    );
  }
  if (
    availabilitySlotOverrides !== undefined &&
    (!Array.isArray(availabilitySlotOverrides) ||
      availabilitySlotOverrides.some((entry) => {
        if (!entry || typeof entry !== 'object') {
          return true;
        }

        const {
          dateKey,
          time,
          action,
        } = entry as { dateKey?: unknown; time?: unknown; action?: unknown };
        return (
          !isAvailabilityDateKey(dateKey) ||
          !isAvailabilityTime(time) ||
          !isAvailabilitySlotOverrideAction(action)
        );
      }))
  ) {
    return NextResponse.json(
      {
        error: getApiLocalizedText(
          req,
          'availabilitySlotOverrides must be an array of valid date, time, and action combinations.'
        ),
      },
      { status: 400 }
    );
  }
  if (
    availabilitySlots !== undefined &&
    (!Array.isArray(availabilitySlots) ||
      availabilitySlots.some((slot) => {
        if (!slot || typeof slot !== 'object') {
          return true;
        }

        const { weekday, time } = slot as { weekday?: unknown; time?: unknown };
        return !isAvailabilityWeekday(weekday) || !isAvailabilityTime(time);
      }))
  ) {
    return NextResponse.json(
      {
        error: getApiLocalizedText(
          req,
          'availabilitySlots must be an array of valid weekday and time combinations.'
        ),
      },
      { status: 400 }
    );
  }

  // Build update payload — only include fields that were provided
  const updateData: Record<string, unknown> = {};
  const normalizedLanguages =
    languages !== undefined
      ? Array.from(
          new Set(
            (languages as string[])
              .map((language) => language.trim())
              .filter((language) => language.length > 0)
          )
        )
      : null;
  const normalizedSpecializations =
    specializations !== undefined
      ? Array.from(
          new Set(
            (specializations as string[])
              .map((specialization) => specialization.trim())
              .filter((specialization) => specialization.length > 0)
          )
        )
      : null;
  const normalizedConsultationModes =
    consultationModes !== undefined
      ? Array.from(
          new Set(
            (consultationModes as string[])
              .map((mode) => mode.toUpperCase())
              .filter((mode): mode is string => isLawyerConsultationMode(mode))
          )
        )
      : null;
  const normalizedAvailabilitySlots =
    availabilitySlots !== undefined
      ? sortAvailabilitySlots(
          Array.from(
            new Map(
              (availabilitySlots as Array<{ weekday: number; time: string }>).map((slot) => [
                `${slot.weekday}:${slot.time}`,
                { weekday: slot.weekday, time: slot.time },
              ])
            ).values()
          )
        )
      : null;
  const normalizedAvailabilityExceptions =
    availabilityExceptions !== undefined
      ? sortAvailabilityExceptions(
          Array.from(
            new Map(
              (availabilityExceptions as Array<{ dateKey: string }>).map((entry) => [
                entry.dateKey,
                { dateKey: entry.dateKey },
              ])
            ).values()
          )
        )
      : null;
  const normalizedAvailabilitySlotOverrides =
    availabilitySlotOverrides !== undefined
      ? sortAvailabilitySlotOverrides(
          Array.from(
            new Map(
              (
                availabilitySlotOverrides as Array<{
                  dateKey: string;
                  time: string;
                  action: 'BLOCK_SLOT' | 'OPEN_SLOT';
                }>
              ).map((entry) => [
                `${entry.dateKey}:${entry.time}`,
                {
                  dateKey: entry.dateKey,
                  time: entry.time,
                  action: entry.action,
                },
              ])
            ).values()
          )
        )
      : null;
  if (bio !== undefined) updateData.bio = (bio as string).trim();
  if (city !== undefined) updateData.city = (city as string).trim();
  if (state !== undefined) updateData.state = (state as string).trim();
  if (experienceYears !== undefined) updateData.experienceYears = experienceYears;
  if (consultationFee !== undefined) updateData.consultationFee = consultationFee;

  try {
    const existingProfile = await prisma.lawyerProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        barCouncilID: true,
        availabilityExceptions: {
          select: { dateKey: true },
        },
        availabilitySlotOverrides: {
          select: { dateKey: true, time: true, action: true },
        },
      },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Profile not found.') }, { status: 404 });
    }

    if (barCouncilID !== undefined) {
      const normalizedBarCouncilId =
        typeof barCouncilID === 'string' ? barCouncilID.trim().toUpperCase() : '';
      const existingBarCouncilId = existingProfile.barCouncilID?.trim().toUpperCase() ?? '';

      if (normalizedBarCouncilId !== existingBarCouncilId) {
        updateData.barCouncilID = normalizedBarCouncilId || null;
        updateData.isVerified = false;
      }
    }

    const finalAvailabilityExceptions =
      normalizedAvailabilityExceptions ??
      sortAvailabilityExceptions(existingProfile.availabilityExceptions);
    const existingAvailabilitySlotOverrides = sortAvailabilitySlotOverrides(
      existingProfile.availabilitySlotOverrides
        .filter(
          (
            entry
          ): entry is { dateKey: string; time: string; action: 'BLOCK_SLOT' | 'OPEN_SLOT' } =>
            isAvailabilitySlotOverrideAction(entry.action)
        )
        .map((entry) => ({
          dateKey: entry.dateKey,
          time: entry.time,
          action: entry.action,
        }))
    );
    const finalAvailabilitySlotOverrides =
      normalizedAvailabilitySlotOverrides ?? existingAvailabilitySlotOverrides;
    const blockedDateSet = new Set(
      finalAvailabilityExceptions.map((entry) => entry.dateKey)
    );
    const conflictingSlotOverride = finalAvailabilitySlotOverrides.find((entry) =>
      blockedDateSet.has(entry.dateKey)
    );

    if (conflictingSlotOverride) {
      return NextResponse.json(
        {
          error: getApiLocalizedText(
            req,
            'Date-specific slot overrides cannot be saved on dates that are blocked for the full day.'
          ),
        },
        { status: 400 }
      );
    }

    if (normalizedLanguages !== null) {
      const matchingLanguages =
        normalizedLanguages.length > 0
          ? await prisma.language.findMany({
              where: {
                OR: [
                  { id: { in: normalizedLanguages } },
                  ...normalizedLanguages.map((language) => ({
                    name: { equals: language, mode: 'insensitive' as const },
                  })),
                ],
              },
            })
          : [];

      if (matchingLanguages.length !== normalizedLanguages.length) {
        const matchedLanguageReferences = new Set(
          matchingLanguages.flatMap((language) => [
            language.id,
            language.name.trim().toLowerCase(),
          ])
        );
        const missingLanguages = normalizedLanguages.filter(
          (language) =>
            !matchedLanguageReferences.has(language) &&
            !matchedLanguageReferences.has(language.toLowerCase())
        );

        return NextResponse.json(
          {
            error: getApiLocalizedText(
              req,
              `Unknown languages: ${missingLanguages.join(', ')}.`
            ),
          },
          { status: 400 }
        );
      }

      updateData.languages = {
        set: matchingLanguages.map((language) => ({ id: language.id })),
      };
    }

    if (normalizedSpecializations !== null) {
      const matchingSpecializations =
        normalizedSpecializations.length > 0
          ? await prisma.specialization.findMany({
              where: {
                OR: [
                  { id: { in: normalizedSpecializations } },
                  ...normalizedSpecializations.map((specialization) => ({
                    name: { equals: specialization, mode: 'insensitive' as const },
                  })),
                ],
              },
            })
          : [];

      if (matchingSpecializations.length !== normalizedSpecializations.length) {
        const matchedSpecializationReferences = new Set(
          matchingSpecializations.flatMap((specialization) => [
            specialization.id,
            specialization.name.trim().toLowerCase(),
          ])
        );
        const missingSpecializations = normalizedSpecializations.filter(
          (specialization) =>
            !matchedSpecializationReferences.has(specialization) &&
            !matchedSpecializationReferences.has(specialization.toLowerCase())
        );

        return NextResponse.json(
          {
            error: getApiLocalizedText(
              req,
              `Unknown specializations: ${missingSpecializations.join(', ')}.`
            ),
          },
          { status: 400 }
        );
      }

      updateData.specializations = {
        set: matchingSpecializations.map((specialization) => ({ id: specialization.id })),
      };
    }

    if (normalizedConsultationModes !== null) {
      updateData.modes = {
        deleteMany: {},
        create: normalizedConsultationModes.map((mode) => ({ mode })),
      };
    }

    if (normalizedAvailabilitySlots !== null) {
      updateData.availabilitySlots = {
        deleteMany: {},
        create: normalizedAvailabilitySlots.map((slot) => ({
          weekday: slot.weekday,
          time: slot.time,
        })),
      };
    }

    if (normalizedAvailabilityExceptions !== null) {
      updateData.availabilityExceptions = {
        deleteMany: {},
        create: normalizedAvailabilityExceptions.map((entry) => ({
          dateKey: entry.dateKey,
        })),
      };
    }

    if (normalizedAvailabilitySlotOverrides !== null) {
      updateData.availabilitySlotOverrides = {
        deleteMany: {},
        create: normalizedAvailabilitySlotOverrides.map((entry) => ({
          dateKey: entry.dateKey,
          time: entry.time,
          action: entry.action,
        })),
      };
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'No valid fields provided to update.') },
        { status: 400 }
      );
    }

    const profile = await prisma.lawyerProfile.update({
      where: { userId: session.user.id },
      data: updateData,
      include: {
        verificationCases: {
          select: {
            id: true,
            status: true,
            submittedBarCouncilId: true,
            identityDocumentUrl: true,
            enrollmentCertificateUrl: true,
            practiceCertificateUrl: true,
            lawyerNotes: true,
            adminNotes: true,
            submittedAt: true,
            reviewedAt: true,
          },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
        languages: { select: { id: true, name: true } },
        modes: { select: { id: true, mode: true } },
        availabilityExceptions: {
          select: { id: true, dateKey: true },
          orderBy: [{ dateKey: 'asc' }],
        },
        availabilitySlotOverrides: {
          select: { id: true, dateKey: true, time: true, action: true },
          orderBy: [{ dateKey: 'asc' }, { time: 'asc' }],
        },
        availabilitySlots: {
          select: { id: true, weekday: true, time: true },
          orderBy: [{ weekday: 'asc' }, { time: 'asc' }],
        },
        specializations: { select: { id: true, name: true } },
        user: { select: { name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({
      profile: {
        ...profile,
        verificationStatus: getLawyerVerificationStatus(profile),
      },
    });
  } catch (error) {
    console.error('[Profile API] PATCH error:', error);
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'That Bar Council ID is already linked to another profile.') },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: getApiLocalizedText(req, 'Failed to update profile.') }, { status: 500 });
  }
}

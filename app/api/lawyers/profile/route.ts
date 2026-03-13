import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

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
        specializations: { select: { id: true, name: true } },
        user: { select: { name: true, email: true, image: true } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Profile not found.') }, { status: 404 });
    }

    return NextResponse.json({ profile });
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
    languages,
    consultationModes,
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
  if (languages !== undefined && (!Array.isArray(languages) || languages.some((l) => typeof l !== 'string'))) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'languages must be an array of strings.') },
      { status: 400 }
    );
  }
  const validModes = ['VIDEO', 'CALL', 'CHAT'];
  if (consultationModes !== undefined && (!Array.isArray(consultationModes) || consultationModes.some((m) => !validModes.includes(m as string)))) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'consultationModes must be an array of VIDEO, CALL, CHAT.') },
      { status: 400 }
    );
  }

  // Build update payload — only include fields that were provided
  const updateData: Record<string, unknown> = {};
  if (bio !== undefined) updateData.bio = (bio as string).trim();
  if (city !== undefined) updateData.city = (city as string).trim();
  if (state !== undefined) updateData.state = (state as string).trim();
  if (experienceYears !== undefined) updateData.experienceYears = experienceYears;
  if (consultationFee !== undefined) updateData.consultationFee = consultationFee;
  if (languages !== undefined) updateData.languages = languages as string[];
  if (consultationModes !== undefined) updateData.consultationModes = (consultationModes as string[]).map((m) => m.toUpperCase());

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'No valid fields provided to update.') },
      { status: 400 }
    );
  }

  try {
    const profile = await prisma.lawyerProfile.update({
      where: { userId: session.user.id },
      data: updateData,
      include: {
        specializations: { select: { id: true, name: true } },
        user: { select: { name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('[Profile API] PATCH error:', error);
    return NextResponse.json({ error: getApiLocalizedText(req, 'Failed to update profile.') }, { status: 500 });
  }
}

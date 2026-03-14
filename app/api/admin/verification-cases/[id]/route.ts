import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { isAdminUser } from '@/lib/admin';
import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

const VALID_STATUSES = ['UNDER_REVIEW', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }

  if (!isAdminUser(session.user)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Admin access is required.') },
      { status: 403 }
    );
  }

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Invalid request body.') }, { status: 400 });
  }

  const status = typeof body.status === 'string' ? body.status.trim().toUpperCase() : '';
  const adminNotes = typeof body.adminNotes === 'string' ? body.adminNotes.trim() : '';

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Invalid verification status.') },
      { status: 400 }
    );
  }

  try {
    const updatedCase = await prisma.$transaction(async (tx) => {
      const existingCase = await tx.lawyerVerificationCase.findUnique({
        where: { id },
        include: {
          lawyerProfile: {
            select: {
              id: true,
              barCouncilID: true,
            },
          },
        },
      });

      if (!existingCase) {
        throw new Error('NOT_FOUND');
      }

      const reviewedAt = status === 'UNDER_REVIEW' ? null : new Date();

      const verificationCase = await tx.lawyerVerificationCase.update({
        where: { id },
        data: {
          status,
          adminNotes: adminNotes || null,
          reviewedAt,
          reviewedById: session.user.id,
        },
        include: {
          lawyerProfile: {
            select: {
              id: true,
              city: true,
              state: true,
              barCouncilID: true,
              isVerified: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      await tx.lawyerProfile.update({
        where: { id: verificationCase.lawyerProfile.id },
        data: {
          isVerified: status === 'APPROVED',
          barCouncilID:
            status === 'APPROVED'
              ? verificationCase.submittedBarCouncilId || existingCase.lawyerProfile.barCouncilID
              : existingCase.lawyerProfile.barCouncilID,
        },
      });

      return verificationCase;
    });

    return NextResponse.json({ case: updatedCase });
  } catch (error) {
    if (error instanceof Error && error.message === 'NOT_FOUND') {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Verification case not found.') },
        { status: 404 }
      );
    }

    console.error('[Admin Verification Cases API] PATCH error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to update verification case.') },
      { status: 500 }
    );
  }
}

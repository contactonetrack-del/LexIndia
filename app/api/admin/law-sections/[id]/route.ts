import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { isAdminUser } from '@/lib/admin';
import { authOptions } from '@/lib/auth';
import { normalizeEditorialStatus } from '@/lib/editorial-review';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Authentication required.') },
      { status: 401 }
    );
  }

  if (!isAdminUser(session.user)) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Admin access is required.') },
      { status: 403 }
    );
  }

  const { id } = await params;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Invalid request body.') },
      { status: 400 }
    );
  }

  const editorialStatus = normalizeEditorialStatus(
    typeof body.editorialStatus === 'string' ? body.editorialStatus : null,
    'DRAFT'
  );
  const reviewerNotes =
    typeof body.reviewerNotes === 'string' ? body.reviewerNotes.trim() : '';

  try {
    const lawSection = await prisma.$transaction(async (tx) => {
      const updatedLawSection = await tx.lawSection.update({
        where: { id },
        data: {
          editorialStatus,
          reviewerNotes: reviewerNotes || null,
          reviewedAt: editorialStatus === 'APPROVED' ? new Date() : null,
          reviewedById: editorialStatus === 'APPROVED' ? session.user.id : null,
        },
        include: {
          act: {
            select: {
              id: true,
              slug: true,
              shortCode: true,
              title: true,
            },
          },
          reviewLogs: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      });

      await tx.lawSectionReviewLog.create({
        data: {
          lawSectionId: id,
          status: editorialStatus,
          notes: reviewerNotes || null,
          reviewedById: session.user.id,
        },
      });

      return updatedLawSection;
    });

    return NextResponse.json({ lawSection });
  } catch (error) {
    console.error('[Admin Law Sections API] PATCH error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to update law section review status.') },
      { status: 500 }
    );
  }
}

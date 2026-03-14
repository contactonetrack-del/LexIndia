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
    const law = await prisma.$transaction(async (tx) => {
      const updatedLaw = await tx.legalAct.update({
        where: { id },
        data: {
          editorialStatus,
          reviewerNotes: reviewerNotes || null,
          reviewedAt: editorialStatus === 'APPROVED' ? new Date() : null,
          reviewedById: editorialStatus === 'APPROVED' ? session.user.id : null,
        },
        include: {
          reviewLogs: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
          sections: {
            select: {
              id: true,
              editorialStatus: true,
            },
          },
        },
      });

      await tx.legalActReviewLog.create({
        data: {
          legalActId: id,
          status: editorialStatus,
          notes: reviewerNotes || null,
          reviewedById: session.user.id,
        },
      });

      return updatedLaw;
    });

    return NextResponse.json({ law });
  } catch (error) {
    console.error('[Admin Laws API] PATCH error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to update law review status.') },
      { status: 500 }
    );
  }
}

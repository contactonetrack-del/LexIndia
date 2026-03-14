import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { isAdminUser } from '@/lib/admin';
import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';
import { normalizeTemplateEditorialStatus } from '@/lib/template-review';

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

  const editorialStatus = normalizeTemplateEditorialStatus(
    typeof body.editorialStatus === 'string' ? body.editorialStatus : null
  );
  const reviewerNotes = typeof body.reviewerNotes === 'string' ? body.reviewerNotes.trim() : '';

  try {
    const template = await prisma.$transaction(async (tx) => {
      const updatedTemplate = await tx.documentTemplate.update({
        where: { id },
        data: {
          editorialStatus,
          reviewerNotes: reviewerNotes || null,
          reviewedAt: new Date(),
          reviewedById: session.user.id,
        },
        include: {
          reviewLogs: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      });

      await tx.templateReviewLog.create({
        data: {
          templateId: id,
          status: editorialStatus,
          notes: reviewerNotes || null,
          reviewedById: session.user.id,
        },
      });

      return updatedTemplate;
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('[Admin Templates API] PATCH error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to update template review status.') },
      { status: 500 }
    );
  }
}

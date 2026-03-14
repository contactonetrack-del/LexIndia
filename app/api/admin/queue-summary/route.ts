import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { isAdminUser } from '@/lib/admin';
import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
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

  try {
    const [
      verificationPendingCount,
      templateReviewCount,
      faqReviewCount,
      guideReviewCount,
      rightsReviewCount,
      lawReviewCount,
      lawSectionReviewCount,
    ] = await Promise.all([
      prisma.lawyerVerificationCase.count({
        where: { status: 'UNDER_REVIEW' },
      }),
      prisma.documentTemplate.count({
        where: { editorialStatus: 'REVIEW' },
      }),
      prisma.fAQ.count({
        where: { editorialStatus: 'REVIEW' },
      }),
      prisma.guideEntry.count({
        where: { editorialStatus: 'REVIEW' },
      }),
      prisma.rightEntry.count({
        where: { editorialStatus: 'REVIEW' },
      }),
      prisma.legalAct.count({
        where: { editorialStatus: 'REVIEW' },
      }),
      prisma.lawSection.count({
        where: { editorialStatus: 'REVIEW' },
      }),
    ]);

    return NextResponse.json({
      verificationPendingCount,
      templateReviewCount,
      faqReviewCount,
      guideReviewCount,
      rightsReviewCount,
      lawReviewCount,
      lawSectionReviewCount,
      pendingTotal:
        verificationPendingCount +
        templateReviewCount +
        faqReviewCount +
        guideReviewCount +
        rightsReviewCount +
        lawReviewCount +
        lawSectionReviewCount,
    });
  } catch (error) {
    console.error('[Admin Queue Summary API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load review notifications.') },
      { status: 500 }
    );
  }
}

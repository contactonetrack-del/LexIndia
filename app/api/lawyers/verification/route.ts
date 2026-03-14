import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';
import {
  cleanupUnreferencedVerificationDocuments,
  extractVerificationDocumentIdFromUrl,
} from '@/lib/verification-documents';
import { getLawyerVerificationStatus } from '@/lib/verification';

function isInternalVerificationDocumentUrl(value: string) {
  return /^\/api\/verification-documents\/[a-z0-9]+$/i.test(value);
}

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
          orderBy: { submittedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Profile not found.') }, { status: 404 });
    }

    return NextResponse.json({
      verificationStatus: getLawyerVerificationStatus(profile),
      latestCase: profile.verificationCases[0] ?? null,
      cases: profile.verificationCases,
    });
  } catch (error) {
    console.error('[Lawyer Verification API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load verification details.') },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }

  if (session.user.role !== 'LAWYER') {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Only lawyers can submit verification details.') },
      { status: 403 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Invalid request body.') }, { status: 400 });
  }

  const submittedBarCouncilId =
    typeof body.barCouncilID === 'string' ? body.barCouncilID.trim().toUpperCase() : '';
  const identityDocumentUrl =
    typeof body.identityDocumentUrl === 'string' ? body.identityDocumentUrl.trim() : '';
  const enrollmentCertificateUrl =
    typeof body.enrollmentCertificateUrl === 'string' ? body.enrollmentCertificateUrl.trim() : '';
  const practiceCertificateUrl =
    typeof body.practiceCertificateUrl === 'string' ? body.practiceCertificateUrl.trim() : '';
  const lawyerNotes = typeof body.lawyerNotes === 'string' ? body.lawyerNotes.trim() : '';

  if (!submittedBarCouncilId) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Bar Council enrolment ID is required.') },
      { status: 400 }
    );
  }

  if (!identityDocumentUrl || !enrollmentCertificateUrl) {
    return NextResponse.json(
      {
        error: getApiLocalizedText(
          req,
          'Identity document URL and enrolment certificate URL are required.'
        ),
      },
      { status: 400 }
    );
  }

  if (
    !isInternalVerificationDocumentUrl(identityDocumentUrl) ||
    !isInternalVerificationDocumentUrl(enrollmentCertificateUrl) ||
    (practiceCertificateUrl && !isInternalVerificationDocumentUrl(practiceCertificateUrl))
  ) {
    return NextResponse.json(
      {
        error: getApiLocalizedText(
          req,
          'Verification documents must be uploaded through LexIndia before submission.'
        ),
      },
      { status: 400 }
    );
  }

  try {
    const profile = await prisma.lawyerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Profile not found.') }, { status: 404 });
    }

    const existingHolder = await prisma.lawyerProfile.findFirst({
      where: {
        barCouncilID: submittedBarCouncilId,
        NOT: { userId: session.user.id },
      },
      select: { id: true },
    });

    if (existingHolder) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'That Bar Council ID is already linked to another profile.') },
        { status: 409 }
      );
    }

    const verificationCase = await prisma.$transaction(async (tx) => {
      await tx.lawyerProfile.update({
        where: { id: profile.id },
        data: {
          barCouncilID: submittedBarCouncilId,
          isVerified: false,
        },
      });

      return tx.lawyerVerificationCase.create({
        data: {
          lawyerProfileId: profile.id,
          submittedBarCouncilId,
          identityDocumentUrl,
          enrollmentCertificateUrl,
          practiceCertificateUrl: practiceCertificateUrl || null,
          lawyerNotes: lawyerNotes || null,
          status: 'UNDER_REVIEW',
        },
      });
    });

    const referencedDocumentIds = [
      extractVerificationDocumentIdFromUrl(identityDocumentUrl),
      extractVerificationDocumentIdFromUrl(enrollmentCertificateUrl),
      extractVerificationDocumentIdFromUrl(practiceCertificateUrl),
    ].filter((value): value is string => Boolean(value));

    cleanupUnreferencedVerificationDocuments({
      client: prisma,
      lawyerProfileId: profile.id,
      keepDocumentIds: referencedDocumentIds,
    }).catch((error) => {
      console.error('[Lawyer Verification API] Cleanup error:', error);
    });

    return NextResponse.json({
      latestCase: verificationCase,
      verificationStatus: 'UNDER_REVIEW',
    });
  } catch (error) {
    console.error('[Lawyer Verification API] POST error:', error);
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'That Bar Council ID is already linked to another profile.') },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to submit verification details.') },
      { status: 500 }
    );
  }
}

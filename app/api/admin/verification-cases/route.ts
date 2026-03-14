import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { isAdminUser } from '@/lib/admin';
import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
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

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status')?.trim().toUpperCase();

    const cases = await prisma.lawyerVerificationCase.findMany({
      where: status ? { status } : undefined,
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
      orderBy: [{ status: 'asc' }, { submittedAt: 'desc' }],
      take: 100,
    });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error('[Admin Verification Cases API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load verification cases.') },
      { status: 500 }
    );
  }
}

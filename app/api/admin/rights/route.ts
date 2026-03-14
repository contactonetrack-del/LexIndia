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

    const rights = await prisma.rightEntry.findMany({
      where: status ? { editorialStatus: status } : undefined,
      include: {
        reviewLogs: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: [{ editorialStatus: 'asc' }, { updatedAt: 'desc' }],
      take: 100,
    });

    return NextResponse.json({ rights });
  } catch (error) {
    console.error('[Admin Rights API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load rights pages.') },
      { status: 500 }
    );
  }
}

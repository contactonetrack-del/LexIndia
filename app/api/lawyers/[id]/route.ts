import { NextRequest, NextResponse } from 'next/server';

import { getApiLocale } from '@/lib/i18n/api';
import { localizeFields, localizeNamedEntity } from '@/lib/i18n/db';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const locale = getApiLocale(req);

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid lawyer ID' }, { status: 400 });
  }

  try {
    const lawyer = await (prisma.lawyerProfile as any).findUnique({
      where: { id },
      include: {
        user: { select: { name: true, image: true, email: true, createdAt: true } },
        languages: {
          include: {
            translations: true,
          },
        },
        specializations: {
          include: {
            translations: true,
          },
        },
        translations: true,
        modes: true,
        appointments: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
    });

    if (!lawyer) {
      return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    return NextResponse.json({
      lawyer: {
        ...localizeFields(lawyer, lawyer.translations, locale, ['bio']),
        languages: lawyer.languages.map((entry: any) => localizeNamedEntity(entry, locale)),
        specializations: lawyer.specializations.map((entry: any) => localizeNamedEntity(entry, locale)),
      },
    });
  } catch (error) {
    console.error('[Lawyer Profile API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch lawyer profile' }, { status: 500 });
  }
}

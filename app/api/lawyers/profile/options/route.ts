import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { localizeNamedEntity } from '@/lib/i18n/db';
import { getApiLocale, getApiLocalizedText } from '@/lib/i18n/api';
import { LAWYER_CONSULTATION_MODES } from '@/lib/lawyer-consultation';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Authentication required.') },
      { status: 401 }
    );
  }

  if (session.user.role !== 'LAWYER') {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Only lawyers can access this endpoint.') },
      { status: 403 }
    );
  }

  const locale = getApiLocale(req);

  try {
    const [languages, specializations] = await Promise.all([
      prisma.language.findMany({
        include: { translations: true },
        orderBy: { name: 'asc' },
      }),
      prisma.specialization.findMany({
        include: { translations: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    return NextResponse.json({
      languages: languages.map((language) => {
        const localizedLanguage = localizeNamedEntity(language, locale);
        return {
          id: localizedLanguage.id,
          name: localizedLanguage.name,
        };
      }),
      specializations: specializations.map((specialization) => {
        const localizedSpecialization = localizeNamedEntity(specialization, locale);
        return {
          id: localizedSpecialization.id,
          name: localizedSpecialization.name,
        };
      }),
      consultationModes: LAWYER_CONSULTATION_MODES,
    });
  } catch (error) {
    console.error('[Lawyer profile options API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to fetch profile options.') },
      { status: 500 }
    );
  }
}

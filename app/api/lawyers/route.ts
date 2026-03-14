import { NextRequest, NextResponse } from 'next/server';

import { getApiLocale, getApiLocalizedText } from '@/lib/i18n/api';
import { localizeNamedEntity } from '@/lib/i18n/db';
import prisma from '@/lib/prisma';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { getLawyerVerificationStatus } from '@/lib/verification';

const LAWYERS_LIMIT = { limit: 30, windowSecs: 60 };

export async function GET(req: NextRequest) {
  const locale = getApiLocale(req);
  const ip = getClientIp(req);
  const rl = rateLimit(`lawyers:${ip}`, LAWYERS_LIMIT);

  if (!rl.success) {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Too many requests. Please slow down.') },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const specialization = searchParams.get('specialization') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const minExp = parseInt(searchParams.get('minExp') || '0', 10);
    const maxFee = parseFloat(searchParams.get('maxFee') || '999999');
    const language = searchParams.get('language') || '';
    const verified = searchParams.get('verified') === 'true' ? true : undefined;

    const where: any = {
      AND: [
        city ? { city: { contains: city, mode: 'insensitive' } } : {},
        minRating > 0 ? { rating: { gte: minRating } } : {},
        minExp > 0 ? { experienceYears: { gte: minExp } } : {},
        maxFee < 999999 ? { consultationFee: { lte: maxFee } } : {},
        verified !== undefined ? { isVerified: verified } : {},
        specialization
          ? {
              specializations: {
                some: {
                  OR: [
                    { name: { contains: specialization, mode: 'insensitive' } },
                    {
                      translations: {
                        some: {
                          locale,
                          name: { contains: specialization, mode: 'insensitive' },
                        },
                      },
                    },
                  ],
                },
              },
            }
          : {},
        language
          ? {
              languages: {
                some: {
                  OR: [
                    { name: { contains: language, mode: 'insensitive' } },
                    {
                      translations: {
                        some: {
                          locale,
                          name: { contains: language, mode: 'insensitive' },
                        },
                      },
                    },
                  ],
                },
              },
            }
          : {},
        search
          ? {
              OR: [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { city: { contains: search, mode: 'insensitive' } },
                {
                  specializations: {
                    some: {
                      OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        {
                          translations: {
                            some: {
                              locale,
                              name: { contains: search, mode: 'insensitive' },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  languages: {
                    some: {
                      OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        {
                          translations: {
                            some: {
                              locale,
                              name: { contains: search, mode: 'insensitive' },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            }
          : {},
      ],
    };

    const lawyers: any[] = await prisma.lawyerProfile.findMany({
      where,
      include: {
        user: { select: { name: true, image: true, email: true } },
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
        modes: true,
        verificationCases: {
          select: {
            status: true,
            submittedAt: true,
          },
          orderBy: { submittedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { rating: 'desc' },
    });

    const tierWeights: Record<string, number> = {
      ELITE: 3,
      PRO: 2,
      BASIC: 1,
    };

    const sortedLawyers = lawyers
      .map((lawyer: any) => ({
        ...lawyer,
        languages: lawyer.languages.map((entry: any) => localizeNamedEntity(entry, locale)),
        specializations: lawyer.specializations.map((entry: any) => localizeNamedEntity(entry, locale)),
        verificationStatus: getLawyerVerificationStatus(lawyer),
      }))
      .sort((a: any, b: any) => {
        const tierA = (a as any).subscriptionTier || 'BASIC';
        const tierB = (b as any).subscriptionTier || 'BASIC';
        const weightA = tierWeights[tierA] || 1;
        const weightB = tierWeights[tierB] || 1;

        if (weightA !== weightB) {
          return weightB - weightA;
        }

        return b.rating - a.rating;
      });

    return NextResponse.json({ lawyers: sortedLawyers, total: sortedLawyers.length });
  } catch (error) {
    console.error('Lawyers API error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to fetch lawyers') },
      { status: 500 }
    );
  }
}

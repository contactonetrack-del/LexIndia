import { NextRequest, NextResponse } from 'next/server';

import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const issue = req.nextUrl.searchParams.get('issue')?.trim();
    const acts = await prisma.legalAct.findMany({
      where: {
        editorialStatus: 'APPROVED',
        ...(issue
          ? {
              issueTopics: {
                some: { slug: issue },
              },
            }
          : {}),
      },
      include: {
        sections: {
          where: { editorialStatus: 'APPROVED' },
          select: { id: true },
        },
        issueTopics: {
          select: {
            slug: true,
            title: true,
          },
        },
        versions: {
          where: { isCurrent: true },
          take: 1,
          select: {
            versionLabel: true,
            status: true,
            effectiveFrom: true,
          },
        },
      },
      orderBy: { title: 'asc' },
    });

    return NextResponse.json({
      acts: acts.map((act) => ({
        id: act.id,
        slug: act.slug,
        shortCode: act.shortCode,
        title: act.title,
        description: act.description,
        sourceAuthority: act.sourceAuthority,
        sourceUrl: act.sourceUrl,
        sourcePdfUrl: act.sourcePdfUrl,
        editorialStatus: act.editorialStatus,
        reviewedAt: act.reviewedAt,
        issueTopics: act.issueTopics,
        currentVersion: act.versions[0] ?? null,
        approvedSectionCount: act.sections.length,
      })),
    });
  } catch (error) {
    console.error('[Laws API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load laws.') },
      { status: 500 }
    );
  }
}

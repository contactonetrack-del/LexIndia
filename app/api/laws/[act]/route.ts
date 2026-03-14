import { NextRequest, NextResponse } from 'next/server';

import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

type Props = { params: Promise<{ act: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  const { act } = await params;

  try {
    const legalAct = await prisma.legalAct.findUnique({
      where: { slug: act },
      include: {
        issueTopics: {
          select: {
            slug: true,
            title: true,
          },
        },
        versions: {
          orderBy: [{ isCurrent: 'desc' }, { displayOrder: 'asc' }],
          select: {
            versionLabel: true,
            status: true,
            commencementDate: true,
            effectiveFrom: true,
            effectiveTo: true,
            updateSummary: true,
            officialSourceUrl: true,
            officialPdfUrl: true,
            isCurrent: true,
          },
        },
        timelineEvents: {
          orderBy: [{ displayOrder: 'asc' }, { eventDate: 'asc' }],
          select: {
            title: true,
            summary: true,
            eventType: true,
            eventDate: true,
            sourceLabel: true,
            sourceUrl: true,
            sourcePdfUrl: true,
          },
        },
        sections: {
          where: { editorialStatus: 'APPROVED' },
          orderBy: { sectionKey: 'asc' },
          select: {
            id: true,
            sectionKey: true,
            title: true,
            plainEnglish: true,
            editorialStatus: true,
            reviewedAt: true,
            aliases: {
              orderBy: { alias: 'asc' },
              select: {
                alias: true,
                aliasType: true,
                locale: true,
              },
            },
            issueTopics: {
              orderBy: { title: 'asc' },
              select: {
                slug: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!legalAct || legalAct.editorialStatus !== 'APPROVED') {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Law not found.') },
        { status: 404 }
      );
    }

    const [outgoingRelations, incomingRelations] = await Promise.all([
      prisma.legalActRelation.findMany({
        where: { fromActId: legalAct.id },
        select: {
          relationType: true,
          summary: true,
          effectiveFrom: true,
          toAct: {
            select: {
              slug: true,
              shortCode: true,
              title: true,
            },
          },
        },
      }),
      prisma.legalActRelation.findMany({
        where: { toActId: legalAct.id },
        select: {
          relationType: true,
          summary: true,
          effectiveFrom: true,
          fromAct: {
            select: {
              slug: true,
              shortCode: true,
              title: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      act: {
        id: legalAct.id,
        slug: legalAct.slug,
        shortCode: legalAct.shortCode,
        title: legalAct.title,
        description: legalAct.description,
        sourceAuthority: legalAct.sourceAuthority,
        sourceUrl: legalAct.sourceUrl,
        sourcePdfUrl: legalAct.sourcePdfUrl,
        editorialStatus: legalAct.editorialStatus,
        reviewerNotes: legalAct.reviewerNotes,
        reviewedAt: legalAct.reviewedAt,
        issueTopics: legalAct.issueTopics,
        outgoingRelations,
        incomingRelations,
        versions: legalAct.versions,
        timelineEvents: legalAct.timelineEvents,
        sections: legalAct.sections,
      },
    });
  } catch (error) {
    console.error('[Law Detail API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load law details.') },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';

type Props = { params: Promise<{ act: string; section: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  const { act, section } = await params;

  try {
    const lawSection = await prisma.lawSection.findFirst({
      where: {
        sectionKey: decodeURIComponent(section),
        editorialStatus: 'APPROVED',
        act: {
          slug: act,
          editorialStatus: 'APPROVED',
        },
      },
      include: {
        aliases: {
          orderBy: { alias: 'asc' },
          select: {
            alias: true,
            aliasType: true,
            locale: true,
          },
        },
        historyEntries: {
          orderBy: [{ displayOrder: 'asc' }, { eventDate: 'asc' }],
          select: {
            title: true,
            summary: true,
            entryType: true,
            eventDate: true,
            sourceLabel: true,
            sourceUrl: true,
            sourcePdfUrl: true,
          },
        },
        issueTopics: {
          orderBy: { title: 'asc' },
          select: {
            slug: true,
            title: true,
          },
        },
        act: {
          select: {
            id: true,
            slug: true,
            shortCode: true,
            title: true,
            description: true,
            sourceAuthority: true,
            sourceUrl: true,
            sourcePdfUrl: true,
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

    if (!lawSection) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Law section not found.') },
        { status: 404 }
      );
    }

    const [outgoingCrosswalks, incomingCrosswalks, outgoingRelations, incomingRelations] =
      await Promise.all([
        prisma.lawSectionCrosswalk.findMany({
          where: { fromSectionId: lawSection.id },
          select: {
            relationType: true,
            summary: true,
            toSection: {
              select: {
                sectionKey: true,
                title: true,
                act: {
                  select: {
                    slug: true,
                    shortCode: true,
                    title: true,
                  },
                },
              },
            },
          },
        }),
        prisma.lawSectionCrosswalk.findMany({
          where: { toSectionId: lawSection.id },
          select: {
            relationType: true,
            summary: true,
            fromSection: {
              select: {
                sectionKey: true,
                title: true,
                act: {
                  select: {
                    slug: true,
                    shortCode: true,
                    title: true,
                  },
                },
              },
            },
          },
        }),
        prisma.legalActRelation.findMany({
          where: { fromActId: lawSection.act.id },
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
          where: { toActId: lawSection.act.id },
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
      section: {
        ...lawSection,
        outgoingCrosswalks,
        incomingCrosswalks,
        act: {
          ...lawSection.act,
          outgoingRelations,
          incomingRelations,
        },
      },
    });
  } catch (error) {
    console.error('[Law Section API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load law section.') },
      { status: 500 }
    );
  }
}

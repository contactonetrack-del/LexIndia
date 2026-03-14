import { NextRequest, NextResponse } from 'next/server';

import { getApiLocale, getApiLocalizedText } from '@/lib/i18n/api';
import { localizeFields } from '@/lib/i18n/db';
import prisma from '@/lib/prisma';
import { getTemplateAvailability } from '@/lib/template-review';

export async function GET(req: NextRequest) {
  const locale = getApiLocale(req);

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    const where: any = {
      AND: [
        category
          ? {
              OR: [
                { category: { contains: category, mode: 'insensitive' } },
                {
                  translations: {
                    some: {
                      locale,
                      category: { contains: category, mode: 'insensitive' },
                    },
                  },
                },
              ],
            }
          : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                {
                  translations: {
                    some: {
                      locale,
                      OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                      ],
                    },
                  },
                },
              ],
            }
          : {},
      ],
    };

    const templates: any[] = await prisma.documentTemplate.findMany({
      where,
      include: {
        translations: true,
      },
      orderBy: { downloads: 'desc' },
    });

    const localizedTemplates = templates.map((template: any) => {
      const localizedTemplate = localizeFields(template, template.translations, locale, [
        'title',
        'description',
        'category',
        'content',
      ]);
      const availability = getTemplateAvailability({
        editorialStatus: template.editorialStatus,
        content: localizedTemplate.content,
      });

      return {
        ...localizedTemplate,
        content: availability.isReadyForDownload ? localizedTemplate.content : '',
        previewText: availability.previewText || localizedTemplate.description,
        availabilityStatus: availability.availabilityStatus,
        editorialStatus: availability.editorialStatus,
        isReadyForDownload: availability.isReadyForDownload,
        hasPlaceholderText: availability.hasPlaceholderText,
        reviewerNotes: template.reviewerNotes ?? null,
        reviewedAt: template.reviewedAt ?? null,
      };
    });

    return NextResponse.json({ templates: localizedTemplates });
  } catch (error) {
    console.error('Templates API error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to fetch templates') },
      { status: 500 }
    );
  }
}

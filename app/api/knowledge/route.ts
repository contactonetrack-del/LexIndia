import { NextRequest, NextResponse } from 'next/server';

import { getApiLocale, getApiLocalizedText } from '@/lib/i18n/api';
import { localizeFields } from '@/lib/i18n/db';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const locale = getApiLocale(req);

  try {
    const categories = await (prisma.fAQCategory as any).findMany({
      include: {
        translations: true,
        faqs: {
          where: {
            editorialStatus: 'APPROVED',
          },
          include: {
            translations: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const localizedCategories = categories.map((category: any) => ({
      ...localizeFields(category, category.translations, locale, ['name', 'description']),
      faqs: category.faqs.map((faq: any) =>
        localizeFields(faq, faq.translations, locale, ['question', 'answer'])
      ),
    })).filter((category: any) => category.faqs.length > 0);

    return NextResponse.json({ categories: localizedCategories });
  } catch (error) {
    console.error('Knowledge API error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to fetch knowledge base') },
      { status: 500 }
    );
  }
}

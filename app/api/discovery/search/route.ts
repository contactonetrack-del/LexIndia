import { NextRequest, NextResponse } from 'next/server';

import { searchDiscoveryResources } from '@/lib/discovery-search';
import { getApiLocalizedText } from '@/lib/i18n/api';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({
      guides: [],
      rights: [],
      laws: [],
    });
  }

  try {
    return NextResponse.json(await searchDiscoveryResources(query));
  } catch (error) {
    console.error('[Discovery Search API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to search legal resources.') },
      { status: 500 }
    );
  }
}

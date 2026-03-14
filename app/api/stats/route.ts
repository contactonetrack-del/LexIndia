import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/stats
 * Returns live platform counts for use on the homepage.
 * Cached at the edge for 10 minutes to avoid DB hammering.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 600; // 10-minute ISR cache

export async function GET() {
  try {
    const [lawyerCount, verifiedCount] = await Promise.all([
      prisma.lawyerProfile.count(),
      prisma.lawyerProfile.count({ where: { isVerified: true } }),
    ]);

    return NextResponse.json(
      { lawyers: lawyerCount, verified: verifiedCount },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=60',
        },
      }
    );
  } catch {
    // Return zeros on failure — homepage should still render
    return NextResponse.json({ lawyers: 0, verified: 0 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // We do an atomic increment directly in the DB to avoid race conditions. 
    // This is simple hit tracking, caching mechanisms could be optimized later.
    const updatedLawyer = await prisma.lawyerProfile.update({
      where: { id },
      data: {
        profileViews: {
          increment: 1,
        },
      },
      select: { profileViews: true },
    });

    return NextResponse.json({ success: true, views: updatedLawyer.profileViews });
  } catch (error) {
    if ((error as any).code === 'P2025') {
        // Record to update not found, fail silently to UI
        return NextResponse.json({ success: false, message: 'Lawyer not found' }, { status: 404 });
    }
    console.error('Error recording profile view:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record view' },
      { status: 500 }
    );
  }
}

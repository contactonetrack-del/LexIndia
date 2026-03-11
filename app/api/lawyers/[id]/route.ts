import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid lawyer ID' }, { status: 400 });
  }

  try {
    const lawyer = await prisma.lawyerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, image: true, email: true, createdAt: true } },
        languages: true,
        specializations: true,
        modes: true,
        appointments: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
      },
    });

    if (!lawyer) {
      return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
    }

    return NextResponse.json({ lawyer });
  } catch (error) {
    console.error('[Lawyer Profile API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch lawyer profile' }, { status: 500 });
  }
}

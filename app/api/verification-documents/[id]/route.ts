import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { isAdminUser } from '@/lib/admin';
import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';
import { readVerificationDocumentData } from '@/lib/verification-storage';

type Props = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }

  try {
    const document = await prisma.verificationDocument.findUnique({
      where: { id },
      select: {
        fileName: true,
        mimeType: true,
        storageProvider: true,
        storageBucket: true,
        storagePath: true,
        data: true,
        lawyerProfile: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Verification document not found.') },
        { status: 404 }
      );
    }

    if (!isAdminUser(session.user) && document.lawyerProfile.userId !== session.user.id) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Not authorised to access this document.') },
        { status: 403 }
      );
    }

    const documentData = await readVerificationDocumentData(document);

    return new NextResponse(new Uint8Array(documentData), {
      headers: {
        'Content-Type': document.mimeType,
        'Content-Disposition': `inline; filename="${document.fileName}"`,
        'Cache-Control': 'private, no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('[Verification Document API] GET error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to load verification document.') },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getApiLocalizedText } from '@/lib/i18n/api';
import prisma from '@/lib/prisma';
import { cleanupUnreferencedVerificationDocuments } from '@/lib/verification-documents';
import {
  sanitizeVerificationFileName,
  uploadVerificationDocument,
} from '@/lib/verification-storage';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['application/pdf', 'image/png', 'image/jpeg']);
const ALLOWED_KINDS = new Set(['IDENTITY', 'ENROLLMENT', 'PRACTICE']);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: getApiLocalizedText(req, 'Authentication required.') }, { status: 401 });
  }

  if (session.user.role !== 'LAWYER') {
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Only lawyers can upload verification documents.') },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const kind = String(formData.get('kind') ?? '').trim().toUpperCase();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'A file is required.') }, { status: 400 });
    }

    if (!ALLOWED_KINDS.has(kind)) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Invalid verification document type.') },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Only PDF, JPG, and PNG files are supported.') },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: getApiLocalizedText(req, 'Files must be 5 MB or smaller.') },
        { status: 400 }
      );
    }

    const profile = await prisma.lawyerProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: getApiLocalizedText(req, 'Profile not found.') }, { status: 404 });
    }

    const data = Buffer.from(await file.arrayBuffer());
    const storedDocument = await uploadVerificationDocument({
      lawyerProfileId: profile.id,
      kind,
      fileName: file.name,
      mimeType: file.type,
      data,
    });
    const document = await prisma.verificationDocument.create({
      data: {
        lawyerProfileId: profile.id,
        kind,
        fileName: sanitizeVerificationFileName(file.name),
        mimeType: file.type,
        sizeBytes: file.size,
        storageProvider: storedDocument.storageProvider,
        storageBucket: storedDocument.storageBucket,
        storagePath: storedDocument.storagePath,
        data: storedDocument.data,
      },
      select: {
        id: true,
        fileName: true,
      },
    });

    cleanupUnreferencedVerificationDocuments({
      client: prisma,
      lawyerProfileId: profile.id,
      keepDocumentIds: [document.id],
    }).catch((error) => {
      console.error('[Verification Documents API] Cleanup error:', error);
    });

    return NextResponse.json({
      documentId: document.id,
      fileName: document.fileName,
      url: `/api/verification-documents/${document.id}`,
    });
  } catch (error) {
    console.error('[Verification Documents API] POST error:', error);
    return NextResponse.json(
      { error: getApiLocalizedText(req, 'Failed to upload verification document.') },
      { status: 500 }
    );
  }
}

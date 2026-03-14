import { deleteVerificationDocumentAsset } from '@/lib/verification-storage';

type VerificationDocumentCleanupClient = {
  lawyerVerificationCase: {
    findMany: (args: {
      where: { lawyerProfileId: string };
      select: {
        identityDocumentUrl: true;
        enrollmentCertificateUrl: true;
        practiceCertificateUrl: true;
      };
    }) => Promise<
      Array<{
        identityDocumentUrl: string | null;
        enrollmentCertificateUrl: string | null;
        practiceCertificateUrl: string | null;
      }>
    >;
  };
  verificationDocument: {
    findMany: (args: {
      where: {
        lawyerProfileId: string;
        id?: { notIn: string[] };
      };
      select: {
        id: true;
        storageProvider: true;
        storageBucket: true;
        storagePath: true;
      };
    }) => Promise<
      Array<{
        id: string;
        storageProvider: string;
        storageBucket: string | null;
        storagePath: string | null;
      }>
    >;
    delete: (args: { where: { id: string } }) => Promise<unknown>;
  };
};

const VERIFICATION_DOCUMENT_URL_PATTERN = /^\/api\/verification-documents\/([a-z0-9]+)$/i;

export function extractVerificationDocumentIdFromUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  const match = value.trim().match(VERIFICATION_DOCUMENT_URL_PATTERN);
  return match?.[1] ?? null;
}

export async function cleanupUnreferencedVerificationDocuments({
  client,
  lawyerProfileId,
  keepDocumentIds = [],
}: {
  client: VerificationDocumentCleanupClient;
  lawyerProfileId: string;
  keepDocumentIds?: string[];
}) {
  const verificationCases = await client.lawyerVerificationCase.findMany({
    where: { lawyerProfileId },
    select: {
      identityDocumentUrl: true,
      enrollmentCertificateUrl: true,
      practiceCertificateUrl: true,
    },
  });

  const referencedDocumentIds = new Set(
    keepDocumentIds.filter(Boolean)
  );

  verificationCases.forEach((entry) => {
    [
      entry.identityDocumentUrl,
      entry.enrollmentCertificateUrl,
      entry.practiceCertificateUrl,
    ].forEach((value) => {
      const documentId = extractVerificationDocumentIdFromUrl(value);
      if (documentId) {
        referencedDocumentIds.add(documentId);
      }
    });
  });

  const staleDocuments = await client.verificationDocument.findMany({
    where: {
      lawyerProfileId,
      ...(referencedDocumentIds.size > 0
        ? {
            id: {
              notIn: Array.from(referencedDocumentIds),
            },
          }
        : {}),
    },
    select: {
      id: true,
      storageProvider: true,
      storageBucket: true,
      storagePath: true,
    },
  });

  for (const document of staleDocuments) {
    await deleteVerificationDocumentAsset(document);
    await client.verificationDocument.delete({
      where: { id: document.id },
    });
  }

  return staleDocuments.length;
}

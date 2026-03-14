import { PrismaClient } from '@prisma/client';

import {
  getVerificationStorageMode,
  uploadVerificationDocument,
} from '@/lib/verification-storage';
import { loadLocalEnv } from './load-local-env';

const prisma = new PrismaClient();

loadLocalEnv();

async function main() {
  if (getVerificationStorageMode() !== 'SUPABASE') {
    throw new Error(
      'Verification storage migration requires LEXINDIA_VERIFICATION_STORAGE_PROVIDER=SUPABASE and valid storage credentials.'
    );
  }

  const documents = await prisma.verificationDocument.findMany({
    where: {
      storageProvider: 'DATABASE',
      data: {
        not: null,
      },
    },
    select: {
      id: true,
      lawyerProfileId: true,
      kind: true,
      fileName: true,
      mimeType: true,
      data: true,
    },
  });

  console.log(`Found ${documents.length} verification documents to migrate.`);

  for (const document of documents) {
    if (!document.data) {
      continue;
    }

    const uploaded = await uploadVerificationDocument({
      lawyerProfileId: document.lawyerProfileId,
      kind: document.kind,
      fileName: document.fileName,
      mimeType: document.mimeType,
      data: Buffer.from(document.data),
    });

    await prisma.verificationDocument.update({
      where: { id: document.id },
      data: {
        storageProvider: uploaded.storageProvider,
        storageBucket: uploaded.storageBucket,
        storagePath: uploaded.storagePath,
        data: null,
      },
    });
  }

  console.log('Verification document migration complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

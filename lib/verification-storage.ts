import { randomUUID } from 'node:crypto';

type VerificationStorageMode = 'DATABASE' | 'SUPABASE';

type UploadVerificationDocumentInput = {
  lawyerProfileId: string;
  kind: string;
  fileName: string;
  mimeType: string;
  data: Buffer;
};

type VerificationDocumentRecord = {
  storageProvider?: string | null;
  storageBucket?: string | null;
  storagePath?: string | null;
  data?: Uint8Array | Buffer | null;
};

type UploadedVerificationDocument = {
  storageProvider: VerificationStorageMode;
  storageBucket: string | null;
  storagePath: string | null;
  data: Buffer | null;
};

function encodeStorageObjectPath(path: string) {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export function sanitizeVerificationFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
}

export function getVerificationStorageMode(): VerificationStorageMode {
  const configuredMode = process.env.LEXINDIA_VERIFICATION_STORAGE_PROVIDER?.trim().toUpperCase();
  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    Boolean(process.env.LEXINDIA_VERIFICATION_STORAGE_BUCKET);

  if (configuredMode === 'SUPABASE' && hasSupabaseConfig) {
    return 'SUPABASE';
  }

  return 'DATABASE';
}

async function uploadToSupabaseStorage(input: UploadVerificationDocumentInput) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.LEXINDIA_VERIFICATION_STORAGE_BUCKET;

  if (!supabaseUrl || !serviceRoleKey || !bucket) {
    throw new Error('supabase_storage_not_configured');
  }

  const fileName = sanitizeVerificationFileName(input.fileName);
  const storagePath = [
    'verification-documents',
    input.lawyerProfileId,
    input.kind.toLowerCase(),
    `${randomUUID()}-${fileName}`,
  ].join('/');

  const uploadResponse = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeStorageObjectPath(storagePath)}`,
    {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': input.mimeType,
        'x-upsert': 'false',
      },
      body: new Uint8Array(input.data),
      cache: 'no-store',
    }
  );

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text().catch(() => '');
    throw new Error(`supabase_upload_failed:${uploadResponse.status}:${errorText}`);
  }

  return {
    storageProvider: 'SUPABASE' as const,
    storageBucket: bucket,
    storagePath,
    data: null,
  };
}

export async function uploadVerificationDocument(
  input: UploadVerificationDocumentInput
): Promise<UploadedVerificationDocument> {
  if (getVerificationStorageMode() === 'SUPABASE') {
    return uploadToSupabaseStorage(input);
  }

  return {
    storageProvider: 'DATABASE',
    storageBucket: null,
    storagePath: null,
    data: input.data,
  };
}

export async function readVerificationDocumentData(document: VerificationDocumentRecord) {
  const storageProvider = document.storageProvider?.trim().toUpperCase() || 'DATABASE';

  if (storageProvider === 'SUPABASE') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const storageBucket = document.storageBucket;
    const storagePath = document.storagePath;

    if (!supabaseUrl || !serviceRoleKey || !storageBucket || !storagePath) {
      throw new Error('supabase_storage_not_configured');
    }

    const response = await fetch(
      `${supabaseUrl}/storage/v1/object/${encodeURIComponent(storageBucket)}/${encodeStorageObjectPath(storagePath)}`,
      {
        method: 'GET',
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`supabase_download_failed:${response.status}:${errorText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  if (!document.data) {
    throw new Error('verification_document_data_missing');
  }

  return Buffer.from(document.data);
}

export async function deleteVerificationDocumentAsset(
  document: Pick<
    VerificationDocumentRecord,
    'storageProvider' | 'storageBucket' | 'storagePath'
  >
) {
  const storageProvider = document.storageProvider?.trim().toUpperCase() || 'DATABASE';

  if (storageProvider !== 'SUPABASE') {
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const storageBucket = document.storageBucket;
  const storagePath = document.storagePath;

  if (!supabaseUrl || !serviceRoleKey || !storageBucket || !storagePath) {
    return;
  }

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${encodeURIComponent(storageBucket)}/${encodeStorageObjectPath(storagePath)}`,
    {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`supabase_delete_failed:${response.status}:${errorText}`);
  }
}

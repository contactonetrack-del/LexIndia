import { loadLocalEnv } from './load-local-env';

loadLocalEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.LEXINDIA_VERIFICATION_STORAGE_BUCKET;

function getHeaders() {
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required.');
  }

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

async function main() {
  if (!supabaseUrl || !bucket) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and LEXINDIA_VERIFICATION_STORAGE_BUCKET are required.'
    );
  }

  const existingBucketResponse = await fetch(
    `${supabaseUrl}/storage/v1/bucket/${encodeURIComponent(bucket)}`,
    {
      headers: getHeaders(),
      cache: 'no-store',
    }
  );

  if (existingBucketResponse.ok) {
    console.log(`Storage bucket "${bucket}" already exists.`);
    return;
  }

  const existingBucketBody = await existingBucketResponse.text();
  const bucketMissing =
    existingBucketResponse.status === 404 ||
    (existingBucketResponse.status === 400 &&
      existingBucketBody.toLowerCase().includes('bucket not found'));

  if (!bucketMissing) {
    throw new Error(
      `Failed to inspect storage bucket: ${existingBucketResponse.status} ${existingBucketBody}`
    );
  }

  const createBucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      id: bucket,
      name: bucket,
      public: false,
      file_size_limit: 5 * 1024 * 1024,
      allowed_mime_types: ['application/pdf', 'image/png', 'image/jpeg'],
    }),
    cache: 'no-store',
  });

  if (!createBucketResponse.ok) {
    throw new Error(
      `Failed to create storage bucket: ${createBucketResponse.status} ${await createBucketResponse.text()}`
    );
  }

  console.log(`Created storage bucket "${bucket}".`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

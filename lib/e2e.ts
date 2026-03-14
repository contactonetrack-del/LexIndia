import { headers } from 'next/headers';

export async function isE2EEnabled() {
  if (process.env['LEXINDIA_E2E'] === '1') {
    return true;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get('host')?.toLowerCase() ?? '';

  return host.startsWith('127.0.0.1') || host.startsWith('localhost');
}

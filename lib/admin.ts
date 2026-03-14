type AdminCandidate = {
  role?: string | null;
  email?: string | null;
};

function parseAdminEmails(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function getConfiguredAdminEmails(env: NodeJS.ProcessEnv = process.env): string[] {
  return Array.from(
    new Set([
      ...parseAdminEmails(env.LEXINDIA_ADMIN_EMAILS),
      ...parseAdminEmails(env.ADMIN_EMAILS),
    ])
  );
}

export function isAdminUser(candidate: AdminCandidate | null | undefined): boolean {
  if (!candidate) {
    return false;
  }

  if ((candidate.role ?? '').toUpperCase() === 'ADMIN') {
    return true;
  }

  const normalizedEmail = candidate.email?.trim().toLowerCase();
  if (!normalizedEmail) {
    return false;
  }

  return getConfiguredAdminEmails().includes(normalizedEmail);
}

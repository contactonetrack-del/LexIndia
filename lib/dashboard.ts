type DashboardCandidate = {
  role?: string | null;
  isAdmin?: boolean | null;
};

export function getDashboardPath(candidate: DashboardCandidate | null | undefined): string {
  if (candidate?.isAdmin) {
    return '/dashboard/admin';
  }

  if ((candidate?.role ?? '').toUpperCase() === 'LAWYER') {
    return '/dashboard/lawyer';
  }

  return '/dashboard/citizen';
}

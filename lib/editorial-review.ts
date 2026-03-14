export type EditorialStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ARCHIVED';

export const EDITORIAL_STATUSES: EditorialStatus[] = [
  'DRAFT',
  'REVIEW',
  'APPROVED',
  'ARCHIVED',
];

export function normalizeEditorialStatus(
  status: string | null | undefined,
  fallback: EditorialStatus = 'REVIEW'
): EditorialStatus {
  const normalized = status?.trim().toUpperCase();
  if (normalized && EDITORIAL_STATUSES.includes(normalized as EditorialStatus)) {
    return normalized as EditorialStatus;
  }

  return fallback;
}

export function isApprovedEditorialStatus(status: string | null | undefined) {
  return normalizeEditorialStatus(status) === 'APPROVED';
}

export function getEditorialStatusLabel(status: string | null | undefined) {
  switch (normalizeEditorialStatus(status)) {
    case 'DRAFT':
      return 'In progress';
    case 'REVIEW':
      return 'Under review';
    case 'APPROVED':
      return 'Reviewed';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return 'Under review';
  }
}

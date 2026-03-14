export function getLawVersionStatusLabel(status: string | null | undefined) {
  switch ((status ?? '').toUpperCase()) {
    case 'IN_FORCE':
      return 'In force';
    case 'UPCOMING':
      return 'Upcoming';
    case 'HISTORICAL':
      return 'Historical';
    default:
      return status ?? 'Unknown';
  }
}

export type LawyerVerificationStatus =
  | 'UNSUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ACTION_REQUIRED';

export function getLawyerVerificationStatus(input: {
  isVerified?: boolean | null;
  barCouncilID?: string | null;
  verificationCases?: Array<{ status?: string | null }> | null;
}): LawyerVerificationStatus {
  const latestCaseStatus = input.verificationCases?.[0]?.status?.trim().toUpperCase();

  if (latestCaseStatus === 'APPROVED') {
    return 'VERIFIED';
  }

  if (latestCaseStatus === 'UNDER_REVIEW') {
    return 'UNDER_REVIEW';
  }

  if (latestCaseStatus === 'CHANGES_REQUESTED' || latestCaseStatus === 'REJECTED') {
    return 'ACTION_REQUIRED';
  }

  if (input.isVerified) {
    return 'VERIFIED';
  }

  if (input.barCouncilID && input.barCouncilID.trim().length > 0) {
    return 'UNDER_REVIEW';
  }

  return 'UNSUBMITTED';
}

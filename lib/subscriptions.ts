export const LAWYER_SUBSCRIPTION_PRICES = {
  PRO: 999,
  ELITE: 2499,
} as const;

export type PaidLawyerSubscriptionTier = keyof typeof LAWYER_SUBSCRIPTION_PRICES;

export function isPaidLawyerSubscriptionTier(
  value: string
): value is PaidLawyerSubscriptionTier {
  return value in LAWYER_SUBSCRIPTION_PRICES;
}

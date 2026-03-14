export const LAWYER_CONSULTATION_MODES = ['VIDEO', 'CALL', 'CHAT', 'IN_PERSON'] as const;

export type LawyerConsultationModeValue =
  (typeof LAWYER_CONSULTATION_MODES)[number];

export function isLawyerConsultationMode(
  value: string
): value is LawyerConsultationModeValue {
  return LAWYER_CONSULTATION_MODES.includes(value as LawyerConsultationModeValue);
}

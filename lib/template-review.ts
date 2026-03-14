import {
  analyzeTemplateAvailability,
  type TemplateAvailabilityStatus,
} from '@/lib/template-availability';
import {
  normalizeEditorialStatus,
  type EditorialStatus,
} from '@/lib/editorial-review';

export type TemplateEditorialStatus = EditorialStatus;

export function normalizeTemplateEditorialStatus(
  status: string | null | undefined
): TemplateEditorialStatus {
  return normalizeEditorialStatus(status, 'REVIEW');
}

export function getTemplateAvailability(input: {
  editorialStatus?: string | null;
  content?: string | null;
}) {
  const editorialStatus = normalizeTemplateEditorialStatus(input.editorialStatus);
  const contentAvailability = analyzeTemplateAvailability(input.content);
  const isApproved = editorialStatus === 'APPROVED';
  const isReadyForDownload = isApproved && contentAvailability.isReadyForDownload;

  const availabilityStatus: TemplateAvailabilityStatus = isReadyForDownload
    ? 'READY'
    : 'PREVIEW_ONLY';

  return {
    editorialStatus,
    isReadyForDownload,
    availabilityStatus,
    hasPlaceholderText: contentAvailability.hasPlaceholderText,
    previewText: contentAvailability.previewText,
  };
}

export type TemplateAvailabilityStatus = 'READY' | 'PREVIEW_ONLY';

const PLACEHOLDER_PATTERNS = [
  /\[insert content here\]/i,
  /\bthis is a sample template\b/i,
  /\bsample template\b/i,
];

function normalizeTemplateContent(content: string | null | undefined): string {
  return (content ?? '').replace(/\s+/g, ' ').trim();
}

function buildPreviewText(content: string): string {
  return content.replace(/^#\s*/, '').slice(0, 180).trim();
}

export function analyzeTemplateAvailability(content: string | null | undefined) {
  const normalizedContent = normalizeTemplateContent(content);
  const hasPlaceholderText = PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(normalizedContent));
  const hasMeaningfulLength = normalizedContent.length >= 180;
  const isReadyForDownload = normalizedContent.length > 0 && hasMeaningfulLength && !hasPlaceholderText;

  return {
    status: (isReadyForDownload ? 'READY' : 'PREVIEW_ONLY') as TemplateAvailabilityStatus,
    isReadyForDownload,
    hasPlaceholderText,
    previewText: normalizedContent ? buildPreviewText(normalizedContent) : '',
  };
}

export function getActRelationLabel(
  relationType: string | null | undefined,
  direction: 'outgoing' | 'incoming'
) {
  switch ((relationType ?? '').toUpperCase()) {
    case 'SUPERSEDED_BY':
      return direction === 'outgoing' ? 'Replaced by' : 'Replaces';
    default:
      return 'Related code';
  }
}

export function getSectionCrosswalkLabel(
  relationType: string | null | undefined,
  direction: 'outgoing' | 'incoming'
) {
  switch ((relationType ?? '').toUpperCase()) {
    case 'SUCCESSOR':
      return direction === 'outgoing' ? 'Current code section' : 'Legacy code section';
    case 'ROUGH_EQUIVALENT':
      return 'Related section';
    default:
      return direction === 'outgoing' ? 'Linked section' : 'Linked section';
  }
}

export function getLawTimelineEventLabel(eventType: string | null | undefined) {
  switch ((eventType ?? '').toUpperCase()) {
    case 'ENACTED':
      return 'Enacted';
    case 'COMMENCED':
      return 'Commenced';
    case 'AMENDED':
      return 'Amendment';
    case 'SUPERSEDED':
      return 'Historical cutoff';
    case 'TRANSITION':
      return 'Code transition';
    case 'UPDATED':
      return 'Official update';
    default:
      return eventType ?? 'Timeline note';
  }
}

export function getSectionHistoryEntryLabel(entryType: string | null | undefined) {
  switch ((entryType ?? '').toUpperCase()) {
    case 'CURRENT_CITATION':
      return 'Current citation';
    case 'LEGACY_REFERENCE':
      return 'Legacy reference';
    case 'CROSSWALK':
      return 'Crosswalk note';
    case 'COMMENCEMENT':
      return 'History note';
    default:
      return entryType ?? 'Section history';
  }
}

import { defineLocalizedText, getLocalizedText } from '@/lib/content/localized';
import type { Locale } from '@/lib/i18n/config';

const KNOWLEDGE_CONTENT = {
  freeAid: {
    title: defineLocalizedText('Free Legal Aid (NALSA)'),
    description: defineLocalizedText(
      'Women, children, SC/ST members, industrial workmen, and persons with limited annual income may be eligible for free legal aid.'
    ),
    button: defineLocalizedText('Apply for Free Aid'),
    href: 'https://nalsa.gov.in/lsams/',
  },
  officialResourcesTitle: defineLocalizedText('Official Government Resources'),
  officialResources: [
    {
      id: 'ecourts',
      title: defineLocalizedText('eCourts Services'),
      description: defineLocalizedText(
        'Check case status, court orders, and cause lists across District Courts in India.'
      ),
      href: 'https://services.ecourts.gov.in/',
    },
    {
      id: 'tele-law',
      title: defineLocalizedText('Tele-Law'),
      description: defineLocalizedText(
        'Access pre-litigation advice through video conferencing by panel lawyers.'
      ),
      href: 'https://www.tele-law.in/',
    },
  ],
  cta: {
    title: defineLocalizedText('Have a specific question not covered here?'),
    description: defineLocalizedText(
      'A short call with a verified lawyer can help you understand the next step with confidence.'
    ),
    button: defineLocalizedText('Talk to a Lawyer'),
  },
  emptyState: {
    title: defineLocalizedText("Can't find what you're looking for?"),
    button: defineLocalizedText('Talk to a Lawyer'),
  },
} as const;

export function getKnowledgeContent(locale: Locale) {
  return {
    freeAid: {
      title: getLocalizedText(KNOWLEDGE_CONTENT.freeAid.title, locale),
      description: getLocalizedText(KNOWLEDGE_CONTENT.freeAid.description, locale),
      button: getLocalizedText(KNOWLEDGE_CONTENT.freeAid.button, locale),
      href: KNOWLEDGE_CONTENT.freeAid.href,
    },
    officialResourcesTitle: getLocalizedText(KNOWLEDGE_CONTENT.officialResourcesTitle, locale),
    officialResources: KNOWLEDGE_CONTENT.officialResources.map((resource) => ({
      ...resource,
      title: getLocalizedText(resource.title, locale),
      description: getLocalizedText(resource.description, locale),
    })),
    cta: {
      title: getLocalizedText(KNOWLEDGE_CONTENT.cta.title, locale),
      description: getLocalizedText(KNOWLEDGE_CONTENT.cta.description, locale),
      button: getLocalizedText(KNOWLEDGE_CONTENT.cta.button, locale),
    },
    emptyState: {
      title: getLocalizedText(KNOWLEDGE_CONTENT.emptyState.title, locale),
      button: getLocalizedText(KNOWLEDGE_CONTENT.emptyState.button, locale),
    },
  };
}

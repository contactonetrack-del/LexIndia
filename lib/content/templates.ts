import { defineLocalizedText, getLocalizedText } from '@/lib/content/localized';
import type { Locale } from '@/lib/i18n/config';

const TEMPLATE_CONTENT = {
  categories: [
    { id: 'All', label: defineLocalizedText('All') },
    { id: 'Criminal', label: defineLocalizedText('Criminal') },
    { id: 'Civil Rights', label: defineLocalizedText('Civil Rights') },
    { id: 'Civil / Corporate', label: defineLocalizedText('Civil / Corporate') },
    { id: 'Property', label: defineLocalizedText('Property') },
    { id: 'General', label: defineLocalizedText('General') },
  ],
  disclaimer: {
    title: defineLocalizedText('Disclaimer:'),
    body: defineLocalizedText(
      'These templates are general guides. Laws vary by state, so have a verified lawyer review the final draft before submission.'
    ),
  },
  downloadsLabel: defineLocalizedText('downloads'),
  upsell: {
    title: defineLocalizedText('Need help drafting a custom document?'),
    description: defineLocalizedText(
      'Get a verified lawyer to draft or review notices, agreements, and complaints for your case.'
    ),
    button: defineLocalizedText('Find a Lawyer'),
  },
} as const;

export function getTemplatesContent(locale: Locale) {
  return {
    categories: TEMPLATE_CONTENT.categories.map((category) => ({
      id: category.id,
      label: getLocalizedText(category.label, locale),
    })),
    disclaimer: {
      title: getLocalizedText(TEMPLATE_CONTENT.disclaimer.title, locale),
      body: getLocalizedText(TEMPLATE_CONTENT.disclaimer.body, locale),
    },
    downloadsLabel: getLocalizedText(TEMPLATE_CONTENT.downloadsLabel, locale),
    upsell: {
      title: getLocalizedText(TEMPLATE_CONTENT.upsell.title, locale),
      description: getLocalizedText(TEMPLATE_CONTENT.upsell.description, locale),
      button: getLocalizedText(TEMPLATE_CONTENT.upsell.button, locale),
    },
  };
}

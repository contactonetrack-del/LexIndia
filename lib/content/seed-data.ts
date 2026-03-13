import { allTranslations, languageNames } from '@/lib/i18n/messages';
import { SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/config';
import { getDisplayLocale } from '@/lib/i18n/display-locale';
import { getMemoryLocalizedText } from '@/lib/content/localized';

type LocaleMap = Record<Locale, string>;

function defineLocaleMap(defaultValue: string, overrides: Partial<Record<Locale, string>> = {}): LocaleMap {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      overrides[locale] ?? getMemoryLocalizedText(defaultValue, locale) ?? defaultValue,
    ])
  ) as LocaleMap;
}

function defineFaq(question: string, answer: string) {
  return {
    question,
    answer,
    translations: {
      question: defineLocaleMap(question),
      answer: defineLocaleMap(answer),
    },
  };
}

function displayNameForLanguage(code: string, fallback: string, locale: Locale) {
  try {
    const displayNames = new Intl.DisplayNames([getDisplayLocale(locale)], { type: 'language' });
    return displayNames.of(code) ?? fallback;
  } catch {
    return fallback;
  }
}

function defineLanguageMap(code: string, fallback: string): LocaleMap {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, displayNameForLanguage(code, fallback, locale)])
  ) as LocaleMap;
}

function fromMessageCatalog(
  fallback: string,
  resolver: (messages: (typeof allTranslations)[Locale]) => string | undefined
): LocaleMap {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, resolver(allTranslations[locale]) ?? fallback])
  ) as LocaleMap;
}

const CONSUMER_PROTECTION_NAMES = defineLocaleMap('Consumer Protection', {
  hi: 'उपभोक्ता संरक्षण',
  bn: 'ভোক্তা সুরক্ষা',
  te: 'వినియోగదారుల పరిరక్షణ',
  mr: 'ग्राहक संरक्षण',
  ta: 'நுகர்வோர் பாதுகாப்பு',
  gu: 'ગ્રાહક સુરક્ષા',
  ur: 'صارف تحفظ',
  kn: 'ಗ್ರಾಹಕ ರಕ್ಷಣೆ',
  or: 'ଉପଭୋକ୍ତା ସୁରକ୍ଷା',
  pa: 'ਖਪਤਕਾਰ ਸੁਰੱਖਿਆ',
  ml: 'ഉപഭോക്തൃ സംരക്ഷണം',
  bho: 'उपभोक्ता संरक्षण',
  bh: 'उपभोक्ता संरक्षण',
});

const SPECIALIZATION_DESCRIPTION_TEMPLATE: Record<Locale, (name: string) => string> = {
  en: (name) => `${name} matters, guidance, and case support.`,
  hi: (name) => `${name} मामलों, मार्गदर्शन और केस सहायता।`,
  bn: (name) => `${name} বিষয়ক পরামর্শ ও কেস সহায়তা।`,
  te: (name) => `${name} వ్యవహారాలపై మార్గదర్శనం మరియు కేసు సహాయం.`,
  mr: (name) => `${name} विषयांवरील मार्गदर्शन आणि केस सहाय्य.`,
  ta: (name) => `${name} தொடர்பான வழிகாட்டல் மற்றும் வழக்கு உதவி.`,
  gu: (name) => `${name} બાબતો માટે માર્ગદર્શન અને કેસ સહાય.`,
  ur: (name) => `${name} معاملات کے لیے رہنمائی اور کیس مدد۔`,
  kn: (name) => `${name} ವಿಷಯಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಪ್ರಕರಣ ಸಹಾಯ.`,
  or: (name) => `${name} ବିଷୟରେ ମାର୍ଗଦର୍ଶନ ଓ କେସ ସହାୟତା।`,
  pa: (name) => `${name} ਮਾਮਲਿਆਂ ਲਈ ਰਹਿਨੁਮਾਈ ਅਤੇ ਕੇਸ ਸਹਾਇਤਾ।`,
  ml: (name) => `${name} വിഷയങ്ങളിൽ മാർഗനിർദ്ദേശവും കേസ് പിന്തുണയും.`,
  bho: (name) => `${name} मामला में मार्गदर्शन आ केस मदद।`,
  bh: (name) => `${name} विषयमे मार्गदर्शन आ केस सहायता।`,
};

function defineSpecializationDescriptions(nameMap: LocaleMap): LocaleMap {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, SPECIALIZATION_DESCRIPTION_TEMPLATE[locale](nameMap[locale])])
  ) as LocaleMap;
}

export const SEEDED_LANGUAGES = [
  {
    name: 'English',
    translations: defineLanguageMap('en', 'English'),
  },
  {
    name: 'Hindi',
    translations: defineLanguageMap('hi', languageNames.hi),
  },
  {
    name: 'Punjabi',
    translations: defineLanguageMap('pa', languageNames.pa),
  },
  {
    name: 'Marathi',
    translations: defineLanguageMap('mr', languageNames.mr),
  },
  {
    name: 'Gujarati',
    translations: defineLanguageMap('gu', languageNames.gu),
  },
  {
    name: 'Telugu',
    translations: defineLanguageMap('te', languageNames.te),
  },
] as const;

const CRIMINAL_LAW_NAMES = fromMessageCatalog('Criminal Law', (messages) => messages.categories.c1);
const FAMILY_LAW_NAMES = fromMessageCatalog('Family Law', (messages) => messages.categories.c2);
const PROPERTY_LAW_NAMES = fromMessageCatalog('Property Law', (messages) => messages.categories.c3);
const CORPORATE_LAW_NAMES = fromMessageCatalog('Corporate Law', (messages) => messages.categories.c4);
const CIVIL_LAW_NAMES = fromMessageCatalog('Civil Law', (messages) => messages.categories.c5);
const CYBER_LAW_NAMES = fromMessageCatalog('Cyber Law', (messages) => messages.categories.c6);

export const SEEDED_SPECIALIZATIONS = [
  {
    name: 'Criminal Law',
    description: SPECIALIZATION_DESCRIPTION_TEMPLATE.en(CRIMINAL_LAW_NAMES.en),
    translations: {
      name: CRIMINAL_LAW_NAMES,
      description: defineSpecializationDescriptions(CRIMINAL_LAW_NAMES),
    },
  },
  {
    name: 'Family Law',
    description: SPECIALIZATION_DESCRIPTION_TEMPLATE.en(FAMILY_LAW_NAMES.en),
    translations: {
      name: FAMILY_LAW_NAMES,
      description: defineSpecializationDescriptions(FAMILY_LAW_NAMES),
    },
  },
  {
    name: 'Corporate Law',
    description: SPECIALIZATION_DESCRIPTION_TEMPLATE.en(CORPORATE_LAW_NAMES.en),
    translations: {
      name: CORPORATE_LAW_NAMES,
      description: defineSpecializationDescriptions(CORPORATE_LAW_NAMES),
    },
  },
  {
    name: 'Property Law',
    description: SPECIALIZATION_DESCRIPTION_TEMPLATE.en(PROPERTY_LAW_NAMES.en),
    translations: {
      name: PROPERTY_LAW_NAMES,
      description: defineSpecializationDescriptions(PROPERTY_LAW_NAMES),
    },
  },
  {
    name: 'Civil Law',
    description: SPECIALIZATION_DESCRIPTION_TEMPLATE.en(CIVIL_LAW_NAMES.en),
    translations: {
      name: CIVIL_LAW_NAMES,
      description: defineSpecializationDescriptions(CIVIL_LAW_NAMES),
    },
  },
  {
    name: 'Consumer Protection',
    description: SPECIALIZATION_DESCRIPTION_TEMPLATE.en(CONSUMER_PROTECTION_NAMES.en),
    translations: {
      name: CONSUMER_PROTECTION_NAMES,
      description: defineSpecializationDescriptions(CONSUMER_PROTECTION_NAMES),
    },
  },
  {
    name: 'Cyber Law',
    description: SPECIALIZATION_DESCRIPTION_TEMPLATE.en(CYBER_LAW_NAMES.en),
    translations: {
      name: CYBER_LAW_NAMES,
      description: defineSpecializationDescriptions(CYBER_LAW_NAMES),
    },
  },
] as const;

export const SEEDED_FAQ_CATEGORIES = [
  {
    name: 'Arrest Rights',
    description: 'Basic rights and safeguards available during arrest.',
    translations: {
      name: defineLocaleMap('Arrest Rights'),
      description: defineLocaleMap('Basic rights and safeguards available during arrest.'),
    },
    faqs: [
      defineFaq(
        'What are my rights if the police arrest me?',
        'You must be informed of the grounds of arrest, allowed to consult a lawyer, produced before a magistrate within 24 hours, and allowed to notify a relative or friend.'
      ),
      defineFaq(
        'Can the police arrest a woman at night?',
        'Usually no. Night arrests of women require exceptional circumstances, a woman police officer, and prior magistrate permission.'
      ),
    ],
  },
  {
    name: 'Domestic Violence',
    description: 'Protection orders, complaint filing, and free legal aid basics.',
    translations: {
      name: defineLocaleMap('Domestic Violence'),
      description: defineLocaleMap('Protection orders, complaint filing, and free legal aid basics.'),
    },
    faqs: [
      defineFaq(
        'How do I file a domestic violence complaint?',
        'You can approach the police station, a Protection Officer, a registered Service Provider, or file directly before the Magistrate under the Protection of Women from Domestic Violence Act, 2005.'
      ),
      defineFaq(
        'Can I get free legal aid for a domestic violence case?',
        'Yes. Women are entitled to free legal aid under the Legal Services Authorities Act, 1987, regardless of income.'
      ),
    ],
  },
  {
    name: 'Consumer Rights',
    description: 'Complaint filing, refund disputes, and consumer commission access.',
    translations: {
      name: defineLocaleMap('Consumer Rights'),
      description: defineLocaleMap('Complaint filing, refund disputes, and consumer commission access.'),
    },
    faqs: [
      defineFaq(
        'How do I file a consumer complaint against a company?',
        'You can file online through e-Daakhil or approach the appropriate Consumer Disputes Redressal Commission depending on claim value.'
      ),
    ],
  },
] as const;

export const SEEDED_TEMPLATES = [
  {
    title: 'Police Complaint / FIR Format',
    description: 'Standard format for drafting a written complaint to the police station in-charge.',
    category: 'Criminal',
    downloads: 12000,
    content:
      'Sample Police Complaint / FIR Format\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
  },
  {
    title: 'RTI Application Form',
    description: 'Format to file a Right to Information request to a government department.',
    category: 'Civil Rights',
    downloads: 45000,
    content:
      'Sample RTI Application Form\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
  },
  {
    title: 'Legal Notice for Unpaid Dues',
    description: 'Draft legal notice to recover money from a defaulter.',
    category: 'Civil / Corporate',
    downloads: 8000,
    content:
      'Sample Legal Notice for Unpaid Dues\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
  },
  {
    title: 'Standard Rent Agreement',
    description: '11-month residential rent agreement format for landlord and tenant use.',
    category: 'Property',
    downloads: 30000,
    content:
      'Sample Standard Rent Agreement\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
  },
  {
    title: 'General Name Change Affidavit',
    description: 'Affidavit format commonly used for gazette name change publication.',
    category: 'General',
    downloads: 15000,
    content:
      'Sample General Name Change Affidavit\n\nThis sample is for general awareness. Review with a lawyer before official use.\n\n[Insert content here]',
  },
].map((template) => ({
  ...template,
  translations: {
    title: defineLocaleMap(template.title),
    description: defineLocaleMap(template.description),
    category: defineLocaleMap(template.category),
    content: defineLocaleMap(template.content),
  },
}));

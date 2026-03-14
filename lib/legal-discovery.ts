import { getLocalizedText } from '@/lib/content/localized';
import { rightsCategories } from '@/lib/content/rights';
import type { Locale } from '@/lib/i18n/config';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import prisma from '@/lib/prisma';

type GuideSlug =
  | 'how-to-file-fir'
  | 'understanding-bail'
  | 'road-accident-emergency'
  | 'tenant-rights-india'
  | 'file-consumer-complaint'
  | 'free-legal-aid-nalsa'
  | 'domestic-violence-act-guide'
  | 'how-to-file-rti';

type RightSlug =
  | 'arrested'
  | 'cybercrime'
  | 'consumers'
  | 'tenants'
  | 'women'
  | 'workers'
  | 'students'
  | 'seniors';

type KnowledgeQuery = {
  query: string;
  title: string;
  description: string;
};

type LawReference = {
  actSlug: string;
  sectionKey?: string;
};

type ManualBundle = {
  laws?: LawReference[];
  guides?: GuideSlug[];
  rights?: RightSlug[];
  knowledgeQueries?: KnowledgeQuery[];
};

export type DiscoveryLink = {
  href: string;
  title: string;
  description: string;
  type: 'law' | 'guide' | 'right' | 'knowledge';
};

export type DiscoveryBundle = {
  lawLinks: DiscoveryLink[];
  guideLinks: DiscoveryLink[];
  rightLinks: DiscoveryLink[];
  knowledgeLinks: DiscoveryLink[];
};

const GUIDE_DIRECTORY: Record<
  GuideSlug,
  { title: string; description: string }
> = {
  'how-to-file-fir': {
    title: 'How to File an FIR',
    description: 'Step-by-step police complaint guidance, including Zero FIR and refusal handling.',
  },
  'understanding-bail': {
    title: 'Understanding Bail in India',
    description: 'A practical guide to bailable offences, anticipatory bail, and urgent next steps.',
  },
  'road-accident-emergency': {
    title: 'Road Accident Emergency Steps',
    description: 'What to document, who to call, and how to protect your legal position after an accident.',
  },
  'tenant-rights-india': {
    title: 'Tenant Rights in India',
    description: 'Protections against illegal eviction, utility cut-offs, and deposit disputes.',
  },
  'file-consumer-complaint': {
    title: 'How to File a Consumer Complaint',
    description: 'A practical walkthrough for online complaints, documents, and forum selection.',
  },
  'free-legal-aid-nalsa': {
    title: 'Free Legal Aid Under NALSA',
    description: 'Who qualifies for legal aid and how to ask for help when cost is the barrier.',
  },
  'domestic-violence-act-guide': {
    title: 'Domestic Violence Act Guide',
    description: 'A practical starting point for protection orders, residence relief, and urgent evidence.',
  },
  'how-to-file-rti': {
    title: 'How to File an RTI Application',
    description: 'A practical guide to filing a focused RTI request and handling reply delays.',
  },
};

const RIGHT_DIRECTORY: Record<RightSlug, { description: string }> = {
  arrested: {
    description: 'Rights around arrest, detention procedure, and access to legal counsel.',
  },
  cybercrime: {
    description: 'First-response help for cyber fraud, impersonation scams, and online abuse.',
  },
  consumers: {
    description: 'What to preserve, where to complain, and how to escalate defective-service disputes.',
  },
  tenants: {
    description: 'Orientation on rental disputes, notices, illegal eviction, and deposit recovery.',
  },
  women: {
    description: 'Practical awareness of legal protections, emergency support, and escalation paths.',
  },
  workers: {
    description: 'Starting points for wage disputes, workplace rights, and labour-law escalation.',
  },
  students: {
    description: 'Student grievance awareness, documentation, and next-step guidance.',
  },
  seniors: {
    description: 'Support paths for elder abuse, maintenance, and senior-citizen protections.',
  },
};

const ACT_DISCOVERY: Record<string, ManualBundle> = {
  'constitution-of-india': {
    guides: ['understanding-bail', 'how-to-file-fir', 'free-legal-aid-nalsa'],
    rights: ['arrested', 'women', 'workers'],
    knowledgeQueries: [
      {
        query: 'arrest rights',
        title: 'Search arrest-right FAQs',
        description: 'Open the FAQ knowledge base with an arrest-rights query prefilled.',
      },
      {
        query: 'legal aid',
        title: 'Search legal-aid FAQs',
        description: 'Find FAQ answers about free legal aid, authorities, and immediate next steps.',
      },
    ],
  },
  'information-technology-act-2000': {
    guides: ['how-to-file-fir', 'file-consumer-complaint'],
    rights: ['cybercrime', 'consumers', 'students'],
    knowledgeQueries: [
      {
        query: 'cyber fraud',
        title: 'Search cyber-fraud FAQs',
        description: 'Open the FAQ knowledge base with cyber-fraud help prefilled.',
      },
      {
        query: 'online scam',
        title: 'Search online-scam FAQs',
        description: 'Jump into related questions on impersonation, evidence, and complaint steps.',
      },
    ],
  },
  'consumer-protection-act-2019': {
    guides: ['file-consumer-complaint'],
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'consumer complaint',
        title: 'Search consumer-complaint FAQs',
        description: 'Open the FAQ knowledge base with complaint, forum, and document questions prefilled.',
      },
    ],
  },
  'protection-of-women-from-domestic-violence-act-2005': {
    guides: ['domestic-violence-act-guide', 'free-legal-aid-nalsa'],
    rights: ['women'],
    knowledgeQueries: [
      {
        query: 'domestic violence',
        title: 'Search domestic-violence FAQs',
        description: 'Find FAQ guidance on urgent safety, complaints, and interim court relief.',
      },
    ],
  },
  'sexual-harassment-of-women-at-workplace-act-2013': {
    rights: ['women', 'workers'],
    knowledgeQueries: [
      {
        query: 'workplace harassment',
        title: 'Search workplace-harassment FAQs',
        description: 'Open the FAQ base with workplace complaint and evidence questions prefilled.',
      },
    ],
  },
  'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007': {
    guides: ['free-legal-aid-nalsa'],
    rights: ['seniors'],
    knowledgeQueries: [
      {
        query: 'senior citizen rights',
        title: 'Search senior-citizen FAQs',
        description: 'Find FAQ answers on maintenance, neglect, and urgent senior-citizen protection.',
      },
    ],
  },
  'right-to-information-act-2005': {
    guides: ['how-to-file-rti'],
    knowledgeQueries: [
      {
        query: 'RTI',
        title: 'Search RTI FAQs',
        description: 'Jump into frequently asked questions on filing, reply timelines, and appeals.',
      },
    ],
  },
  'real-estate-regulation-and-development-act-2016': {
    guides: ['file-consumer-complaint'],
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'builder delay',
        title: 'Search builder-delay FAQs',
        description: 'Search FAQs about delayed possession, refund demands, and property-dispute next steps.',
      },
    ],
  },
  'code-on-wages-2019': {
    guides: ['free-legal-aid-nalsa'],
    rights: ['workers'],
    knowledgeQueries: [
      {
        query: 'salary delay',
        title: 'Search salary-delay FAQs',
        description: 'Open FAQ help on unpaid wages, labour complaints, and wage recovery steps.',
      },
    ],
  },
  'bharatiya-nyaya-sanhita-2023': {
    guides: ['how-to-file-fir', 'domestic-violence-act-guide'],
    rights: ['cybercrime', 'women'],
    knowledgeQueries: [
      {
        query: 'criminal intimidation',
        title: 'Search criminal-intimidation FAQs',
        description: 'Find FAQ guidance on threats, evidence preservation, and police-complaint steps.',
      },
      {
        query: 'impersonation scam',
        title: 'Search impersonation-scam FAQs',
        description: 'Jump into help for fake identity fraud, payment scams, and complaint next steps.',
      },
    ],
  },
  'bharatiya-nagarik-suraksha-sanhita-2023': {
    guides: ['how-to-file-fir', 'understanding-bail'],
    rights: ['arrested'],
    knowledgeQueries: [
      {
        query: 'FIR refusal',
        title: 'Search FIR-refusal FAQs',
        description: 'Open the FAQ knowledge base with FIR filing, refusal, and escalation guidance.',
      },
      {
        query: 'arrest procedure',
        title: 'Search arrest-procedure FAQs',
        description: 'Find answers on arrest powers, police procedure, and access to counsel.',
      },
    ],
  },
  'negotiable-instruments-act-1881': {
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'cheque bounce',
        title: 'Search cheque-bounce FAQs',
        description: 'Find quick answers on notice timing, complaint limitation, and settlement options.',
      },
    ],
  },
  'indian-evidence-act-1872': {
    rights: ['cybercrime'],
    knowledgeQueries: [
      {
        query: '65B certificate',
        title: 'Search 65B and digital-evidence FAQs',
        description: 'Open the knowledge base with legacy electronic-evidence and current-code crosswalk questions.',
      },
    ],
  },
  'maharashtra-rent-control-act-1999': {
    guides: ['tenant-rights-india'],
    rights: ['tenants'],
    knowledgeQueries: [
      {
        query: 'maharashtra tenant rights',
        title: 'Search Maharashtra rent FAQs',
        description: 'Find FAQ guidance on leave-and-licence disputes, eviction, and rent-payment protection.',
      },
    ],
  },
};

const SECTION_DISCOVERY: Record<string, ManualBundle> = {
  'constitution-of-india::Article 21': {
    guides: ['understanding-bail', 'road-accident-emergency'],
    rights: ['arrested', 'seniors'],
    knowledgeQueries: [
      {
        query: 'personal liberty',
        title: 'Search liberty-related FAQs',
        description: 'Find general answers connected to detention, liberty, and urgent remedies.',
      },
    ],
  },
  'constitution-of-india::Article 22': {
    guides: ['how-to-file-fir', 'understanding-bail'],
    rights: ['arrested'],
    knowledgeQueries: [
      {
        query: 'arrest procedure',
        title: 'Search arrest-procedure FAQs',
        description: 'Look up FAQ guidance on arrest grounds, custody procedure, and police steps.',
      },
    ],
  },
  'constitution-of-india::Article 39A': {
    guides: ['free-legal-aid-nalsa'],
    rights: ['women', 'workers'],
    knowledgeQueries: [
      {
        query: 'free legal aid',
        title: 'Search free-legal-aid FAQs',
        description: 'Open knowledge answers about eligibility, helplines, and legal-services authorities.',
      },
    ],
  },
  'information-technology-act-2000::Section 66C': {
    guides: ['how-to-file-fir'],
    rights: ['cybercrime'],
    knowledgeQueries: [
      {
        query: 'identity theft',
        title: 'Search identity-theft FAQs',
        description: 'Find FAQ guidance on passwords, OTP misuse, and evidence preservation.',
      },
    ],
  },
  'information-technology-act-2000::Section 66D': {
    guides: ['how-to-file-fir', 'file-consumer-complaint'],
    rights: ['cybercrime', 'consumers'],
    knowledgeQueries: [
      {
        query: 'online impersonation',
        title: 'Search impersonation-scam FAQs',
        description: 'Jump into help for fake support calls, KYC scams, and payment fraud.',
      },
    ],
  },
  'consumer-protection-act-2019::Section 35': {
    guides: ['file-consumer-complaint'],
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'consumer complaint',
        title: 'Search consumer-filing FAQs',
        description: 'Find FAQ help on where to file, what to attach, and what happens after filing.',
      },
    ],
  },
  'protection-of-women-from-domestic-violence-act-2005::Section 18': {
    guides: ['domestic-violence-act-guide', 'free-legal-aid-nalsa'],
    rights: ['women'],
    knowledgeQueries: [
      {
        query: 'protection order',
        title: 'Search protection-order FAQs',
        description: 'Open FAQ guidance on urgent orders, documentation, and safety-focused next steps.',
      },
    ],
  },
  'protection-of-women-from-domestic-violence-act-2005::Section 19': {
    guides: ['domestic-violence-act-guide'],
    rights: ['women'],
    knowledgeQueries: [
      {
        query: 'residence order',
        title: 'Search residence-order FAQs',
        description: 'Find FAQ guidance on shared household disputes and urgent housing protection.',
      },
    ],
  },
  'sexual-harassment-of-women-at-workplace-act-2013::Section 9': {
    rights: ['women', 'workers'],
    knowledgeQueries: [
      {
        query: 'workplace harassment complaint',
        title: 'Search workplace-complaint FAQs',
        description: 'Find FAQ help on complaint drafting, timelines, and document preservation.',
      },
    ],
  },
  'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007::Section 4': {
    guides: ['free-legal-aid-nalsa'],
    rights: ['seniors'],
    knowledgeQueries: [
      {
        query: 'senior citizen maintenance',
        title: 'Search senior-maintenance FAQs',
        description: 'Open FAQ help on maintenance, neglect, and tribunal-oriented next steps.',
      },
    ],
  },
  'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007::Section 23': {
    rights: ['seniors'],
    knowledgeQueries: [
      {
        query: 'senior citizen property transfer',
        title: 'Search senior-property FAQs',
        description: 'Find FAQ guidance on abusive transfers, neglect, and property-related escalation.',
      },
    ],
  },
  'right-to-information-act-2005::Section 6': {
    guides: ['how-to-file-rti'],
    knowledgeQueries: [
      {
        query: 'RTI application',
        title: 'Search RTI-filing FAQs',
        description: 'Find FAQ answers on drafting an RTI request and choosing the right authority.',
      },
    ],
  },
  'right-to-information-act-2005::Section 19': {
    guides: ['how-to-file-rti'],
    knowledgeQueries: [
      {
        query: 'RTI appeal',
        title: 'Search RTI-appeal FAQs',
        description: 'Jump to FAQ help on appeals, non-response, and rejected requests.',
      },
    ],
  },
  'real-estate-regulation-and-development-act-2016::Section 18': {
    guides: ['file-consumer-complaint'],
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'builder delay refund',
        title: 'Search builder-delay refund FAQs',
        description: 'Find FAQ guidance on delayed possession, refund demands, and escalation.',
      },
    ],
  },
  'real-estate-regulation-and-development-act-2016::Section 31': {
    guides: ['file-consumer-complaint'],
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'RERA complaint',
        title: 'Search RERA-complaint FAQs',
        description: 'Open FAQ help on complaint filing, forum choice, and evidence preparation.',
      },
    ],
  },
  'code-on-wages-2019::Section 45': {
    guides: ['free-legal-aid-nalsa'],
    rights: ['workers'],
    knowledgeQueries: [
      {
        query: 'unpaid wages',
        title: 'Search unpaid-wages FAQs',
        description: 'Open FAQ help on wage recovery, delayed salary, and labour-law escalation.',
      },
    ],
  },
  'bharatiya-nyaya-sanhita-2023::Section 75': {
    guides: ['domestic-violence-act-guide'],
    rights: ['women'],
    knowledgeQueries: [
      {
        query: 'sexual harassment',
        title: 'Search harassment FAQs',
        description: 'Find FAQ help on complaint options, evidence, and urgent next steps.',
      },
    ],
  },
  'bharatiya-nyaya-sanhita-2023::Section 319': {
    guides: ['how-to-file-fir', 'file-consumer-complaint'],
    rights: ['cybercrime', 'consumers'],
    knowledgeQueries: [
      {
        query: 'impersonation fraud',
        title: 'Search impersonation-fraud FAQs',
        description: 'Jump into FAQ guidance on fake identity scams, payment trails, and complaints.',
      },
    ],
  },
  'bharatiya-nyaya-sanhita-2023::Section 351': {
    guides: ['how-to-file-fir'],
    rights: ['women', 'cybercrime'],
    knowledgeQueries: [
      {
        query: 'criminal intimidation',
        title: 'Search threat-related FAQs',
        description: 'Find FAQ help on threats, coercion, and evidence preservation.',
      },
    ],
  },
  'bharatiya-nagarik-suraksha-sanhita-2023::Section 35': {
    guides: ['understanding-bail'],
    rights: ['arrested'],
    knowledgeQueries: [
      {
        query: 'arrest without warrant',
        title: 'Search no-warrant arrest FAQs',
        description: 'Open FAQ guidance on police powers, custody safeguards, and legal response.',
      },
    ],
  },
  'bharatiya-nagarik-suraksha-sanhita-2023::Section 38': {
    guides: ['understanding-bail'],
    rights: ['arrested'],
    knowledgeQueries: [
      {
        query: 'lawyer during interrogation',
        title: 'Search interrogation-right FAQs',
        description: 'Find FAQ guidance on access to counsel during police questioning.',
      },
    ],
  },
  'bharatiya-nagarik-suraksha-sanhita-2023::Section 173': {
    guides: ['how-to-file-fir'],
    rights: ['arrested', 'cybercrime'],
    knowledgeQueries: [
      {
        query: 'FIR',
        title: 'Search FIR FAQs',
        description: 'Find FAQ answers on FIR registration, refusal, and evidence to preserve.',
      },
    ],
  },
  'negotiable-instruments-act-1881::Section 138': {
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'cheque bounce notice',
        title: 'Search cheque-bounce notice FAQs',
        description: 'Open FAQ help on statutory notice, limitation, and complaint filing for dishonoured cheques.',
      },
    ],
  },
  'indian-evidence-act-1872::Section 65B': {
    rights: ['cybercrime'],
    laws: [{ actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 63' }],
    knowledgeQueries: [
      {
        query: '65B certificate',
        title: 'Search 65B certificate FAQs',
        description: 'Find FAQ guidance on legacy electronic-evidence references and current BSA crosswalks.',
      },
    ],
  },
  'companies-act-2013::Section 248': {
    knowledgeQueries: [
      {
        query: 'company strike off',
        title: 'Search strike-off FAQs',
        description: 'Open FAQ help on ROC strike-off notices, defaults, and restoration strategy.',
      },
    ],
  },
  'central-goods-and-services-tax-act-2017::Section 129': {
    knowledgeQueries: [
      {
        query: 'gst detained goods',
        title: 'Search detained-goods FAQs',
        description: 'Find FAQ guidance on release of goods in transit, payment, and appellate next steps.',
      },
    ],
  },
  'maharashtra-rent-control-act-1999::Section 24': {
    guides: ['tenant-rights-india'],
    rights: ['tenants'],
    knowledgeQueries: [
      {
        query: 'leave and licence eviction',
        title: 'Search leave-and-licence FAQs',
        description: 'Open FAQ help on licence expiry, possession, and documentation problems in tenancy disputes.',
      },
    ],
  },
};

const GUIDE_DISCOVERY: Partial<Record<GuideSlug, ManualBundle>> = {
  'how-to-file-fir': {
    laws: [
      { actSlug: 'constitution-of-india', sectionKey: 'Article 22' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 173' },
      { actSlug: 'information-technology-act-2000', sectionKey: 'Section 66D' },
    ],
    rights: ['arrested', 'cybercrime'],
    knowledgeQueries: [
      {
        query: 'Zero FIR',
        title: 'Search Zero FIR FAQs',
        description: 'Find FAQ answers about jurisdiction, refusal, and complaint escalation.',
      },
    ],
  },
  'understanding-bail': {
    laws: [
      { actSlug: 'constitution-of-india', sectionKey: 'Article 21' },
      { actSlug: 'constitution-of-india', sectionKey: 'Article 22' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 35' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 38' },
    ],
    rights: ['arrested'],
    knowledgeQueries: [
      {
        query: 'bail',
        title: 'Search bail FAQs',
        description: 'Open the FAQ knowledge base with bail-related answers prefilled.',
      },
    ],
  },
  'road-accident-emergency': {
    laws: [{ actSlug: 'constitution-of-india', sectionKey: 'Article 21' }],
    rights: ['consumers'],
    knowledgeQueries: [
      {
        query: 'road accident',
        title: 'Search road-accident FAQs',
        description: 'Find FAQs on emergency response, documentation, and complaint follow-up.',
      },
    ],
  },
  'tenant-rights-india': {
    laws: [{ actSlug: 'constitution-of-india', sectionKey: 'Article 21' }],
    rights: ['tenants'],
    knowledgeQueries: [
      {
        query: 'tenant rights',
        title: 'Search tenant-rights FAQs',
        description: 'Open the FAQ knowledge base with rental-dispute answers prefilled.',
      },
    ],
  },
  'file-consumer-complaint': {
    laws: [{ actSlug: 'information-technology-act-2000', sectionKey: 'Section 66D' }],
    rights: ['consumers', 'cybercrime'],
    knowledgeQueries: [
      {
        query: 'consumer complaint',
        title: 'Search consumer-law FAQs',
        description: 'Find complaint, evidence, and escalation guidance in the FAQ base.',
      },
    ],
  },
  'free-legal-aid-nalsa': {
    laws: [{ actSlug: 'constitution-of-india', sectionKey: 'Article 39A' }],
    rights: ['women', 'workers'],
    knowledgeQueries: [
      {
        query: 'legal aid',
        title: 'Search legal-aid FAQs',
        description: 'Jump into the FAQ base for legal-services authorities and eligibility help.',
      },
    ],
  },
  'domestic-violence-act-guide': {
    laws: [
      { actSlug: 'protection-of-women-from-domestic-violence-act-2005', sectionKey: 'Section 3' },
      { actSlug: 'protection-of-women-from-domestic-violence-act-2005', sectionKey: 'Section 18' },
      { actSlug: 'protection-of-women-from-domestic-violence-act-2005', sectionKey: 'Section 19' },
    ],
    rights: ['women'],
    knowledgeQueries: [
      {
        query: 'domestic violence',
        title: 'Search domestic-violence FAQs',
        description: 'Open FAQ help on emergency steps, protection orders, and support contacts.',
      },
    ],
  },
  'how-to-file-rti': {
    laws: [
      { actSlug: 'right-to-information-act-2005', sectionKey: 'Section 6' },
      { actSlug: 'right-to-information-act-2005', sectionKey: 'Section 7' },
      { actSlug: 'right-to-information-act-2005', sectionKey: 'Section 19' },
    ],
    knowledgeQueries: [
      {
        query: 'RTI',
        title: 'Search RTI FAQs',
        description: 'Find FAQ answers on RTI requests, replies, fees, and appeals.',
      },
    ],
  },
};

const RIGHT_DISCOVERY: Partial<Record<RightSlug, ManualBundle>> = {
  arrested: {
    laws: [
      { actSlug: 'constitution-of-india', sectionKey: 'Article 21' },
      { actSlug: 'constitution-of-india', sectionKey: 'Article 22' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 35' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 38' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 173' },
    ],
    guides: ['how-to-file-fir', 'understanding-bail'],
    knowledgeQueries: [
      {
        query: 'arrest rights',
        title: 'Search arrest-right FAQs',
        description: 'Open the FAQ knowledge base with detention and police-procedure answers prefilled.',
      },
    ],
  },
  cybercrime: {
    laws: [
      { actSlug: 'information-technology-act-2000', sectionKey: 'Section 66C' },
      { actSlug: 'information-technology-act-2000', sectionKey: 'Section 66D' },
      { actSlug: 'bharatiya-nyaya-sanhita-2023', sectionKey: 'Section 319' },
    ],
    guides: ['how-to-file-fir', 'file-consumer-complaint'],
    knowledgeQueries: [
      {
        query: 'cyber fraud',
        title: 'Search cyber-fraud FAQs',
        description: 'Find answers on evidence, helplines, and complaint escalation.',
      },
    ],
  },
  consumers: {
    laws: [
      { actSlug: 'consumer-protection-act-2019', sectionKey: 'Section 35' },
      { actSlug: 'real-estate-regulation-and-development-act-2016', sectionKey: 'Section 31' },
      { actSlug: 'information-technology-act-2000', sectionKey: 'Section 66D' },
    ],
    guides: ['file-consumer-complaint'],
    knowledgeQueries: [
      {
        query: 'consumer complaint',
        title: 'Search consumer-right FAQs',
        description: 'Browse FAQ answers on complaints, timelines, and forum selection.',
      },
    ],
  },
  tenants: {
    laws: [{ actSlug: 'constitution-of-india', sectionKey: 'Article 21' }],
    guides: ['tenant-rights-india'],
    knowledgeQueries: [
      {
        query: 'tenant rights',
        title: 'Search tenant-right FAQs',
        description: 'Find FAQ help on eviction, notices, deposits, and evidence.',
      },
    ],
  },
  women: {
    laws: [
      { actSlug: 'protection-of-women-from-domestic-violence-act-2005', sectionKey: 'Section 18' },
      { actSlug: 'sexual-harassment-of-women-at-workplace-act-2013', sectionKey: 'Section 9' },
      { actSlug: 'bharatiya-nyaya-sanhita-2023', sectionKey: 'Section 74' },
      { actSlug: 'bharatiya-nyaya-sanhita-2023', sectionKey: 'Section 75' },
      { actSlug: 'constitution-of-india', sectionKey: 'Article 39A' },
    ],
    guides: ['domestic-violence-act-guide', 'free-legal-aid-nalsa'],
    knowledgeQueries: [
      {
        query: 'women rights',
        title: 'Search women-rights FAQs',
        description: 'Open FAQ guidance for emergency support, complaints, and safe next steps.',
      },
    ],
  },
  workers: {
    laws: [
      { actSlug: 'code-on-wages-2019', sectionKey: 'Section 45' },
      { actSlug: 'sexual-harassment-of-women-at-workplace-act-2013', sectionKey: 'Section 9' },
      { actSlug: 'constitution-of-india', sectionKey: 'Article 39A' },
    ],
    guides: ['free-legal-aid-nalsa'],
    knowledgeQueries: [
      {
        query: 'labour rights',
        title: 'Search labour-rights FAQs',
        description: 'Find FAQ answers on wages, workplace disputes, and escalation paths.',
      },
    ],
  },
  seniors: {
    laws: [
      {
        actSlug: 'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007',
        sectionKey: 'Section 4',
      },
      {
        actSlug: 'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007',
        sectionKey: 'Section 23',
      },
    ],
    guides: ['free-legal-aid-nalsa'],
    knowledgeQueries: [
      {
        query: 'senior citizen rights',
        title: 'Search senior-citizen FAQs',
        description: 'Find FAQ help on maintenance, neglect, and senior-citizen legal options.',
      },
    ],
  },
};

function buildKnowledgeHref(query: string, locale: Locale) {
  return `${withLocalePrefix('/knowledge', locale)}?q=${encodeURIComponent(query)}`;
}

function getSectionDiscoveryKey(actSlug: string, sectionKey?: string) {
  return sectionKey ? `${actSlug}::${sectionKey}` : actSlug;
}

function getGuideLinks(guideSlugs: GuideSlug[] | undefined, locale: Locale): DiscoveryLink[] {
  if (!guideSlugs?.length) {
    return [];
  }

  const links: DiscoveryLink[] = [];

  for (const slug of guideSlugs) {
    const guide = GUIDE_DIRECTORY[slug];
    if (!guide) {
      continue;
    }

    links.push({
      href: withLocalePrefix(`/guides/${slug}`, locale),
      title: guide.title,
      description: guide.description,
      type: 'guide',
    });
  }

  return links;
}

function getRightLinks(rightSlugs: RightSlug[] | undefined, locale: Locale): DiscoveryLink[] {
  if (!rightSlugs?.length) {
    return [];
  }

  const links: DiscoveryLink[] = [];

  for (const slug of rightSlugs) {
    const right = rightsCategories.find((entry) => entry.slug === slug);
    if (!right) {
      continue;
    }

    links.push({
      href: withLocalePrefix(`/rights/${slug}`, locale),
      title: getLocalizedText(right.title, locale),
      description: RIGHT_DIRECTORY[slug].description,
      type: 'right',
    });
  }

  return links;
}

function getKnowledgeLinks(
  knowledgeQueries: KnowledgeQuery[] | undefined,
  locale: Locale
): DiscoveryLink[] {
  if (!knowledgeQueries?.length) {
    return [];
  }

  return knowledgeQueries.map((item) => ({
    href: buildKnowledgeHref(item.query, locale),
    title: item.title,
    description: item.description,
    type: 'knowledge' as const,
  }));
}

async function getLawLinks(lawRefs: LawReference[] | undefined, locale: Locale): Promise<DiscoveryLink[]> {
  if (!lawRefs?.length) {
    return [];
  }

  const actSlugs = [...new Set(lawRefs.map((ref) => ref.actSlug))];
  const acts = await prisma.legalAct.findMany({
    where: {
      editorialStatus: 'APPROVED',
      slug: { in: actSlugs },
    },
    select: {
      slug: true,
      title: true,
      description: true,
      sections: {
        where: { editorialStatus: 'APPROVED' },
        select: {
          sectionKey: true,
          title: true,
          plainEnglish: true,
        },
      },
    },
  });

  const actMap = new Map(acts.map((act) => [act.slug, act]));

  return lawRefs.flatMap((ref) => {
    const act = actMap.get(ref.actSlug);
    if (!act) {
      return [];
    }

    if (!ref.sectionKey) {
      return [
        {
          href: withLocalePrefix(`/laws/${act.slug}`, locale),
          title: act.title,
          description: act.description,
          type: 'law' as const,
        },
      ];
    }

    const section = act.sections.find((entry) => entry.sectionKey === ref.sectionKey);
    if (!section) {
      return [];
    }

    return [
      {
        href: withLocalePrefix(
          `/laws/${act.slug}/${encodeURIComponent(section.sectionKey)}`,
          locale
        ),
        title: `${section.sectionKey}: ${section.title}`,
        description: section.plainEnglish,
        type: 'law' as const,
      },
    ];
  });
}

async function resolveBundle(bundle: ManualBundle | undefined, locale: Locale): Promise<DiscoveryBundle> {
  if (!bundle) {
    return {
      lawLinks: [],
      guideLinks: [],
      rightLinks: [],
      knowledgeLinks: [],
    };
  }

  const [lawLinks] = await Promise.all([getLawLinks(bundle.laws, locale)]);

  return {
    lawLinks,
    guideLinks: getGuideLinks(bundle.guides, locale),
    rightLinks: getRightLinks(bundle.rights, locale),
    knowledgeLinks: getKnowledgeLinks(bundle.knowledgeQueries, locale),
  };
}

export async function getActDiscoveryBundle(actSlug: string, locale: Locale) {
  return resolveBundle(ACT_DISCOVERY[actSlug], locale);
}

export async function getSectionDiscoveryBundle(
  actSlug: string,
  sectionKey: string,
  locale: Locale
) {
  return resolveBundle(SECTION_DISCOVERY[getSectionDiscoveryKey(actSlug, sectionKey)], locale);
}

export async function getGuideDiscoveryBundle(slug: string, locale: Locale) {
  return resolveBundle(GUIDE_DISCOVERY[slug as GuideSlug], locale);
}

export async function getRightDiscoveryBundle(slug: string, locale: Locale) {
  return resolveBundle(RIGHT_DISCOVERY[slug as RightSlug], locale);
}

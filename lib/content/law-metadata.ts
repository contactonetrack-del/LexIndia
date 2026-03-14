type LawVersionSeedRecord = {
  versionLabel: string;
  status: 'IN_FORCE' | 'UPCOMING' | 'HISTORICAL';
  commencementDate?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  updateSummary: string;
  officialSourceUrl?: string;
  officialPdfUrl?: string | null;
  isCurrent: boolean;
  displayOrder?: number;
};

type LawSectionReference = {
  actSlug: string;
  sectionKey: string;
};

type LawSectionAliasSeedRecord = LawSectionReference & {
  aliases: Array<{
    alias: string;
    aliasType?: 'SEARCH' | 'PRACTICE_LABEL' | 'LEGACY_REFERENCE';
    locale?: string;
  }>;
};

type LegalIssueTopicSeedRecord = {
  slug: string;
  title: string;
  description: string;
  searchKeywords: string[];
  actSlugs?: string[];
  sectionRefs?: LawSectionReference[];
};

type LegalActRelationSeedRecord = {
  fromActSlug: string;
  toActSlug: string;
  relationType: 'SUPERSEDED_BY' | 'RELATED';
  summary: string;
  effectiveFrom?: string;
};

type LawSectionCrosswalkSeedRecord = {
  fromActSlug: string;
  fromSectionKey: string;
  toActSlug: string;
  toSectionKey: string;
  relationType?: 'SUCCESSOR' | 'ROUGH_EQUIVALENT';
  summary: string;
};

type LegalActTimelineEventSeedRecord = {
  actSlug: string;
  title: string;
  summary: string;
  eventType:
    | 'ENACTED'
    | 'COMMENCED'
    | 'UPDATED'
    | 'AMENDED'
    | 'SUPERSEDED'
    | 'TRANSITION';
  eventDate?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  sourcePdfUrl?: string | null;
  displayOrder?: number;
};

type LawSectionHistorySeedRecord = {
  actSlug: string;
  sectionKey: string;
  title: string;
  summary: string;
  entryType: 'CURRENT_CITATION' | 'LEGACY_REFERENCE' | 'CROSSWALK' | 'COMMENCEMENT';
  eventDate?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  sourcePdfUrl?: string | null;
  displayOrder?: number;
};

export const LAW_VERSION_SEED_RECORDS: Array<{
  actSlug: string;
  versions: LawVersionSeedRecord[];
}> = [
  {
    actSlug: 'constitution-of-india',
    versions: [
      {
        versionLabel: 'Current published constitutional text',
        status: 'IN_FORCE',
        commencementDate: '1950-01-26',
        effectiveFrom: '1950-01-26',
        updateSummary:
          'Foundational constitutional protections remain in force. Amendment-level section history is not yet broken out on LexIndia.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'information-technology-act-2000',
    versions: [
      {
        versionLabel: 'Current published IT Act text',
        status: 'IN_FORCE',
        updateSummary:
          'Current India Code text is in force. Detailed amendment-by-amendment change tracking is being expanded.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'consumer-protection-act-2019',
    versions: [
      {
        versionLabel: 'Current published consumer-law text',
        status: 'IN_FORCE',
        updateSummary:
          'Current India Code text is live on LexIndia with issue-led consumer complaint guidance layered on top.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'protection-of-women-from-domestic-violence-act-2005',
    versions: [
      {
        versionLabel: 'Current published domestic-violence text',
        status: 'IN_FORCE',
        updateSummary:
          'Current official text is in force. Relief workflows and shared-household guidance are mapped separately in LexIndia content.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'sexual-harassment-of-women-at-workplace-act-2013',
    versions: [
      {
        versionLabel: 'Current published POSH text',
        status: 'IN_FORCE',
        updateSummary:
          'Current official workplace-harassment text is in force. Employer workflow explainers are layered separately in the guide system.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007',
    versions: [
      {
        versionLabel: 'Current published senior-citizen protection text',
        status: 'IN_FORCE',
        updateSummary:
          'Current official text is in force, covering maintenance claims and abusive property-transfer disputes.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'right-to-information-act-2005',
    versions: [
      {
        versionLabel: 'Current published RTI text',
        status: 'IN_FORCE',
        updateSummary:
          'Current official RTI text is in force. Appeal and reply workflow guidance is mapped into LexIndia issue pages and guides.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'real-estate-regulation-and-development-act-2016',
    versions: [
      {
        versionLabel: 'Current published RERA text',
        status: 'IN_FORCE',
        updateSummary:
          'Current official RERA text is in force. State-rule and authority-specific workflow differences are still being expanded.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'code-on-wages-2019',
    versions: [
      {
        versionLabel: 'Current published wage-code text',
        status: 'IN_FORCE',
        updateSummary:
          'Current official wage-code text is indexed. LexIndia still needs deeper state-level wage notification overlays.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'indian-penal-code-1860',
    versions: [
      {
        versionLabel: 'Historical penal code text used before July 1, 2024',
        status: 'HISTORICAL',
        effectiveTo: '2024-06-30',
        updateSummary:
          'The Indian Penal Code, 1860 functioned as the core penal code until June 30, 2024 and was superseded by the Bharatiya Nyaya Sanhita, 2023 from July 1, 2024.',
        isCurrent: false,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'code-of-criminal-procedure-1973',
    versions: [
      {
        versionLabel: 'Historical procedure code used before July 1, 2024',
        status: 'HISTORICAL',
        effectiveTo: '2024-06-30',
        updateSummary:
          'The Code of Criminal Procedure, 1973 operated as the core criminal-procedure code until June 30, 2024 and was superseded by the Bharatiya Nagarik Suraksha Sanhita, 2023 from July 1, 2024.',
        isCurrent: false,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'bharatiya-nyaya-sanhita-2023',
    versions: [
      {
        versionLabel: '2023 code currently in force',
        status: 'IN_FORCE',
        commencementDate: '2024-07-01',
        effectiveFrom: '2024-07-01',
        updateSummary:
          'The Bharatiya Nyaya Sanhita, 2023 is in force from July 1, 2024. Legacy IPC crosswalks are still being expanded section by section.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    versions: [
      {
        versionLabel: '2023 procedure code currently in force',
        status: 'IN_FORCE',
        commencementDate: '2024-07-01',
        effectiveFrom: '2024-07-01',
        updateSummary:
          'The Bharatiya Nagarik Suraksha Sanhita, 2023 is in force from July 1, 2024. Legacy CrPC crosswalks are still being expanded section by section.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'hindu-marriage-act-1955',
    versions: [
      {
        versionLabel: 'Current published matrimonial-law text',
        status: 'IN_FORCE',
        commencementDate: '1955-05-18',
        effectiveFrom: '1955-05-18',
        updateSummary:
          'Current official Hindu Marriage Act text is indexed with contested-divorce, mutual-consent, and interim-maintenance starter guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'special-marriage-act-1954',
    versions: [
      {
        versionLabel: 'Current published civil-marriage text',
        status: 'IN_FORCE',
        commencementDate: '1954-10-09',
        effectiveFrom: '1954-10-09',
        updateSummary:
          'Current official Special Marriage Act text is in force, covering court-marriage eligibility, validity questions, and divorce starter guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'hindu-succession-act-1956',
    versions: [
      {
        versionLabel: 'Current published inheritance-law text',
        status: 'IN_FORCE',
        commencementDate: '1956-06-17',
        effectiveFrom: '1956-06-17',
        updateSummary:
          'Current official Hindu Succession Act text is indexed with inheritance and family-property starter guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'transfer-of-property-act-1882',
    versions: [
      {
        versionLabel: 'Current published property-transfer text',
        status: 'IN_FORCE',
        updateSummary:
          'Current official Transfer of Property Act text is indexed with sale, buyer-seller duty, and tenancy-notice starter guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'registration-act-1908',
    versions: [
      {
        versionLabel: 'Current published registration-law text',
        status: 'IN_FORCE',
        commencementDate: '1909-01-01',
        effectiveFrom: '1909-01-01',
        updateSummary:
          'Current official Registration Act text is indexed with compulsory-registration and non-registration consequence guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'employees-compensation-act-1923',
    versions: [
      {
        versionLabel: 'Current published workplace-injury text',
        status: 'IN_FORCE',
        commencementDate: '1924-07-01',
        effectiveFrom: '1924-07-01',
        updateSummary:
          'Current official Employees Compensation Act text is indexed with workplace-injury, compensation amount, and notice-claim guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    versions: [
      {
        versionLabel: '2023 evidence code currently in force',
        status: 'IN_FORCE',
        commencementDate: '2024-07-01',
        effectiveFrom: '2024-07-01',
        updateSummary:
          'Current official Bharatiya Sakshya Adhiniyam text is indexed with digital-evidence, admissibility, and expert-opinion starter guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    versions: [
      {
        versionLabel: 'Current published Companies Act text',
        status: 'IN_FORCE',
        commencementDate: '2013-08-29',
        effectiveFrom: '2013-08-29',
        updateSummary:
          'Current official Companies Act text is indexed with board-composition, director-disqualification, and governance meeting starter guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    versions: [
      {
        versionLabel: 'Current published CGST text',
        status: 'IN_FORCE',
        commencementDate: '2017-07-01',
        effectiveFrom: '2017-07-01',
        updateSummary:
          'Current official CGST Act text is indexed with input-tax-credit, tax-demand, and first-appeal starter guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'delhi-rent-control-act-1958',
    versions: [
      {
        versionLabel: 'Current published Delhi rent-control text',
        status: 'IN_FORCE',
        commencementDate: '1959-02-09',
        effectiveFrom: '1959-02-09',
        updateSummary:
          'Current official Delhi Rent Control Act text is indexed as a state-specific tenancy overlay covering eviction protection and rent-deposit workflow.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    versions: [
      {
        versionLabel: 'Current published cheque-dishonour text',
        status: 'IN_FORCE',
        commencementDate: '1882-03-01',
        effectiveFrom: '1882-03-01',
        updateSummary:
          'Current official Negotiable Instruments Act text is indexed with cheque-bounce, company-signatory, limitation, and interim-compensation guidance.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'indian-evidence-act-1872',
    versions: [
      {
        versionLabel: 'Historical evidence code text used before July 1, 2024',
        status: 'HISTORICAL',
        commencementDate: '1872-09-01',
        effectiveFrom: '1872-09-01',
        effectiveTo: '2024-06-30',
        updateSummary:
          'The Indian Evidence Act, 1872 remained the legacy evidence code until June 30, 2024 and was replaced for current-code references by the Bharatiya Sakshya Adhiniyam, 2023 from July 1, 2024.',
        isCurrent: false,
        displayOrder: 1,
      },
    ],
  },
  {
    actSlug: 'maharashtra-rent-control-act-1999',
    versions: [
      {
        versionLabel: 'Current published Maharashtra rent-control text',
        status: 'IN_FORCE',
        commencementDate: '2000-03-31',
        effectiveFrom: '2000-03-31',
        updateSummary:
          'Current official Maharashtra Rent Control Act text is indexed as a state-specific tenancy overlay covering rent-payment protection, licence expiry, and registration disputes.',
        isCurrent: true,
        displayOrder: 1,
      },
    ],
  },
];

export const LAW_SECTION_ALIAS_SEED_RECORDS: LawSectionAliasSeedRecord[] = [
  {
    actSlug: 'constitution-of-india',
    sectionKey: 'Article 21',
    aliases: [
      { alias: 'right to life', aliasType: 'PRACTICE_LABEL' },
      { alias: 'personal liberty', aliasType: 'PRACTICE_LABEL' },
      { alias: 'art 21', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'constitution-of-india',
    sectionKey: 'Article 22',
    aliases: [
      { alias: 'arrest safeguards', aliasType: 'PRACTICE_LABEL' },
      { alias: 'grounds of arrest', aliasType: 'PRACTICE_LABEL' },
      { alias: 'art 22', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'constitution-of-india',
    sectionKey: 'Article 39A',
    aliases: [
      { alias: 'free legal aid', aliasType: 'PRACTICE_LABEL' },
      { alias: 'equal justice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'art 39a', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'information-technology-act-2000',
    sectionKey: 'Section 66D',
    aliases: [
      { alias: 'online impersonation fraud', aliasType: 'PRACTICE_LABEL' },
      { alias: 'fake customer care scam', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 66d', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'protection-of-women-from-domestic-violence-act-2005',
    sectionKey: 'Section 18',
    aliases: [
      { alias: 'protection order', aliasType: 'PRACTICE_LABEL' },
      { alias: 'dv protection order', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 18 pwdva', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'protection-of-women-from-domestic-violence-act-2005',
    sectionKey: 'Section 19',
    aliases: [
      { alias: 'residence order', aliasType: 'PRACTICE_LABEL' },
      { alias: 'shared household protection', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 19 pwdva', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'sexual-harassment-of-women-at-workplace-act-2013',
    sectionKey: 'Section 9',
    aliases: [
      { alias: 'posh complaint', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sexual harassment complaint at work', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 9 posh', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'real-estate-regulation-and-development-act-2016',
    sectionKey: 'Section 18',
    aliases: [
      { alias: 'builder delay refund', aliasType: 'PRACTICE_LABEL' },
      { alias: 'rera refund section', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 18 rera', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'code-on-wages-2019',
    sectionKey: 'Section 45',
    aliases: [
      { alias: 'wage claim', aliasType: 'PRACTICE_LABEL' },
      { alias: 'salary recovery', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 45 code on wages', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-penal-code-1860',
    sectionKey: 'Section 354',
    aliases: [
      { alias: 'outraging modesty', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 354 ipc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-penal-code-1860',
    sectionKey: 'Section 419',
    aliases: [
      { alias: 'cheating by personation ipc', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 419 ipc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-penal-code-1860',
    sectionKey: 'Section 420',
    aliases: [
      { alias: 'cheating and dishonestly inducing delivery of property', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 420 ipc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-penal-code-1860',
    sectionKey: 'Section 506',
    aliases: [
      { alias: 'criminal intimidation ipc', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 506 ipc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-penal-code-1860',
    sectionKey: 'Section 509',
    aliases: [
      { alias: 'insult modesty of a woman', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 509 ipc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'code-of-criminal-procedure-1973',
    sectionKey: 'Section 41',
    aliases: [
      { alias: 'arrest without warrant crpc', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 41 crpc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'code-of-criminal-procedure-1973',
    sectionKey: 'Section 41B',
    aliases: [
      { alias: 'procedure of arrest crpc', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 41b crpc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'code-of-criminal-procedure-1973',
    sectionKey: 'Section 41D',
    aliases: [
      { alias: 'right to meet advocate during interrogation', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 41d crpc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'code-of-criminal-procedure-1973',
    sectionKey: 'Section 154',
    aliases: [
      { alias: 'fir registration crpc', aliasType: 'PRACTICE_LABEL' },
      { alias: 'zero fir crpc', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 154 crpc', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nyaya-sanhita-2023',
    sectionKey: 'Section 74',
    aliases: [
      { alias: 'ipc 354', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 74 bns', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nyaya-sanhita-2023',
    sectionKey: 'Section 75',
    aliases: [
      { alias: 'sexual harassment offence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'mahila suraksha harassment', aliasType: 'PRACTICE_LABEL' },
      { alias: 'ipc 509', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 75 bns', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nyaya-sanhita-2023',
    sectionKey: 'Section 319',
    aliases: [
      { alias: 'cheating by fake identity', aliasType: 'PRACTICE_LABEL' },
      { alias: 'impersonation fraud offence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'ipc 419', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 319 bns', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nyaya-sanhita-2023',
    sectionKey: 'Section 318',
    aliases: [
      { alias: 'ipc 420', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 318 bns', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nyaya-sanhita-2023',
    sectionKey: 'Section 351',
    aliases: [
      { alias: 'threats and intimidation', aliasType: 'PRACTICE_LABEL' },
      { alias: 'criminal threats', aliasType: 'PRACTICE_LABEL' },
      { alias: 'ipc 506', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 351 bns', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    sectionKey: 'Section 35',
    aliases: [
      { alias: 'arrest without warrant', aliasType: 'PRACTICE_LABEL' },
      { alias: 'police arrest power', aliasType: 'PRACTICE_LABEL' },
      { alias: 'crpc 41', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 35 bnss', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    sectionKey: 'Section 36',
    aliases: [
      { alias: 'crpc 41b', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 36 bnss', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    sectionKey: 'Section 38',
    aliases: [
      { alias: 'lawyer during interrogation', aliasType: 'PRACTICE_LABEL' },
      { alias: 'advocate access in custody', aliasType: 'PRACTICE_LABEL' },
      { alias: 'crpc 41d', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 38 bnss', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    sectionKey: 'Section 173',
    aliases: [
      { alias: 'first information report', aliasType: 'PRACTICE_LABEL' },
      { alias: 'zero fir', aliasType: 'PRACTICE_LABEL' },
      { alias: 'एफआईआर', aliasType: 'SEARCH', locale: 'hi' },
      { alias: 'fir refusal', aliasType: 'PRACTICE_LABEL' },
      { alias: 'crpc 154', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'sec 173 bnss', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'hindu-marriage-act-1955',
    sectionKey: 'Section 13',
    aliases: [
      { alias: 'contested divorce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'cruelty divorce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 13 hma', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'hindu-marriage-act-1955',
    sectionKey: 'Section 13B',
    aliases: [
      { alias: 'mutual consent divorce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'mutual divorce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 13b hma', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'hindu-marriage-act-1955',
    sectionKey: 'Section 24',
    aliases: [
      { alias: 'interim maintenance', aliasType: 'PRACTICE_LABEL' },
      { alias: 'litigation expenses in divorce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 24 hma', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'special-marriage-act-1954',
    sectionKey: 'Section 4',
    aliases: [
      { alias: 'court marriage eligibility', aliasType: 'PRACTICE_LABEL' },
      { alias: 'interfaith marriage conditions', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 4 sma', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'special-marriage-act-1954',
    sectionKey: 'Section 27',
    aliases: [
      { alias: 'special marriage divorce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'civil marriage divorce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 27 sma', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'hindu-succession-act-1956',
    sectionKey: 'Section 6',
    aliases: [
      { alias: 'coparcenary property', aliasType: 'PRACTICE_LABEL' },
      { alias: 'ancestral property share', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 6 hsa', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'hindu-succession-act-1956',
    sectionKey: 'Section 14',
    aliases: [
      { alias: 'female absolute property', aliasType: 'PRACTICE_LABEL' },
      { alias: 'stridhan rights', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 14 hsa', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'transfer-of-property-act-1882',
    sectionKey: 'Section 54',
    aliases: [
      { alias: 'sale deed', aliasType: 'PRACTICE_LABEL' },
      { alias: 'property sale transfer', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 54 tpa', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'transfer-of-property-act-1882',
    sectionKey: 'Section 106',
    aliases: [
      { alias: 'tenancy notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'lease termination notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 106 tpa', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'registration-act-1908',
    sectionKey: 'Section 17',
    aliases: [
      { alias: 'compulsory registration', aliasType: 'PRACTICE_LABEL' },
      { alias: 'mandatory document registration', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 17 registration act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'registration-act-1908',
    sectionKey: 'Section 49',
    aliases: [
      { alias: 'effect of non registration', aliasType: 'PRACTICE_LABEL' },
      { alias: 'unregistered sale deed', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 49 registration act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'employees-compensation-act-1923',
    sectionKey: 'Section 3',
    aliases: [
      { alias: 'work injury compensation', aliasType: 'PRACTICE_LABEL' },
      { alias: 'workplace accident compensation', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 3 employees compensation', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'employees-compensation-act-1923',
    sectionKey: 'Section 10',
    aliases: [
      { alias: 'accident notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'compensation claim notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 10 employees compensation', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    sectionKey: 'Section 39',
    aliases: [
      { alias: 'expert opinion', aliasType: 'PRACTICE_LABEL' },
      { alias: 'digital forensic expert', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 39 bsa', aliasType: 'SEARCH' },
      { alias: 'section 45a evidence act', aliasType: 'LEGACY_REFERENCE' },
    ],
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    sectionKey: 'Section 61',
    aliases: [
      { alias: 'digital evidence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'electronic record evidence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 61 bsa', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    sectionKey: 'Section 62',
    aliases: [
      { alias: 'special provisions for electronic evidence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'electronic proof framework', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 62 bsa', aliasType: 'SEARCH' },
      { alias: 'section 65a evidence act', aliasType: 'LEGACY_REFERENCE' },
    ],
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    sectionKey: 'Section 63',
    aliases: [
      { alias: 'electronic record admissibility', aliasType: 'PRACTICE_LABEL' },
      { alias: 'computer output evidence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 63 bsa', aliasType: 'SEARCH' },
      { alias: '65b certificate', aliasType: 'LEGACY_REFERENCE' },
      { alias: 'section 65b evidence act', aliasType: 'LEGACY_REFERENCE' },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 92',
    aliases: [
      { alias: 'annual return filing', aliasType: 'PRACTICE_LABEL' },
      { alias: 'mca annual return', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 92 companies act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 117',
    aliases: [
      { alias: 'file board resolution', aliasType: 'PRACTICE_LABEL' },
      { alias: 'resolution filing with roc', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 117 companies act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 248',
    aliases: [
      { alias: 'company strike off', aliasType: 'PRACTICE_LABEL' },
      { alias: 'roc removal of company name', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 248 companies act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 252',
    aliases: [
      { alias: 'restore struck off company', aliasType: 'PRACTICE_LABEL' },
      { alias: 'nclt restoration', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 252 companies act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 149',
    aliases: [
      { alias: 'board of directors', aliasType: 'PRACTICE_LABEL' },
      { alias: 'company board structure', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 149 companies act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 164',
    aliases: [
      { alias: 'director disqualification', aliasType: 'PRACTICE_LABEL' },
      { alias: 'disqualified director', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 164 companies act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 173',
    aliases: [
      { alias: 'board meeting', aliasType: 'PRACTICE_LABEL' },
      { alias: 'board meeting notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 173 companies act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    sectionKey: 'Section 16',
    aliases: [
      { alias: 'input tax credit', aliasType: 'PRACTICE_LABEL' },
      { alias: 'itc eligibility', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 16 cgst', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    sectionKey: 'Section 70',
    aliases: [
      { alias: 'gst summons', aliasType: 'PRACTICE_LABEL' },
      { alias: 'summon for documents under gst', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 70 cgst', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    sectionKey: 'Section 73',
    aliases: [
      { alias: 'gst notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'tax short paid notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 73 cgst', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    sectionKey: 'Section 74',
    aliases: [
      { alias: 'fraud gst notice', aliasType: 'PRACTICE_LABEL' },
      { alias: 'wilful suppression gst', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 74 cgst', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    sectionKey: 'Section 107',
    aliases: [
      { alias: 'gst appeal', aliasType: 'PRACTICE_LABEL' },
      { alias: 'appellate authority gst', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 107 cgst', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    sectionKey: 'Section 122',
    aliases: [
      { alias: 'gst penalty', aliasType: 'PRACTICE_LABEL' },
      { alias: 'penalty for gst offences', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 122 cgst', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    sectionKey: 'Section 129',
    aliases: [
      { alias: 'detained goods under gst', aliasType: 'PRACTICE_LABEL' },
      { alias: 'release of goods in transit', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 129 cgst', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'delhi-rent-control-act-1958',
    sectionKey: 'Section 14',
    aliases: [
      { alias: 'delhi tenant eviction', aliasType: 'PRACTICE_LABEL' },
      { alias: 'eviction protection delhi', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 14 drc act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'delhi-rent-control-act-1958',
    sectionKey: 'Section 27',
    aliases: [
      { alias: 'rent deposit by tenant', aliasType: 'PRACTICE_LABEL' },
      { alias: 'landlord refused rent delhi', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 27 drc act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    sectionKey: 'Section 138',
    aliases: [
      { alias: 'cheque bounce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'dishonour of cheque', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 138 ni act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    sectionKey: 'Section 139',
    aliases: [
      { alias: 'cheque presumption', aliasType: 'PRACTICE_LABEL' },
      { alias: 'presumption in favour of holder', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 139 ni act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    sectionKey: 'Section 141',
    aliases: [
      { alias: 'company cheque bounce liability', aliasType: 'PRACTICE_LABEL' },
      { alias: 'director liability under cheque case', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 141 ni act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    sectionKey: 'Section 142',
    aliases: [
      { alias: 'cheque bounce limitation', aliasType: 'PRACTICE_LABEL' },
      { alias: 'cognizance under ni act', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 142 ni act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    sectionKey: 'Section 143A',
    aliases: [
      { alias: 'interim compensation cheque bounce', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 143a ni act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    sectionKey: 'Section 147',
    aliases: [
      { alias: 'compound cheque bounce case', aliasType: 'PRACTICE_LABEL' },
      { alias: 'settlement of ni act offence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 147 ni act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-evidence-act-1872',
    sectionKey: 'Section 45A',
    aliases: [
      { alias: 'examiner of electronic evidence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'digital forensic expert opinion', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 45a evidence act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-evidence-act-1872',
    sectionKey: 'Section 65A',
    aliases: [
      { alias: 'special provisions electronic record', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 65a evidence act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'indian-evidence-act-1872',
    sectionKey: 'Section 65B',
    aliases: [
      { alias: '65b certificate', aliasType: 'PRACTICE_LABEL' },
      { alias: 'electronic records admissibility', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 65b evidence act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'maharashtra-rent-control-act-1999',
    sectionKey: 'Section 15',
    aliases: [
      { alias: 'maharashtra tenant eviction protection', aliasType: 'PRACTICE_LABEL' },
      { alias: 'ready and willing to pay rent', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 15 mrc act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'maharashtra-rent-control-act-1999',
    sectionKey: 'Section 17',
    aliases: [
      { alias: 'tenant re entry after repairs', aliasType: 'PRACTICE_LABEL' },
      { alias: 'repair possession maharashtra rent', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 17 mrc act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'maharashtra-rent-control-act-1999',
    sectionKey: 'Section 24',
    aliases: [
      { alias: 'leave and licence eviction', aliasType: 'PRACTICE_LABEL' },
      { alias: 'licensee possession maharashtra', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 24 mrc act', aliasType: 'SEARCH' },
    ],
  },
  {
    actSlug: 'maharashtra-rent-control-act-1999',
    sectionKey: 'Section 55',
    aliases: [
      { alias: 'registered leave and licence', aliasType: 'PRACTICE_LABEL' },
      { alias: 'tenancy agreement registration maharashtra', aliasType: 'PRACTICE_LABEL' },
      { alias: 'sec 55 mrc act', aliasType: 'SEARCH' },
    ],
  },
];

export const LEGAL_ISSUE_TOPICS_SEED_RECORDS: LegalIssueTopicSeedRecord[] = [
  {
    slug: 'fir-and-police-complaints',
    title: 'FIR and police complaints',
    description:
      'Complaint registration, refusal handling, FIR procedure, and first-response evidence preservation.',
    searchKeywords: ['fir', 'first information report', 'zero fir', 'एफआईआर', 'prathmiki'],
    actSlugs: ['code-of-criminal-procedure-1973', 'bharatiya-nagarik-suraksha-sanhita-2023'],
    sectionRefs: [
      { actSlug: 'code-of-criminal-procedure-1973', sectionKey: 'Section 154' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 173' },
      { actSlug: 'constitution-of-india', sectionKey: 'Article 22' },
    ],
  },
  {
    slug: 'arrest-and-custody',
    title: 'Arrest and custody safeguards',
    description:
      'Grounds of arrest, detention procedure, access to counsel, and no-warrant arrest powers.',
    searchKeywords: ['arrest', 'custody', 'detention', 'girftari', 'गिरफ्तारी'],
    actSlugs: [
      'constitution-of-india',
      'code-of-criminal-procedure-1973',
      'bharatiya-nagarik-suraksha-sanhita-2023',
    ],
    sectionRefs: [
      { actSlug: 'constitution-of-india', sectionKey: 'Article 21' },
      { actSlug: 'constitution-of-india', sectionKey: 'Article 22' },
      { actSlug: 'code-of-criminal-procedure-1973', sectionKey: 'Section 41' },
      { actSlug: 'code-of-criminal-procedure-1973', sectionKey: 'Section 41B' },
      { actSlug: 'code-of-criminal-procedure-1973', sectionKey: 'Section 41D' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 35' },
      { actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023', sectionKey: 'Section 38' },
    ],
  },
  {
    slug: 'cyber-fraud-and-impersonation',
    title: 'Cyber fraud and impersonation',
    description:
      'OTP scams, fake customer-care calls, personation-based fraud, and digital identity misuse.',
    searchKeywords: ['cyber fraud', 'online scam', 'otp fraud', 'impersonation', 'साइबर फ्रॉड'],
    actSlugs: ['information-technology-act-2000', 'indian-penal-code-1860', 'bharatiya-nyaya-sanhita-2023'],
    sectionRefs: [
      { actSlug: 'information-technology-act-2000', sectionKey: 'Section 66C' },
      { actSlug: 'information-technology-act-2000', sectionKey: 'Section 66D' },
      { actSlug: 'indian-penal-code-1860', sectionKey: 'Section 419' },
      { actSlug: 'indian-penal-code-1860', sectionKey: 'Section 420' },
      { actSlug: 'bharatiya-nyaya-sanhita-2023', sectionKey: 'Section 319' },
    ],
  },
  {
    slug: 'domestic-violence-and-shared-household',
    title: 'Domestic violence and shared household relief',
    description:
      'Domestic abuse, protection orders, residence rights, and urgent safety-focused court relief.',
    searchKeywords: ['domestic violence', 'protection order', 'shared household', 'घरेलू हिंसा'],
    actSlugs: ['protection-of-women-from-domestic-violence-act-2005'],
    sectionRefs: [
      { actSlug: 'protection-of-women-from-domestic-violence-act-2005', sectionKey: 'Section 3' },
      { actSlug: 'protection-of-women-from-domestic-violence-act-2005', sectionKey: 'Section 18' },
      { actSlug: 'protection-of-women-from-domestic-violence-act-2005', sectionKey: 'Section 19' },
    ],
  },
  {
    slug: 'women-safety-and-harassment',
    title: 'Women safety and harassment',
    description:
      'Harassment, assault, criminal-force complaints, and overlapping civil or workplace remedies.',
    searchKeywords: ['women safety', 'sexual harassment', 'mahila suraksha', 'महिला सुरक्षा'],
    actSlugs: [
      'indian-penal-code-1860',
      'bharatiya-nyaya-sanhita-2023',
      'sexual-harassment-of-women-at-workplace-act-2013',
    ],
    sectionRefs: [
      { actSlug: 'indian-penal-code-1860', sectionKey: 'Section 354' },
      { actSlug: 'indian-penal-code-1860', sectionKey: 'Section 509' },
      { actSlug: 'bharatiya-nyaya-sanhita-2023', sectionKey: 'Section 74' },
      { actSlug: 'bharatiya-nyaya-sanhita-2023', sectionKey: 'Section 75' },
      { actSlug: 'sexual-harassment-of-women-at-workplace-act-2013', sectionKey: 'Section 9' },
    ],
  },
  {
    slug: 'criminal-intimidation-and-threats',
    title: 'Criminal intimidation and threats',
    description:
      'Threat-based criminal complaints, pressure tactics, and intimidation provisions across the legacy and current penal codes.',
    searchKeywords: ['criminal intimidation', 'threats', 'sec 506 ipc', 'sec 351 bns', 'threat complaint'],
    actSlugs: ['indian-penal-code-1860', 'bharatiya-nyaya-sanhita-2023'],
    sectionRefs: [
      { actSlug: 'indian-penal-code-1860', sectionKey: 'Section 506' },
      { actSlug: 'bharatiya-nyaya-sanhita-2023', sectionKey: 'Section 351' },
    ],
  },
  {
    slug: 'consumer-refunds-and-defective-services',
    title: 'Consumer refunds and defective services',
    description:
      'Forum selection, complaint drafting, refunds, and defective-service disputes.',
    searchKeywords: ['consumer complaint', 'refund', 'defective service', 'उपभोक्ता शिकायत'],
    actSlugs: ['consumer-protection-act-2019'],
    sectionRefs: [
      { actSlug: 'consumer-protection-act-2019', sectionKey: 'Section 34' },
      { actSlug: 'consumer-protection-act-2019', sectionKey: 'Section 35' },
      { actSlug: 'consumer-protection-act-2019', sectionKey: 'Section 38' },
    ],
  },
  {
    slug: 'home-buyer-delays-and-rera',
    title: 'Home-buyer delays and RERA complaints',
    description:
      'Delayed possession, refund claims, allottee rights, and RERA complaint filing.',
    searchKeywords: ['rera', 'builder delay', 'home buyer', 'delayed possession'],
    actSlugs: ['real-estate-regulation-and-development-act-2016'],
    sectionRefs: [
      { actSlug: 'real-estate-regulation-and-development-act-2016', sectionKey: 'Section 18' },
      { actSlug: 'real-estate-regulation-and-development-act-2016', sectionKey: 'Section 31' },
    ],
  },
  {
    slug: 'wages-and-employment-claims',
    title: 'Wages and employment claims',
    description:
      'Minimum wages, delayed salary, wage recovery, and labour-escalation starting points.',
    searchKeywords: ['salary delay', 'unpaid wages', 'wage claim', 'मजदूरी'],
    actSlugs: ['code-on-wages-2019'],
    sectionRefs: [
      { actSlug: 'code-on-wages-2019', sectionKey: 'Section 5' },
      { actSlug: 'code-on-wages-2019', sectionKey: 'Section 17' },
      { actSlug: 'code-on-wages-2019', sectionKey: 'Section 45' },
    ],
  },
  {
    slug: 'senior-citizen-maintenance-and-property',
    title: 'Senior-citizen maintenance and property protection',
    description:
      'Maintenance claims, neglect, and abusive property-transfer disputes affecting older citizens.',
    searchKeywords: ['senior citizen', 'maintenance tribunal', 'elder neglect', 'वरिष्ठ नागरिक'],
    actSlugs: ['maintenance-and-welfare-of-parents-and-senior-citizens-act-2007'],
    sectionRefs: [
      {
        actSlug: 'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007',
        sectionKey: 'Section 4',
      },
      {
        actSlug: 'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007',
        sectionKey: 'Section 23',
      },
    ],
  },
  {
    slug: 'legal-aid-and-liberty',
    title: 'Legal aid and liberty protections',
    description:
      'Constitutional liberty protections and access-to-justice support where cost is the barrier.',
    searchKeywords: ['legal aid', 'liberty', 'article 21', 'article 39a', 'कानूनी सहायता'],
    actSlugs: ['constitution-of-india'],
    sectionRefs: [
      { actSlug: 'constitution-of-india', sectionKey: 'Article 21' },
      { actSlug: 'constitution-of-india', sectionKey: 'Article 39A' },
    ],
  },
  {
    slug: 'public-information-and-rti',
    title: 'Public information and RTI',
    description:
      'RTI drafting, reply timelines, and appeals against non-response or refusal.',
    searchKeywords: ['rti', 'right to information', 'information request', 'सूचना का अधिकार'],
    actSlugs: ['right-to-information-act-2005'],
    sectionRefs: [
      { actSlug: 'right-to-information-act-2005', sectionKey: 'Section 6' },
      { actSlug: 'right-to-information-act-2005', sectionKey: 'Section 19' },
    ],
  },
  {
    slug: 'divorce-and-matrimonial-relief',
    title: 'Divorce and matrimonial relief',
    description:
      'Contested divorce, mutual-consent divorce, interim maintenance, and civil-marriage divorce starting points.',
    searchKeywords: [
      'divorce',
      'mutual consent divorce',
      'matrimonial relief',
      'interim maintenance',
      'court marriage divorce',
    ],
    actSlugs: ['hindu-marriage-act-1955', 'special-marriage-act-1954'],
    sectionRefs: [
      { actSlug: 'hindu-marriage-act-1955', sectionKey: 'Section 13' },
      { actSlug: 'hindu-marriage-act-1955', sectionKey: 'Section 13B' },
      { actSlug: 'hindu-marriage-act-1955', sectionKey: 'Section 24' },
      { actSlug: 'special-marriage-act-1954', sectionKey: 'Section 27' },
    ],
  },
  {
    slug: 'court-marriage-and-marriage-validity',
    title: 'Court marriage and marriage validity',
    description:
      'Civil-marriage eligibility, marriage validity objections, and annulment-focused starting points.',
    searchKeywords: [
      'court marriage',
      'special marriage act',
      'interfaith marriage',
      'void marriage',
      'marriage validity',
    ],
    actSlugs: ['special-marriage-act-1954'],
    sectionRefs: [
      { actSlug: 'special-marriage-act-1954', sectionKey: 'Section 4' },
      { actSlug: 'special-marriage-act-1954', sectionKey: 'Section 24' },
    ],
  },
  {
    slug: 'inheritance-and-family-property',
    title: 'Inheritance and family property',
    description:
      'Coparcenary rights, intestate succession, and women’s ownership claims in family-property disputes.',
    searchKeywords: [
      'inheritance',
      'family property',
      'ancestral property',
      'coparcenary',
      'succession',
    ],
    actSlugs: ['hindu-succession-act-1956'],
    sectionRefs: [
      { actSlug: 'hindu-succession-act-1956', sectionKey: 'Section 6' },
      { actSlug: 'hindu-succession-act-1956', sectionKey: 'Section 8' },
      { actSlug: 'hindu-succession-act-1956', sectionKey: 'Section 14' },
    ],
  },
  {
    slug: 'property-sale-title-and-registration',
    title: 'Property sale, title, and registration',
    description:
      'Sale deeds, title disclosure, compulsory registration, and non-registration disputes involving immovable property.',
    searchKeywords: [
      'property dispute',
      'sale deed',
      'title dispute',
      'registration act',
      'unregistered document',
    ],
    actSlugs: ['transfer-of-property-act-1882', 'registration-act-1908'],
    sectionRefs: [
      { actSlug: 'transfer-of-property-act-1882', sectionKey: 'Section 54' },
      { actSlug: 'transfer-of-property-act-1882', sectionKey: 'Section 55' },
      { actSlug: 'registration-act-1908', sectionKey: 'Section 17' },
      { actSlug: 'registration-act-1908', sectionKey: 'Section 49' },
    ],
  },
  {
    slug: 'tenant-notice-and-possession',
    title: 'Tenant notice and possession disputes',
    description:
      'Lease-notice timing, occupation disputes, and documentary gaps in possession-focused conflicts.',
    searchKeywords: [
      'tenant notice',
      'lease notice',
      'vacate notice',
      'possession dispute',
      'rent notice',
    ],
    actSlugs: ['transfer-of-property-act-1882'],
    sectionRefs: [{ actSlug: 'transfer-of-property-act-1882', sectionKey: 'Section 106' }],
  },
  {
    slug: 'workplace-injury-and-compensation',
    title: 'Workplace injury and compensation',
    description:
      'Employment-related injury claims, compensation amount disputes, and notice timing under the compensation law.',
    searchKeywords: [
      'work injury',
      'employee compensation',
      'workplace accident',
      'industrial injury',
      'accident claim',
    ],
    actSlugs: ['employees-compensation-act-1923'],
    sectionRefs: [
      { actSlug: 'employees-compensation-act-1923', sectionKey: 'Section 3' },
      { actSlug: 'employees-compensation-act-1923', sectionKey: 'Section 4' },
      { actSlug: 'employees-compensation-act-1923', sectionKey: 'Section 10' },
    ],
  },
  {
    slug: 'electronic-evidence-and-digital-records',
    title: 'Electronic evidence and digital records',
    description:
      'Digital-record preservation, electronic admissibility, and expert-backed proof strategy in cyber and commercial disputes.',
    searchKeywords: [
      'electronic evidence',
      'digital evidence',
      'electronic record',
      'computer output',
      'admissibility of electronic records',
      '65b certificate',
    ],
    actSlugs: ['bharatiya-sakshya-adhiniyam-2023', 'indian-evidence-act-1872'],
    sectionRefs: [
      { actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 39' },
      { actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 61' },
      { actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 62' },
      { actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 63' },
      { actSlug: 'indian-evidence-act-1872', sectionKey: 'Section 45A' },
      { actSlug: 'indian-evidence-act-1872', sectionKey: 'Section 65A' },
      { actSlug: 'indian-evidence-act-1872', sectionKey: 'Section 65B' },
    ],
  },
  {
    slug: 'company-board-and-director-compliance',
    title: 'Company board and director compliance',
    description:
      'Board composition, director eligibility, and governance-meeting compliance issues for Indian companies.',
    searchKeywords: [
      'board of directors',
      'director disqualification',
      'board meeting',
      'company law compliance',
      'founder governance',
    ],
    actSlugs: ['companies-act-2013'],
    sectionRefs: [
      { actSlug: 'companies-act-2013', sectionKey: 'Section 149' },
      { actSlug: 'companies-act-2013', sectionKey: 'Section 164' },
      { actSlug: 'companies-act-2013', sectionKey: 'Section 173' },
      { actSlug: 'companies-act-2013', sectionKey: 'Section 92' },
      { actSlug: 'companies-act-2013', sectionKey: 'Section 117' },
    ],
  },
  {
    slug: 'gst-notices-itc-and-appeals',
    title: 'GST notices, input tax credit, and appeals',
    description:
      'GST input-tax-credit disputes, section 73 demand notices, and first-level appeal workflow.',
    searchKeywords: [
      'gst notice',
      'input tax credit',
      'itc mismatch',
      'gst appeal',
      'tax demand reply',
    ],
    actSlugs: ['central-goods-and-services-tax-act-2017'],
    sectionRefs: [
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 16' },
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 73' },
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 107' },
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 70' },
    ],
  },
  {
    slug: 'delhi-tenant-eviction-and-rent-deposit',
    title: 'Delhi tenant eviction and rent-deposit protection',
    description:
      'Delhi-specific rent-control coverage for eviction grounds, statutory protection, and deposit of rent when payment is refused.',
    searchKeywords: [
      'delhi rent control',
      'tenant eviction delhi',
      'rent deposit',
      'landlord refused rent',
      'drc act',
    ],
    actSlugs: ['delhi-rent-control-act-1958', 'transfer-of-property-act-1882'],
    sectionRefs: [
      { actSlug: 'delhi-rent-control-act-1958', sectionKey: 'Section 14' },
      { actSlug: 'delhi-rent-control-act-1958', sectionKey: 'Section 15' },
      { actSlug: 'delhi-rent-control-act-1958', sectionKey: 'Section 27' },
      { actSlug: 'transfer-of-property-act-1882', sectionKey: 'Section 106' },
    ],
  },
  {
    slug: 'cheque-bounce-and-ni-act',
    title: 'Cheque bounce and NI Act complaints',
    description:
      'Dishonoured cheque complaints, statutory notice timing, company-signatory liability, and settlement strategy under the NI Act.',
    searchKeywords: [
      'cheque bounce',
      'dishonour of cheque',
      'section 138',
      'ni act',
      'cheque dishonour notice',
    ],
    actSlugs: ['negotiable-instruments-act-1881'],
    sectionRefs: [
      { actSlug: 'negotiable-instruments-act-1881', sectionKey: 'Section 138' },
      { actSlug: 'negotiable-instruments-act-1881', sectionKey: 'Section 139' },
      { actSlug: 'negotiable-instruments-act-1881', sectionKey: 'Section 141' },
      { actSlug: 'negotiable-instruments-act-1881', sectionKey: 'Section 142' },
      { actSlug: 'negotiable-instruments-act-1881', sectionKey: 'Section 143A' },
      { actSlug: 'negotiable-instruments-act-1881', sectionKey: 'Section 147' },
    ],
  },
  {
    slug: 'legacy-evidence-crosswalks',
    title: 'Legacy evidence-code crosswalks',
    description:
      'How older 65A, 65B, and electronic-evidence references under the Indian Evidence Act map to the current BSA framework.',
    searchKeywords: [
      '65a evidence act',
      '65b evidence act',
      'bsa crosswalk',
      'legacy evidence act',
      'electronic evidence crosswalk',
    ],
    actSlugs: ['indian-evidence-act-1872', 'bharatiya-sakshya-adhiniyam-2023'],
    sectionRefs: [
      { actSlug: 'indian-evidence-act-1872', sectionKey: 'Section 45A' },
      { actSlug: 'indian-evidence-act-1872', sectionKey: 'Section 65A' },
      { actSlug: 'indian-evidence-act-1872', sectionKey: 'Section 65B' },
      { actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 39' },
      { actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 62' },
      { actSlug: 'bharatiya-sakshya-adhiniyam-2023', sectionKey: 'Section 63' },
    ],
  },
  {
    slug: 'company-filings-and-strike-off',
    title: 'Company filings, resolutions, and strike-off',
    description:
      'Annual return defaults, ROC filing of resolutions, strike-off exposure, and restoration before the Tribunal.',
    searchKeywords: [
      'annual return filing',
      'roc filing',
      'company strike off',
      'nclt restoration',
      'board resolution filing',
    ],
    actSlugs: ['companies-act-2013'],
    sectionRefs: [
      { actSlug: 'companies-act-2013', sectionKey: 'Section 92' },
      { actSlug: 'companies-act-2013', sectionKey: 'Section 117' },
      { actSlug: 'companies-act-2013', sectionKey: 'Section 248' },
      { actSlug: 'companies-act-2013', sectionKey: 'Section 252' },
    ],
  },
  {
    slug: 'gst-summons-penalties-and-detention',
    title: 'GST summons, penalties, and detention of goods',
    description:
      'Summons to produce documents, fraud notices, separate penalty exposure, and release of detained goods in transit.',
    searchKeywords: [
      'gst summons',
      'gst fraud notice',
      'gst penalty',
      'detained goods',
      'section 129 cgst',
    ],
    actSlugs: ['central-goods-and-services-tax-act-2017'],
    sectionRefs: [
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 70' },
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 74' },
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 122' },
      { actSlug: 'central-goods-and-services-tax-act-2017', sectionKey: 'Section 129' },
    ],
  },
  {
    slug: 'maharashtra-tenant-licensee-and-rent-disputes',
    title: 'Maharashtra tenant, licensee, and rent disputes',
    description:
      'Maharashtra-specific rent-payment protection, repair-and-reentry issues, and leave-and-licence possession disputes.',
    searchKeywords: [
      'maharashtra rent control',
      'leave and licence eviction',
      'licensee possession',
      'tenant ready and willing to pay rent',
      'maharashtra tenancy registration',
    ],
    actSlugs: ['maharashtra-rent-control-act-1999', 'transfer-of-property-act-1882'],
    sectionRefs: [
      { actSlug: 'maharashtra-rent-control-act-1999', sectionKey: 'Section 15' },
      { actSlug: 'maharashtra-rent-control-act-1999', sectionKey: 'Section 17' },
      { actSlug: 'maharashtra-rent-control-act-1999', sectionKey: 'Section 24' },
      { actSlug: 'maharashtra-rent-control-act-1999', sectionKey: 'Section 55' },
      { actSlug: 'transfer-of-property-act-1882', sectionKey: 'Section 106' },
    ],
  },
];

export const LEGAL_ACT_RELATION_SEED_RECORDS: LegalActRelationSeedRecord[] = [
  {
    fromActSlug: 'indian-penal-code-1860',
    toActSlug: 'bharatiya-nyaya-sanhita-2023',
    relationType: 'SUPERSEDED_BY',
    summary:
      'The Indian Penal Code, 1860 was superseded by the Bharatiya Nyaya Sanhita, 2023 from July 1, 2024 for current-code references.',
    effectiveFrom: '2024-07-01',
  },
  {
    fromActSlug: 'code-of-criminal-procedure-1973',
    toActSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    relationType: 'SUPERSEDED_BY',
    summary:
      'The Code of Criminal Procedure, 1973 was superseded by the Bharatiya Nagarik Suraksha Sanhita, 2023 from July 1, 2024 for current-code references.',
    effectiveFrom: '2024-07-01',
  },
  {
    fromActSlug: 'indian-evidence-act-1872',
    toActSlug: 'bharatiya-sakshya-adhiniyam-2023',
    relationType: 'SUPERSEDED_BY',
    summary:
      'The Indian Evidence Act, 1872 was replaced for current-code references by the Bharatiya Sakshya Adhiniyam, 2023 from July 1, 2024.',
    effectiveFrom: '2024-07-01',
  },
];

export const LAW_SECTION_CROSSWALK_SEED_RECORDS: LawSectionCrosswalkSeedRecord[] = [
  {
    fromActSlug: 'indian-penal-code-1860',
    fromSectionKey: 'Section 354',
    toActSlug: 'bharatiya-nyaya-sanhita-2023',
    toSectionKey: 'Section 74',
    summary:
      'Legacy IPC Section 354 is commonly cross-referenced to BNS Section 74 for current-code awareness on comparable conduct.',
  },
  {
    fromActSlug: 'indian-penal-code-1860',
    fromSectionKey: 'Section 419',
    toActSlug: 'bharatiya-nyaya-sanhita-2023',
    toSectionKey: 'Section 319',
    summary:
      'Legacy IPC Section 419 is commonly cross-referenced to BNS Section 319 for personation-focused fraud matters.',
  },
  {
    fromActSlug: 'indian-penal-code-1860',
    fromSectionKey: 'Section 420',
    toActSlug: 'bharatiya-nyaya-sanhita-2023',
    toSectionKey: 'Section 318',
    summary:
      'Legacy IPC Section 420 is commonly cross-referenced to BNS Section 318 for current-code cheating references.',
  },
  {
    fromActSlug: 'indian-penal-code-1860',
    fromSectionKey: 'Section 506',
    toActSlug: 'bharatiya-nyaya-sanhita-2023',
    toSectionKey: 'Section 351',
    summary:
      'Legacy IPC Section 506 is commonly cross-referenced to BNS Section 351 for current-code criminal-intimidation awareness.',
  },
  {
    fromActSlug: 'indian-penal-code-1860',
    fromSectionKey: 'Section 509',
    toActSlug: 'bharatiya-nyaya-sanhita-2023',
    toSectionKey: 'Section 75',
    summary:
      'Legacy IPC Section 509 is commonly cross-referenced to BNS Section 75 for current-code harassment awareness.',
  },
  {
    fromActSlug: 'code-of-criminal-procedure-1973',
    fromSectionKey: 'Section 41',
    toActSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    toSectionKey: 'Section 35',
    summary:
      'Legacy CrPC Section 41 is commonly cross-referenced to BNSS Section 35 for current-code arrest-without-warrant awareness.',
  },
  {
    fromActSlug: 'code-of-criminal-procedure-1973',
    fromSectionKey: 'Section 41B',
    toActSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    toSectionKey: 'Section 36',
    summary:
      'Legacy CrPC Section 41B is commonly cross-referenced to BNSS Section 36 for current arrest-procedure awareness.',
  },
  {
    fromActSlug: 'code-of-criminal-procedure-1973',
    fromSectionKey: 'Section 41D',
    toActSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    toSectionKey: 'Section 38',
    summary:
      'Legacy CrPC Section 41D is commonly cross-referenced to BNSS Section 38 for current counsel-access awareness during interrogation.',
  },
  {
    fromActSlug: 'code-of-criminal-procedure-1973',
    fromSectionKey: 'Section 154',
    toActSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    toSectionKey: 'Section 173',
    summary:
      'Legacy CrPC Section 154 is commonly cross-referenced to BNSS Section 173 for current FIR-registration awareness.',
  },
  {
    fromActSlug: 'indian-evidence-act-1872',
    fromSectionKey: 'Section 45A',
    toActSlug: 'bharatiya-sakshya-adhiniyam-2023',
    toSectionKey: 'Section 39',
    relationType: 'ROUGH_EQUIVALENT',
    summary:
      'Legacy Evidence Act Section 45A is commonly cross-referenced to the current BSA expert-opinion framework when digital-forensic opinion is in issue.',
  },
  {
    fromActSlug: 'indian-evidence-act-1872',
    fromSectionKey: 'Section 65A',
    toActSlug: 'bharatiya-sakshya-adhiniyam-2023',
    toSectionKey: 'Section 62',
    relationType: 'ROUGH_EQUIVALENT',
    summary:
      'Legacy Evidence Act Section 65A is commonly cross-referenced to BSA Section 62 for current electronic-record proof planning.',
  },
  {
    fromActSlug: 'indian-evidence-act-1872',
    fromSectionKey: 'Section 65B',
    toActSlug: 'bharatiya-sakshya-adhiniyam-2023',
    toSectionKey: 'Section 63',
    relationType: 'ROUGH_EQUIVALENT',
    summary:
      'Legacy Evidence Act Section 65B is commonly cross-referenced to BSA Section 63 for current electronic-record admissibility awareness.',
  },
];

export const LEGAL_ACT_TIMELINE_SEED_RECORDS: LegalActTimelineEventSeedRecord[] = [
  {
    actSlug: 'constitution-of-india',
    title: 'Constitution adopted',
    summary:
      'The Constitution of India was adopted on November 26, 1949 before coming into force on Republic Day.',
    eventType: 'ENACTED',
    eventDate: '1949-11-26',
    sourceLabel: 'Legislative Department of India',
    sourceUrl: 'https://legislative.gov.in/constitution-of-india/',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/19150/1/constitution_of_india.pdf',
    displayOrder: 5,
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    title: 'Act enacted',
    summary:
      'The Negotiable Instruments Act, 1881 was enacted on December 9, 1881 and later brought into force in 1882.',
    eventType: 'ENACTED',
    eventDate: '1881-12-09',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2189',
    displayOrder: 5,
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    title: 'Cheque-dishonour amendment framework expanded',
    summary:
      'The 2002 amendment modernised cheque-dishonour procedure and related negotiable-instrument provisions, taking effect in February 2003.',
    eventType: 'AMENDED',
    eventDate: '2003-02-06',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/1997?view_type=browse',
    displayOrder: 30,
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    title: 'Interim compensation amendment',
    summary:
      'The 2018 amendment introduced interim compensation and deposit-on-appeal features that changed cheque-bounce litigation strategy.',
    eventType: 'AMENDED',
    eventDate: '2018-08-02',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2246?view_type=browse',
    displayOrder: 40,
  },
  {
    actSlug: 'indian-evidence-act-1872',
    title: 'Act enacted',
    summary:
      'The Indian Evidence Act, 1872 was enacted on March 15, 1872 and became the long-standing evidence code for Indian courts.',
    eventType: 'ENACTED',
    eventDate: '1872-03-15',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/12846?view_type=browse',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15351/1/iea_1872.pdf',
    displayOrder: 5,
  },
  {
    actSlug: 'bharatiya-nyaya-sanhita-2023',
    title: 'Act received assent',
    summary:
      'The Bharatiya Nyaya Sanhita, 2023 received presidential assent on December 25, 2023 before being brought into force on July 1, 2024.',
    eventType: 'ENACTED',
    eventDate: '2023-12-25',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20062',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/20062/1/a2023-45.pdf',
    displayOrder: 5,
  },
  {
    actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    title: 'Act received assent',
    summary:
      'The Bharatiya Nagarik Suraksha Sanhita, 2023 received presidential assent on December 25, 2023 before commencement on July 1, 2024.',
    eventType: 'ENACTED',
    eventDate: '2023-12-25',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20061',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/20061/1/a2023-46.pdf',
    displayOrder: 5,
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    title: 'Act received assent',
    summary:
      'The Bharatiya Sakshya Adhiniyam, 2023 received presidential assent on December 25, 2023 before commencement on July 1, 2024.',
    eventType: 'ENACTED',
    eventDate: '2023-12-25',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20063?sam_handle=123456789%2F1362',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/20063/1/a2023-47.pdf',
    displayOrder: 5,
  },
  {
    actSlug: 'companies-act-2013',
    title: 'Act enacted',
    summary:
      'The Companies Act, 2013 was enacted on August 29, 2013 and began replacing the prior company-law framework in stages.',
    eventType: 'ENACTED',
    eventDate: '2013-08-29',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2114',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/2114/3/a2013-18.pdf',
    displayOrder: 5,
  },
  {
    actSlug: 'companies-act-2013',
    title: 'Core governance provisions commenced',
    summary:
      'Important governance provisions including annual return, board structure, and meeting rules were notified into force in September 2013.',
    eventType: 'COMMENCED',
    eventDate: '2013-09-12',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2260',
    displayOrder: 20,
  },
  {
    actSlug: 'companies-act-2013',
    title: 'Companies Amendment 2020 commencement',
    summary:
      'The 2020 amendment rollout adjusted multiple compliance and decriminalisation points in the Companies Act framework.',
    eventType: 'AMENDED',
    eventDate: '2021-07-22',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2265',
    displayOrder: 35,
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    title: 'Act enacted',
    summary:
      'The Central Goods and Services Tax Act, 2017 was enacted in April 2017 ahead of GST rollout in July 2017.',
    eventType: 'ENACTED',
    eventDate: '2017-04-12',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/15689',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15689/5/a2017-12.pdf',
    displayOrder: 5,
  },
  {
    actSlug: 'central-goods-and-services-tax-act-2017',
    title: 'CGST Amendment 2018',
    summary:
      'The 2018 amendment updated key supply, credit, and compliance provisions in the GST framework.',
    eventType: 'AMENDED',
    eventDate: '2018-08-29',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2247?view_type=browse',
    displayOrder: 30,
  },
  {
    actSlug: 'maharashtra-rent-control-act-1999',
    title: 'Act enacted',
    summary:
      'The Maharashtra Rent Control Act, 1999 consolidated the state rent-control framework before it commenced in 2000.',
    eventType: 'ENACTED',
    eventDate: '1999-03-10',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/15817?locale=en',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/15817/1/the_maharashtra_rent_control_act%2C_1999.pdf',
    displayOrder: 5,
  },
];

export const LAW_SECTION_HISTORY_SEED_RECORDS: LawSectionHistorySeedRecord[] = [
  {
    actSlug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    sectionKey: 'Section 173',
    title: 'Current FIR-registration citation',
    summary:
      'For current-code references after July 1, 2024, FIR-registration issues are ordinarily cited under BNSS Section 173 rather than legacy CrPC Section 154.',
    entryType: 'CURRENT_CITATION',
    eventDate: '2024-07-01',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20061',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/20061/1/a2023-46.pdf',
    displayOrder: 20,
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    sectionKey: 'Section 39',
    title: 'Legacy expert-opinion reference',
    summary:
      'Older electronic-evidence strategy may refer to Evidence Act Section 45A, while current-code analysis should be anchored in the BSA expert-opinion framework.',
    entryType: 'LEGACY_REFERENCE',
    eventDate: '2024-07-01',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20063?sam_handle=123456789%2F1362',
    displayOrder: 30,
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    sectionKey: 'Section 62',
    title: 'Legacy 65A crosswalk',
    summary:
      'Older case material may cite Evidence Act Section 65A. For current-code electronic-record proof planning, LexIndia cross-links that legacy reference to BSA Section 62.',
    entryType: 'LEGACY_REFERENCE',
    eventDate: '2024-07-01',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20063?sam_handle=123456789%2F1362',
    displayOrder: 30,
  },
  {
    actSlug: 'bharatiya-sakshya-adhiniyam-2023',
    sectionKey: 'Section 63',
    title: 'Legacy 65B crosswalk',
    summary:
      'Older pleadings and advice often refer to a 65B certificate under the Indian Evidence Act. Current-code electronic-record admissibility is cross-linked here to BSA Section 63.',
    entryType: 'LEGACY_REFERENCE',
    eventDate: '2024-07-01',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20063?sam_handle=123456789%2F1362',
    displayOrder: 30,
  },
  {
    actSlug: 'indian-evidence-act-1872',
    sectionKey: 'Section 65B',
    title: 'Historical citation after code transition',
    summary:
      'Section 65B remains a legacy citation that still appears in older cases, but LexIndia flags July 1, 2024 as the key transition date for current-code references to BSA Section 63.',
    entryType: 'CROSSWALK',
    eventDate: '2024-07-01',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/12846?view_type=browse',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15351/1/iea_1872.pdf',
    displayOrder: 25,
  },
  {
    actSlug: 'negotiable-instruments-act-1881',
    sectionKey: 'Section 138',
    title: 'Current cheque-dishonour citation',
    summary:
      'Cheque-bounce complaints still centre on NI Act Section 138, but the filing strategy is tightly tied to notice service and limitation under the connected complaint provisions.',
    entryType: 'CURRENT_CITATION',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2189',
    displayOrder: 20,
  },
  {
    actSlug: 'companies-act-2013',
    sectionKey: 'Section 248',
    title: 'Strike-off and restoration sequence',
    summary:
      'Strike-off analysis under Section 248 is usually read together with the restoration route under Section 252 when the company seeks revival before the Tribunal.',
    entryType: 'CROSSWALK',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2114',
    displayOrder: 20,
  },
  {
    actSlug: 'maharashtra-rent-control-act-1999',
    sectionKey: 'Section 24',
    title: 'Licence-expiry possession note',
    summary:
      'This section is frequently cited in Maharashtra leave-and-licence disputes where the dispute is about possession after the licence term has expired.',
    entryType: 'CURRENT_CITATION',
    sourceLabel: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/15817?locale=en',
    displayOrder: 20,
  },
];

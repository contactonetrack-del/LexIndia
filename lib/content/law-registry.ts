type LawSectionSeedRecord = {
  sectionKey: string;
  title: string;
  sectionText: string;
  plainEnglish: string;
  punishmentSummary: string | null;
  practicalGuidance: string | null;
  exampleScenario: string | null;
  editorialStatus: 'DRAFT' | 'REVIEW' | 'APPROVED';
  reviewerNotes: string | null;
};

type LawRegistrySeedRecord = {
  slug: string;
  shortCode: string;
  title: string;
  description: string;
  sourceAuthority: string;
  sourceUrl: string;
  sourcePdfUrl: string | null;
  editorialStatus: 'DRAFT' | 'REVIEW' | 'APPROVED';
  reviewerNotes: string | null;
  sections: LawSectionSeedRecord[];
};

export const LAW_REGISTRY_SEED_RECORDS = [
  {
    slug: 'constitution-of-india',
    shortCode: 'CONST',
    title: 'Constitution of India',
    description:
      'Foundational constitutional protections that citizens rely on in arrest, liberty, and legal-aid situations.',
    sourceAuthority: 'Legislative Department of India',
    sourceUrl: 'https://legislative.gov.in/constitution-of-india/',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/19150/1/constitution_of_india.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed constitutional rights guidance.',
    sections: [
      {
        sectionKey: 'Article 21',
        title: 'Protection of life and personal liberty',
        sectionText:
          'No person shall be deprived of life or personal liberty except according to procedure established by law.',
        plainEnglish:
          'State action that affects liberty must follow a lawful procedure. Citizens often rely on this article in detention, prison conditions, emergency medical treatment, and due-process matters.',
        punishmentSummary: null,
        practicalGuidance:
          'If detention, hospital refusal, or abusive state action affects safety or liberty, gather records quickly and speak to a lawyer about urgent writ remedies.',
        exampleScenario:
          'A family member is unlawfully detained without clear records or access. Article 21 becomes part of the immediate legal strategy.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed constitutional rights guidance.',
      },
      {
        sectionKey: 'Article 22',
        title: 'Safeguards against arbitrary arrest and detention',
        sectionText:
          'Article 22 provides procedural safeguards for arrested persons, including information about grounds of arrest and access to legal counsel.',
        plainEnglish:
          'Police cannot keep an arrested person in the dark. They must communicate the reason for arrest, allow legal consultation, and generally produce the person before a magistrate within the legally required period.',
        punishmentSummary: null,
        practicalGuidance:
          'If police refuse to share the grounds of arrest or delay production before the magistrate, note times, station details, and witnesses immediately.',
        exampleScenario:
          'A family is told only that someone was taken for questioning, but no arrest memo or grounds are shared. Article 22 becomes a core protection.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed arrest-procedure guidance.',
      },
      {
        sectionKey: 'Article 39A',
        title: 'Equal justice and free legal aid',
        sectionText:
          'The State shall secure that the operation of the legal system promotes justice on a basis of equal opportunity and shall provide free legal aid in suitable cases.',
        plainEnglish:
          'A person should not lose access to justice only because they cannot afford a lawyer. This article supports legal-services authorities and free legal-aid systems.',
        punishmentSummary: null,
        practicalGuidance:
          'If cost is the barrier, ask for legal-aid eligibility through district or state legal-services authorities and preserve income or vulnerability documents.',
        exampleScenario:
          'A domestic-violence survivor needs urgent court help but cannot pay private legal fees. Article 39A supports legal-aid access.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed legal-aid guidance.',
      },
    ],
  },
  {
    slug: 'information-technology-act-2000',
    shortCode: 'ITA',
    title: 'Information Technology Act, 2000',
    description:
      'Practical cyber-law explainers covering identity theft, online impersonation, and harmful electronic publication.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/13683',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/13116/1/it_act_2000_updated.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed cyber-law starter content.',
    sections: [
      {
        sectionKey: 'Section 66C',
        title: 'Identity theft',
        sectionText:
          'Section 66C deals with fraudulent or dishonest use of another person\'s electronic signature, password, or other unique identification feature.',
        plainEnglish:
          'If someone uses your OTPs, passwords, digital signatures, or other unique credentials without permission, this section becomes relevant.',
        punishmentSummary:
          'The section allows criminal punishment, including imprisonment and fine, for identity-theft conduct under the Act.',
        practicalGuidance:
          'Preserve screenshots, complaint numbers, bank alerts, login emails, and device details before you reset accounts.',
        exampleScenario:
          'A fraudster takes over a wallet or bank-linked login using stolen credentials and starts transactions in your name.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed cyber-fraud guidance.',
      },
      {
        sectionKey: 'Section 66D',
        title: 'Cheating by personation using computer resources',
        sectionText:
          'Section 66D addresses cheating by personation through a computer resource or communication device.',
        plainEnglish:
          'This is commonly relevant in fake customer-care calls, bogus KYC updates, romance scams, and impersonation-based payment fraud.',
        punishmentSummary:
          'The section provides criminal punishment, including imprisonment and fine, for personation-based digital cheating.',
        practicalGuidance:
          'Collect the phone numbers, payment screenshots, chat logs, and beneficiary account details before filing a cyber complaint.',
        exampleScenario:
          'Someone pretends to be a bank officer or support executive and tricks a citizen into sharing payment approvals.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed cyber-fraud guidance.',
      },
      {
        sectionKey: 'Section 67',
        title: 'Publishing or transmitting obscene material in electronic form',
        sectionText:
          'Section 67 deals with publishing or transmitting obscene material in electronic form.',
        plainEnglish:
          'This section is often discussed in complaints involving online circulation of obscene content, abusive uploads, and unlawful sharing.',
        punishmentSummary:
          'The section prescribes criminal punishment that escalates for repeat conduct.',
        practicalGuidance:
          'Keep the original links, handles, timestamps, and platform complaint references. Do not keep redistributing the content while collecting evidence.',
        exampleScenario:
          'Obscene content is circulated through messaging apps or public platforms and the victim needs a takedown plus police complaint path.',
        editorialStatus: 'REVIEW',
        reviewerNotes: 'Needs final editorial review before public publication.',
      },
    ],
  },
  {
    slug: 'consumer-protection-act-2019',
    shortCode: 'CPA',
    title: 'Consumer Protection Act, 2019',
    description:
      'Consumer complaint guidance covering forum jurisdiction, complaint filing, and what happens after admission.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/15256',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/16939/1/a2019-35.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed consumer-law starter content.',
    sections: [
      {
        sectionKey: 'Section 34',
        title: 'Jurisdiction of District Commission',
        sectionText:
          'Section 34 identifies when a District Consumer Commission can hear a complaint, including value and territorial considerations.',
        plainEnglish:
          'Before filing, a citizen needs to know whether the district forum is the right place. This section helps match the complaint to the correct commission.',
        punishmentSummary: null,
        practicalGuidance:
          'Note the seller location, where the cause of action arose, and the claim value before drafting the complaint.',
        exampleScenario:
          'A buyer in Pune wants to complain about a defective appliance sold online and needs to confirm whether the district forum can hear the matter.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed consumer-jurisdiction guidance.',
      },
      {
        sectionKey: 'Section 35',
        title: 'Manner in which complaint shall be made',
        sectionText:
          'Section 35 deals with how a consumer complaint is instituted before the District Commission.',
        plainEnglish:
          'This is the core filing section for many consumer disputes. It tells citizens that a proper complaint with supporting facts and documents is the starting point.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep invoices, warranties, screenshots, notices, and a short chronology ready before filing.',
        exampleScenario:
          'A service provider refuses a refund for a cancelled booking and the customer wants to file a formal consumer complaint.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed complaint-filing guidance.',
      },
      {
        sectionKey: 'Section 38',
        title: 'Procedure on admission of complaint',
        sectionText:
          'Section 38 outlines the procedure the District Commission follows after a complaint is admitted.',
        plainEnglish:
          'Once the complaint gets through the filing gate, the forum can seek a response, call for evidence, and move the case forward.',
        punishmentSummary: null,
        practicalGuidance:
          'Track notices, filing defects, deadlines, and follow-up submissions so the complaint is not delayed unnecessarily.',
        exampleScenario:
          'A consumer complaint is accepted and the citizen needs to understand what happens next in the forum process.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed forum-procedure guidance.',
      },
    ],
  },
  {
    slug: 'protection-of-women-from-domestic-violence-act-2005',
    shortCode: 'PWDVA',
    title: 'Protection of Women from Domestic Violence Act, 2005',
    description:
      'Family-law protection guidance for domestic violence, residence rights, and immediate court relief.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2021',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/2021/5/A2005-43.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed domestic-violence starter content.',
    sections: [
      {
        sectionKey: 'Section 3',
        title: 'Definition of domestic violence',
        sectionText:
          'Section 3 explains what conduct counts as domestic violence under the Act, including physical, emotional, verbal, sexual, and economic abuse.',
        plainEnglish:
          'Domestic violence is broader than physical assault. Financial control, threats, humiliation, and coercive conduct can also matter.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve messages, medical records, neighbour statements, bank evidence, and prior complaint references if abuse is ongoing.',
        exampleScenario:
          'A woman is not being beaten but is being isolated, threatened, and denied money for essentials in the shared home.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed definition guidance.',
      },
      {
        sectionKey: 'Section 17',
        title: 'Right to reside in a shared household',
        sectionText:
          'Section 17 recognizes a woman in a domestic relationship as having a right to reside in the shared household.',
        plainEnglish:
          'A survivor does not automatically lose housing security just because the home is controlled by the other side or their family.',
        punishmentSummary: null,
        practicalGuidance:
          'If lockout or forced eviction is threatened, document the household connection and seek immediate legal help.',
        exampleScenario:
          'A woman is told to leave the matrimonial home overnight after reporting abuse.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed residence-right guidance.',
      },
      {
        sectionKey: 'Section 18',
        title: 'Protection orders',
        sectionText:
          'Section 18 empowers the Magistrate to issue protection orders against abusive conduct.',
        plainEnglish:
          'A court can restrain the respondent from violence, threats, contact, or other prohibited behaviour depending on the facts.',
        punishmentSummary: null,
        practicalGuidance:
          'Urgent facts, prior incidents, and current threat details should be assembled quickly for the first hearing.',
        exampleScenario:
          'After repeated threats, a survivor needs a court order stopping the respondent from approaching or harassing her.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed protection-order guidance.',
      },
      {
        sectionKey: 'Section 19',
        title: 'Residence orders',
        sectionText:
          'Section 19 allows the Magistrate to pass residence-related orders in domestic violence matters.',
        plainEnglish:
          'The court can address who stays where, prevent dispossession, and craft housing-related interim relief.',
        punishmentSummary: null,
        practicalGuidance:
          'Collect address proof, incident history, and evidence of threats or forced exclusion from the shared household.',
        exampleScenario:
          'A survivor needs court protection against being pushed out of the shared residence while proceedings continue.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed residence-order guidance.',
      },
    ],
  },
  {
    slug: 'sexual-harassment-of-women-at-workplace-act-2013',
    shortCode: 'POSH',
    title: 'Sexual Harassment of Women at Workplace Act, 2013',
    description:
      'Workplace-harassment guidance covering complaint filing, inquiry process, and employer obligations.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2104',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/5561/1/sexual_harassment.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed workplace-harassment starter content.',
    sections: [
      {
        sectionKey: 'Section 4',
        title: 'Constitution of Internal Complaints Committee',
        sectionText:
          'Section 4 deals with the constitution of the Internal Complaints Committee at the workplace.',
        plainEnglish:
          'Many employers must have an internal body that receives and processes sexual-harassment complaints.',
        punishmentSummary: null,
        practicalGuidance:
          'Check whether the employer has constituted the committee and preserve the policy, designation details, and reporting contacts.',
        exampleScenario:
          'An employee wants to complain internally but first needs to know whether a valid committee exists.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed ICC-structure guidance.',
      },
      {
        sectionKey: 'Section 9',
        title: 'Complaint of sexual harassment',
        sectionText:
          'Section 9 deals with how a complaint of sexual harassment is made under the Act.',
        plainEnglish:
          'This is the main entry point for a workplace complaint. It matters for written allegations, timing, and how the process starts.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep messages, emails, witness names, calendar entries, and any internal HR communication before filing.',
        exampleScenario:
          'A woman employee wants to submit a formal workplace-harassment complaint after repeated abusive messages from a senior colleague.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed complaint-filing guidance.',
      },
      {
        sectionKey: 'Section 11',
        title: 'Inquiry into complaint',
        sectionText: 'Section 11 governs the inquiry into a complaint under the Act.',
        plainEnglish:
          'Once a complaint is filed, the committee has to examine the material, hear the parties, and move through a formal inquiry process.',
        punishmentSummary: null,
        practicalGuidance:
          'Track notices, hearing dates, evidence submissions, and retaliation concerns during the inquiry.',
        exampleScenario:
          'An employee has filed a complaint and now needs to understand how the internal inquiry is expected to proceed.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed inquiry guidance.',
      },
      {
        sectionKey: 'Section 19',
        title: 'Duties of employer',
        sectionText:
          'Section 19 sets out duties of the employer relating to prevention and response under the Act.',
        plainEnglish:
          'Employers are expected to support awareness, process complaints properly, and help make the workplace safer.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve policy gaps, ignored complaints, or failures to assist the inquiry if the employer is not complying.',
        exampleScenario:
          'A company receives a complaint but does not form a committee or support the complainant with the process.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed employer-duty guidance.',
      },
    ],
  },
  {
    slug: 'maintenance-and-welfare-of-parents-and-senior-citizens-act-2007',
    shortCode: 'MWPSC',
    title: 'Maintenance and Welfare of Parents and Senior Citizens Act, 2007',
    description:
      'Senior-citizen protection guidance covering maintenance claims, tribunal access, and abusive property transfers.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2033',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/2033/1/200756.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed senior-citizen starter content.',
    sections: [
      {
        sectionKey: 'Section 4',
        title: 'Maintenance of parents and senior citizens',
        sectionText:
          'Section 4 recognizes the right of eligible parents and senior citizens to seek maintenance in the circumstances covered by the Act.',
        plainEnglish:
          'Older parents and senior citizens may have a direct legal route when children or relatives neglect maintenance obligations.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep identity proof, relationship proof, medical records, and evidence of financial neglect ready for the tribunal process.',
        exampleScenario:
          'An elderly parent is being denied support by adult children despite clear dependency and medical needs.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed maintenance-right guidance.',
      },
      {
        sectionKey: 'Section 5',
        title: 'Application for maintenance',
        sectionText: 'Section 5 deals with the application process for maintenance under the Act.',
        plainEnglish:
          'This section matters because it opens the route to file before the maintenance tribunal instead of waiting for a larger civil dispute.',
        punishmentSummary: null,
        practicalGuidance:
          'Prepare a short facts note, address details, dependency evidence, and any prior requests for support before filing.',
        exampleScenario:
          'A senior citizen wants to formally seek monthly maintenance through the tribunal mechanism.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed filing-process guidance.',
      },
      {
        sectionKey: 'Section 23',
        title: 'Transfer of property to be void in certain circumstances',
        sectionText:
          'Section 23 addresses situations where a senior citizen transfers property subject to care or amenities and that expectation is not met.',
        plainEnglish:
          'If property was transferred on the understanding that the senior citizen would be looked after, the transfer may be challenged when the care promise is broken.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep transfer documents, witness accounts, medical needs, and proof of neglect or abandonment ready.',
        exampleScenario:
          'An elderly parent transfers a house to a child, then faces neglect and wants to challenge the transfer.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed property-transfer guidance.',
      },
    ],
  },
  {
    slug: 'right-to-information-act-2005',
    shortCode: 'RTI',
    title: 'Right to Information Act, 2005',
    description:
      'Public-information guidance covering RTI requests, reply timelines, and appeals.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/17520',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/19794/1/rti_act_2005.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed RTI starter content.',
    sections: [
      {
        sectionKey: 'Section 6',
        title: 'Request for obtaining information',
        sectionText:
          'Section 6 deals with how a citizen requests information from a public authority.',
        plainEnglish:
          'A good RTI application is usually short, specific, and directed to the correct public authority.',
        punishmentSummary: null,
        practicalGuidance:
          'Frame numbered queries, avoid arguments in the request itself, and preserve the filing receipt or portal reference.',
        exampleScenario:
          'A citizen wants certified information from a local authority about an application that has not moved for months.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed RTI-request guidance.',
      },
      {
        sectionKey: 'Section 7',
        title: 'Disposal of request',
        sectionText:
          'Section 7 deals with the response and disposal process after an RTI request is received.',
        plainEnglish:
          'This section is central for reply timelines, fee communication, and when a delayed or incomplete response becomes a problem.',
        punishmentSummary: null,
        practicalGuidance:
          'Track the filing date, payment requests, and the exact response date before deciding on appeal strategy.',
        exampleScenario:
          'A public authority does not send a clear response within the expected time and the applicant needs to plan next steps.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed RTI-response guidance.',
      },
      {
        sectionKey: 'Section 19',
        title: 'Appeal',
        sectionText:
          'Section 19 provides the appeal route when the applicant is dissatisfied with the decision or non-response.',
        plainEnglish:
          'If information is wrongly denied or ignored, the RTI process includes internal and commission-level appeal paths.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve the original application, reply, and deadline calculations before filing the first or second appeal.',
        exampleScenario:
          'An applicant receives an unjustified exemption reply and needs to challenge it through the RTI appeal route.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed RTI-appeal guidance.',
      },
    ],
  },
  {
    slug: 'real-estate-regulation-and-development-act-2016',
    shortCode: 'RERA',
    title: 'Real Estate (Regulation and Development) Act, 2016',
    description:
      'Property and homebuyer guidance covering promoter liability, allottee rights, and complaint filing.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2158',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/15131/1/the_real_estate_%28regulation_and_development%29_act%2C_2016.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed real-estate starter content.',
    sections: [
      {
        sectionKey: 'Section 18',
        title: 'Return of amount and compensation',
        sectionText:
          'Section 18 addresses return of amounts and compensation in the situations covered by the Act.',
        plainEnglish:
          'When a project is delayed or key promises are not met, homebuyers often look at this section for refund and compensation exposure.',
        punishmentSummary: null,
        practicalGuidance:
          'Collect allotment letters, payment proof, builder communications, brochures, and possession commitments before escalating.',
        exampleScenario:
          'A buyer keeps paying instalments on a flat project that is badly delayed and wants a refund path.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed refund-and-compensation guidance.',
      },
      {
        sectionKey: 'Section 19',
        title: 'Rights and duties of allottees',
        sectionText: 'Section 19 lays out rights and duties of allottees under the Act.',
        plainEnglish:
          'This section helps buyers understand what they can demand from the promoter and what their own obligations are.',
        punishmentSummary: null,
        practicalGuidance:
          'Review the allotment documents, payment status, and promised project details before claiming breach.',
        exampleScenario:
          'A homebuyer wants to know what information and delivery standards can legitimately be insisted on.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed allottee-rights guidance.',
      },
      {
        sectionKey: 'Section 31',
        title: 'Filing of complaints with the Authority or the adjudicating officer',
        sectionText:
          'Section 31 provides the complaint route before the Authority or the adjudicating officer.',
        plainEnglish:
          'This section matters when a buyer is ready to formally escalate instead of sending only emails or notices.',
        punishmentSummary: null,
        practicalGuidance:
          'Gather the project registration details, payment trail, builder communications, and the exact relief you want before filing.',
        exampleScenario:
          'A buyer decides to move from informal follow-up to a formal RERA complaint.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed complaint-filing guidance.',
      },
    ],
  },
  {
    slug: 'code-on-wages-2019',
    shortCode: 'COW',
    title: 'Code on Wages, 2019',
    description:
      'Employment-law guidance covering minimum wages, delayed salary payments, and wage claims.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/15793',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15793/1/aA2019-29.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed wage-law starter content.',
    sections: [
      {
        sectionKey: 'Section 5',
        title: 'Payment of minimum rate of wages',
        sectionText:
          'Section 5 deals with payment of the minimum rate of wages under the Code.',
        plainEnglish:
          'Workers and employees often start here when the core problem is being paid below the legally fixed minimum wage.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep salary slips, attendance records, appointment letters, bank statements, and any wage notifications relevant to the role.',
        exampleScenario:
          'A worker is being paid below the notified minimum rate and needs to understand the legal baseline.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed minimum-wage guidance.',
      },
      {
        sectionKey: 'Section 17',
        title: 'Time limit for payment of wages',
        sectionText: 'Section 17 addresses the time limit for payment of wages.',
        plainEnglish:
          'If salary is repeatedly delayed, this section is often one of the first places to examine the employer obligation.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve payslips, bank statements, attendance records, resignation letters, and internal follow-up emails.',
        exampleScenario:
          'An employee keeps receiving salary late every month and needs a clearer escalation path.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed delayed-wages guidance.',
      },
      {
        sectionKey: 'Section 45',
        title: 'Claims under Code and procedure thereof',
        sectionText:
          'Section 45 deals with claims under the Code and the procedure for pursuing them.',
        plainEnglish:
          'When a wage dispute is no longer informal, this section becomes relevant for the claim route and recovery process.',
        punishmentSummary: null,
        practicalGuidance:
          'Organize the wage shortfall calculation and every supporting record before you move to a formal claim.',
        exampleScenario:
          'A worker wants to recover unpaid wages after internal reminders have failed.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed wage-claim guidance.',
      },
    ],
  },
  {
    slug: 'indian-penal-code-1860',
    shortCode: 'IPC',
    title: 'Indian Penal Code, 1860',
    description:
      'Legacy criminal-code reference pages for citizens and lawyers crosswalking common IPC sections into the new BNS framework.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2263',
    sourcePdfUrl: null,
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed legacy-code crosswalk starter content.',
    sections: [
      {
        sectionKey: 'Section 354',
        title: 'Assault or criminal force to woman with intent to outrage her modesty',
        sectionText:
          'Section 354 criminalized assault or use of criminal force against a woman with intent to outrage her modesty under the IPC.',
        plainEnglish:
          'This is a legacy IPC section that lawyers and citizens still search while comparing old penal-code references with the BNS framework.',
        punishmentSummary:
          'The section carried criminal punishment including imprisonment and fine when the required intent and conduct were proved.',
        practicalGuidance:
          'Use this page as a crosswalk reference when an old FIR, charge sheet, or legal notice still cites IPC provisions.',
        exampleScenario:
          'An older complaint or court document cites IPC Section 354 and the citizen needs to understand the equivalent modern-code context.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed IPC-to-BNS crosswalk guidance.',
      },
      {
        sectionKey: 'Section 419',
        title: 'Punishment for cheating by personation',
        sectionText:
          'Section 419 dealt with punishment for cheating by personation under the IPC.',
        plainEnglish:
          'This legacy IPC section is still widely searched in fraud matters involving fake identities, bogus officers, and impersonation-driven deception.',
        punishmentSummary:
          'The section provided criminal punishment, including imprisonment and fine, for personation-based cheating.',
        practicalGuidance:
          'Check whether the complaint, FIR, or old advice note is using IPC language that now needs to be understood against the BNS section map.',
        exampleScenario:
          'A bank-impersonation fraud complaint from an earlier period still mentions IPC Section 419 in the paperwork.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed IPC personation crosswalk guidance.',
      },
      {
        sectionKey: 'Section 420',
        title: 'Cheating and dishonestly inducing delivery of property',
        sectionText:
          'Section 420 dealt with cheating and dishonestly inducing delivery of property under the IPC.',
        plainEnglish:
          'This is one of the most commonly cited legacy IPC fraud sections and remains important when older documents have not yet shifted to BNS terminology.',
        punishmentSummary:
          'The section carried serious criminal punishment, including imprisonment and fine, where dishonest inducement and delivery of property were proved.',
        practicalGuidance:
          'Use the crosswalk context here when an FIR, complaint, or bail order still uses IPC 420 terminology after the new code transition.',
        exampleScenario:
          'A person searches for IPC 420 after receiving an older fraud complaint or police reference and needs the current-code equivalent.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed IPC cheating crosswalk guidance.',
      },
      {
        sectionKey: 'Section 506',
        title: 'Punishment for criminal intimidation',
        sectionText:
          'Section 506 prescribed punishment for criminal intimidation under the IPC.',
        plainEnglish:
          'Legacy threats and intimidation complaints often still cite this IPC section, making it useful as a bridge to the current penal-code framework.',
        punishmentSummary:
          'The section provided criminal punishment for threat-based conduct depending on the gravity of the intimidation proved.',
        practicalGuidance:
          'Use this reference when matching older criminal-intimidation citations to their current BNS context.',
        exampleScenario:
          'A complaint or legal notice still threatens action under IPC Section 506 and the recipient wants to understand the present-code position.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed IPC intimidation crosswalk guidance.',
      },
      {
        sectionKey: 'Section 509',
        title: 'Word, gesture or act intended to insult modesty of a woman',
        sectionText:
          'Section 509 dealt with words, gestures, or acts intended to insult the modesty of a woman under the IPC.',
        plainEnglish:
          'This legacy provision still appears in earlier harassment complaints and is useful for mapping older police references into the new code structure.',
        punishmentSummary:
          'The section provided criminal punishment for the defined insulting or intrusive conduct.',
        practicalGuidance:
          'Cross-check older IPC references here before comparing them with the current BNS harassment section on LexIndia.',
        exampleScenario:
          'A police complaint drafted before the code transition still cites IPC Section 509 for harassment-related conduct.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed IPC harassment crosswalk guidance.',
      },
    ],
  },
  {
    slug: 'code-of-criminal-procedure-1973',
    shortCode: 'CrPC',
    title: 'Code of Criminal Procedure, 1973',
    description:
      'Legacy criminal-procedure reference pages crosswalking FIR, arrest, and counsel-access sections into the BNSS framework.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/17319',
    sourcePdfUrl: null,
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed CrPC-to-BNSS crosswalk starter content.',
    sections: [
      {
        sectionKey: 'Section 41',
        title: 'When police may arrest without warrant',
        sectionText:
          'Section 41 addressed the circumstances in which police could arrest without warrant under the CrPC.',
        plainEnglish:
          'This legacy CrPC section is still widely cited in older arrest paperwork and legal advice, especially where the code transition has not yet been reflected in documents.',
        punishmentSummary: null,
        practicalGuidance:
          'Use this as a crosswalk page when a notice, FIR, or police communication still cites CrPC Section 41 after the BNSS transition.',
        exampleScenario:
          'A family reads an older bail note or arrest memo that still refers to CrPC Section 41 and needs the new-code equivalent.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed CrPC arrest-power crosswalk guidance.',
      },
      {
        sectionKey: 'Section 41B',
        title: 'Procedure of arrest and duties of officer making arrest',
        sectionText:
          'Section 41B dealt with arrest procedure and duties of the officer making arrest under the CrPC.',
        plainEnglish:
          'This legacy section remains useful when older documents or legal searches still refer to CrPC arrest-procedure terminology.',
        punishmentSummary: null,
        practicalGuidance:
          'Compare old CrPC procedure references with the BNSS section listed in the crosswalk panel rather than treating the legacy citation as current.',
        exampleScenario:
          'A detainee’s family sees CrPC Section 41B in old advice notes and wants the current procedural code reference.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed CrPC arrest-procedure crosswalk guidance.',
      },
      {
        sectionKey: 'Section 41D',
        title: 'Right of arrested person to meet an advocate of his choice during interrogation',
        sectionText:
          'Section 41D recognized the right of an arrested person to meet an advocate of choice during interrogation under the CrPC framework.',
        plainEnglish:
          'This is a common legacy arrest-rights section and remains important when old police-procedure references are still being used.',
        punishmentSummary: null,
        practicalGuidance:
          'Use the crosswalk here when earlier legal advice or templates cite CrPC Section 41D but the matter now sits under the BNSS.',
        exampleScenario:
          'A citizen searches for CrPC Section 41D after reading an older arrest-rights explainer and needs the current-code section.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed CrPC counsel-access crosswalk guidance.',
      },
      {
        sectionKey: 'Section 154',
        title: 'Information in cognizable cases',
        sectionText:
          'Section 154 dealt with information in cognizable cases and was the legacy FIR starting provision under the CrPC.',
        plainEnglish:
          'This is the classic old-code FIR section that citizens still search. It now needs to be read as a legacy reference alongside the BNSS replacement.',
        punishmentSummary: null,
        practicalGuidance:
          'Use the crosswalk here when police complaints, legal notices, or older articles still refer to CrPC 154 instead of the BNSS provision.',
        exampleScenario:
          'A citizen searches for CrPC 154 because an older police refusal template still cites that section number for FIR registration.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed CrPC FIR crosswalk guidance.',
      },
    ],
  },
  {
    slug: 'bharatiya-nyaya-sanhita-2023',
    shortCode: 'BNS',
    title: 'Bharatiya Nyaya Sanhita, 2023',
    description:
      'Starter criminal-law coverage for cheating, intimidation, and offences affecting women under the new penal code framework.',
    sourceAuthority: 'India Code',
    sourceUrl:
      'https://www.indiacode.nic.in/handle/123456789/20063?sam_handle=123456789/1362',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/20062/1/a202345.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed Bharatiya Nyaya Sanhita starter content.',
    sections: [
      {
        sectionKey: 'Section 74',
        title: 'Assault or criminal force to woman with intent to outrage her modesty',
        sectionText:
          'Section 74 covers assault or use of criminal force against a woman with intent to outrage her modesty.',
        plainEnglish:
          'This provision is used where the conduct is physical and directed at violating a woman\'s dignity or bodily autonomy.',
        punishmentSummary:
          'The section allows criminal punishment, including imprisonment and fine, when the prosecution proves the required intent and conduct.',
        practicalGuidance:
          'Preserve witness details, CCTV references, clothing evidence, medical records, and the earliest complaint chronology.',
        exampleScenario:
          'A woman is physically manhandled in a public place and the conduct is clearly meant to humiliate or violate her.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNS women-safety guidance.',
      },
      {
        sectionKey: 'Section 75',
        title: 'Sexual harassment',
        sectionText:
          'Section 75 addresses sexual harassment and the forms of conduct that can trigger criminal liability.',
        plainEnglish:
          'This is a criminal-law provision for harassment conduct that may sit alongside workplace, police-complaint, or other remedial paths.',
        punishmentSummary:
          'Exposure depends on the proved form of harassment and can include imprisonment, fine, or both.',
        practicalGuidance:
          'Keep chats, call records, CCTV leads, witness names, prior complaints, and any workplace or institutional reporting trail.',
        exampleScenario:
          'Repeated unwanted sexual remarks, advances, or physical conduct leads to a police complaint and evidence collection.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNS harassment guidance.',
      },
      {
        sectionKey: 'Section 318',
        title: 'Cheating',
        sectionText:
          'Section 318 addresses cheating where deception causes a person to deliver property, alter conduct, or suffer wrongful loss.',
        plainEnglish:
          'This is a core cheating section for fraud patterns that are not limited to online conduct and do not always require impersonation.',
        punishmentSummary:
          'The section carries criminal punishment that can include imprisonment and fine where dishonest deception is proved.',
        practicalGuidance:
          'Organize messages, transaction records, false promises, bank trails, and any notice or complaint already sent.',
        exampleScenario:
          'A person pays money after false assurances about a service or asset and later discovers the entire representation was dishonest.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNS cheating guidance.',
      },
      {
        sectionKey: 'Section 319',
        title: 'Cheating by personation',
        sectionText:
          'Section 319 covers cheating where the deception involves pretending to be another person or falsely representing identity.',
        plainEnglish:
          'This is highly relevant in impersonation scams, fake officer calls, bogus support desks, and fraudulent identity-based approaches.',
        punishmentSummary:
          'The section allows criminal punishment, including imprisonment and fine, when personation-based cheating is established.',
        practicalGuidance:
          'Preserve call recordings, screenshots, payment requests, beneficiary details, and any platform or cyber-cell complaint references.',
        exampleScenario:
          'A fraudster poses as a bank official or government officer and induces a payment or credential disclosure.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNS personation guidance.',
      },
      {
        sectionKey: 'Section 351',
        title: 'Criminal intimidation',
        sectionText:
          'Section 351 addresses threats intended to alarm a person or compel action or inaction through fear.',
        plainEnglish:
          'If somebody is using threats of violence, exposure, reputational harm, or other injury to force compliance, this section may matter.',
        punishmentSummary:
          'The section provides criminal punishment that becomes more serious in aggravated threat situations.',
        practicalGuidance:
          'Save the exact threat language, call logs, chats, witness accounts, and any indication that the threat is continuing or escalating.',
        exampleScenario:
          'A person receives repeated threats to pay money or withdraw a complaint, creating fear of harm if they refuse.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNS intimidation guidance.',
      },
    ],
  },
  {
    slug: 'bharatiya-nagarik-suraksha-sanhita-2023',
    shortCode: 'BNSS',
    title: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    description:
      'Criminal-procedure starter coverage for FIRs, arrest without warrant, custody procedure, and access to counsel.',
    sourceAuthority: 'India Code',
    sourceUrl:
      'https://www.indiacode.nic.in/handle/123456789/20064?view_type=browse&sam_handle=123456789/1362',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/21920/1/the_bharatiya_nagarik_suraksha_sanhita%2C_2023.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed Bharatiya Nagarik Suraksha Sanhita starter content.',
    sections: [
      {
        sectionKey: 'Section 35',
        title: 'When police may arrest without warrant',
        sectionText:
          'Section 35 explains the circumstances in which police may arrest without a warrant in the covered categories of cases.',
        plainEnglish:
          'This is a key starting point for citizens trying to understand whether a no-warrant arrest claim is even legally available on the facts.',
        punishmentSummary: null,
        practicalGuidance:
          'Record the station details, exact allegation, time of detention, and whether the police explained the basis of arrest.',
        exampleScenario:
          'A family is told that police have arrested someone immediately in a cognizable matter and needs to understand the power being used.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNSS arrest-power guidance.',
      },
      {
        sectionKey: 'Section 36',
        title: 'Procedure of arrest and duties of officer making arrest',
        sectionText:
          'Section 36 deals with arrest procedure and the duties that apply to the officer making the arrest.',
        plainEnglish:
          'Even where police can arrest, there are still procedural duties around how that arrest is carried out and recorded.',
        punishmentSummary: null,
        practicalGuidance:
          'Ask for the arrest memo, note witness details, preserve the time line, and document any procedural irregularities immediately.',
        exampleScenario:
          'Police make an arrest but family members suspect that the required procedure and documentation were not followed.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNSS arrest-procedure guidance.',
      },
      {
        sectionKey: 'Section 38',
        title: 'Right of arrested person to meet an advocate of his choice during interrogation',
        sectionText:
          'Section 38 recognizes the right of an arrested person to meet an advocate of choice during interrogation, subject to the statutory framework.',
        plainEnglish:
          'This section matters when police question an arrested person and the family needs to insist on access to legal assistance.',
        punishmentSummary: null,
        practicalGuidance:
          'Document requests for counsel access, the time they were made, and whether the police allowed any meaningful lawyer contact.',
        exampleScenario:
          'A detained person is being questioned and the family is blocked from arranging legal representation quickly.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNSS counsel-access guidance.',
      },
      {
        sectionKey: 'Section 173',
        title: 'Information in cognizable cases',
        sectionText:
          'Section 173 deals with information in cognizable cases and is a core FIR-era entry point in the criminal-procedure workflow.',
        plainEnglish:
          'This is the practical FIR starting section for many citizens. It matters when police are refusing to record information in a cognizable matter or are delaying action.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep the written complaint, station details, refusal evidence, screenshots, medical records, and any escalation sent to senior officers.',
        exampleScenario:
          'A victim goes to the police station with a clear cognizable complaint but struggles to get the FIR registered or acknowledged.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed BNSS FIR guidance.',
      },
    ],
  },
  {
    slug: 'hindu-marriage-act-1955',
    shortCode: 'HMA',
    title: 'Hindu Marriage Act, 1955',
    description:
      'Family-law starter coverage for contested divorce, mutual-consent divorce, and interim maintenance during matrimonial proceedings.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/17272',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/15136/1/hindu_marriage_act.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed matrimonial-relief starter content.',
    sections: [
      {
        sectionKey: 'Section 13',
        title: 'Divorce',
        sectionText:
          'Section 13 sets out the statutory grounds on which a spouse may seek divorce under the Act.',
        plainEnglish:
          'This is the main contested-divorce entry point in the Hindu Marriage Act. Citizens usually look here when cruelty, desertion, conversion, mental disorder, or other recognised grounds are part of the dispute.',
        punishmentSummary: null,
        practicalGuidance:
          'Build a dated chronology, preserve chats and notices, and separate evidence that supports each pleaded ground before filing.',
        exampleScenario:
          'A spouse wants to move beyond separation and file a contested divorce based on repeated cruelty and long-term desertion.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed contested-divorce guidance.',
      },
      {
        sectionKey: 'Section 13B',
        title: 'Divorce by mutual consent',
        sectionText:
          'Section 13B provides the framework for divorce by mutual consent where both spouses agree to dissolve the marriage.',
        plainEnglish:
          'When both sides agree on ending the marriage, settlement terms, custody, and financial arrangements, this section becomes the practical route.',
        punishmentSummary: null,
        practicalGuidance:
          'Draft settlement terms clearly on alimony, stridhan, custody, visitation, and pending cases before the first motion is filed.',
        exampleScenario:
          'A couple has already separated and wants a structured mutual-consent divorce instead of a prolonged contested case.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed mutual-consent divorce guidance.',
      },
      {
        sectionKey: 'Section 24',
        title: 'Maintenance pendente lite and expenses of proceedings',
        sectionText:
          'Section 24 allows the court to award interim maintenance and litigation expenses during proceedings where a spouse lacks sufficient independent income.',
        plainEnglish:
          'This section is often the first relief sought in a divorce case when one spouse cannot meet day-to-day expenses or legal costs while the case is pending.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep income proofs, bank statements, expense details, and employment records ready for interim-maintenance arguments.',
        exampleScenario:
          'A spouse defending or filing divorce proceedings cannot fund rent, essentials, and legal fees during the case.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed interim-maintenance guidance.',
      },
    ],
  },
  {
    slug: 'special-marriage-act-1954',
    shortCode: 'SMA',
    title: 'Special Marriage Act, 1954',
    description:
      'Civil-marriage and divorce starter coverage for inter-faith marriages, validity questions, and matrimonial relief outside personal-law ceremonies.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/12937',
    sourcePdfUrl:
      'https://www.indiacode.nic.in/bitstream/123456789/15480/1/special_marriage_act.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed civil-marriage starter content.',
    sections: [
      {
        sectionKey: 'Section 4',
        title: 'Conditions relating to solemnization of special marriages',
        sectionText:
          'Section 4 lays down the statutory conditions that must be satisfied for solemnization under the Special Marriage Act.',
        plainEnglish:
          'This is the practical starting point when couples need to confirm eligibility, age, marital status, and prohibited-relationship limits before registration.',
        punishmentSummary: null,
        practicalGuidance:
          'Check age proof, residence proof, prior-marriage records, and whether any personal circumstances can trigger validity objections.',
        exampleScenario:
          'An inter-faith couple wants to understand whether they can marry under the civil-marriage route and what conditions must be met.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed SMA eligibility guidance.',
      },
      {
        sectionKey: 'Section 24',
        title: 'Void marriages',
        sectionText:
          'Section 24 identifies when a marriage solemnized under the Act can be declared void.',
        plainEnglish:
          'This section matters when a marriage is challenged as legally invalid because the basic statutory conditions were never satisfied.',
        punishmentSummary: null,
        practicalGuidance:
          'Collect proof relating to subsisting marriage, prohibited relationship, age, identity, or fraud issues before seeking annulment advice.',
        exampleScenario:
          'A spouse later discovers that the other party concealed a prior subsisting marriage at the time of civil marriage registration.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed marriage-validity guidance.',
      },
      {
        sectionKey: 'Section 27',
        title: 'Divorce',
        sectionText:
          'Section 27 provides the grounds on which a petition for divorce may be presented under the Special Marriage Act.',
        plainEnglish:
          'This is the main divorce provision for marriages registered under the Act and is used when parties need matrimonial relief outside traditional personal-law routes.',
        punishmentSummary: null,
        practicalGuidance:
          'Map the facts to the pleaded ground, preserve records, and align strategy on maintenance, custody, and settlement before filing.',
        exampleScenario:
          'A couple married under the Special Marriage Act now needs a divorce strategy tied to cruelty, desertion, or other recognised grounds.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed SMA divorce guidance.',
      },
    ],
  },
  {
    slug: 'hindu-succession-act-1956',
    shortCode: 'HSA',
    title: 'Hindu Succession Act, 1956',
    description:
      'Inheritance and family-property starter coverage for coparcenary rights, succession rules, and women’s ownership interests.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/12843',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/5519/1/hindu_succession.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed inheritance starter content.',
    sections: [
      {
        sectionKey: 'Section 6',
        title: 'Devolution of interest in coparcenary property',
        sectionText:
          'Section 6 addresses devolution of interest in coparcenary property under the Act.',
        plainEnglish:
          'This section matters in family-property disputes where ancestral or coparcenary property rights are being contested among legal heirs.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve title papers, family tree details, mutation records, and death certificates before framing a succession or partition claim.',
        exampleScenario:
          'Siblings dispute rights in ancestral property after the death of a coparcener and need to understand who can claim what share.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed coparcenary-property guidance.',
      },
      {
        sectionKey: 'Section 8',
        title: 'General rules of succession in the case of males',
        sectionText:
          'Section 8 provides the general succession rules that apply to property of a male Hindu dying intestate.',
        plainEnglish:
          'This is the basic inheritance-routing section used when a person dies without leaving a will and family members need to identify the first line of heirs.',
        punishmentSummary: null,
        practicalGuidance:
          'Identify whether a will exists, assemble legal-heir records, and check for surviving Class I heirs before starting mutation or transfer requests.',
        exampleScenario:
          'After a father dies without a will, the family needs to know who can lawfully inherit the flat and bank assets.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed intestate-succession guidance.',
      },
      {
        sectionKey: 'Section 14',
        title: 'Property of a female Hindu to be her absolute property',
        sectionText:
          'Section 14 deals with property possessed by a female Hindu becoming her absolute property under the Act.',
        plainEnglish:
          'This section is central when women’s ownership claims are being minimised as merely limited or dependent interests in family property.',
        punishmentSummary: null,
        practicalGuidance:
          'Collect gift deeds, settlement papers, possession proof, and prior revenue or municipal records when ownership is challenged.',
        exampleScenario:
          'Relatives argue that a widow or daughter only had a restricted right in property that she claims as her own.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed women’s-property-right guidance.',
      },
    ],
  },
  {
    slug: 'transfer-of-property-act-1882',
    shortCode: 'TPA',
    title: 'Transfer of Property Act, 1882',
    description:
      'Property-transfer starter coverage for sale deeds, buyer-seller duties, and tenancy-notice disputes.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/14037',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/2321/1/A1882-04.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed property-transfer starter content.',
    sections: [
      {
        sectionKey: 'Section 54',
        title: 'Sale',
        sectionText:
          'Section 54 explains what amounts to a sale of immovable property and how such transfer is completed under the law.',
        plainEnglish:
          'This is the core property-transfer starting section when parties are arguing over whether a property sale was properly completed or documented.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep the sale deed, agreement to sell, payment trail, possession records, and registration details together before taking advice.',
        exampleScenario:
          'A buyer paid substantial money for a flat, but the parties are now fighting over whether the transfer was ever legally completed.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed property-sale guidance.',
      },
      {
        sectionKey: 'Section 55',
        title: 'Rights and liabilities of buyer and seller',
        sectionText:
          'Section 55 addresses the respective rights and liabilities of buyer and seller in a property transaction.',
        plainEnglish:
          'This section matters when there are disputes over title disclosure, possession, payment defaults, encumbrances, or document handover.',
        punishmentSummary: null,
        practicalGuidance:
          'Organize all representations about title, payment schedule, possession, dues, and defects before drafting legal notices.',
        exampleScenario:
          'A seller failed to disclose a prior mortgage and the buyer is now facing both payment loss and title uncertainty.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed buyer-seller duty guidance.',
      },
      {
        sectionKey: 'Section 106',
        title: 'Duration of certain leases in absence of written contract or local usage',
        sectionText:
          'Section 106 deals with the duration and termination framework for certain leases when no written contract or contrary local usage governs the issue.',
        plainEnglish:
          'This section becomes important in tenancy disputes where parties are arguing over notice length, month-to-month occupation, or termination timelines.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep rent records, notices, utility bills, and possession evidence ready before asserting eviction or tenancy-continuation rights.',
        exampleScenario:
          'A tenant receives an abrupt notice to vacate and wants to know whether the termination period was legally proper.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed lease-notice guidance.',
      },
    ],
  },
  {
    slug: 'registration-act-1908',
    shortCode: 'REGA',
    title: 'Registration Act, 1908',
    description:
      'Document-registration starter coverage for compulsory registration, timing, and consequences of non-registration.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2190',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/18914/1/a1908-16.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed registration-law starter content.',
    sections: [
      {
        sectionKey: 'Section 17',
        title: 'Documents of which registration is compulsory',
        sectionText:
          'Section 17 identifies categories of documents whose registration is compulsory under the Act.',
        plainEnglish:
          'This is the core section used when parties need to know whether a sale deed, gift deed, lease, or other property instrument had to be registered.',
        punishmentSummary: null,
        practicalGuidance:
          'Check the document type, transaction value, property location, and whether the instrument affects immovable-property rights.',
        exampleScenario:
          'A family is relying on an unregistered property document and needs to know whether compulsory registration was legally required.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed compulsory-registration guidance.',
      },
      {
        sectionKey: 'Section 23',
        title: 'Time for presenting documents',
        sectionText:
          'Section 23 deals with the time within which documents must ordinarily be presented for registration.',
        plainEnglish:
          'Citizens often run into this section when a deed was executed but not presented quickly enough, creating deadline and condonation issues.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve execution dates, stamp papers, witness details, and the reason for any delay before approaching the registering authority.',
        exampleScenario:
          'A deed was signed months ago and one side now fears that the registration deadline has already been missed.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed registration-timeline guidance.',
      },
      {
        sectionKey: 'Section 49',
        title: 'Effect of non-registration of documents required to be registered',
        sectionText:
          'Section 49 addresses the legal effect of non-registration where registration was compulsory.',
        plainEnglish:
          'This section is crucial when one side is trying to rely on an unregistered property document in a title, possession, or contractual dispute.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep the original instrument, possession evidence, payment records, and any related notices ready before litigating on an unregistered document.',
        exampleScenario:
          'A buyer relies on an unregistered sale-related document, but the other side objects that it cannot be used to prove the claimed transfer.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed non-registration-effect guidance.',
      },
    ],
  },
  {
    slug: 'employees-compensation-act-1923',
    shortCode: 'ECA',
    title: "Employees' Compensation Act, 1923",
    description:
      'Labour-law starter coverage for workplace injury claims, compensation calculations, and notice requirements.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/19236',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/19236/1/a1923-08.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed workplace-injury starter content.',
    sections: [
      {
        sectionKey: 'Section 3',
        title: "Employer's liability for compensation",
        sectionText:
          'Section 3 deals with an employer’s liability to pay compensation for certain employment-related injury or death situations covered by the Act.',
        plainEnglish:
          'This is the starting section when a worker or family needs to know whether a workplace accident creates a compensation claim against the employer.',
        punishmentSummary: null,
        practicalGuidance:
          'Collect medical records, accident reports, wage proof, witness details, and employment documents as early as possible.',
        exampleScenario:
          'A worker suffers a serious factory-floor injury and the family needs to understand whether statutory compensation is payable.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed employer-liability guidance.',
      },
      {
        sectionKey: 'Section 4',
        title: 'Amount of compensation',
        sectionText:
          'Section 4 addresses how compensation is computed under the Act in covered injury and death cases.',
        plainEnglish:
          'Once liability is accepted or disputed, this section becomes central to the amount question, especially where wages and disability assessment are contested.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve wage slips, disability records, age proof, and medical assessment papers before negotiating or filing a claim.',
        exampleScenario:
          'The employer says compensation, if any, is minimal, but the worker believes the injury has caused major earning loss.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed compensation-calculation guidance.',
      },
      {
        sectionKey: 'Section 10',
        title: 'Notice and claim',
        sectionText:
          'Section 10 deals with notice of the accident and the presentation of a compensation claim under the Act.',
        plainEnglish:
          'This section matters when delay, lack of written notice, or procedural objections are being used to resist a compensation claim.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep accident intimation proof, hospital papers, employer communication, and timing records to address notice disputes.',
        exampleScenario:
          'An employer argues that no proper accident notice was given even though the worker was hospitalized immediately after the incident.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed notice-and-claim guidance.',
      },
    ],
  },
  {
    slug: 'bharatiya-sakshya-adhiniyam-2023',
    shortCode: 'BSA',
    title: 'Bharatiya Sakshya Adhiniyam, 2023',
    description:
      'Evidence-law starter coverage for digital records, electronic admissibility, and proof planning in cyber and commercial disputes.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/20063?sam_handle=123456789%2F1362',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/20063/1/a2023-47.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed evidence-law starter content.',
    sections: [
      {
        sectionKey: 'Section 39',
        title: 'Opinions of experts',
        sectionText:
          'Section 39 governs when expert opinions are relevant, including scientific, technical, and digital-forensic opinion where the subject matter requires specialised knowledge.',
        plainEnglish:
          'Courts do not accept every technical claim at face value. When a dispute turns on a specialised subject like digital forensics, the expert basis, method, and supporting facts all matter.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep original devices, hash values, sample material, and the expert instruction trail organised before relying on a forensic opinion.',
        exampleScenario:
          'A party disputes whether a recording was tampered with and plans to rely on a forensic expert to explain device extraction and integrity checks.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed expert-opinion guidance.',
      },
      {
        sectionKey: 'Section 61',
        title: 'Electronic or digital record',
        sectionText:
          'Section 61 states that evidence cannot be denied only because the record is electronic or digital and that such records can have the same legal effect as other documents subject to the Act.',
        plainEnglish:
          'Chats, CCTV exports, emails, device logs, screenshots, and platform records are not automatically inferior just because they are digital. The real question is how they are preserved and proved.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep original files, device details, metadata sources, export method, and chain-of-custody notes before sharing the material widely.',
        exampleScenario:
          'A cyber-fraud victim wants to rely on bank alerts, WhatsApp messages, and app screenshots to support a police complaint and later court proceedings.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed digital-record guidance.',
      },
      {
        sectionKey: 'Section 62',
        title: 'Special provisions as to evidence relating to electronic or digital record',
        sectionText:
          'Section 62 lays down the special framework for proving an electronic or digital record in the manner recognised by the Act.',
        plainEnglish:
          'This section is the bridge between having a digital file and proving it properly. It matters when lawyers need to decide what supporting certification, system details, or production method will be required.',
        punishmentSummary: null,
        practicalGuidance:
          'Identify the source system, export process, device owner, and whether a supporting certificate or system-generated record will be needed before the hearing stage.',
        exampleScenario:
          'A company wants to rely on email and server logs, but first needs to structure the proof material in the format the court will accept.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed electronic-proof framework guidance.',
      },
      {
        sectionKey: 'Section 63',
        title: 'Admissibility of electronic records',
        sectionText:
          'Section 63 lays down the admissibility framework for information contained in electronic records that is produced as computer output subject to the statutory conditions.',
        plainEnglish:
          'This is the practical electronic-evidence section lawyers look at when proving emails, logs, recordings, and other computer output in court.',
        punishmentSummary: null,
        practicalGuidance:
          'Before litigation, identify the device or system source, who can certify the output, and whether supporting records from service providers or internal systems are needed.',
        exampleScenario:
          'A business wants to prove invoice emails, ledger extracts, and CCTV-backed delivery records in a commercial recovery dispute.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed electronic-admissibility guidance.',
      },
      {
        sectionKey: 'Section 65',
        title: 'Facts bearing on opinion of experts',
        sectionText:
          'Section 65 covers facts that support or qualify expert opinion when expert evidence is relied upon in court.',
        plainEnglish:
          'When forensic, handwriting, technical, or digital experts are involved, the surrounding facts and methodology matter, not just the expert label.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve original samples, device history, comparison material, and the expert’s basis documents if you expect a forensic or technical dispute.',
        exampleScenario:
          'A party disputes the authenticity of a digital recording and needs to understand how technical expert evidence may be assessed.',
        editorialStatus: 'REVIEW',
        reviewerNotes: 'Needs one more editorial pass for courtroom-practice language.',
      },
    ],
  },
  {
    slug: 'companies-act-2013',
    shortCode: 'COA',
    title: 'Companies Act, 2013',
    description:
      'Corporate-law starter coverage for board structure, director compliance, and governance obligations relevant to founders and operating companies.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2114',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/2114/3/a2013-18.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed corporate-governance starter content.',
    sections: [
      {
        sectionKey: 'Section 149',
        title: 'Company to have Board of Directors',
        sectionText:
          'Section 149 deals with the requirement for companies to have a Board of Directors and sets out key board-composition rules including resident and independent director considerations where applicable.',
        plainEnglish:
          'This is the starting point when founders need to understand how many directors a company needs and whether special board-composition rules apply.',
        punishmentSummary: null,
        practicalGuidance:
          'Check the company category, director count, resident-director status, and whether any independent-director or women-director requirement has been triggered.',
        exampleScenario:
          'A startup raises funding and now needs to structure its board correctly before the next compliance cycle and investor-driven appointments.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed board-structure guidance.',
      },
      {
        sectionKey: 'Section 164',
        title: 'Disqualifications for appointment of director',
        sectionText:
          'Section 164 lays down disqualifications that can prevent a person from being appointed or re-appointed as a director.',
        plainEnglish:
          'Founder and director disputes often turn on whether compliance defaults, convictions, or statutory ineligibility can block a board position.',
        punishmentSummary: null,
        practicalGuidance:
          'Review filing defaults, DIN status, conviction history, and connected-company compliance failures before planning a new appointment.',
        exampleScenario:
          'An investor-backed company questions whether a promoter can continue or be re-appointed as director after repeated compliance lapses.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed director-eligibility guidance.',
      },
      {
        sectionKey: 'Section 173',
        title: 'Meetings of Board',
        sectionText:
          'Section 173 deals with the frequency, notice, and conduct framework for meetings of the Board of Directors.',
        plainEnglish:
          'This section matters when board actions, approvals, notice gaps, or governance disputes are linked to whether proper meetings were held.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep notice records, attendance, circulation material, minutes, and resolution history organised before challenging or defending a board decision.',
        exampleScenario:
          'A co-founder challenges a financing approval by arguing that the board meeting notice and process were defective.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed board-meeting guidance.',
      },
      {
        sectionKey: 'Section 92',
        title: 'Annual return',
        sectionText:
          'Section 92 governs the filing of the annual return and the core disclosure framework that companies must maintain for shareholders, directors, and compliance records.',
        plainEnglish:
          'This section becomes critical when founders or compliance teams need to file yearly company information accurately or assess whether a filing lapse has created downstream legal risk.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep the register of members, director changes, shareholding data, and prior filing history ready before preparing the annual return.',
        exampleScenario:
          'A startup is preparing its annual MCA filings and discovers that director and shareholder changes were not reflected correctly in past records.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed annual-return guidance.',
      },
      {
        sectionKey: 'Section 117',
        title: 'Resolutions and agreements to be filed',
        sectionText:
          'Section 117 requires certain board and shareholder resolutions or agreements to be filed in the prescribed manner.',
        plainEnglish:
          'Not every internal resolution stays internal. Some approvals have to be filed with the ROC, and disputes often arise when a company acted on a resolution that was never properly filed.',
        punishmentSummary: null,
        practicalGuidance:
          'Check whether the resolution falls in the filing category, preserve signed minutes, and track the filing deadline and SRN history.',
        exampleScenario:
          'A founder dispute turns on whether a key shareholder or board resolution was filed properly after it was passed.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed resolution-filing guidance.',
      },
      {
        sectionKey: 'Section 248',
        title: 'Power of Registrar to remove name of company from register of companies',
        sectionText:
          'Section 248 empowers the Registrar to strike off a company in the situations covered by the Act after following the required process.',
        plainEnglish:
          'This is the provision that surfaces when a company is inactive, non-compliant, or facing strike-off action from the ROC.',
        punishmentSummary: null,
        practicalGuidance:
          'Review filing defaults, business activity records, show-cause notices, and pending liabilities before responding to a strike-off step.',
        exampleScenario:
          'A dormant private company receives a strike-off notice and needs to decide whether to revive compliance or contest the action.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed strike-off guidance.',
      },
      {
        sectionKey: 'Section 252',
        title: 'Appeal to Tribunal',
        sectionText:
          'Section 252 deals with appeals and restoration applications before the Tribunal in relation to strike-off orders and related company-register decisions.',
        plainEnglish:
          'When a company has already been struck off, this section is the gateway for seeking restoration before the NCLT in the right factual cases.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve bank statements, tax filings, contracts, and evidence of continuing business or pending obligations before preparing a restoration case.',
        exampleScenario:
          'A business discovers that its company name has been struck off and urgently needs restoration because contracts and bank operations are still active.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed restoration-appeal guidance.',
      },
    ],
  },
  {
    slug: 'central-goods-and-services-tax-act-2017',
    shortCode: 'CGST',
    title: 'Central Goods and Services Tax Act, 2017',
    description:
      'Tax-law starter coverage for input tax credit, GST demand notices, and first-level appeal strategy for businesses.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/15689',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15689/5/a2017-12.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed GST starter content.',
    sections: [
      {
        sectionKey: 'Section 16',
        title: 'Eligibility and conditions for taking input tax credit',
        sectionText:
          'Section 16 deals with entitlement to input tax credit subject to statutory conditions and documentation requirements.',
        plainEnglish:
          'Businesses often start here when a GST issue turns on whether tax credit can actually be claimed, retained, or reversed.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve invoices, return filings, supplier matching records, payment evidence, and reconciliation notes before answering an ITC query or notice.',
        exampleScenario:
          'A company receives a GST query because claimed input tax credit does not fully align with supplier-side reporting.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed GST ITC guidance.',
      },
      {
        sectionKey: 'Section 73',
        title:
          'Determination of tax not paid or short paid or erroneously refunded or input tax credit wrongly availed or utilised for any reason other than fraud or any wilful-misstatement or suppression of facts',
        sectionText:
          'Section 73 provides the framework for demand proceedings where tax is alleged to be unpaid, short paid, erroneously refunded, or input tax credit is alleged to be wrongly availed or utilised without invoking fraud-based allegations.',
        plainEnglish:
          'This is the common GST notice section when the department raises a tax demand but is not yet alleging fraud or wilful suppression.',
        punishmentSummary: null,
        practicalGuidance:
          'Map every allegation in the notice to returns, invoices, reconciliations, and explanatory records before drafting a reply.',
        exampleScenario:
          'A business receives a departmental notice claiming short payment and excess credit but the dispute appears to arise from reporting mismatch rather than fraud.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed GST demand-notice guidance.',
      },
      {
        sectionKey: 'Section 107',
        title: 'Appeals to Appellate Authority',
        sectionText:
          'Section 107 deals with appeals to the Appellate Authority against certain GST decisions or orders.',
        plainEnglish:
          'If the dispute has already moved beyond the original GST order stage, this is the first appeal gateway businesses look at.',
        punishmentSummary: null,
        practicalGuidance:
          'Track order date, appeal limitation, mandatory pre-deposit, annexures, and the exact grounds of challenge before filing.',
        exampleScenario:
          'A trader wants to challenge an adverse adjudication order after an unsatisfactory reply stage in a GST demand matter.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed GST appeal guidance.',
      },
      {
        sectionKey: 'Section 70',
        title: 'Power to summon persons to give evidence and produce documents',
        sectionText:
          'Section 70 empowers the proper officer to summon persons to give evidence or produce documents in an inquiry under the Act.',
        plainEnglish:
          'Businesses often encounter this section when a GST inquiry moves beyond notices into document production and statement recording.',
        punishmentSummary: null,
        practicalGuidance:
          'Do not ignore a summons. Gather the notice, authorisation trail, accounting records, and counsel strategy before attending.',
        exampleScenario:
          'A company receives a GST summons requiring directors or staff to appear with invoices, ledgers, and reconciliation documents.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed GST-summons guidance.',
      },
      {
        sectionKey: 'Section 74',
        title:
          'Determination of tax not paid or short paid or erroneously refunded or input tax credit wrongly availed or utilised by reason of fraud or any wilful-misstatement or suppression of facts',
        sectionText:
          'Section 74 deals with serious GST demand proceedings where the department alleges fraud, wilful misstatement, or suppression of facts.',
        plainEnglish:
          'This is the higher-risk GST demand section. The allegations are more serious than a standard mismatch case, and penalty exposure can be significant.',
        punishmentSummary:
          'The section exposes the taxpayer to tax, interest, and enhanced penalty consequences where the fraud-based allegation is sustained.',
        practicalGuidance:
          'Map the notice allegation by allegation against books, e-way bills, reconciliations, and internal explanations before sending any reply.',
        exampleScenario:
          'A business receives a show-cause notice alleging bogus billing or suppression and needs to prepare a detailed fraud-defence response.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed fraud-demand guidance.',
      },
      {
        sectionKey: 'Section 122',
        title: 'Penalty for certain offences',
        sectionText:
          'Section 122 sets out penalty exposure for the categories of contraventions covered by the Act.',
        plainEnglish:
          'This section becomes relevant when a GST dispute is no longer only about tax and interest, but also about separate statutory penalty exposure.',
        punishmentSummary:
          'Penalty exposure under the section depends on the nature of the contravention and can be substantial in addition to tax demands.',
        practicalGuidance:
          'Separate the tax computation dispute from the penalty defence and preserve documents showing intent, disclosure, and good-faith compliance steps.',
        exampleScenario:
          'A taxpayer accepts that returns contained mistakes but contests the department’s attempt to impose the highest available penalty.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed GST-penalty guidance.',
      },
      {
        sectionKey: 'Section 129',
        title: 'Detention, seizure and release of goods and conveyances in transit',
        sectionText:
          'Section 129 deals with detention or seizure of goods and conveyances in transit and the conditions for release.',
        plainEnglish:
          'Transport and logistics disputes often start here when moving goods are intercepted and release depends on documentation, tax position, and the officer’s allegations.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve the detention order, e-way bill, invoice trail, driver statement, and payment or security details before seeking release or appeal relief.',
        exampleScenario:
          'A truck carrying business goods is intercepted and detained during transit because the officer questions the documentation or tax treatment.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed detention-and-release guidance.',
      },
    ],
  },
  {
    slug: 'delhi-rent-control-act-1958',
    shortCode: 'DRCA',
    title: 'Delhi Rent Control Act, 1958',
    description:
      'State-overlay tenancy coverage for Delhi eviction protection, rent deposit, and tenant-possession disputes under the Delhi rent regime.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/19223?sam_handle=123456789%2F1362&view_type=browse',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/19223/1/a1958-59.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed Delhi tenancy overlay content.',
    sections: [
      {
        sectionKey: 'Section 14',
        title: 'Protection of tenant against eviction',
        sectionText:
          'Section 14 deals with the core protection framework against eviction and the recognised grounds on which eviction may still be sought under the Act.',
        plainEnglish:
          'Delhi tenancy disputes often begin here because landlords and tenants need to know whether an eviction claim fits one of the permitted legal grounds.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve rent receipts, notice history, ownership claims, landlord-tenant communication, and occupation records before contesting or filing eviction proceedings.',
        exampleScenario:
          'A Delhi tenant receives an eviction petition and needs to understand whether the claimed ground actually fits the rent-control law.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed Delhi eviction-protection guidance.',
      },
      {
        sectionKey: 'Section 15',
        title: 'When a tenant can get the benefit of protection against eviction',
        sectionText:
          'Section 15 addresses how a tenant may secure statutory protection against eviction in certain proceedings, including rent-payment compliance directions.',
        plainEnglish:
          'This section becomes practical when a rent-default dispute turns on whether the tenant can still retain statutory protection by complying with the Controller’s directions.',
        punishmentSummary: null,
        practicalGuidance:
          'Track every rent-deposit deadline, Controller order, arrears calculation, and proof of payment if tenancy protection depends on compliance.',
        exampleScenario:
          'A landlord alleges default, but the tenant wants to know whether timely deposit or compliance can preserve protection from eviction.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed tenant-protection guidance.',
      },
      {
        sectionKey: 'Section 27',
        title: 'Deposit of rent by the tenant',
        sectionText:
          'Section 27 deals with deposit of rent by the tenant where the landlord does not accept rent, does not issue a receipt, or there is bona fide doubt about the proper payee.',
        plainEnglish:
          'This is one of the most practical Delhi rent sections when a tenant needs a lawful way to avoid default despite landlord refusal or uncertainty about who should receive rent.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep tender proof, money-order or transfer attempts, receipt disputes, and the rent-controller filing details safely organised.',
        exampleScenario:
          'A tenant keeps trying to pay rent, but the landlord refuses acceptance and later alleges default to support an eviction case.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed Delhi rent-deposit guidance.',
      },
    ],
  },
  {
    slug: 'negotiable-instruments-act-1881',
    shortCode: 'NIA',
    title: 'Negotiable Instruments Act, 1881',
    description:
      'Cheque-bounce starter coverage for dishonour complaints, presumptions, limitation, and company-signatory liability.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/2189',
    sourcePdfUrl: null,
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed cheque-dishonour starter content.',
    sections: [
      {
        sectionKey: 'Section 6',
        title: 'Cheque',
        sectionText:
          'Section 6 defines cheque for the purposes of the Act, including cheque forms recognised under the law.',
        plainEnglish:
          'This is the starting definition when a dispute turns on whether the instrument in question is legally being treated as a cheque.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve the instrument image, bank return memo, account details, and the underlying liability records before escalating a cheque dispute.',
        exampleScenario:
          'A payment dispute begins with uncertainty about whether the signed instrument and bank return fit the legal concept of a cheque.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed cheque-definition guidance.',
      },
      {
        sectionKey: 'Section 138',
        title: 'Dishonour of cheque for insufficiency, etc., of funds in the account',
        sectionText:
          'Section 138 creates the cheque-dishonour offence where the statutory conditions are met after a cheque is returned unpaid.',
        plainEnglish:
          'This is the main cheque-bounce section used when a cheque is dishonoured and the legal notice, limitation, and filing steps have to be handled correctly.',
        punishmentSummary:
          'The section creates criminal exposure, but only when the statutory timeline and notice requirements are satisfied.',
        practicalGuidance:
          'Track the bank memo date, statutory notice date, proof of service, and limitation for filing the complaint before drafting anything.',
        exampleScenario:
          'A supplier deposits a cheque that bounces for insufficiency of funds and now needs to preserve the notice and complaint timeline carefully.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed cheque-bounce guidance.',
      },
      {
        sectionKey: 'Section 139',
        title: 'Presumption in favour of holder',
        sectionText:
          'Section 139 creates a rebuttable presumption in favour of the holder that the cheque was received towards discharge of debt or liability.',
        plainEnglish:
          'Once the cheque and foundational facts are shown, the drawer may have to rebut a statutory presumption instead of forcing the complainant to prove everything from zero.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep the loan, invoice, settlement, or security-cheque documents ready because the presumption and the defence strategy usually turn on the underlying transaction record.',
        exampleScenario:
          'The accused says the cheque was only security, while the complainant says it was issued against a real outstanding liability.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed presumption guidance.',
      },
      {
        sectionKey: 'Section 141',
        title: 'Offences by companies',
        sectionText:
          'Section 141 addresses how cheque-dishonour liability can extend to companies and the persons who were in charge of and responsible for the conduct of business.',
        plainEnglish:
          'Company cheque-bounce cases do not automatically make every director liable. The complaint has to connect the accused person to the company’s relevant conduct and role.',
        punishmentSummary: null,
        practicalGuidance:
          'Collect board designations, authorised-signatory records, bank documents, and the exact complaint averments before defending or filing a company cheque case.',
        exampleScenario:
          'A bounced company cheque leads to complaints not only against the company but also against directors and signatories.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed company-liability guidance.',
      },
      {
        sectionKey: 'Section 142',
        title: 'Cognizance of offences',
        sectionText:
          'Section 142 governs when the court can take cognizance of a cheque-dishonour complaint and how limitation and territorial filing requirements operate.',
        plainEnglish:
          'This section becomes critical when a cheque-bounce case is ready to be filed and the complainant has to get the court, limitation, and complaint format right.',
        punishmentSummary: null,
        practicalGuidance:
          'Prepare the bank memo, statutory notice, service proof, complaint affidavit, and filing chronology before moving the case.',
        exampleScenario:
          'A complainant has served notice after dishonour and now needs to confirm the filing deadline and proper court before instituting the complaint.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed cognizance-and-limitation guidance.',
      },
      {
        sectionKey: 'Section 143A',
        title: 'Power to direct interim compensation',
        sectionText:
          'Section 143A empowers the court to direct interim compensation in the circumstances provided by the Act.',
        plainEnglish:
          'This section matters once a cheque-bounce case is already underway and the complainant seeks interim monetary protection during trial.',
        punishmentSummary: null,
        practicalGuidance:
          'Assess the stage of proceedings, the amount sought, and the defence position before arguing for or against interim compensation.',
        exampleScenario:
          'A complainant asks the magistrate to direct interim compensation while the accused contests the cheque-bounce prosecution.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed interim-compensation guidance.',
      },
      {
        sectionKey: 'Section 147',
        title: 'Offences to be compoundable',
        sectionText:
          'Section 147 makes offences under the Act compoundable, enabling settlement-based closure in the appropriate cases.',
        plainEnglish:
          'Many cheque-bounce disputes end in negotiated settlement rather than full trial. This section is the statutory doorway for compounding.',
        punishmentSummary: null,
        practicalGuidance:
          'Record settlement terms carefully, including payment schedule, withdrawal steps, and default consequences before asking the court to close the case.',
        exampleScenario:
          'The parties agree on a staged repayment after a cheque-bounce complaint has already been filed in court.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed compounding guidance.',
      },
    ],
  },
  {
    slug: 'indian-evidence-act-1872',
    shortCode: 'IEA',
    title: 'Indian Evidence Act, 1872',
    description:
      'Legacy evidence-code coverage for old 65A and 65B references that still appear in pleadings, notices, and older court strategy.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/12846?view_type=browse',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15351/1/iea_1872.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed legacy evidence-code content.',
    sections: [
      {
        sectionKey: 'Section 45A',
        title: 'Opinion of Examiner of Electronic Evidence',
        sectionText:
          'Section 45A dealt with the relevance of the opinion of the Examiner of Electronic Evidence in the situations covered by the Act.',
        plainEnglish:
          'Older pleadings and evidence strategy may still refer to this legacy provision when digital-forensic opinion was being framed under the prior evidence code.',
        punishmentSummary: null,
        practicalGuidance:
          'If a legacy case or older advice cites Section 45A, cross-check the current BSA framework and the exact expert-opinion issue before relying on the old citation.',
        exampleScenario:
          'A pending civil or criminal case filed before the code transition still cites Section 45A while the parties are discussing current admissibility strategy.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed legacy examiner-opinion guidance.',
      },
      {
        sectionKey: 'Section 65A',
        title: 'Special provisions as to evidence relating to electronic record',
        sectionText:
          'Section 65A created the special framework for proving electronic records under the legacy evidence code.',
        plainEnglish:
          'Lawyers still see this section in older pleadings and judgments whenever electronic evidence had to be channelled through the special proof framework under the old code.',
        punishmentSummary: null,
        practicalGuidance:
          'If a matter still cites Section 65A, compare it with the current BSA sections and preserve the device, export method, and supporting certification trail.',
        exampleScenario:
          'A commercial recovery suit relies on older case law and still frames its email-proof strategy around Section 65A references.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed legacy electronic-proof guidance.',
      },
      {
        sectionKey: 'Section 65B',
        title: 'Admissibility of electronic records',
        sectionText:
          'Section 65B governed how electronic records could be admitted through computer output and the statutory certification framework under the legacy evidence code.',
        plainEnglish:
          'This is the legacy electronic-evidence section that continues to appear in notices, pleadings, and many court discussions even after the new evidence code transition.',
        punishmentSummary: null,
        practicalGuidance:
          'If someone refers to a 65B certificate, check the filing date of the case, the current BSA crosswalk, and the exact system or device that generated the record.',
        exampleScenario:
          'A litigant is told to produce a 65B certificate for CCTV footage and needs to understand how that legacy reference maps onto current law.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed 65B crosswalk guidance.',
      },
    ],
  },
  {
    slug: 'maharashtra-rent-control-act-1999',
    shortCode: 'MRCA',
    title: 'Maharashtra Rent Control Act, 1999',
    description:
      'State-overlay tenancy coverage for Maharashtra eviction, repairs and re-entry, and licence-expiry possession disputes.',
    sourceAuthority: 'India Code',
    sourceUrl: 'https://www.indiacode.nic.in/handle/123456789/15817?locale=en',
    sourcePdfUrl: 'https://www.indiacode.nic.in/bitstream/123456789/15817/1/the_maharashtra_rent_control_act%2C_1999.pdf',
    editorialStatus: 'APPROVED',
    reviewerNotes: 'Seeded as reviewed Maharashtra tenancy overlay content.',
    sections: [
      {
        sectionKey: 'Section 15',
        title: 'No ejectment ordinarily to be made if tenant pays or is ready and willing to pay standard rent and permitted increases',
        sectionText:
          'Section 15 protects a tenant against ordinary ejectment where the tenant pays or is ready and willing to pay standard rent and permitted increases subject to the Act.',
        plainEnglish:
          'This is one of the key tenant-protection sections in Maharashtra when the dispute is really about payment, arrears, and whether eviction can still be pursued.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve rent receipts, transfer proof, money-order history, and correspondence showing readiness to pay before responding to an eviction claim.',
        exampleScenario:
          'A Maharashtra tenant faces an eviction attempt despite repeatedly trying to pay standard rent and permitted increases.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed rent-payment protection guidance.',
      },
      {
        sectionKey: 'Section 17',
        title: 'Recovery of possession for repairs and re-entry',
        sectionText:
          'Section 17 deals with recovery of possession for repairs and the tenant’s re-entry rights after the repair-related purpose is completed.',
        plainEnglish:
          'Landlords sometimes seek temporary possession for structural repair work. This section matters because the dispute is not only about leaving, but also about lawful re-entry and project purpose.',
        punishmentSummary: null,
        practicalGuidance:
          'Keep repair notices, engineering material, expected timelines, and re-entry commitments documented before agreeing to vacate temporarily.',
        exampleScenario:
          'A landlord asks a tenant to vacate during major repairs, but the tenant needs assurance about returning after the work is completed.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed repair-and-reentry guidance.',
      },
      {
        sectionKey: 'Section 24',
        title: 'Landlord entitled to recover possession of premises given on licence on expiry',
        sectionText:
          'Section 24 provides a recovery route where premises were given on licence and the licence term has expired.',
        plainEnglish:
          'This section becomes practical in Maharashtra leave-and-licence disputes where the core question is whether the licensee can be lawfully removed after the licence ends.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve the registered leave-and-licence agreement, expiry date, possession record, and all post-expiry communications before starting proceedings.',
        exampleScenario:
          'A landlord says the leave-and-licence term has ended and wants possession back, while the occupant disputes the next legal step.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed licence-expiry possession guidance.',
      },
      {
        sectionKey: 'Section 55',
        title: 'Tenancy agreement to be compulsorily registered',
        sectionText:
          'Section 55 requires tenancy or leave-and-licence agreements covered by the Act to be registered in the manner contemplated by the statute.',
        plainEnglish:
          'This is the practical Maharashtra documentation section when one side is relying on an unregistered rent or licence arrangement and later facts become disputed.',
        punishmentSummary: null,
        practicalGuidance:
          'Preserve draft agreements, stamp-duty records, possession proof, and payment history if registration or documentation is already in dispute.',
        exampleScenario:
          'A tenant and landlord disagree about the terms of occupation because the written arrangement was not properly registered at the beginning.',
        editorialStatus: 'APPROVED',
        reviewerNotes: 'Seeded as reviewed tenancy-registration guidance.',
      },
    ],
  },
] satisfies readonly LawRegistrySeedRecord[];

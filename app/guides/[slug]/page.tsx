import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BookOpen, Clock, Shield, ArrowLeft, ArrowRight,
  CheckCircle, AlertTriangle, FileText, Phone
} from 'lucide-react';

// ============================================================
// Guide Content Repository
// Add new guides here. Each guide follows the same content schema.
// ============================================================

interface GuideContent {
  title: string;
  category: string;
  categorySlug: string;
  readTime: number;
  lastUpdated: string;
  summary: string;
  whoThisIsFor: string[];
  keyRights: string[];
  steps: { step: string; detail: string }[];
  documents: string[];
  authorities: { name: string; contact?: string; url?: string }[];
  commonMistakes: string[];
  whenToTalkLawyer: string[];
  faqs: { q: string; a: string }[];
  relatedGuides: { title: string; slug: string }[];
}

const GUIDES: Record<string, GuideContent> = {
  'road-accident-emergency': {
    title: 'Road Accidents: Immediate Legal Steps & What NOT to Do',
    category: 'Emergency & Accidents',
    categorySlug: 'emergency-law',
    readTime: 7,
    lastUpdated: '12 March 2026',
    summary: 'A critical emergency legal protocol for what to do immediately following a road traffic accident in India, whether you are the victim or the accused. Understand Motor Vehicles Act liabilities, police reporting, and insurance claims.',
    whoThisIsFor: [
      'Victims of road accidents (drivers, passengers, or pedestrians)',
      'Drivers involved in an accident causing injury or damage',
      'Witnesses (Good Samaritans) to a road accident'
    ],
    keyRights: [
      'Good Samaritan Law: You cannot be harassed by police, forced to reveal your identity, or forced to pay hospital bills if you help an accident victim.',
      'Emergency Medical Care: ALL hospitals (public and private) MUST provide emergency first-aid immediately without demanding prior payment or police clearance.',
      'Hit and Run Compensation: Victims are entitled to baseline government compensation even if the offending vehicle is never caught (Section 161 MV Act).',
      'Third-Party Insurance: All vehicles must have mandatory third-party insurance to cover your injuries/damages if they hit you.'
    ],
    steps: [
      { step: 'Check for Injuries & Call for Help', detail: 'Ensure safety first. If anyone is injured, call 112 (Police) and 108 (Ambulance). Take victims to the nearest hospital immediately.' },
      { step: 'Do NOT Flee the Scene', detail: 'Fleeing an accident where someone is injured is a severe criminal offense (Hit and Run). Stay at the scene until police arrive, unless your life is under immediate mob threat.' },
      { step: 'Document Everything', detail: 'Before moving vehicles, take clear photos/videos of the positions, license plates, skid marks, and damage from multiple angles.' },
      { step: 'Report to Local Police', detail: 'Visit the nearest police station to file an FIR. If you are hospitalized, the police must visit the hospital to record your statement.' },
      { step: 'Notify Your Insurance', detail: 'Inform your motor insurance company immediately (usually within 24-48 hours) to initiate the claims process.' }
    ],
    documents: [
      'Copy of the FIR or Police General Diary (GD) entry',
      'Medico-legal certificate (MLC) from the hospital if injured',
      'Original bills for medical expenses or vehicle repair estimates',
      'Photos/Videos of the accident scene and both vehicles',
      'Valid Driving License, RC, and Insurance Policy (if you were driving)'
    ],
    authorities: [
      { name: 'Emergency Services (Police/Ambulance)', contact: '112' },
      { name: 'National Highways Helpline', contact: '1033' },
      { name: 'Motor Accidents Claims Tribunal (MACT)', url: 'https://districts.ecourts.gov.in/' }
    ],
    commonMistakes: [
      'Fleeing the scene out of panic (turns a bailable offense into a non-bailable Hit and Run).',
      'Admitting fault or apologizing at the scene — let the police and insurance investigators determine legal liability.',
      'Moving the vehicles before taking photos (destroys vital positioning evidence).',
      'Settling "privately" for cash without a police record (you lose all rights to future medical or insurance claims if injuries appear later).',
      'Delaying the FIR or hospital visit (creates legal doubt about your claims).'
    ],
    whenToTalkLawyer: [
      'To file a compensation claim before the Motor Accidents Claims Tribunal (MACT).',
      'If you are accused of reckless driving (Section 279 IPC) or causing death by negligence (Section 304A IPC).',
      'If the insurance company unfairly rejects your claim.',
      'If the police refuse to register an FIR against an influential offender.'
    ],
    faqs: [
      {
        q: 'What if a mob gathers and threatens me?',
        a: 'If you fear for your life from mob violence, you may leave the immediate scene, BUT you must drive straight to the nearest police station to surrender and report the accident.'
      },
      {
        q: 'Will I get into trouble if I take an accident victim to the hospital?',
        a: 'No. The Supreme Court established Good Samaritan Guidelines. You cannot be detained, forced to be a witness, or asked for money by the hospital.'
      },
      {
        q: 'How long do I have to file a MACT claim?',
        a: 'Under the amended Motor Vehicles Act, you must file a compensation claim within 6 months of the accident.'
      }
    ],
    relatedGuides: [
      { title: 'How to File an FIR', slug: 'how-to-file-fir' },
      { title: 'Understanding Bail', slug: 'understanding-bail' }
    ]
  },
  'how-to-file-fir': {
    title: 'How to File an FIR (First Information Report) in India',
    category: 'Criminal Law',
    categorySlug: 'criminal-law',
    readTime: 6,
    lastUpdated: '10 March 2026',
    summary: 'An FIR (First Information Report) is the first step in the criminal justice process in India. This guide explains who can file one, how to file it, and what to do if the police refuse.',
    whoThisIsFor: [
      'Anyone who has been a victim of a cognizable offence (theft, assault, rape, fraud, etc.)',
      'Witnesses who have direct knowledge of a cognizable offence',
      'Family members reporting on behalf of a victim who is unable to report',
    ],
    keyRights: [
      'You have an absolute right to file an FIR for any cognizable offence — police cannot refuse.',
      'You can file an FIR at ANY police station in India, not just the one where the offence occurred (Zero FIR).',
      'You are entitled to a free copy of the FIR after it is registered.',
      'If police refuse, you can complain to the Superintendent of Police, Judicial Magistrate, or High Court.',
      'For sexual assault cases, the FIR must be recorded by a woman officer if requested.',
    ],
    steps: [
      { step: 'Visit the police station', detail: 'Go to the nearest police station. You can also go to ANY police station — they must file a Zero FIR if the offence happened in a different jurisdiction.' },
      { step: 'Speak to the Officer-in-Charge (SHO)', detail: 'Request to meet the Station House Officer. State clearly that you want to register an FIR.' },
      { step: 'Give your statement', detail: 'Narrate the facts clearly: what happened, when, where, who was involved, and any witnesses. Be accurate — your statement becomes the FIR.' },
      { step: 'Review and sign the FIR', detail: 'Read the FIR carefully before signing. Ensure all facts are recorded correctly. You have the right to have it read out to you.' },
      { step: 'Get your free copy', detail: 'Under Section 154(2) CrPC, you are entitled to a free copy of the FIR. Insist on receiving it before leaving.' },
      { step: 'Note the FIR number', detail: 'Record the FIR number, the police station name, and the name of the officer who filed it. Keep the copy safe for court proceedings.' },
    ],
    documents: [
      'Your government-issued ID (Aadhaar card, voter ID, passport)',
      'Any physical evidence of the offence (photos, screenshots, documents)',
      'Names and contact details of witnesses (if any)',
      'CCTV footage or digital evidence (submit later if not immediately available)',
    ],
    authorities: [
      { name: 'Local Police Station', contact: '100' },
      { name: 'Women Helpline', contact: '1091' },
      { name: 'National Commission for Women (NCW)', contact: '7827-170-170' },
      { name: 'State Human Rights Commission', url: 'https://nhrc.nic.in' },
    ],
    commonMistakes: [
      'Giving an incomplete or vague statement — be specific about dates, times, and names.',
      'Not getting a copy of the FIR before leaving the station.',
      'Accepting a "complaint" or "Daily Diary (DD)" entry instead of a proper FIR.',
      'Waiting too long — file as soon as possible while details are fresh.',
      'Not noting the FIR number — you need it for all follow-up.',
    ],
    whenToTalkLawyer: [
      'If police refuse to file your FIR despite valid grounds.',
      'If you are being pressured to change your statement.',
      'For serious offences like rape, kidnapping, or organised crime.',
      'If you need to file a petition before a Magistrate to direct the police to file an FIR.',
      'If you are accused in an FIR and need to understand your rights.',
    ],
    faqs: [
      {
        q: 'Can police refuse to file an FIR?',
        a: 'No. For cognizable offences, police are legally required to register an FIR. If they refuse, you can file a written complaint to the Superintendent of Police, or approach the Judicial Magistrate under Section 156(3) CrPC.',
      },
      {
        q: 'What is a Zero FIR?',
        a: 'A Zero FIR can be filed at any police station regardless of jurisdiction. The station that receives it must register it and transfer it to the appropriate station. This was made mandatory after the 2012 Nirbhaya case.',
      },
      {
        q: 'Can I file an FIR online?',
        a: 'Several states provide online FIR facilities for specific offences like vehicle theft and lost documents. Check your state police website. For serious offences, you should visit the station.',
      },
      {
        q: 'Is there a time limit to file an FIR?',
        a: 'There is no fixed time limit for filing an FIR, but it is best to file as soon as possible. Unexplained delays can affect the credibility of your complaint and evidence collection.',
      },
    ],
    relatedGuides: [
      { title: 'What to Do When Arrested by Police in India', slug: 'arrested-by-police' },
      { title: 'Understanding Bail: Types and How to Get Bail', slug: 'understanding-bail' },
      { title: 'Free Legal Aid Under NALSA: Who Qualifies', slug: 'free-legal-aid-nalsa' },
    ],
  },
  'tenant-rights-india': {
    title: 'Tenant Rights in India: What Your Landlord Cannot Do',
    category: 'Property Law',
    categorySlug: 'property-law',
    readTime: 8,
    lastUpdated: '10 March 2026',
    summary: 'Indian tenants have significant legal protections. This guide explains your rights as a tenant — what your landlord must provide, when they cannot evict you, and how to recover your security deposit.',
    whoThisIsFor: [
      'Renters living in any property in India',
      'People facing unfair eviction or harassment by landlords',
      'Tenants who need to recover their security deposit',
      'People entering into a new rental agreement',
    ],
    keyRights: [
      'A landlord cannot evict you without following the legal eviction process — even if rent is overdue.',
      'You have the right to a written rental agreement that clearly states rent, deposit, and duration.',
      'Landlord cannot cut off essential services (water, electricity) as a means of eviction.',
      'Your security deposit must be refunded within a reasonable time after vacating, minus legitimate deductions.',
      'You have the right to quiet enjoyment of the property without unreasonable landlord interference.',
    ],
    steps: [
      { step: 'Know your agreement', detail: 'Always have a written rental agreement registered at the Sub-Registrar Office. Understand your rent, deposit, notice period, and renewal terms.' },
      { step: 'Document the property condition', detail: 'On move-in, document all existing damages with photos and share with the landlord in writing. This protects your security deposit.' },
      { step: 'Pay rent and document payments', detail: 'Always pay rent by bank transfer, not cash. Keep all receipts. This creates a record that cannot be disputed.' },
      { step: 'Know the notice period', detail: 'A landlord must give you the legally required notice (usually 1-3 months under state rent laws) before asking you to vacate.' },
      { step: 'Challenge illegal eviction', detail: 'If facing illegal eviction, file a complaint with the Rent Controller Court in your city. Courts can order reinstatement.' },
      { step: 'Recover your deposit', detail: 'Send a formal written demand for your security deposit after vacating. If refused, you can approach the consumer court or civil court.' },
    ],
    documents: [
      'Registered rental agreement / lease deed',
      'Rent payment receipts / bank transfer records',
      'Move-in and move-out condition photographs',
      'Any written communication with landlord (WhatsApp, email)',
      'Security deposit payment proof (receipt or bank record)',
    ],
    authorities: [
      { name: 'Rent Controller Court', contact: 'Find at your city\'s District Court' },
      { name: 'Consumer Forum (for deposit disputes)', contact: '1800-11-4000' },
      { name: 'State Rent Authority', url: 'https://mohua.gov.in' },
    ],
    commonMistakes: [
      'Paying rent in cash without receipts — always use bank transfers.',
      'Not registering the rental agreement — unregistered agreements are weak in court.',
      'Vacating without a written "no objection" or deposit refund commitment.',
      'Not documenting pre-existing damages on move-in.',
      'Allowing the landlord to cut utilities without filing a complaint.',
    ],
    whenToTalkLawyer: [
      'If you receive a legal eviction notice and want to contest it.',
      'If the landlord has locked you out or cut utilities.',
      'If your deposit (especially large amounts) is being wrongfully withheld.',
      'If you have a commercial property lease dispute.',
      'Before signing any rental agreement with unusual clauses.',
    ],
    faqs: [
      {
        q: 'Can a landlord evict me without notice?',
        a: 'No. In India, landlords must follow the state\'s rent control law and give adequate notice (typically 30-90 days) before seeking eviction through the Rent Controller Court. Self-help evictions (changing locks, removing belongings) are illegal.',
      },
      {
        q: 'What if my landlord cuts electricity or water?',
        a: 'This is illegal in India. A landlord cannot deprive a tenant of essential amenities to force them to vacate. You can file a criminal complaint and seek an injunction from the civil court.',
      },
      {
        q: 'How long does a landlord have to return my deposit?',
        a: 'There is no fixed legal deadline nationally, but a reasonable period is 30-90 days after vacating and handing over keys. Deductions must be itemised and justified. Unjustified withholding can be challenged in consumer court.',
      },
    ],
    relatedGuides: [
      { title: 'How to File a Consumer Court Complaint in India', slug: 'file-consumer-complaint' },
      { title: 'Property Registration: Process and Documents Needed', slug: 'property-registration-guide' },
    ],
  },

  'understanding-bail': {
    title: 'Understanding Bail in India: Types, How to Apply, and Your Rights',
    category: 'Criminal Law', categorySlug: 'criminal-law', readTime: 7, lastUpdated: '10 March 2026',
    summary: 'If you or someone you know has been arrested, bail is usually the first priority. This guide explains the three types of bail in India, who can apply, and what happens at a bail hearing.',
    whoThisIsFor: ['Anyone who has been arrested or fears arrest', 'Family members of an arrested person', 'People who want to understand the bail process before it becomes urgent'],
    keyRights: [
      'Every person has the right to be produced before a magistrate within 24 hours of arrest.',
      'You have the right to consult a lawyer immediately upon arrest - this cannot be denied.',
      'Under BNSS 2023, first-time offenders for bailable offences are entitled to bail as a right.',
      'You have the right to free legal aid if you cannot afford a lawyer (NALSA).',
      'Bail can only be cancelled by a court order - not by the police unilaterally.',
    ],
    steps: [
      { step: 'Understand the offence type', detail: 'Bailable offences entitle you to bail as of right. Non-bailable offences require a court hearing where bail is discretionary.' },
      { step: 'Regular Bail - Apply to the Magistrate', detail: 'Your lawyer files under Section 480 BNSS before the Sessions Court or Magistrate, presenting sureties and reasons for release.' },
      { step: 'Anticipatory Bail - Apply before arrest', detail: 'File under Section 482 BNSS before the Sessions Court or High Court before arrest happens.' },
      { step: 'Attend the bail hearing', detail: 'Both sides argue. Prosecution may oppose citing flight risk or evidence tampering. The judge weighs these factors.' },
      { step: 'Arrange sureties if bail is granted', detail: 'You may need surety bonds - a person who guarantees your appearance. The court sets bail amount and conditions.' },
      { step: 'Comply with bail conditions strictly', detail: 'Do not travel without permission, report to police as directed, do not contact witnesses. Violations lead to immediate cancellation.' },
    ],
    documents: ['FIR copy (if available)', 'ID proof of the accused (Aadhaar, passport)', 'Surety documents: ID + property documents', 'Proof of permanent residence', 'Employment or family ties documents'],
    authorities: [{ name: 'Nearest Magistrate Court', contact: 'Find at your District Court' }, { name: 'NALSA (Free Legal Aid)', contact: '15100' }, { name: 'State Legal Services Authority', url: 'https://nalsa.gov.in/lsams' }],
    commonMistakes: ['Waiting too long - file for bail immediately after arrest.', 'Not disclosing prior criminal record - courts see this as dishonesty.', 'Not arranging sureties in advance.', 'Violating bail conditions - leads to immediate cancellation.', 'Missing court dates - Non-Bailable Warrants (NBW) are issued.'],
    whenToTalkLawyer: ['Immediately upon arrest - do not give any statement without a lawyer.', 'For anticipatory bail - requires an experienced criminal lawyer.', 'If bail is denied - to appeal to a higher court.', 'If bail conditions need modification.', 'For NDPS, POCSO, or special legislation - stricter bail rules apply.'],
    faqs: [
      { q: 'What is the difference between bailable and non-bailable offences?', a: 'Bailable offences allow bail as a right - police or court must grant it. Non-bailable offences require a court hearing where bail is discretionary, not automatic.' },
      { q: 'What is the bail amount?', a: 'The court fixes the bail amount based on offence severity, flight risk, and other factors. You do not pay this amount unless you abscond - you provide a surety bond.' },
      { q: 'Can bail be cancelled?', a: 'Yes. Bail can be cancelled if you violate conditions, tamper with evidence, threaten witnesses, or commit another offence while on bail.' },
    ],
    relatedGuides: [{ title: 'What to Do When Arrested by Police in India', slug: 'arrested-by-police' }, { title: 'How to File an FIR', slug: 'how-to-file-fir' }],
  },

  'divorce-india-guide': {
    title: 'Divorce in India: Mutual Consent vs Contested - A Complete Guide',
    category: 'Family Law', categorySlug: 'family-law', readTime: 10, lastUpdated: '10 March 2026',
    summary: 'Divorce in India can be filed by mutual consent or as a contested petition. This guide explains the process, timeline, grounds, and what to expect - including property and child custody.',
    whoThisIsFor: ['Spouses considering separation or divorce', 'People who have been served a divorce petition', 'Those who want to understand their rights before approaching a lawyer'],
    keyRights: [
      'Either spouse can file for divorce - it is not limited to one party.',
      'Women have additional grounds under the Hindu Marriage Act including cruelty, desertion, and bigamy.',
      'You cannot be forced to stay in a marriage - divorce is a legal right in India.',
      'Interim maintenance can be sought while proceedings are ongoing.',
      "Children custody is decided on their best interests, not as a punishment to either parent.",
    ],
    steps: [
      { step: 'Understand your type of divorce', detail: 'Both agree: file for mutual consent divorce. One opposes: file a contested petition citing cruelty, desertion, adultery, mental illness, or irretrievable breakdown.' },
      { step: 'Choose the right court', detail: 'File in the District Family Court where you last lived together, or where either spouse currently resides.' },
      { step: 'Mutual Consent: File a joint petition', detail: 'Both sign a joint petition under Section 13B Hindu Marriage Act. You must have lived separately for at least 1 year.' },
      { step: 'First Motion + 6-month cooling period', detail: 'Court records the First Motion. A mandatory 6-month cooling-off follows (waivable per Supreme Court). Then proceed to Second Motion.' },
      { step: 'Contested: File petition + serve notice', detail: 'Petitioner files stating grounds. Court issues notice to the other spouse. Evidence is recorded. Reconciliation may be attempted.' },
      { step: 'Final Decree', detail: 'After all hearings, the court grants the divorce decree - the legal end of the marriage. Both parties receive a certified copy.' },
    ],
    documents: ['Marriage certificate', 'Address proof of both spouses', 'Evidence for contested grounds (medical records, witness statements)', 'Property documents (if division involved)', 'Children birth certificates (if custody matters)'],
    authorities: [{ name: 'District Family Court', contact: 'Find at your District Court' }, { name: 'NALSA Mediation / Lok Adalat', url: 'https://nalsa.gov.in' }, { name: 'Women Helpline', contact: '181' }],
    commonMistakes: ['Filing in the wrong court - wrong jurisdiction leads to dismissal.', 'Not gathering evidence early in a contested divorce.', 'Not seeking interim maintenance during proceedings.', 'Agreeing to unfair settlement under pressure.', "Assuming children go with the mother - courts decide case by case."],
    whenToTalkLawyer: ['Before filing - to understand which grounds apply.', 'If served a divorce petition unexpectedly.', 'For property, maintenance, and alimony negotiations.', 'When children are involved.', 'If you belong to a non-Hindu religion - personal law varies.'],
    faqs: [
      { q: 'How long does mutual consent divorce take?', a: 'Minimum 1.5 years (1 year separation + 6-month cooling period + hearing). The 6-month period can be waived in exceptional cases.' },
      { q: 'How long does contested divorce take?', a: 'Contested divorces can take 3-10 years depending on complexity and court backlogs. Mediation first is almost always advisable.' },
      { q: 'What happens to property after divorce?', a: 'There is no automatic 50:50 split in India. Courts may order maintenance, stridhan return, and property-sharing based on contributions.' },
    ],
    relatedGuides: [{ title: 'Domestic Violence Act 2005: A Complete Guide', slug: 'domestic-violence-act-guide' }, { title: 'Tenant Rights in India', slug: 'tenant-rights-india' }],
  },

  'domestic-violence-act-guide': {
    title: 'Domestic Violence Act 2005: A Complete Guide for Victims',
    category: 'Family Law', categorySlug: 'family-law', readTime: 9, lastUpdated: '10 March 2026',
    summary: 'The Protection of Women from Domestic Violence Act 2005 protects women from physical, emotional, sexual, and economic violence. It provides fast civil relief without requiring a criminal FIR first.',
    whoThisIsFor: ['Women experiencing any form of domestic abuse', 'Women in live-in relationships who face abuse', 'Family members who want to help a victim understand her rights'],
    keyRights: [
      'Any woman in a domestic relationship (including live-in partner) can apply for protection.',
      'You can get a Protection Order on the same day in urgent cases (ex-parte order).',
      'You have the right to stay in the shared household even if it belongs to the abuser.',
      'You can claim monetary relief for medical expenses, loss of earnings, and maintenance.',
      'Filing under PWDVA does not prevent you from also filing a criminal complaint (IPC 498A).',
    ],
    steps: [
      { step: 'Contact a Protection Officer', detail: 'Every district has a designated Protection Officer under PWDVA. They help you file a Domestic Incident Report (DIR). No lawyer is needed at this stage.' },
      { step: 'File a complaint / DIR', detail: 'The Protection Officer records your complaint. This can be done at a police station, Magistrate court, or through a registered NGO.' },
      { step: 'Magistrate hears the case', detail: 'In urgent cases, a Protection Order can be issued the same day without the abuser being present (ex-parte order).' },
      { step: 'Types of orders available', detail: 'Protection Order (stops contact), Residence Order (prevents eviction), Custody Order (for children), Monetary Relief, and Compensation.' },
      { step: 'Enforcement', detail: 'Violating a Protection Order is a cognizable offence with up to 1 year imprisonment. Police must act immediately on a complaint of violation.' },
    ],
    documents: ['Photographs of injuries', 'Medical reports / hospital records', 'Screenshots of threatening messages or calls', 'Police complaint records (if filed earlier)', 'Address proof of the shared household'],
    authorities: [{ name: 'Women Helpline', contact: '181' }, { name: 'Police Emergency', contact: '100' }, { name: 'NCW Helpline', contact: '7827-170-170' }, { name: 'NALSA Legal Aid', contact: '15100' }],
    commonMistakes: ['Thinking only physical violence is covered - emotional and economic abuse are also included.', 'Assuming you must leave the home - you have the right to stay.', 'Not documenting injuries or abuse immediately.', 'Accepting verbal apologies without legal follow-through.', 'Thinking live-in partners are not covered - PWDVA explicitly protects them.'],
    whenToTalkLawyer: ['To file for divorce alongside PWDVA relief.', 'For child custody applications.', 'If the abuser has significant resources.', 'To seek criminal prosecution (IPC 498A) alongside civil relief.', 'If Protection Orders are not being enforced by police.'],
    faqs: [
      { q: 'Is domestic violence only about physical assault?', a: 'No. PWDVA defines violence broadly: physical, sexual, verbal/emotional (insults, threats, humiliation), and economic abuse (withholding money, controlling finances).' },
      { q: 'Does PWDVA apply to live-in couples?', a: 'Yes. The Supreme Court confirmed women in live-in relationships are protected if the relationship is in the nature of marriage.' },
      { q: 'Do I need to file an FIR first?', a: 'No. PWDVA is a civil law and you can approach the Magistrate directly without an FIR. You can also do both simultaneously.' },
    ],
    relatedGuides: [{ title: 'Divorce in India: Mutual Consent vs Contested', slug: 'divorce-india-guide' }, { title: 'How to File an FIR', slug: 'how-to-file-fir' }],
  },

  'file-consumer-complaint': {
    title: 'How to File a Consumer Court Complaint in India',
    category: 'Consumer Law', categorySlug: 'consumer-law', readTime: 7, lastUpdated: '10 March 2026',
    summary: 'The Consumer Protection Act 2019 gives you powerful tools to fight defective products, poor services, and e-commerce fraud. This guide walks you through filing a complaint at the right Consumer Commission.',
    whoThisIsFor: ['Anyone who bought a defective product or received poor service', 'Consumers facing misleading advertising or unfair pricing', 'People whose insurance claims were wrongly rejected', 'Victims of e-commerce fraud on Amazon, Flipkart, Meesho etc.'],
    keyRights: [
      'No court fee for claims up to Rs.5 lakh - making consumer court accessible to everyone.',
      'You can file online at edaakhil.nic.in without visiting the commission.',
      'The time limit to file is 2 years from the cause of action.',
      'You can claim compensation for the defect, mental agony, and litigation costs.',
      'Consumer commissions must decide cases within 3-5 months (though backlogs exist).',
    ],
    steps: [
      { step: 'Identify the right forum', detail: 'District Commission (claims up to Rs.50 lakh), State Commission (Rs.50L to Rs.2 crore), National Commission (above Rs.2 crore). For most complaints, file at District Commission.' },
      { step: 'Send a legal notice first', detail: 'Send a written notice to the seller or company giving 15-30 days to resolve. Keep proof of sending. This often resolves the issue without court.' },
      { step: 'Gather evidence', detail: 'Invoice/receipt, warranty card, product photos, screenshots of e-commerce orders, and all communication with the seller.' },
      { step: 'File online or in person', detail: 'Visit edaakhil.nic.in to file online. Fill the complaint form, upload documents, and pay the fee (nil for up to Rs.5 lakh). Or visit your district consumer commission in person.' },
      { step: 'Attend hearings', detail: 'The commission issues notice to the opposite party. Both sides submit evidence. For straightforward matters you may not need a lawyer.' },
      { step: 'Obtain and execute the order', detail: 'If you win, the order grants refund, replacement, compensation, or penalty. If not complied with, file for execution.' },
    ],
    documents: ['Purchase invoice or e-commerce order confirmation', 'Warranty card or service contract', 'Communication with seller (emails, WhatsApp screenshots)', 'Photos showing the defect', 'Legal notice and proof of sending', 'Medical records if health was affected'],
    authorities: [{ name: 'National Consumer Helpline', contact: '1800-11-4000' }, { name: 'e-Daakhil Online Filing', url: 'https://edaakhil.nic.in' }, { name: 'Consumer Affairs Ministry', url: 'https://consumeraffairs.nic.in' }],
    commonMistakes: ['Filing in the wrong forum (wrong monetary jurisdiction) - complaint gets rejected.', 'Not sending a legal notice first.', 'Filing after 2 years - complaints become time-barred.', 'Not keeping original purchase documents.', 'Claiming emotional distress without supporting evidence.'],
    whenToTalkLawyer: ['For claims above Rs.50 lakh (State/National Commission).', 'Complex product liability cases.', 'Medical negligence claims - require expert opinions.', 'When the company files a counter-complaint or appeal.', 'To draft the legal notice professionally.'],
    faqs: [
      { q: 'Can I file against an e-commerce platform?', a: 'Yes. Under Consumer Protection (E-Commerce) Rules 2020, platforms like Amazon and Flipkart are liable. You can file against them for failed refunds or defective products.' },
      { q: 'Is there a court fee?', a: 'For claims up to Rs.5 lakh: no fee. Rs.5-10 lakh: Rs.200. Rs.10-20 lakh: Rs.400. Up to Rs.50 lakh: Rs.2,000. Check edaakhil.nic.in for current rates.' },
      { q: 'How long does it take?', a: 'The law mandates 3-5 months but in practice 6 months to 2 years at district commissions. Simple cases with good documentation resolve faster.' },
    ],
    relatedGuides: [{ title: 'Tenant Rights in India', slug: 'tenant-rights-india' }, { title: 'How to File an RTI Application', slug: 'how-to-file-rti' }],
  },

  'how-to-file-rti': {
    title: 'How to File an RTI (Right to Information) Application in India',
    category: 'Civil & General', categorySlug: 'civil-law', readTime: 6, lastUpdated: '10 March 2026',
    summary: 'The Right to Information Act 2005 gives every Indian citizen the right to ask any government office for information and get a response within 30 days. This guide explains what you can ask, how to file, and what to do if denied.',
    whoThisIsFor: ['Anyone who wants information from a government office or public authority', 'Citizens fighting corruption, delayed payments, or government inaction', 'People checking status of their own applications, licences, or benefits'],
    keyRights: [
      'Any Indian citizen can file an RTI against any public authority - you do not need to explain why.',
      'The public authority must respond within 30 days (48 hours for matters of life or liberty).',
      'If denied, you can file a First Appeal within 30 days and then a Second Appeal to the Information Commission.',
      'You can file without identifying your reason - reason for filing cannot be a ground for rejection.',
      'BPL card holders are exempt from the Rs.10 application fee.',
    ],
    steps: [
      { step: 'Identify the public authority', detail: 'Determine which government department has the information. RTI applies to all central and state government bodies, public sector undertakings, and government-funded organisations.' },
      { step: 'Write a clear, specific application', detail: 'Be specific. Example: "Please provide the number of road repair tenders awarded in Delhi district between Jan 2024 and Jan 2025." Vague requests get vague answers.' },
      { step: 'Pay the application fee', detail: 'Central government: Rs.10 per application. BPL card holders are exempt. Online: pay via netbanking at rtionline.gov.in.' },
      { step: 'File the application', detail: 'Online at rtionline.gov.in for central government. By registered post to the Public Information Officer (PIO) of the concerned department.' },
      { step: 'Wait for response (30 days)', detail: 'The PIO must respond within 30 days. If the RTI concerns life or liberty, they must respond within 48 hours.' },
      { step: 'Appeal if denied or unsatisfied', detail: 'First Appeal: to the First Appellate Authority of the same department within 30 days. Second Appeal: to the Central or State Information Commission within 90 days.' },
    ],
    documents: ['No mandatory documents required - RTI is designed to be simple', 'Proof of BPL status (if claiming fee exemption)', 'Copy of original RTI application and PIO response (needed for appeals)'],
    authorities: [{ name: 'Central Government RTI Portal', url: 'https://rtionline.gov.in' }, { name: 'Central Information Commission', url: 'https://cic.gov.in' }],
    commonMistakes: ['Asking vague questions - be very specific about what you need.', 'Filing against private companies - RTI does not apply to most private entities.', 'Missing appeal deadlines - 30 days for First Appeal, 90 days for Second.', 'Not keeping a copy of your RTI application before submitting.'],
    whenToTalkLawyer: ['If your RTI is wrongly rejected and the Second Appeal also fails - petition the High Court.', 'For complex matters where national security exemptions are being misused.', 'If a government officer destroys or falsifies information (a criminal offence).'],
    faqs: [
      { q: 'Can private companies be asked for information via RTI?', a: 'Generally no - RTI applies only to public authorities. Private entities receiving substantial government funding may be covered, but most private companies are not.' },
      { q: 'What if the government says the information is exempt?', a: 'Section 8 has 10 exempt categories. However, even exempt information must be disclosed if public interest outweighs harm. An appeal officer can override the exemption claim.' },
      { q: 'Is there RTI for state governments?', a: 'Yes. Every state has its own State PIOs and State Information Commissions. Many states also have online RTI portals mirroring the central system.' },
    ],
    relatedGuides: [{ title: 'How to File a Consumer Court Complaint', slug: 'file-consumer-complaint' }, { title: 'How to File an FIR', slug: 'how-to-file-fir' }],
  },

};

// Fallback for guides not yet written
function ComingSoonGuide({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4 py-16">
      <BookOpen className="w-12 h-12 text-[#1E3A8A] mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title || 'Guide Coming Soon'}</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        Our legal team is working on this guide. In the meantime, use our AI assistant or book a verified lawyer.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/guides" className="border border-[#1E3A8A] text-[#1E3A8A] px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
          Browse All Guides
        </Link>
        <Link href="/lawyers" className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
          Find a Verified Lawyer
        </Link>
      </div>
    </div>
  );
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) {
    return { title: 'Legal Guide | LexIndia' };
  }
  return {
    title: `${guide.title} | LexIndia`,
    description: guide.summary,
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES[slug];

  // For unknown slugs that look valid, show "coming soon" rather than 404
  // (many guide stubs are listed on /guides but not written yet)
  if (!guide) {
    return <ComingSoonGuide title="" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-blue-300 text-sm mb-3">
            <Link href="/guides" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> All Guides
            </Link>
            <span>·</span>
            <Link href={`/guides?cat=${guide.categorySlug}`} className="hover:text-white">{guide.category}</Link>
          </div>

          {/* JSON-LD FAQ Schema */}
          {guide.faqs && guide.faqs.length > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: guide.faqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: faq.a,
                    },
                  })),
                }),
              }}
            />
          )}
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{guide.title}</h1>
          <p className="text-blue-200 leading-relaxed mb-4">{guide.summary}</p>
          <div className="flex flex-wrap gap-4 text-xs text-blue-300">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {guide.readTime} min read</span>
            <span>Updated: {guide.lastUpdated}</span>
            <span className="flex items-center gap-1 text-green-300"><CheckCircle className="w-3.5 h-3.5" /> Reviewed by lawyers</span>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-amber-800 text-xs">
              <strong>General Information Only:</strong> This guide explains general Indian law principles and does not constitute legal advice.
              For your specific situation, consult a <Link href="/lawyers" className="underline font-medium">verified lawyer</Link>.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Who this is for */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 text-[#1E3A8A] rounded-full flex items-center justify-center text-xs font-bold">?</span>
                Who This Guide Is For
              </h2>
              <ul className="space-y-2">
                {guide.whoThisIsFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Rights */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Your Key Rights
              </h2>
              <ul className="space-y-3">
                {guide.keyRights.map((right, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                    <span className="w-5 h-5 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {right}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step-by-Step Process */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Step-by-Step Guide</h2>
              <div className="space-y-5">
                {guide.steps.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{s.step}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Needed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" /> Documents You May Need
              </h2>
              <ul className="space-y-2">
                {guide.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${guide.categorySlug === 'emergency-law' ? 'text-red-700 uppercase tracking-wide' : 'text-red-900'}`}>
                <AlertTriangle className={`w-5 h-5 ${guide.categorySlug === 'emergency-law' ? 'text-red-600' : 'text-red-500'}`} /> 
                {guide.categorySlug === 'emergency-law' ? 'WHAT NOT TO DO (Strictly Avoid)' : 'Common Mistakes to Avoid'}
              </h2>
              <ul className="space-y-2">
                {guide.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {guide.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* When to Talk to a Lawyer */}
            <div className="bg-[#1E3A8A] rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-3 text-sm">⚖️ When to Consult a Lawyer</h3>
              <ul className="space-y-2">
                {guide.whenToTalkLawyer.map((item, i) => (
                  <li key={i} className="text-xs text-blue-200 flex items-start gap-1.5">
                    <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-[#D4AF37]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/lawyers"
                className="block mt-4 text-center bg-[#D4AF37] text-gray-900 py-2.5 rounded-lg text-xs font-bold hover:bg-yellow-500 transition-colors"
              >
                Find a Verified Lawyer
              </Link>
            </div>

           {/* Mistakes Sidebar */}
           {guide.commonMistakes.length > 0 && (
             <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
               <h3 className={`font-bold mb-3 text-sm flex items-center gap-1 ${guide.categorySlug === 'emergency-law' ? 'text-red-700 uppercase' : 'text-red-900'}`}>
                 <AlertTriangle className="w-4 h-4 text-red-500" /> 
                 {guide.categorySlug === 'emergency-law' ? 'WHAT NOT TO DO' : 'Mistakes to Avoid'}
               </h3>
               <ul className="space-y-2">
                 {guide.commonMistakes.map((m, i) => (
                   <li key={i} className="text-xs text-red-800 flex items-start gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                     {m}
                   </li>
                 ))}
               </ul>
             </div>
           )}

            {/* Authorities & Helplines (Moved Down) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#1E3A8A]" /> Helpful Authorities
              </h3>
              <div className="space-y-3">
                {guide.authorities.map((auth, i) => (
                  <div key={i} className="text-xs">
                    <p className="font-semibold text-gray-800">{auth.name}</p>
                    {auth.contact && <p className="text-[#1E3A8A]"><a href={`tel:${auth.contact}`}>{auth.contact}</a></p>}
                    {auth.url && <a href={auth.url} target="_blank" rel="noopener noreferrer" className="text-[#1E3A8A] underline">Visit website</a>}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Guides */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Guides</h3>
              <div className="space-y-2">
                {guide.relatedGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="block text-xs text-[#1E3A8A] hover:underline flex items-center gap-1"
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" /> {g.title}
                  </Link>
                ))}
                <Link href="/guides" className="block text-xs text-gray-400 hover:text-gray-600 mt-2">
                  Browse all guides →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

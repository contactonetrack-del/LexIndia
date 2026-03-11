import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BookOpen, Clock, Shield, ArrowLeft, ArrowRight,
  CheckCircle, AlertTriangle, FileText, Phone
} from 'lucide-react';

// ============================================================
// Rights Persona Content Repository
// ============================================================

interface RightsContent {
  title: string;
  category: string;
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

const RIGHTS: Record<string, RightsContent> = {
  'cybercrime': {
    title: 'Your Rights as a Cybercrime Victim',
    category: 'Cybercrime Victims',
    readTime: 8,
    lastUpdated: '12 March 2026',
    summary: 'A definitive legal guide for victims of online financial fraud, social media harassment, hacking, and data theft in India. Learn the immediate steps to secure your assets, file reports, and trigger the IT Act.',
    whoThisIsFor: [
      'Victims of UPI, Credit Card, or Bank Fraud',
      'Individuals facing online harassment or cyberbullying',
      'Victims of identity theft, hacking, or unauthorized data access',
      'Businesses experiencing ransomware or corporate espionage'
    ],
    keyRights: [
      'You have the right to register a Zero FIR for cybercrime at any police station.',
      'Banks must refund unauthorized fraudulent transactions if reported within 3 days (under RBI guidelines).',
      'You have the right to demand social media platforms remove non-consensual explicit images within 24 hours (IT Rules).',
      'Your identity can be kept anonymous in cases involving sexual harassment or extortion.',
      'You are entitled to compensation for data breaches under Section 43A of the IT Act if a corporate body is negligent.'
    ],
    steps: [
      { step: 'Call the National Helpline', detail: 'Immediately dial 1930 to report financial fraud before the money leaves the banking system.' },
      { step: 'Block Compromised Assets', detail: 'Contact your bank to freeze involved accounts, block credit/debit cards, and pause UPI mandates.' },
      { step: 'Preserve Digital Evidence', detail: 'Do not delete the chats, emails, or logs. Take screenshots showing URLs, phone numbers, and visible timestamps.' },
      { step: 'File the Official Complaint', detail: 'Register your complaint online at the National Cyber Crime Reporting Portal (cybercrime.gov.in).' },
      { step: 'Follow Up Locally', detail: 'Take the online acknowledgment number to your nearest cyber cell or police station to escalate to a physical FIR.' }
    ],
    documents: [
      'Screenshots/Printouts of the fraudulent communications',
      'Bank/Credit Card statements reflecting the unauthorized transactions',
      'Soft copies of the phishing emails (with headers intact)',
      'Government ID (Aadhaar/PAN) for identity verification at the station'
    ],
    authorities: [
      { name: 'National Cybercrime Helpline', contact: '1930', url: 'https://cybercrime.gov.in' },
      { name: 'RBI Ombudsman (For Bank Grievances)', url: 'https://cms.rbi.org.in' },
      { name: 'Local Cyber Cell', contact: '112 (Emergency Police)' }
    ],
    commonMistakes: [
      'Deleting the suspicious emails or messages out of panic — this destroys vital digital forensics.',
      'Waiting too long to report. RBI heavily limits bank liability if fraud is reported after 3 working days.',
      'Trying to confront or threaten the hacker/scammer back. This frequently escalates extortion.',
      'Surrendering your phone to the police without taking a backup of your innocent personal data.'
    ],
    whenToTalkLawyer: [
      'If your bank refuses to process your fraud refund claim despite timely reporting.',
      'If the police refuse to convert your cybercrime portal complaint into an FIR.',
      'If you are being blackmailed via a data breach and need an injunction against publishers.',
      'If your corporate business infrastructure has been hijacked and you face liability issues.'
    ],
    faqs: [
      {
        q: 'Will I get my stolen money back?',
        a: 'If you report the fraud to your bank within 3 working days, you carry zero liability for the loss per RBI guidelines, meaning the bank must refund you. If reported between 4-7 days, your liability is capped. If reported after 7 days, it depends entirely on the bank’s board policy.'
      },
      {
        q: 'Are screenshots enough for court?',
        a: 'Screenshots are useful for the FIR, but for court admission, electronic evidence must be certified under Section 65B of the Indian Evidence Act.'
      },
      {
        q: 'Can the police recover my hacked Instagram/Facebook account?',
        a: 'The police can issue a notice to Meta/Facebook under CrPC Request, but recovery relies heavily on the platform. You must also use the platform\'s internal hacked-account recovery forms simultaneously.'
      }
    ],
    relatedGuides: [
      { title: 'How to File an FIR', slug: 'how-to-file-fir' },
      { title: 'E-Commerce Fraud Refunds', slug: 'ecommerce-refund-fraud' }
    ]
  },
  'women': { 
    title: 'Women’s Rights', category: 'Women', readTime: 5, lastUpdated: '10 March 2026', summary: 'Placeholder content', whoThisIsFor: [], keyRights: [], steps: [], documents: [], authorities: [], commonMistakes: [], whenToTalkLawyer: [], faqs: [], relatedGuides: [] 
  },
  'tenants': { 
    title: 'Tenant Rights', category: 'Tenants', readTime: 5, lastUpdated: '10 March 2026', summary: 'Placeholder content', whoThisIsFor: [], keyRights: [], steps: [], documents: [], authorities: [], commonMistakes: [], whenToTalkLawyer: [], faqs: [], relatedGuides: [] 
  },
  'workers': { 
    title: 'Worker Rights', category: 'Workers', readTime: 5, lastUpdated: '10 March 2026', summary: 'Placeholder content', whoThisIsFor: [], keyRights: [], steps: [], documents: [], authorities: [], commonMistakes: [], whenToTalkLawyer: [], faqs: [], relatedGuides: [] 
  },
  'consumers': { 
    title: 'Consumer Rights', category: 'Consumers', readTime: 5, lastUpdated: '10 March 2026', summary: 'Placeholder content', whoThisIsFor: [], keyRights: [], steps: [], documents: [], authorities: [], commonMistakes: [], whenToTalkLawyer: [], faqs: [], relatedGuides: [] 
  },
  'seniors': { 
    title: 'Senior Citizen Rights', category: 'Seniors', readTime: 5, lastUpdated: '10 March 2026', summary: 'Placeholder content', whoThisIsFor: [], keyRights: [], steps: [], documents: [], authorities: [], commonMistakes: [], whenToTalkLawyer: [], faqs: [], relatedGuides: [] 
  },
  'arrested': { 
    title: 'Arrested Rights', category: 'Arrested', readTime: 5, lastUpdated: '10 March 2026', summary: 'Placeholder content', whoThisIsFor: [], keyRights: [], steps: [], documents: [], authorities: [], commonMistakes: [], whenToTalkLawyer: [], faqs: [], relatedGuides: [] 
  },
  'students': { 
    title: 'Student Rights', category: 'Students', readTime: 5, lastUpdated: '10 March 2026', summary: 'Placeholder content', whoThisIsFor: [], keyRights: [], steps: [], documents: [], authorities: [], commonMistakes: [], whenToTalkLawyer: [], faqs: [], relatedGuides: [] 
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const guide = RIGHTS[resolvedParams.slug];
  if (!guide) return { title: 'Not Found | LexIndia' };

  return {
    title: `${guide.title} | LexIndia`,
    description: guide.summary,
  };
}

export default async function RightsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const guide = RIGHTS[resolvedParams.slug];

  if (!guide) {
    notFound();
  }

  // Same basic layout structure mirrored from Guides architecture
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#1E3A8A] text-white pt-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/rights" className="inline-flex items-center text-blue-200 hover:text-white mb-6 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Rights
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/10 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
              {guide.category} Persona
            </span>
            <span className="flex items-center text-blue-200 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 mr-1" /> {guide.readTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {guide.title}
          </h1>
          
          <p className="text-blue-100 text-lg sm:text-xl leading-relaxed max-w-3xl">
            {guide.summary}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Verified Legal Information</p>
              <p className="text-xs text-gray-500">Based on prevailing Indian Laws as of {guide.lastUpdated}</p>
            </div>
          </div>
          <Link href="/lawyers" className="w-full sm:w-auto text-center bg-[#D4AF37] text-gray-900 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors">
            Consult a Lawyer
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
        <div className="space-y-10">
          
          {/* Key Rights */}
          {guide.keyRights.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-[#1E3A8A] mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Your Absolute Rights
              </h2>
              <ul className="space-y-3">
                {guide.keyRights.map((right, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-gray-800 leading-relaxed font-medium">{right}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Steps */}
          {guide.steps.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Immediate Steps to Take</h2>
              <div className="space-y-6">
                {guide.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{step.step}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Docs */}
          {guide.documents.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" /> Documents Needed
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
          )}

          {/* FAQs */}
          {guide.faqs.length > 0 && (
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
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
           {/* When To Talk To Lawyer */}
           {guide.whenToTalkLawyer.length > 0 && (
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
             </div>
           )}

           {/* Mistakes */}
           {guide.commonMistakes.length > 0 && (
             <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
               <h3 className="font-bold text-red-900 mb-3 text-sm flex items-center gap-1">
                 <AlertTriangle className="w-4 h-4 text-red-500" /> Mistakes to Avoid
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
        </div>
      </div>
    </div>
  );
}

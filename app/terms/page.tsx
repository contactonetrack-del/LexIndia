import type { Metadata } from 'next';
import { FileText, AlertTriangle, Scale, Users, CreditCard, Bot } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | LexIndia',
  description: 'Read the Terms of Service for LexIndia — the Indian legal-tech platform connecting citizens with verified lawyers.',
  alternates: { canonical: '/terms' },
};

const sections = [
  {
    icon: Users,
    title: '1. Eligibility and Account',
    items: [
      'You must be at least 18 years of age to use LexIndia.',
      'You agree to provide accurate, current, and complete information during registration.',
      'You are responsible for maintaining the security of your account credentials.',
      'You must not share your account or allow unauthorised access.',
      'LexIndia reserves the right to suspend or terminate accounts that violate these terms.',
    ],
  },
  {
    icon: Scale,
    title: '2. Platform Nature and Scope',
    items: [
      'LexIndia is a technology platform that facilitates connections between citizens and legal professionals. It is not a law firm.',
      'LexIndia does not provide legal advice. All legal advice is provided by independent lawyers listed on the platform.',
      'The platform does not endorse any specific lawyer\u2019s advice or guarantee specific legal outcomes.',
      'Lawyer profiles are created by lawyers themselves. LexIndia verifies Bar Council registration but does not verify all profile claims.',
      'LexIndia operates only within the jurisdiction of India and provides information about Indian law.',
    ],
  },
  {
    icon: Bot,
    title: '3. AI Legal Assistant',
    items: [
      'The AI Legal Assistant provides general legal information for educational purposes only.',
      'AI responses do not constitute legal advice and should not be relied upon as a substitute for consultation with a qualified lawyer.',
      'The AI assistant may make errors. Always consult a verified lawyer for your specific legal situation.',
      'Do not share sensitive personal information (Aadhaar number, financial account details, passwords) with the AI assistant.',
      'LexIndia is not liable for any actions taken or not taken based on AI assistant responses.',
    ],
  },
  {
    icon: CreditCard,
    title: '4. Payments and Bookings',
    items: [
      'Consultation fees are set by individual lawyers and are displayed before booking.',
      'All payments are processed securely through authorised payment gateways. LexIndia does not store card details.',
      'Consultation fees include applicable GST at prevailing rates.',
      'Cancellation and refund policies are as stated at the time of booking. Platform fees may be non-refundable.',
      'LexIndia acts as a payment facilitator. Disputes regarding consultation quality should be raised with the lawyer first.',
      'In case of technical failure during payment, contact support@lexindia.in within 48 hours.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '5. Prohibited Conduct',
    items: [
      'Using the platform to harass, intimidate, or threaten any lawyer, citizen, or platform staff.',
      'Submitting false, misleading, or fraudulent information during registration or booking.',
      'Attempting to circumvent the platform to engage lawyers directly and avoid platform fees after initial contact.',
      'Posting defamatory, obscene, or illegal content in reviews, messages, or issue descriptions.',
      'Using automated tools, bots, or scrapers to extract platform data.',
      'Impersonating any person, entity, or lawyer on the platform.',
    ],
  },
  {
    icon: FileText,
    title: '6. Intellectual Property',
    items: [
      'All platform content, design, code, and trademarks are owned by LexIndia or its licensors.',
      'Legal guide articles, templates, and knowledge base content may not be reproduced without written permission.',
      'User-generated content (reviews, messages) grants LexIndia a non-exclusive licence to display and moderate such content.',
      'Legal templates are provided for general guidance. Adapt templates with professional legal advice before use.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-sm">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Please read these terms carefully before using LexIndia. By registering or using our services,
            you agree to be bound by these terms.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-blue-300">
            <span>Effective: 10 March 2026</span>
            <span>·</span>
            <span>Last Updated: 10 March 2026</span>
            <span>·</span>
            <span>Version 1.0</span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-red-800 text-sm">
              <strong>Not Legal Advice:</strong> LexIndia is a technology platform, not a law firm. Content on this platform,
              including AI responses, knowledge base articles, and legal guides, is for general informational purposes only
              and does not constitute legal advice.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1E3A8A]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Limitation of Liability */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              To the maximum extent permitted by applicable Indian law, LexIndia and its officers, directors, employees,
              and agents shall not be liable for any indirect, incidental, special, or consequential damages arising
              from your use of the platform.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              LexIndia&apos;s total liability for any claim arising from these terms shall not exceed the amount paid
              by you to LexIndia in the 3 months preceding the claim.
            </p>
          </div>

          {/* Dispute Resolution */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              These Terms are governed by the laws of India. Any disputes arising shall be subject to the exclusive
              jurisdiction of the courts at [City], India.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We encourage resolution of disputes through our grievance mechanism first. Contact us at
              legal@lexindia.in with your concern. We aim to resolve disputes within 30 days.
            </p>
          </div>

          {/* Changes */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Changes to These Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may modify these Terms at any time. Material changes will be communicated via email to registered users
              at least 14 days before taking effect. Continued use of LexIndia after changes constitutes acceptance.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-[#1E3A8A] rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-2">Questions About These Terms?</h2>
            <p className="text-blue-200 text-sm mb-4">Contact our legal team:</p>
            <div className="space-y-1 text-sm text-blue-100">
              <p><strong className="text-white">Email:</strong> legal@lexindia.in</p>
              <p><strong className="text-white">Grievance Officer:</strong> LexIndia Legal Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

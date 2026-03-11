import type { Metadata } from 'next';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | LexIndia',
  description: 'Learn how LexIndia collects, uses, and protects your personal data in compliance with Indian IT Act 2000 and the Digital Personal Data Protection Act 2023.',
  alternates: { canonical: '/privacy' },
};

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Account information: name, email address, phone number, and role (Citizen or Lawyer).',
      'Lawyer-specific information: Bar Council ID, state enrollment, specializations, experience, fees, and consultation modes.',
      'Consultation data: issue descriptions, uploaded documents shared during booking, and appointment records.',
      'AI Assistant interactions: queries submitted to the AI Legal Assistant (processed server-side; not stored permanently).',
      'Usage data: pages visited, search queries, features used, IP address, browser type, and device information.',
      'Payment data: transaction references and booking amounts processed through our payment provider. We do not store card details.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To create and manage your account and provide platform services.',
      'To connect citizens with verified lawyers for legal consultations.',
      'To process consultation bookings and payments.',
      'To improve our AI Legal Assistant and knowledge base.',
      'To send transactional emails: booking confirmations, appointment reminders, and account notifications.',
      'To comply with legal obligations under Indian law.',
      'To detect and prevent fraud, abuse, or security incidents.',
    ],
  },
  {
    icon: Shield,
    title: 'Data Security',
    content: [
      'Your data is stored on secured servers with encryption at rest and in transit (TLS/SSL).',
      'Passwords are hashed using industry-standard algorithms and are never stored in plaintext.',
      'AI queries are processed server-side; API keys are never exposed to client browsers.',
      'Access to personal data is restricted to authorised personnel only.',
      'We conduct regular security reviews and follow responsible disclosure practices.',
      'In the event of a data breach affecting your rights, we will notify you as required by applicable law.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Your Rights Under DPDPA 2023',
    content: [
      'Right to access: You may request a copy of the personal data we hold about you.',
      'Right to correction: You may request correction of inaccurate or incomplete personal data.',
      'Right to erasure: You may request deletion of your personal data, subject to legal retention obligations.',
      'Right to withdraw consent: You may withdraw consent for data processing at any time by deleting your account.',
      'Right to grievance redressal: You may raise a complaint with us or the Data Protection Board of India.',
      'To exercise any of these rights, contact us at privacy@lexindia.in.',
    ],
  },
  {
    icon: Lock,
    title: 'Cookies and Tracking',
    content: [
      'We use essential cookies required for authentication and session management.',
      'We use analytics cookies to understand how users interact with our platform (aggregated, non-personal).',
      'We do not use third-party advertising cookies or sell your data to advertisers.',
      'You can manage cookie preferences in your browser settings. Disabling essential cookies may impair platform functionality.',
    ],
  },
  {
    icon: Mail,
    title: 'Data Sharing and Third Parties',
    content: [
      'We share your booking information with the lawyer you have selected for a consultation.',
      'We use trusted third-party processors for payments (Razorpay), email (Resend), and cloud hosting. They are contractually bound to protect your data.',
      'We do not sell, rent, or trade your personal data to any third party for marketing purposes.',
      'We may disclose data if required by law, court order, or governmental authority.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-sm">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            LexIndia is committed to protecting your personal data. This policy explains what we collect,
            how we use it, and your rights under Indian law.
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

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-amber-800 text-sm">
            <strong>Applicable Law:</strong> This Privacy Policy is governed by the Information Technology Act 2000,
            the Information Technology (Reasonable Security Practices) Rules 2011, and the Digital Personal Data
            Protection Act 2023 (DPDPA).
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
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
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Retention & Deletion */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We retain your account data for as long as your account remains active. Appointment and booking records
              are retained for 7 years as required by Indian financial and legal record-keeping obligations.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              You may delete your account at any time from your dashboard settings. Upon deletion, your personal data
              will be anonymised or erased within 30 days, except where retention is legally required.
            </p>
          </div>

          {/* Children */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              LexIndia is not intended for use by persons under 18 years of age. We do not knowingly collect personal
              data from minors. If you believe we have inadvertently collected such data, please contact us immediately
              at <a href="mailto:privacy@lexindia.in" className="text-[#1E3A8A] underline">privacy@lexindia.in</a>.
            </p>
          </div>

          {/* Changes */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. When we make material changes, we will notify
              registered users by email and update the &quot;Last Updated&quot; date above. Continued use of LexIndia
              after changes constitutes acceptance of the revised policy.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-[#1E3A8A] rounded-2xl p-8 text-white">
            <h2 className="text-xl font-bold mb-4">Contact Our Privacy Team</h2>
            <p className="text-blue-200 text-sm mb-6">
              For any privacy-related questions, requests, or complaints, please contact our designated Privacy Officer:
            </p>
            <div className="space-y-2 text-sm text-blue-100">
              <p><strong className="text-white">Email:</strong> privacy@lexindia.in</p>
              <p><strong className="text-white">Grievance Officer:</strong> LexIndia Privacy Team</p>
              <p><strong className="text-white">Response Time:</strong> We aim to respond to all privacy requests within 30 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

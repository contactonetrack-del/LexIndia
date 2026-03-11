import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck, FileCheck, Search, Star, AlertTriangle,
  CheckCircle, XCircle, ArrowRight, Scale, Phone
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How We Verify Lawyers | LexIndia — Our Verification Process',
  description: 'Learn how LexIndia verifies every lawyer on our platform — from Bar Council ID checks to identity verification and ongoing monitoring. Your safety is our priority.',
  alternates: { canonical: '/verify-lawyers' },
  keywords: ['verified lawyers India', 'LexIndia verification', 'lawyer verification process', 'how to find trusted lawyer India'],
};

const VERIFICATION_STEPS = [
  {
    number: '01',
    icon: FileCheck,
    title: 'Document Submission',
    desc: 'Every lawyer who applies to join LexIndia must submit their Bar Council Enrolment Certificate, Aadhaar card (for identity), and a professional photograph.',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-[#1E3A8A]',
    iconBg: 'bg-blue-100',
  },
  {
    number: '02',
    icon: Search,
    title: 'Bar Council Cross-Check',
    desc: 'Our team cross-references the submitted Bar Council Enrolment Number with the respective State Bar Council registry to verify active enrolment status.',
    color: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-700',
    iconBg: 'bg-indigo-100',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Manual Document Review',
    desc: 'A LexIndia team member physically reviews submitted documents for authenticity. We check for tampered certificates, mismatched IDs, and false claims.',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-700',
    iconBg: 'bg-purple-100',
  },
  {
    number: '04',
    icon: Star,
    title: 'Verification Badge Issued',
    desc: 'Lawyers who pass all checks receive a ✓ Verified badge on their profile. Unverified applicants are notified and given a chance to resubmit correct documents.',
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-100',
  },
  {
    number: '05',
    icon: AlertTriangle,
    title: 'Ongoing Monitoring',
    desc: 'Verification is not a one-time event. Client ratings, reviews, and complaints are monitored. Any credible complaint triggers an automatic re-review and potential suspension.',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-700',
    iconBg: 'bg-red-100',
  },
];

const VERIFIED_INDICATORS = [
  'Blue ✓ Verified badge on profile',
  'Bar Council ID visible on profile',
  'At least one consultation mode listed',
  'Profile reviewed by LexIndia team',
];

const NOT_VERIFIED_INDICATORS = [
  'No verification badge shown',
  'Newly onboarded (review pending)',
  'Profile flagged for document mismatch',
  'Active investigation for a complaint',
];

const FAQS = [
  {
    q: 'Does LexIndia guarantee a lawyer\'s quality of service?',
    a: 'No. Verification confirms identity and Bar Council enrolment — it does not guarantee the quality or outcome of legal advice. You should use ratings, reviews, experience years, and your own judgment when choosing a lawyer.',
  },
  {
    q: 'What if I suspect a lawyer\'s credentials are fake?',
    a: 'Report it immediately via our Contact page or email trust@lexindia.in. We take fraud seriously and suspend profiles pending investigation. You can also verify any lawyer independently at your state Bar Council\'s website.',
  },
  {
    q: 'Can a suspended or disqualified lawyer join LexIndia?',
    a: 'Our Bar Council check is designed to catch suspended enrolments. However, if you notice a lawyer who has been debarred, please report them and we will remove the profile immediately.',
  },
  {
    q: 'How long does verification take?',
    a: 'Typically 2–5 business days after a lawyer submits all required documents. During high-demand periods this may extend to 7 days.',
  },
  {
    q: 'Is my data safe when booking through LexIndia?',
    a: 'Yes. All communication between you and the platform is encrypted. Your legal issue description is only shared with the specific lawyer you book. We do not sell personal data to third parties.',
  },
];

export default function VerifyLawyersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-9 h-9 text-gray-900" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">How We Verify Lawyers</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-4">
            Every lawyer on LexIndia goes through a rigorous 5-step verification process before receiving 
            the <strong className="text-white">✓ Verified</strong> badge. Here&apos;s exactly what we check — and what we don&apos;t.
          </p>
          <p className="text-blue-300 text-sm">
            We believe in transparency. If you have questions about a specific lawyer, use our{' '}
            <Link href="/contact" className="underline text-white">Contact page</Link> to reach our trust team.
          </p>
        </div>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Verification confirms a lawyer&apos;s identity and Bar Council enrolment. 
                It does <strong>not</strong> guarantee outcomes, quality of advice, or specialisation depth. 
                Always review a lawyer&apos;s profile, ratings, and experience before booking.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 5-Step Process */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Our 5-Step Verification Process</h2>
          <p className="text-gray-500 mb-8">Applied to every lawyer before they can list on LexIndia.</p>
          <div className="space-y-5">
            {VERIFICATION_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={`border-2 rounded-2xl p-6 ${step.color} flex items-start gap-5`}>
                  <div className="shrink-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${step.iconBg}`}>
                      <Icon className={`w-6 h-6 ${step.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-gray-400 tracking-widest">STEP {step.number}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What Verified / Not Verified means */}
        <section className="mb-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" /> ✓ Verified Means
            </h3>
            <ul className="space-y-2">
              {VERIFIED_INDICATORS.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" /> Not Verified Means
            </h3>
            <ul className="space-y-2">
              {NOT_VERIFIED_INDICATORS.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Your Rights as a User */}
        <section className="mb-14 bg-[#1E3A8A] rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-5">
            <Scale className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-xl font-bold">Your Rights as a LexIndia User</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Report any lawyer for suspected fraud — we act within 24 hours.',
              'Request a full refund if a lawyer misrepresents their credentials.',
              'Raise a complaint about unprofessional conduct anytime.',
              'Get a copy of your booking and consultation history.',
              'Request account deletion and data erasure under DPDPA 2023.',
              'Verify any lawyer directly with your State Bar Council.',
            ].map((right, i) => (
              <div key={i} className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <p className="text-blue-100 text-sm">{right}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Report / Contact CTA */}
        <section className="bg-gray-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#1E3A8A]" /> Report a Concern
            </h3>
            <p className="text-gray-500 text-sm">
              If you have a concern about a lawyer&apos;s credentials or conduct, our trust team is here to help.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/contact" className="bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-800 transition-colors">
              Contact Trust Team
            </Link>
            <Link href="/lawyers" className="border border-[#1E3A8A] text-[#1E3A8A] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
              Find Verified Lawyers
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

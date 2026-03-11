import type { Metadata } from 'next';
import { Scale, Target, Heart, Users, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About LexIndia | Our Mission to Make Legal Help Accessible',
  description: 'LexIndia is an Indian legal-tech platform on a mission to make legal help accessible, transparent, and affordable for every Indian citizen.',
  alternates: { canonical: '/about' },
};

const values = [
  {
    icon: Scale,
    title: 'Justice for All',
    desc: 'Legal help should not be a privilege of the few. We believe every Indian deserves access to quality legal guidance regardless of income or background.',
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    desc: 'Every lawyer on our platform is individually verified. We never promote misleading claims, fake reviews, or unverified assurances.',
  },
  {
    icon: Globe,
    title: 'Multilingual First',
    desc: 'India speaks many languages. LexIndia supports 14 Indian languages so that citizens can access legal help in their mother tongue.',
  },
  {
    icon: Heart,
    title: 'Public Utility',
    desc: 'Our knowledge base, Know Your Rights content, and legal guides are free and publicly accessible — no account required.',
  },
];

const pillars = [
  { label: 'Find a Verified Lawyer', desc: 'Search and book consultations with lawyers across India, filtered by specialization, city, language, and fee.', href: '/lawyers' },
  { label: 'Know Your Rights', desc: 'Free, plain-language content explaining your legal rights as a citizen, tenant, worker, or consumer under Indian law.', href: '/rights' },
  { label: 'Legal Templates', desc: 'Download and use professionally structured legal document templates for common legal situations.', href: '/templates' },
  { label: 'AI Legal Assistant', desc: 'Ask our AI assistant basic legal questions in English or Hindi — grounded in Indian law with instant responses.', href: '/' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-sm">Our Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Making Legal Help <br />
            <span className="text-[#D4AF37]">Accessible to Every Indian</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
            LexIndia was built on a simple belief: that navigating India&apos;s legal system should not require wealth,
            connections, or a law degree. We combine technology, multilingual content, and a verified lawyer network
            to give every citizen a fair shot at justice.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed">
            To bridge the gap between Indian citizens and quality legal help through technology — by connecting
            people with verified lawyers, providing free legal knowledge in local languages, and making the
            legal system less intimidating and more transparent for everyone.
          </p>
        </div>

        {/* What We Offer */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What LexIndia Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {pillars.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#1E3A8A] hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#1E3A8A] transition-colors">{p.label}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </Link>
          ))}
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1E3A8A]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Structure */}
        <div className="bg-gray-900 rounded-2xl p-8 text-white mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xl font-bold">About LexIndia</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            LexIndia is an Indian legal-technology platform. Our platform is operated in compliance with the
            Bar Council of India Rules regarding online legal services and advertisements.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-gray-200">Disclaimer:</strong> LexIndia is a technology intermediary, not a law firm.
            We do not provide legal advice. Lawyers on our platform are independent practitioners responsible for
            their own legal advice and services.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get legal help?</h2>
          <p className="text-gray-500 mb-6">Find a verified lawyer in your city or explore free legal resources.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lawyers"
              className="bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
            >
              Find a Lawyer
            </Link>
            <Link
              href="/knowledge"
              className="border border-[#1E3A8A] text-[#1E3A8A] px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Knowledge Base
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Shield, Users, Home, Briefcase, ShoppingCart, Heart, Smartphone, GraduationCap, ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Know Your Rights | LexIndia — Legal Rights for Indian Citizens',
  description: 'Understand your legal rights as an Indian citizen. Plain-language guides for women, tenants, workers, consumers, senior citizens, and more — in English and Hindi.',
  alternates: { canonical: '/rights' },
  keywords: ['know your rights India', 'legal rights India', 'tenant rights', 'worker rights', 'women rights law India'],
};

const personas = [
  {
    icon: Heart,
    title: "Women's Rights",
    slug: 'women',
    desc: 'Protection under DV Act, POSH Act, Section 498A, maintenance rights, and helplines.',
    topics: ['Domestic Violence Protection', 'Workplace Harassment (POSH)', 'Dowry & 498A', 'Maintenance & Alimony'],
    color: 'bg-pink-50 border-pink-200 hover:border-pink-400',
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-100',
  },
  {
    icon: Home,
    title: 'Tenant Rights',
    slug: 'tenants',
    desc: 'Your rights as a renter: eviction protection, security deposits, repairs, and rent agreements.',
    topics: ['Eviction Notice Rules', 'Security Deposit Recovery', 'Right to Repairs', 'Rental Agreement Essentials'],
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    icon: Briefcase,
    title: 'Workers & Labour Rights',
    slug: 'workers',
    desc: 'Minimum wage, PF/ESI entitlements, wrongful termination, gratuity, and workplace harassment.',
    topics: ['Minimum Wage Rights', 'PF & ESI Entitlements', 'Wrongful Termination', 'Gratuity & Benefits'],
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
  {
    icon: ShoppingCart,
    title: 'Consumer Rights',
    slug: 'consumers',
    desc: 'Consumer Protection Act 2019 — how to file complaints against defective products and services.',
    topics: ['Consumer Protection Act 2019', 'Filing a Consumer Complaint', 'E-commerce Disputes', 'Product Defect Claims'],
    color: 'bg-green-50 border-green-200 hover:border-green-400',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    icon: Users,
    title: 'Senior Citizen Rights',
    slug: 'seniors',
    desc: 'Maintenance obligations from children, property rights, healthcare entitlements, and elder abuse.',
    topics: ['Maintenance from Children', 'Property & Asset Rights', 'Healthcare Entitlements', 'Protection from Abuse'],
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    icon: Smartphone,
    title: 'Cybercrime Victims',
    slug: 'cybercrime',
    desc: 'Online fraud, social media harassment, data theft — how to report and what to do immediately.',
    topics: ['Online Financial Fraud', 'Social Media Harassment', 'Data Theft & Privacy', 'How to Report Cybercrime'],
    color: 'bg-red-50 border-red-200 hover:border-red-400',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
  },
  {
    icon: Shield,
    title: 'Arrested / Accused Rights',
    slug: 'arrested',
    desc: 'Your rights under Article 22, FIR filing, bail procedure, anticipatory bail, and legal aid.',
    topics: ['Rights at Time of Arrest', 'FIR Filing Rights', 'Bail Procedure', 'Free Legal Aid (NALSA)'],
    color: 'bg-slate-50 border-slate-200 hover:border-slate-400',
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100',
  },
  {
    icon: GraduationCap,
    title: 'Student Rights',
    slug: 'students',
    desc: 'Right to Education Act, university grievances, scholarship entitlements, and anti-ragging protection.',
    topics: ['Right to Education (RTE)', 'University Complaint Mechanism', 'Scholarship Rights', 'Anti-Ragging Protection'],
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
  },
];

const emergencyContacts = [
  { name: 'Police', number: '100' },
  { name: 'Women Helpline', number: '1091' },
  { name: 'NALSA (Free Legal Aid)', number: '15100' },
  { name: 'Cybercrime Helpline', number: '1930' },
  { name: 'Senior Citizen Helpline', number: '14567' },
];

export default function RightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-sm">Know Your Rights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Your Legal Rights as an Indian Citizen
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mb-8">
            Plain-language guides to help you understand your rights under Indian law — for women, workers,
            tenants, consumers, and more. No jargon. No legal degree required.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">Free to Read</span>
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">No Registration Required</span>
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">English & Hindi</span>
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">Government Source Links</span>
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="font-semibold text-sm">Emergency Helplines:</span>
            </div>
            {emergencyContacts.map((c) => (
              <a key={c.number} href={`tel:${c.number}`} className="text-sm hover:underline">
                {c.name}: <strong>{c.number}</strong>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Personas Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Situation</h2>
          <p className="text-gray-500">Choose the category that best matches your current legal concern.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.slug}
                href={`/rights/${p.slug}`}
                className={`block bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-md group ${p.color}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${p.iconBg}`}>
                  <Icon className={`w-5 h-5 ${p.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#1E3A8A] transition-colors">{p.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">{p.desc}</p>
                <ul className="space-y-1">
                  {p.topics.map((t) => (
                    <li key={t} className="text-xs text-gray-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] group-hover:gap-2 transition-all">
                  Read your rights <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-blue-900 text-white rounded-2xl p-6">
            <h3 className="font-bold mb-2">Free Legal Aid</h3>
            <p className="text-blue-300 text-sm mb-4">Every Indian citizen has the right to free legal aid if they cannot afford a lawyer — guaranteed under Article 39A.</p>
            <a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] text-sm font-semibold hover:underline">
              Visit NALSA Website →
            </a>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Not Sure Where to Start?</h3>
            <p className="text-gray-500 text-sm mb-4">Tell us about your situation and we&apos;ll help you find the right rights category, template, and lawyer.</p>
            <Link href="/" className="text-[#1E3A8A] text-sm font-semibold hover:underline">
              Ask the AI Assistant →
            </Link>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Need a Lawyer?</h3>
            <p className="text-gray-500 text-sm mb-4">Reading about your rights is the first step. Book a consultation with a verified lawyer for your specific case.</p>
            <Link href="/lawyers" className="text-[#1E3A8A] text-sm font-semibold hover:underline">
              Find a Verified Lawyer →
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-amber-800 text-sm">
            <strong>Important:</strong> The information on this page is for general educational purposes only and does not constitute legal advice.
            Laws vary by state, situation, and circumstances. Always consult a qualified lawyer for your specific legal matter.
          </p>
        </div>
      </div>
    </div>
  );
}

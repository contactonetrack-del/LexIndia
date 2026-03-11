import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Scale, Shield, Briefcase, Home, ShoppingCart, Users, FileText } from 'lucide-react';
import { LeadCapture } from '@/components/ui/LeadCapture';

export const metadata: Metadata = {
  title: 'Legal Guides | LexIndia — Plain-Language Indian Law Explained',
  description: 'Free plain-language legal guides covering criminal law, family law, property, consumer rights, labour law, and more — written for Indian citizens.',
  alternates: { canonical: '/guides' },
  keywords: ['legal guides India', 'Indian law explained', 'legal help India', 'know your rights guide'],
};

const guideCategories = [
  {
    icon: Shield,
    title: 'Emergency & Accidents',
    slug: 'emergency-law',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    guides: [
      { title: 'Road Accidents: Immediate Legal Steps & What NOT to Do', slug: 'road-accident-emergency', readTime: 7 },
    ],
  },
  {
    icon: Scale,
    title: 'Criminal Law',
    slug: 'criminal-law',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    guides: [
      { title: 'What to Do When Arrested by Police in India', slug: 'arrested-by-police', readTime: 8 },
      { title: 'How to File an FIR: Step-by-Step Guide', slug: 'how-to-file-fir', readTime: 6 },
      { title: 'Understanding Bail: Types and How to Get Bail', slug: 'understanding-bail', readTime: 7 },
      { title: 'Anticipatory Bail: When and How to Apply', slug: 'anticipatory-bail', readTime: 6 },
      { title: 'Free Legal Aid Under NALSA: Who Qualifies', slug: 'free-legal-aid-nalsa', readTime: 5 },
    ],
  },
  {
    icon: Users,
    title: 'Family Law',
    slug: 'family-law',
    color: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-100',
    guides: [
      { title: 'Divorce in India: Mutual Consent vs Contested', slug: 'divorce-india-guide', readTime: 10 },
      { title: 'Child Custody Laws in India Explained', slug: 'child-custody-india', readTime: 8 },
      { title: 'Maintenance and Alimony: Your Rights After Divorce', slug: 'maintenance-alimony-rights', readTime: 7 },
      { title: 'Marriage Registration in India: How to Register', slug: 'marriage-registration-india', readTime: 5 },
      { title: 'Domestic Violence Act 2005: A Complete Guide', slug: 'domestic-violence-act-guide', readTime: 9 },
    ],
  },
  {
    icon: Home,
    title: 'Property Law',
    slug: 'property-law',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    guides: [
      { title: 'Tenant Rights in India: What Your Landlord Cannot Do', slug: 'tenant-rights-india', readTime: 8 },
      { title: 'Property Registration: Process and Documents Needed', slug: 'property-registration-guide', readTime: 7 },
      { title: 'How to Dispute an Illegal Eviction', slug: 'illegal-eviction-dispute', readTime: 6 },
      { title: 'Property Inheritance Laws in India', slug: 'property-inheritance-india', readTime: 9 },
      { title: 'RERA: Your Rights as a Home Buyer', slug: 'rera-home-buyer-rights', readTime: 7 },
    ],
  },
  {
    icon: ShoppingCart,
    title: 'Consumer Law',
    slug: 'consumer-law',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    guides: [
      { title: 'How to File a Consumer Court Complaint in India', slug: 'file-consumer-complaint', readTime: 7 },
      { title: 'E-Commerce Fraud: Getting a Refund From Flipkart/Amazon', slug: 'ecommerce-refund-fraud', readTime: 6 },
      { title: 'Insurance Claim Rejection: How to Contest It', slug: 'insurance-claim-rejection', readTime: 7 },
      { title: 'Defective Product Claims Under Consumer Protection Act', slug: 'defective-product-claim', readTime: 6 },
    ],
  },
  {
    icon: Briefcase,
    title: 'Labour & Employment',
    slug: 'labour-law',
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    guides: [
      { title: 'Wrongful Termination in India: Your Options', slug: 'wrongful-termination-india', readTime: 8 },
      { title: 'PF (Provident Fund): How to Withdraw and Claim', slug: 'pf-withdrawal-claim-guide', readTime: 6 },
      { title: 'Gratuity: Who Gets It and How to Claim', slug: 'gratuity-claim-guide', readTime: 5 },
      { title: 'POSH Act: Filing a Sexual Harassment Complaint at Work', slug: 'posh-act-complaint-guide', readTime: 8 },
    ],
  },
  {
    icon: FileText,
    title: 'Civil & General',
    slug: 'civil-law',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    guides: [
      { title: 'How to File an RTI (Right to Information) Application', slug: 'how-to-file-rti', readTime: 6 },
      { title: 'Cybercrime Reporting in India: Step-by-Step', slug: 'cybercrime-reporting-india', readTime: 7 },
      { title: 'How to Write a Legal Notice', slug: 'how-to-write-legal-notice', readTime: 5 },
    ],
  },
];

export default function GuidesPage() {
  const totalGuides = guideCategories.reduce((sum, c) => sum + c.guides.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-sm">Free Legal Guides</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Understand Indian Law — Simply</h1>
          <p className="text-blue-200 text-lg max-w-2xl mb-6">
            {totalGuides}+ plain-language legal guides covering every major area of Indian law.
            No jargon. Written by legal professionals. Free forever.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">No Registration</span>
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">Plain Language</span>
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">Reviewed by Lawyers</span>
            <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full border border-white/20">Updated Regularly</span>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-amber-800 text-xs">
              <strong>Informational Only:</strong> These guides explain general Indian law. They are not legal advice. Consult a{' '}
              <Link href="/lawyers" className="underline font-medium">verified lawyer</Link>{' '}
              for your specific situation.
            </p>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {guideCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.slug}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.iconBg}`}>
                    <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{cat.title}</h2>
                  <span className="text-sm text-gray-400">{cat.guides.length} guides</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.guides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className={`bg-white border-2 rounded-xl p-5 hover:shadow-md transition-all group ${cat.color} hover:border-opacity-80`}
                    >
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-3 group-hover:text-[#1E3A8A] transition-colors">
                        {guide.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{guide.readTime} min read</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1E3A8A] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lead Capture */}
        <div className="mt-16 mb-8">
          <LeadCapture />
        </div>

        {/* CTA */}
        <div className="mt-12 bg-[#1E3A8A] rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Need Help With Your Specific Case?</h2>
          <p className="text-blue-200 mb-6 text-sm">Reading a guide is the first step. Get personalised advice from a verified Indian lawyer.</p>
          <Link href="/lawyers" className="inline-block bg-[#D4AF37] text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
            Find a Verified Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}

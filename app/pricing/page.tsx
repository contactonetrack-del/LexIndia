import React from 'react';
import { Check, X, Shield, Users, BarChart, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Lawyer Pricing & Plans | LexIndia',
  description: 'Join LexIndia\'s verified legal network. Compare pricing plans and features for lawyers to grow their practice online.',
};

export default function PricingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "LexIndia Lawyer Pricing",
    "description": "Compare pricing plans and features for lawyers to grow their practice online.",
    "publisher": {
      "@type": "Organization",
      "name": "LexIndia"
    }
  };

  const plans = [
    {
      name: 'Basic Listing',
      price: 'Free',
      period: 'Forever',
      description: 'Perfect for new lawyers starting their online journey.',
      features: [
        'Public directory listing',
        'Basic profile (Bio & Experience)',
        'Bar Council Verification Badge',
        'Standard search visibility',
      ],
      missing: [
        'Direct appointment booking',
        'Client reviews & ratings',
        'Dashboard analytics',
        'Priority search placement',
      ],
      cta: 'Create Free Profile',
      href: '/verify-lawyers',
      popular: false,
    },
    {
      name: 'Pro Advocate',
      price: '₹1,499',
      period: '/month',
      description: 'Everything you need to grow your practice and manage clients.',
      features: [
        'Public directory listing',
        'Enhanced profile with multimedia',
        'Bar Council Verification Badge',
        'Direct appointment booking system',
        'Client reviews & rating system',
        'Automated email notifications',
        'Dashboard analytics & insights',
      ],
      missing: [
        'Priority search placement',
      ],
      cta: 'Start Pro Trial',
      href: '/verify-lawyers',
      popular: true,
    },
    {
      name: 'Elite Partner',
      price: '₹3,999',
      period: '/month',
      description: 'Maximum visibility and dedicated support for established firms.',
      features: [
        'Everything in Pro Advocate',
        'Priority placement in search results',
        'Featured in specialized guides',
        'Publish articles on LexIndia Knowledge Base',
        'Dedicated account manager',
        'Custom lead-generation analytics',
        'API access for firm integration',
      ],
      missing: [],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <JsonLd data={schema} />

      {/* Hero Section */}
      <section className="bg-[#1E3A8A] text-white pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/legalbg/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Grow Your Legal Practice with LexIndia</h1>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of verified lawyers. Get discovered by clients actively seeking legal representation, manage appointments, and build your digital reputation.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-transform hover:-translate-y-2 duration-300 flex flex-col ${
                plan.popular ? 'border-[#D4AF37] relative transform md:-translate-y-4 md:hover:-translate-y-6' : 'border-transparent hover:border-blue-100'
              }`}
            >
              {plan.popular && (
                <div className="bg-[#D4AF37] text-gray-900 text-sm font-bold uppercase tracking-widest text-center py-2 absolute top-0 inset-x-0">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 mb-6 min-h-[48px]">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 font-medium"> {plan.period}</span>
                </div>
                <Link 
                  href={plan.href}
                  className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-colors ${
                    plan.popular 
                      ? 'bg-[#1E3A8A] text-white hover:bg-blue-800 shadow-md hover:shadow-lg' 
                      : 'bg-blue-50 text-[#1E3A8A] hover:bg-blue-100'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex-1">
                <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">What&apos;s included:</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.missing.length > 0 && (
                  <ul className="space-y-4 opacity-50">
                    {plan.missing.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-gray-500 line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Lawyers Choose LexIndia</h2>
          <p className="text-lg text-gray-600">Built specifically for the needs of the modern Indian legal practice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">High-Intent Clients</h3>
            <p className="text-gray-600">Our content-first approach attracts citizens actively seeking representation, not just browsing.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] rounded-xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted Verification</h3>
            <p className="text-gray-600">The &quot;Verified by Bar Council&quot; badge dramatically increases client trust and conversion rates.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] rounded-xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Save Admin Time</h3>
            <p className="text-gray-600">Automated appointment scheduling and email reminders reduce your administrative burden.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-blue-50 text-[#1E3A8A] rounded-xl flex items-center justify-center mx-auto mb-6">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Analytics</h3>
            <p className="text-gray-600">Track profile views, consultation requests, and client conversion metrics in real-time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto text-[#D4AF37] mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to elevate your practice?</h2>
          <p className="text-lg text-gray-600 mb-10">
            Join the fastest-growing network of verified legal professionals in India. Verification takes less than 24 hours.
          </p>
          <Link 
            href="/verify-lawyers" 
            className="inline-block bg-[#1E3A8A] text-white font-bold px-10 py-4 rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 text-lg"
          >
            Start Verification Process
          </Link>
        </div>
      </section>
    </div>
  );
}

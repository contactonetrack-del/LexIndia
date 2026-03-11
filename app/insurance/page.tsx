import React from 'react';
import Link from 'next/link';
import { Shield, Heart, Car, Home, Briefcase, Plane, BookOpen, CheckCircle } from 'lucide-react';
import JsonLd from '@/components/JsonLd';

export default function InsuranceHub() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "LexIndia Insurance Hub",
    "description": "Compare and buy the best insurance policies in India. Health, Life, Motor, and Travel insurance.",
    "publisher": {
      "@type": "Organization",
      "name": "LexIndia"
    }
  };

  const categories = [
    { name: 'Health Insurance', icon: Heart, href: '/insurance/health', desc: 'Protect your family against medical emergencies.', color: 'bg-rose-50 text-rose-600' },
    { name: 'Term Life Insurance', icon: Shield, href: '#', desc: 'Secure your family\'s financial future.', color: 'bg-blue-50 text-blue-600' },
    { name: 'Motor Insurance', icon: Car, href: '#', desc: 'Comprehensive cover for your car or bike.', color: 'bg-orange-50 text-orange-600' },
    { name: 'Travel Insurance', icon: Plane, href: '#', desc: 'Travel the world worry-free.', color: 'bg-teal-50 text-teal-600' },
    { name: 'Home Insurance', icon: Home, href: '#', desc: 'Protect your most valuable asset.', color: 'bg-purple-50 text-purple-600' },
    { name: 'Business Insurance', icon: Briefcase, href: '#', desc: 'Safeguard your enterprise.', color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <JsonLd data={schema} />

      {/* Hero Section */}
      <div className="bg-[#1E3A8A] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Compare & Buy the Best Insurance in India</h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Make informed financial decisions. Compare premiums, claim settlement ratios, and benefits side-by-side.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={cat.href} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-gray-600">{cat.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-10">Why Choose LexIndia Insurance?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Unbiased Comparison</h3>
            <p className="text-gray-600 text-sm">We don&apos;t favor any provider. Compare policies objectively based on your needs.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Expert Knowledge</h3>
            <p className="text-gray-600 text-sm">Our guides are written by certified insurance experts to help you understand the fine print.</p>
          </div>
          <div>
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-[#1E3A8A]" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">IRDAI Compliant</h3>
            <p className="text-gray-600 text-sm">We strictly adhere to all IRDAI guidelines to ensure your data and transactions are secure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


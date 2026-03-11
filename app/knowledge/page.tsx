'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, BookOpen, Shield, Scale, AlertTriangle,
  ChevronDown, ChevronUp, ExternalLink, Landmark, Smartphone
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { FAQSkeleton } from '@/components/ui/Skeletons';
import { LeadCapture } from '@/components/ui/LeadCapture';
import { ConsultationCTA } from '@/components/ui/ConsultationCTA';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  faqs: FAQ[];
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Arrest Rights': Shield,
  'Domestic Violence': AlertTriangle,
  'Consumer Rights': BookOpen,
};

export default function KnowledgeBase() {
  const { lang, isIndic } = useLanguage();
  const t = getTranslation(lang);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/knowledge')
      .then(r => r.json())
      .then(data => { setCategories(data.categories || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const filtered = categories.map(cat => ({
    ...cat,
    faqs: searchQuery
      ? cat.faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : cat.faqs,
  })).filter(cat => cat.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${isIndic ? 'font-hindi' : ''}`}>
            {t.knowledge.title}
          </h1>
          <p className={`text-lg text-gray-600 mb-8 ${isIndic ? 'font-hindi' : ''}`}>
            {t.knowledge.subtitle}
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            <label htmlFor="knowledge-search" className="sr-only">Search legal topics</label>
            <input
              id="knowledge-search"
              type="text"
              placeholder={t.knowledge.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none transition-all shadow-sm text-lg"
            />
          </div>
        </div>

        {/* Free Legal Aid Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Free Legal Aid (NALSA)</h3>
              <p className="text-gray-600 text-sm">
                Women, children, SC/ST members, industrial workmen, and persons with an annual income less than ₹3,000,000 are eligible for free legal aid.
              </p>
            </div>
          </div>
          <a
            href="https://nalsa.gov.in/lsams/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2"
          >
            Apply for Free Aid <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <ConsultationCTA 
          title="Have a specific question not covered here?"
          description="A short 15 minute call with a top-rated attorney can clear up any confusion and build your confidence."
          buttonText="Talk to a Lawyer"
        />

        {/* Official Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Official Government Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="https://services.ecourts.gov.in/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-[#1E3A8A] transition-colors group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1E3A8A] transition-colors">
                <Landmark className="w-6 h-6 text-[#1E3A8A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">eCourts Services <ExternalLink className="w-4 h-4 text-gray-400" /></h3>
              <p className="text-gray-600 text-sm">Check case status, court orders, and cause lists across all District Courts in India.</p>
            </a>
            <a href="https://www.tele-law.in/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-[#1E3A8A] transition-colors group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1E3A8A] transition-colors">
                <Smartphone className="w-6 h-6 text-[#1E3A8A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">Tele-Law <ExternalLink className="w-4 h-4 text-gray-400" /></h3>
              <p className="text-gray-600 text-sm">Pre-litigation advice through video conferencing by panel lawyers for marginalized communities.</p>
            </a>
          </div>
        </div>

        {/* FAQs from DB */}
        <div className="space-y-8">
          {isLoading ? (
            <FAQSkeleton />
          ) : filtered.length === 0 ? (
            <div className={`text-center py-12 text-gray-500 ${isIndic ? 'font-hindi' : ''}`}>
              {searchQuery ? `${t.common.noResults} "${searchQuery}"` : t.common.noResults}
            </div>
          ) : (
            filtered.map((section) => {
              const Icon = CATEGORY_ICONS[section.name] ?? BookOpen;
              return (
                <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                    <Icon className="w-6 h-6 text-[#1E3A8A]" aria-hidden="true" />
                    <h2 className="text-xl font-bold text-gray-900">{section.name}</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {section.faqs.map((item) => {
                      const isOpen = openQ === item.id;
                      return (
                        <div key={item.id} className="px-6 py-4">
                          <button
                            onClick={() => setOpenQ(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                            className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] rounded"
                          >
                            <h3 className="text-lg font-medium text-gray-900 pr-4">{item.question}</h3>
                            {isOpen
                              ? <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" aria-hidden="true" />
                              : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" aria-hidden="true" />}
                          </button>
                          {isOpen && (
                            <div className="mt-4 text-gray-600 leading-relaxed">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lead Capture */}
        <div className="mt-16 mb-8">
          <LeadCapture />
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Can&apos;t find what you&apos;re looking for?</p>
          <Link href="/lawyers" className="inline-flex bg-[#D4AF37] text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-500 transition-colors">
            Talk to a Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}

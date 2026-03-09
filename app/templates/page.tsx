'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, ShieldAlert, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  downloads: number;
}

const CATEGORIES = ['All', 'Criminal', 'Civil Rights', 'Civil / Corporate', 'Property', 'General'];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeCategory !== 'All') params.set('category', activeCategory);

    fetch(`/api/templates?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setTemplates(data.templates || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [searchQuery, activeCategory]);

  const formatDownloads = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k+`;
    return n.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Legal Document Templates
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download standard legal formats and drafts. Review by a lawyer before official use.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
          <label htmlFor="template-search" className="sr-only">Search templates</label>
          <input
            id="template-search"
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8" role="group" aria-label="Filter by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> These templates are provided as general guides. Laws vary by state. We recommend having a verified LexIndia lawyer review your filled document before submission.
          </p>
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="w-16 h-6 bg-gray-200 rounded" />
                </div>
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6 mt-1" />
              </div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">No templates found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {templates.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1E3A8A]">
                    <FileText className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">{doc.category}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1">{doc.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Download className="w-3 h-3" aria-hidden="true" /> {formatDownloads(doc.downloads)} downloads
                  </span>
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(`# ${doc.title}\n\nThis is a sample template. Please consult a lawyer before use.\n\n[Insert Content Here]`)}`}
                    download={`${doc.id}-template.txt`}
                    aria-label={`Download ${doc.title} as text file`}
                    className="text-[#1E3A8A] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" /> TXT
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upsell Banner */}
        <div className="bg-[#1E3A8A] rounded-2xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Need help drafting a custom document?</h2>
            <p className="text-blue-200">Get a verified lawyer to draft or review your legal notices, agreements, and complaints.</p>
          </div>
          <Link href="/lawyers" className="shrink-0 bg-[#D4AF37] text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-500 transition-colors flex items-center gap-2">
            Find a Lawyer <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

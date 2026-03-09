'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import {
  Search, MapPin, Star, Filter, CheckCircle, Video, Phone,
  MessageSquare, Clock, ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { LawyersGridSkeleton } from '@/components/ui/Skeletons';

interface Lawyer {
  id: string;
  city: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  isVerified: boolean;
  user: { name: string | null; image: string | null; email: string | null };
  languages: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
  modes: { id: string; mode: string }[];
}

const SPECIALIZATIONS = [
  'Criminal Law', 'Family Law', 'Property Law', 'Corporate Law',
  'Civil Law', 'Consumer Protection', 'Cyber Law',
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Rating: High to Low' },
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'experience', label: 'Experience: High to Low' },
];

function LawyersContent() {
  const { lang, isIndic } = useLanguage();
  const t = getTranslation(lang);
  const searchParams = useSearchParams();

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchLaw, setSearchLaw] = useState(searchParams.get('q') || '');
  const [searchCity, setSearchCity] = useState(searchParams.get('loc') || '');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('rating');

  const fetchLawyers = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchLaw) params.set('search', searchLaw);
    if (searchCity) params.set('city', searchCity);
    if (selectedSpec) params.set('specialization', selectedSpec);
    if (verifiedOnly) params.set('verified', 'true');

    try {
      const res = await fetch(`/api/lawyers?${params.toString()}`);
      const data = await res.json();
      let results: Lawyer[] = data.lawyers || [];

      // Client-side sort after server filter
      if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
      else if (sort === 'fee_asc') results.sort((a, b) => a.consultationFee - b.consultationFee);
      else if (sort === 'experience') results.sort((a, b) => b.experienceYears - a.experienceYears);

      setLawyers(results);
    } catch (err) {
      console.error('Failed to fetch lawyers:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchLaw, searchCity, selectedSpec, verifiedOnly, sort]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLawyers();
  };

  const clearFilters = () => {
    setSelectedSpec('');
    setVerifiedOnly(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Search */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-6 ${isIndic ? 'font-hindi' : ''}`}>
            {t.categories.title}
          </h1>

          <form onSubmit={handleSearch} className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-[#1E3A8A] focus-within:ring-1 focus-within:ring-[#1E3A8A] transition-all">
              <Search className="w-5 h-5 text-gray-400" />
              <label htmlFor="search-law" className="sr-only">Search by specialization or name</label>
              <input
                id="search-law"
                type="text"
                value={searchLaw}
                onChange={(e) => setSearchLaw(e.target.value)}
                placeholder={t.hero.searchLaw}
                className={`w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 py-3 px-3 outline-none ${isIndic ? 'font-hindi' : ''}`}
              />
            </div>
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-[#1E3A8A] focus-within:ring-1 focus-within:ring-[#1E3A8A] transition-all">
              <MapPin className="w-5 h-5 text-gray-400" />
              <label htmlFor="search-city" className="sr-only">Search by city</label>
              <input
                id="search-city"
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder={t.hero.searchCity}
                className={`w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 py-3 px-3 outline-none ${isIndic ? 'font-hindi' : ''}`}
              />
            </div>
            <button
              type="submit"
              className={`bg-[#1E3A8A] text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.hero.searchBtn}
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            aria-expanded={isMobileFilterOpen}
            aria-controls="filter-panel"
            className="lg:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-medium text-gray-700"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter className="w-5 h-5" />
            {t.lawyersPage.filters} {selectedSpec || verifiedOnly ? '(active)' : ''}
          </button>

          {/* Sidebar Filters */}
          <aside
            id="filter-panel"
            className={`lg:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden'} lg:block`}
            aria-label="Filter lawyers"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t.lawyersPage.filters}</h2>
                <button onClick={clearFilters} className={`text-sm text-[#1E3A8A] font-medium hover:underline ${isIndic ? 'font-hindi' : ''}`}>
                  {t.lawyersPage.clearFilters}
                </button>
              </div>

              {/* Specialization */}
              <div className="mb-6">
                <h3 className={`font-semibold text-gray-900 mb-3 ${isIndic ? 'font-hindi' : ''}`}>Specialization</h3>
                <div className="space-y-2">
                  {SPECIALIZATIONS.map((spec) => (
                    <label key={spec} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSpec === spec}
                        onChange={() => setSelectedSpec(selectedSpec === spec ? '' : spec)}
                        className="w-4 h-4 rounded border-gray-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                      />
                      <span className="text-gray-700 text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div className="mb-6">
                <h3 className={`font-semibold text-gray-900 mb-3 ${isIndic ? 'font-hindi' : ''}`}>Verification</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={() => setVerifiedOnly(!verifiedOnly)}
                    className="w-4 h-4 rounded border-gray-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <span className="text-gray-700 text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {t.lawyersPage.verifiedOnly}
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Lawyer Listings */}
          <div className="lg:w-3/4 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 font-medium">
                {isLoading ? t.common.loading : `${lawyers.length} ${t.categories.lawyers}`}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="sr-only">Sort lawyers by</label>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                <select
                  id="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border-gray-200 rounded-lg focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <LawyersGridSkeleton count={4} />
            ) : lawyers.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <h3 className={`text-xl font-bold text-gray-900 mb-2 ${isIndic ? 'font-hindi' : ''}`}>{t.lawyersPage.noLawyers}</h3>
                <p className={`text-gray-500 ${isIndic ? 'font-hindi' : ''}`}>Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <button onClick={clearFilters} className={`mt-4 text-[#1E3A8A] font-medium hover:underline ${isIndic ? 'font-hindi' : ''}`}>
                  {t.lawyersPage.clearFilters}
                </button>
              </div>
            ) : (
              lawyers.map((lawyer) => (
                <article key={lawyer.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6">
                  <div className="flex gap-4 sm:w-2/3">
                    <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 bg-gray-100">
                      {lawyer.user.image ? (
                        <Image src={lawyer.user.image} alt={lawyer.user.name ?? 'Lawyer'} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                          {(lawyer.user.name ?? 'L')[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{lawyer.user.name}</h3>
                        {lawyer.isVerified && (
                          <CheckCircle className="w-5 h-5 text-green-500" aria-label="Verified lawyer" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {lawyer.city}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lawyer.experienceYears} {t.lawyersPage.experience.split(' ')[0] || 'Years'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {lawyer.specializations.map(spec => (
                          <span key={spec.id} className="bg-blue-50 text-[#1E3A8A] text-xs font-medium px-2.5 py-1 rounded-md">
                            {spec.name}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className={`font-medium text-gray-700 ${isIndic ? 'font-hindi' : ''}`}>{t.lawyersPage.languages || 'Speaks'}:</span> {lawyer.languages.map(l => l.name).join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-1/3 flex flex-col justify-between sm:items-end border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                    <div className="flex flex-col sm:items-end mb-4 sm:mb-0">
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-sm font-bold mb-2">
                        <Star className="w-4 h-4 fill-current" /> {lawyer.rating.toFixed(1)}
                        <span className="font-normal text-green-600 ml-1">({lawyer.reviewCount})</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">₹{lawyer.consultationFee}</div>
                      <div className="text-xs text-gray-500">per consultation</div>
                    </div>

                    <div className="w-full space-y-2">
                      <div className="flex justify-center gap-3 mb-2" aria-label="Available consultation modes">
                        {lawyer.modes.some(m => m.mode === 'VIDEO') && <Video className="w-5 h-5 text-gray-400" aria-hidden="true" />}
                        {lawyer.modes.some(m => m.mode === 'CALL') && <Phone className="w-5 h-5 text-gray-400" aria-hidden="true" />}
                        {lawyer.modes.some(m => m.mode === 'CHAT') && <MessageSquare className="w-5 h-5 text-gray-400" aria-hidden="true" />}
                      </div>
                      <Link
                        href={`/book/${lawyer.id}`}
                        className="block w-full text-center bg-[#1E3A8A] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        {t.lawyersPage.bookConsultation}
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LawyersDirectory() {
  return (
    <Suspense fallback={<LawyersGridSkeleton count={4} />}>
      <LawyersContent />
    </Suspense>
  );
}

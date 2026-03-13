'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';
import { localizeHref } from '@/lib/i18n/navigation';
import type { Translation } from '@/lib/translations';

export function SearchForm({ t }: { t: Translation }) {
  const router = useRouter();
  const { lang, fontClass } = useLanguage();
  const copy = localizeTreeFromMemory(
    {
      popularSearchesLabel: 'Popular Searches:',
    } as const,
    lang
  );
  const [searchLaw, setSearchLaw] = useState('');
  const [searchCity, setSearchCity] = useState('');
  
  const [showLawDropdown, setShowLawDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const lawRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const legalSpecializations = [
    { query: 'Criminal Law', label: t.categories.c1 },
    { query: 'Family Law', label: t.categories.c2 },
    { query: 'Property Law', label: t.categories.c3 },
    { query: 'Corporate Law', label: t.categories.c4 },
    { query: 'Civil Law', label: t.categories.c5 },
    { query: 'Cyber Law', label: t.categories.c6 },
  ];

  const cities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];
  const quickSearches = [
    { query: 'Criminal Law', label: t.categories.c1 },
    { query: 'Family Law', label: t.categories.c2 },
    { query: 'Property Law', label: t.categories.c3 },
  ];

  const filteredLaw = legalSpecializations.filter((entry) =>
    entry.label.toLowerCase().includes(searchLaw.toLowerCase())
  );
  const filteredCity = cities.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));

  const resolveSearchQuery = (value: string) =>
    legalSpecializations.find(
      (entry) =>
        entry.label.toLowerCase() === value.toLowerCase() ||
        entry.query.toLowerCase() === value.toLowerCase()
    )?.query ?? value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lawRef.current && !lawRef.current.contains(event.target as Node)) setShowLawDropdown(false);
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setShowCityDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLaw) params.append('q', resolveSearchQuery(searchLaw));
    if (searchCity) params.append('loc', searchCity);
    router.push(localizeHref(`/lawyers?${params.toString()}`, lang));
  };

  const executeQuickSearch = (query: string) => {
    router.push(localizeHref(`/lawyers?q=${encodeURIComponent(query)}`, lang));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-4xl mx-auto w-full mb-10"
    >
      <div className="bg-primary/10 backdrop-blur-md p-2 rounded-2xl border border-primary-foreground/25 shadow-2xl flex flex-col sm:flex-row gap-2 mb-4">
        {/* Specialization Autocomplete */}
        <div ref={lawRef} className="relative flex-1">
          <div className="flex h-14 items-center rounded-xl border-2 border-transparent bg-background px-4 transition-all focus-within:border-accent">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchLaw}
              onChange={(e) => { setSearchLaw(e.target.value); setShowLawDropdown(true); }}
              onFocus={() => setShowLawDropdown(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.hero.searchLaw}
              className={`w-full bg-transparent border-none px-3 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 ${fontClass}`}
            />
          </div>
          <AnimatePresence>
            {showLawDropdown && filteredLaw.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto overflow-hidden rounded-xl border border-border bg-background py-2 shadow-xl"
              >
                {filteredLaw.map((item) => (
                  <button
                    key={item.query}
                    onClick={() => { setSearchLaw(item.label); setShowLawDropdown(false); }}
                    className="w-full border-b border-border px-5 py-3 text-left text-muted-foreground transition-colors last:border-0 hover:bg-surface-hover hover:text-foreground"
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* City Autocomplete */}
        <div ref={cityRef} className="relative flex-1">
          <div className="flex h-14 items-center rounded-xl border-2 border-transparent bg-background px-4 transition-all focus-within:border-accent">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => { setSearchCity(e.target.value); setShowCityDropdown(true); }}
              onFocus={() => setShowCityDropdown(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.hero.searchCity}
              className={`w-full bg-transparent border-none px-3 py-3 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 ${fontClass}`}
            />
          </div>
          <AnimatePresence>
            {showCityDropdown && filteredCity.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-background rounded-xl shadow-xl border border-border overflow-hidden z-50 py-2 max-h-60 overflow-y-auto"
              >
                {filteredCity.map(item => (
                  <button
                    key={item}
                    onClick={() => { setSearchCity(item); setShowCityDropdown(false); }}
                    className="w-full border-b border-border px-5 py-3 text-left text-muted-foreground transition-colors last:border-0 hover:bg-surface-hover hover:text-foreground"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={handleSearch} className={`flex h-14 items-center justify-center whitespace-nowrap rounded-xl bg-accent px-8 font-bold text-accent-foreground shadow-lg transition-colors hover:opacity-90 ${fontClass}`}>
          {t.hero.searchBtn}
        </button>
      </div>

      <div className={`flex flex-wrap items-center justify-center gap-3 px-2 text-sm text-primary-foreground/80 sm:justify-start ${fontClass}`}>
        <span className="opacity-80">{copy.popularSearchesLabel}</span>
        {quickSearches.map((item) => (
          <button
            key={item.query}
            onClick={() => executeQuickSearch(item.query)}
            className="rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 transition-colors hover:text-primary-foreground"
          >
            {item.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

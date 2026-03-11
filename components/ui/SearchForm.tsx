'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

export function SearchForm({ t, isIndic }: { t: any, isIndic: boolean }) {
  const router = useRouter();
  const [searchLaw, setSearchLaw] = useState('');
  const [searchCity, setSearchCity] = useState('');
  
  const [showLawDropdown, setShowLawDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const lawRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const legalSpecializations = [
    'Criminal Lawyer', 'Family Lawyer', 'Corporate Lawyer', 'Property Lawyer',
    'Civil Lawyer', 'Cyber Crime', 'Divorce & Customary', 'Taxation', 'Immigration', 'Labor & Employment'
  ];

  const cities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const filteredLaw = legalSpecializations.filter(s => s.toLowerCase().includes(searchLaw.toLowerCase()));
  const filteredCity = cities.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));

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
    if (searchLaw) params.append('q', searchLaw);
    if (searchCity) params.append('loc', searchCity);
    router.push(`/lawyers?${params.toString()}`);
  };

  const executeQuickSearch = (query: string) => {
    router.push(`/lawyers?q=${encodeURIComponent(query)}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-4xl mx-auto w-full mb-10"
    >
      <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2 mb-4">
        {/* Specialization Autocomplete */}
        <div ref={lawRef} className="relative flex-1">
          <div className="flex items-center px-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-transparent focus-within:border-[#D4AF37] dark:focus-within:border-[#D4AF37] transition-all h-14">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchLaw}
              onChange={(e) => { setSearchLaw(e.target.value); setShowLawDropdown(true); }}
              onFocus={() => setShowLawDropdown(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.hero.searchLaw}
              className={`w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-3 px-3 outline-none ${isIndic ? 'font-hindi' : ''}`}
            />
          </div>
          <AnimatePresence>
            {showLawDropdown && filteredLaw.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 py-2 max-h-60 overflow-y-auto"
              >
                {filteredLaw.map(item => (
                  <button
                    key={item}
                    onClick={() => { setSearchLaw(item); setShowLawDropdown(false); }}
                    className="w-full text-left px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* City Autocomplete */}
        <div ref={cityRef} className="relative flex-1">
          <div className="flex items-center px-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-transparent focus-within:border-[#D4AF37] dark:focus-within:border-[#D4AF37] transition-all h-14">
            <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => { setSearchCity(e.target.value); setShowCityDropdown(true); }}
              onFocus={() => setShowCityDropdown(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={t.hero.searchCity}
              className={`w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-3 px-3 outline-none ${isIndic ? 'font-hindi' : ''}`}
            />
          </div>
          <AnimatePresence>
            {showCityDropdown && filteredCity.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 py-2 max-h-60 overflow-y-auto"
              >
                {filteredCity.map(item => (
                  <button
                    key={item}
                    onClick={() => { setSearchCity(item); setShowCityDropdown(false); }}
                    className="w-full text-left px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    {item}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={handleSearch} className={`h-14 bg-[#D4AF37] text-gray-900 font-bold px-8 rounded-xl hover:bg-yellow-500 transition-colors whitespace-nowrap flex items-center justify-center shadow-lg ${isIndic ? 'font-hindi' : ''}`}>
          {t.hero.searchBtn}
        </button>
      </div>

      {/* Popular Searches */}
      <div className="text-sm text-blue-100 flex flex-wrap items-center justify-center sm:justify-start gap-3 px-2">
        <span className="opacity-80">Popular Searches:</span>
        <button onClick={() => executeQuickSearch('Criminal')} className="hover:text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 transition-colors backdrop-blur-sm">Criminal Defense</button>
        <button onClick={() => executeQuickSearch('Divorce')} className="hover:text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 transition-colors backdrop-blur-sm">Divorce filing</button>
        <button onClick={() => executeQuickSearch('Property')} className="hover:text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 transition-colors backdrop-blur-sm">Property Registration</button>
      </div>
    </motion.div>
  );
}

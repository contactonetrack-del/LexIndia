'use client';

import React, { useState } from 'react';
import { Search, MapPin, MessageSquare, BookOpen, FileText, Star, ChevronRight, Shield, Users, Briefcase, Home, Lock, Scale } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/lib/translations';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';

export default function HomePage() {
  const { lang, isIndic } = useLanguage();
  const t = getTranslation(lang);
  const router = useRouter();
  const { openAuthModal } = useAuth();

  const [searchLaw, setSearchLaw] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLaw) params.append('q', searchLaw);
    if (searchCity) params.append('loc', searchCity);
    router.push(`/lawyers?${params.toString()}`);
  };

  return (
    <div className="flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1E3A8A] to-blue-800 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/legal/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 ${isIndic ? 'font-hindi' : ''}`}>
            {t.hero.title}
          </h1>
          <p className={`text-xl md:text-2xl text-blue-200 mb-10 ${lang === 'en' ? 'font-hindi' : ''}`}>
            {t.hero.subtitle}
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-xl p-2 shadow-lg flex flex-col sm:flex-row gap-2 mb-10">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37] transition-all">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchLaw}
                onChange={(e) => setSearchLaw(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t.hero.searchLaw}
                className={`w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 py-3 px-3 outline-none ${isIndic ? 'font-hindi' : ''}`}
              />
            </div>
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37] transition-all">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t.hero.searchCity}
                className={`w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 py-3 px-3 outline-none ${isIndic ? 'font-hindi' : ''}`}
              />
            </div>
            <button onClick={handleSearch} className={`bg-[#D4AF37] text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors whitespace-nowrap flex items-center justify-center ${isIndic ? 'font-hindi' : ''}`}>
              {t.hero.searchBtn}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'CITIZEN' })}
              className={`w-full sm:w-auto bg-white text-[#1E3A8A] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-md ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.hero.forCitizens}
            </button>
            <button
              onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'LAWYER' })}
              className={`w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.hero.forLawyers}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.features.title}</h2>
            <p className={`text-lg text-gray-600 max-w-2xl mx-auto ${isIndic ? 'font-hindi' : ''}`}>{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: t.features.f1Title, desc: t.features.f1Desc },
              { icon: MessageSquare, title: t.features.f2Title, desc: t.features.f2Desc },
              { icon: BookOpen, title: t.features.f3Title, desc: t.features.f3Desc },
              { icon: FileText, title: t.features.f4Title, desc: t.features.f4Desc }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-[#1E3A8A]">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isIndic ? 'font-hindi' : ''}`}>{feature.title}</h3>
                <p className={`text-gray-600 leading-relaxed ${isIndic ? 'font-hindi' : ''}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.howItWorks.title}</h2>
            <p className={`text-lg text-gray-600 ${isIndic ? 'font-hindi' : ''}`}>{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200 z-0"></div>

            {[
              { step: '1', title: t.howItWorks.s1Title, desc: t.howItWorks.s1Desc },
              { step: '2', title: t.howItWorks.s2Title, desc: t.howItWorks.s2Desc },
              { step: '3', title: t.howItWorks.s3Title, desc: t.howItWorks.s3Desc }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border-4 border-[#1E3A8A] rounded-full flex items-center justify-center text-3xl font-bold text-[#1E3A8A] mb-6 shadow-sm">
                  {item.step}
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-3 ${isIndic ? 'font-hindi' : ''}`}>{item.title}</h3>
                <p className={`text-gray-600 max-w-xs ${isIndic ? 'font-hindi' : ''}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyer Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.categories.title}</h2>
              <p className={`text-lg text-gray-600 ${isIndic ? 'font-hindi' : ''}`}>{t.categories.subtitle}</p>
            </div>
            <Link href="/lawyers" className="hidden sm:flex items-center text-[#1E3A8A] font-medium hover:text-blue-700 transition-colors">
              <span className={isIndic ? 'font-hindi' : ''}>{t.categories.viewAll}</span> <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: t.categories.c1, count: `1,240+ ${t.categories.lawyers}` },
              { icon: Users, title: t.categories.c2, count: `850+ ${t.categories.lawyers}` },
              { icon: Home, title: t.categories.c3, count: `1,120+ ${t.categories.lawyers}` },
              { icon: Briefcase, title: t.categories.c4, count: `630+ ${t.categories.lawyers}` },
              { icon: Scale, title: t.categories.c5, count: `1,500+ ${t.categories.lawyers}` },
              { icon: Lock, title: t.categories.c6, count: `420+ ${t.categories.lawyers}` },
            ].map((cat, idx) => (
              <Link key={idx} href="/lawyers" className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#1E3A8A] hover:shadow-md transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#1E3A8A] group-hover:text-white rounded-lg flex items-center justify-center text-[#1E3A8A] transition-colors">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold text-gray-900 group-hover:text-[#1E3A8A] transition-colors ${isIndic ? 'font-hindi' : ''}`}>{cat.title}</h3>
                  <p className={`text-sm text-gray-500 ${isIndic ? 'font-hindi' : ''}`}>{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/lawyers" className="inline-flex items-center text-[#1E3A8A] font-medium hover:text-blue-700 transition-colors">
              <span className={isIndic ? 'font-hindi' : ''}>{t.categories.viewAll}</span> <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials & CTA */}
      <section className="py-24 bg-[#1E3A8A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-900 rounded-full opacity-50 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isIndic ? 'font-hindi' : ''}`}>{t.testimonials.title}</h2>
              <p className={`text-xl text-blue-200 mb-10 max-w-lg ${isIndic ? 'font-hindi' : ''}`}>
                {t.testimonials.subtitle}
              </p>
              <button
                onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'CITIZEN' })}
                className={`inline-block bg-[#D4AF37] text-gray-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-500 transition-colors shadow-lg text-lg ${isIndic ? 'font-hindi' : ''}`}
              >
                {t.testimonials.startBtn}
              </button>
            </div>

            {/* Testimonial Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl">
              <div className="flex gap-1 text-[#D4AF37] mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className={`text-lg md:text-xl font-medium leading-relaxed mb-8 ${isIndic ? 'font-hindi' : ''}`}>
                &quot;{t.testimonials.quote}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden relative">
                  <Image src="https://picsum.photos/seed/user1/100/100" alt="User" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="font-semibold">Rajesh Kumar</h4>
                  <p className={`text-blue-200 text-sm ${isIndic ? 'font-hindi' : ''}`}>{t.testimonials.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, MessageSquare, BookOpen, FileText, Star, ChevronRight, Shield, Users, Briefcase, Home, Lock, Scale, CheckCircle } from 'lucide-react';

function StatsBar() {
  const [stats, setStats] = useState({ lawyers: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || stats.verified === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100 text-sm sm:text-base border-t border-white/10 pt-8 mt-12 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-[#D4AF37]" />
        <span><strong className="text-white text-lg">{stats.lawyers}+</strong> Total Lawyers</span>
      </div>
      <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20"></div>
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span><strong className="text-white text-lg">{stats.verified}+</strong> Verified Profiles</span>
      </div>
      <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20"></div>
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-[#D4AF37]" />
        <span><strong className="text-white text-lg">24/7</strong> AI Assistance</span>
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { getTranslation } from '@/lib/translations';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { PartnerLogos } from '@/components/ui/PartnerLogos';
import { TestimonialsCarousel } from '@/components/ui/Testimonials';
import { SearchForm } from '@/components/ui/SearchForm';
import { useABTest } from '@/hooks/useABTest';

export default function HomePage() {
  const { lang, isIndic } = useLanguage();
  const t = getTranslation(lang);
  const { openAuthModal } = useAuth();
  const heroVariant = useABTest('homepage_hero');

  return (
    <div className="flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1E3A8A] to-blue-800 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero-bg.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 ${isIndic ? 'font-hindi' : ''}`}
          >
            {heroVariant === 'B' ? t.hero.titleB : t.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className={`text-xl md:text-2xl text-blue-200 mb-10 ${lang === 'en' ? 'font-hindi' : ''}`}
          >
            {heroVariant === 'B' ? t.hero.subtitleB : t.hero.subtitle}
          </motion.p>

          {/* Search Bar */}
          <SearchForm t={t} isIndic={isIndic} />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'CITIZEN' })}
              className={`w-full sm:w-auto bg-white text-[#1E3A8A] px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors shadow-md ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.hero.forCitizens}
            </button>
            <button
              onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'LAWYER' })}
              className={`w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 dark:hover:bg-white/20 transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.hero.forLawyers}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <StatsBar />
          </motion.div>
        </div>
      </section>

      <PartnerLogos />

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold text-gray-900 dark:text-white mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.features.title}</h2>
            <p className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${isIndic ? 'font-hindi' : ''}`}>{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Search, title: t.features.f1Title, desc: t.features.f1Desc },
              { icon: MessageSquare, title: t.features.f2Title, desc: t.features.f2Desc },
              { icon: BookOpen, title: t.features.f3Title, desc: t.features.f3Desc },
              { icon: FileText, title: t.features.f4Title, desc: t.features.f4Desc }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-[#1E3A8A] dark:text-blue-400">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-semibold text-gray-900 dark:text-white mb-3 ${isIndic ? 'font-hindi' : ''}`}>{feature.title}</h3>
                <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${isIndic ? 'font-hindi' : ''}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold text-gray-900 dark:text-white mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.howItWorks.title}</h2>
            <p className={`text-lg text-gray-600 dark:text-gray-300 ${isIndic ? 'font-hindi' : ''}`}>{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-200 dark:bg-gray-700 z-0"></div>

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
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className={`text-3xl font-bold text-gray-900 dark:text-white mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.categories.title}</h2>
              <p className={`text-lg text-gray-600 dark:text-gray-300 ${isIndic ? 'font-hindi' : ''}`}>{t.categories.subtitle}</p>
            </div>
            <Link href="/lawyers" className="hidden sm:flex items-center text-[#1E3A8A] dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              <span className={isIndic ? 'font-hindi' : ''}>{t.categories.viewAll}</span> <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: t.categories.c1, href: '/lawyers?q=criminal' },
              { icon: Users, title: t.categories.c2, href: '/lawyers?q=family' },
              { icon: Home, title: t.categories.c3, href: '/lawyers?q=property' },
              { icon: Briefcase, title: t.categories.c4, href: '/lawyers?q=corporate' },
              { icon: Scale, title: t.categories.c5, href: '/lawyers?q=civil' },
              { icon: Lock, title: t.categories.c6, href: '/lawyers?q=cyber' },
            ].map((cat, idx) => (
              <Link key={idx} href={cat.href} className="group bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#1E3A8A] dark:hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 group-hover:bg-[#1E3A8A] dark:group-hover:bg-blue-500 group-hover:text-white rounded-lg flex items-center justify-center text-[#1E3A8A] dark:text-blue-400 transition-colors">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors ${isIndic ? 'font-hindi' : ''}`}>{cat.title}</h3>
                  <p className={`text-sm text-gray-400 dark:text-gray-500 ${isIndic ? 'font-hindi' : ''}`}>Search verified lawyers →</p>
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

      <TestimonialsCarousel />

      {/* Trust & Verification Section */}
      <section className="py-24 bg-[#1E3A8A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-800 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-900 rounded-full opacity-50 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isIndic ? 'font-hindi' : ''}`}>{t.testimonials.title}</h2>
              <p className={`text-xl text-blue-200 mb-6 max-w-lg ${isIndic ? 'font-hindi' : ''}`}>
                {t.testimonials.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'CITIZEN' })}
                  className={`inline-block bg-[#D4AF37] text-gray-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-500 transition-colors shadow-lg text-lg ${isIndic ? 'font-hindi' : ''}`}
                >
                  {t.testimonials.startBtn}
                </button>
                <Link
                  href="/verify-lawyers"
                  className="inline-block border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors text-lg text-center"
                >
                  How We Verify Lawyers
                </Link>
              </div>
            </div>

            {/* Trust Signals Panel */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl">
              <h3 className="text-lg font-bold mb-5 text-[#D4AF37]">🔒 Our Verification Process</h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Identity Verification', desc: 'Every lawyer submits Aadhaar + Bar Council ID before listing.' },
                  { step: '02', title: 'Bar Council Check', desc: 'We cross-verify Bar Council Enrolment Number with state records.' },
                  { step: '03', title: 'Manual Review', desc: 'Our team reviews documents. Only approved lawyers get the ✓ badge.' },
                  { step: '04', title: 'Ongoing Monitoring', desc: 'Ratings and reviews are monitored. Any complaint triggers re-review.' },
                ].map(v => (
                  <div key={v.step} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37] text-gray-900 font-bold text-xs flex items-center justify-center shrink-0">{v.step}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{v.title}</p>
                      <p className="text-blue-200 text-xs mt-0.5">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/verify-lawyers" className="mt-5 block text-center text-xs text-blue-300 hover:text-white underline">
                Read full verification policy →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
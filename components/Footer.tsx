'use client';

import React from 'react';
import { Scale } from 'lucide-react';
import Link from 'next/link';
import { getTranslation } from '@/lib/translations';
import { useLanguage } from '@/lib/LanguageContext';

export default function Footer() {
  const { lang, isIndic } = useLanguage();
  const t = getTranslation(lang);

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-xl font-bold text-white tracking-tight">LexIndia</span>
            </div>
            <p className={`text-sm ${isIndic ? 'font-hindi' : ''}`}>{t.footer.desc}</p>
          </div>
          <div>
            <h4 className={`text-white font-semibold mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.footer.forCitizens}</h4>
            <ul className={`space-y-2 text-sm ${isIndic ? 'font-hindi' : ''}`}>
              <li><Link href="/lawyers" className="hover:text-white transition-colors">{t.footer.findLawyer}</Link></li>
              <li><Link href="/knowledge" className="hover:text-white transition-colors">{t.footer.knowledge}</Link></li>
              <li><Link href="/guides" className="hover:text-white transition-colors">Legal Guides</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">{t.footer.templates}</Link></li>
              <li><Link href="/rights" className="hover:text-white transition-colors">{t.footer.rights}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-white font-semibold mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.footer.forLawyers}</h4>
            <ul className={`space-y-2 text-sm ${isIndic ? 'font-hindi' : ''}`}>
              <li><Link href="/for-lawyers" className="hover:text-white transition-colors">{t.footer.joinDir}</Link></li>
              <li><Link href="/dashboard/lawyer" className="hover:text-white transition-colors">{t.footer.dashboard}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{t.footer.pricing}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className={`text-white font-semibold mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.footer.company}</h4>
            <ul className={`space-y-2 text-sm ${isIndic ? 'font-hindi' : ''}`}>
              <li><Link href="/about" className="hover:text-white transition-colors">{t.footer.about}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t.footer.contact}</Link></li>
              <li><Link href="/verify-lawyers" className="hover:text-white transition-colors">Verification Policy</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className={isIndic ? 'font-hindi' : ''}>&copy; {new Date().getFullYear()} LexIndia. {t.footer.rightsRes}</p>
          <div className="mt-4 md:mt-0 text-xs max-w-xl text-center md:text-right space-y-2">

            <p className="text-gray-500">
              <strong>{t.footer.disclaimer}</strong>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Scale, Globe, ChevronDown, Search, Check, User, LogOut, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { languageNames, getTranslation, Language } from '@/lib/translations';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
  const { lang, setLang, isIndic } = useLanguage();
  const { logout, openAuthModal } = useAuth();
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() ?? null;
  const router = useRouter();

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = getTranslation(lang);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    setIsLangMenuOpen(false);
    setLangSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const filteredLanguages = (Object.entries(languageNames) as [Language, string][]).filter(([_, name]) =>
    name.toLowerCase().includes(langSearchQuery.toLowerCase())
  );

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Scale className="w-8 h-8 text-[#1E3A8A]" />
          <span className="text-2xl font-bold text-[#1E3A8A] tracking-tight">LexIndia</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link href="/lawyers" className={`text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap ${isIndic ? 'font-hindi' : ''}`}>{t.nav.lawyers}</Link>
          <Link href="/knowledge" className={`text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap ${isIndic ? 'font-hindi' : ''}`}>{t.nav.knowledge}</Link>
          <Link href="/guides" className={`text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap ${isIndic ? 'font-hindi' : ''}`}>Legal Guides</Link>
          <Link href="/templates" className={`text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap ${isIndic ? 'font-hindi' : ''}`}>{t.nav.templates}</Link>
          <Link href="/rights" className={`text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-blue-400 font-medium transition-colors whitespace-nowrap ${isIndic ? 'font-hindi' : ''}`}>{t.nav.rights}</Link>
          <Link href="/pricing" className={`text-[#D4AF37] hover:text-[#B8962D] dark:text-[#E5C158] dark:hover:text-[#F3D573] font-bold transition-colors whitespace-nowrap ${isIndic ? 'font-hindi' : ''}`}>For Lawyers</Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          <ThemeToggle />

          {/* Language Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-[#1E3A8A] dark:hover:text-blue-400 font-medium transition-colors px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              aria-label="Select Language"
              aria-expanded={isLangMenuOpen}
              aria-haspopup="listbox"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm hidden sm:block font-semibold">{languageNames[lang].split(' ')[0]}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 flex flex-col transform origin-top-right transition-all">
                <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t.common?.search + "..."}
                      value={langSearchQuery}
                      onChange={(e) => setLangSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {filteredLanguages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-1">
                      {filteredLanguages.map(([code, name]) => (
                        <button
                          key={code}
                          onClick={() => handleLanguageSelect(code)}
                          className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${lang === code ? 'bg-blue-50 text-[#1E3A8A] font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <span>{name}</span>
                          {lang === code && <Check className="w-4 h-4 text-[#1E3A8A]" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No languages found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!userRole ? (
            <>
              <button
                onClick={() => openAuthModal()}
                className={`hidden sm:block text-[#1E3A8A] font-medium hover:text-blue-700 transition-colors ${isIndic ? 'font-hindi' : ''}`}
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => openAuthModal()}
                className={`hidden sm:block bg-[#1E3A8A] text-white px-4 sm:px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm text-sm sm:text-base ${isIndic ? 'font-hindi' : ''}`}
              >
                {t.nav.signup}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={`/dashboard/${userRole}`}
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-[#1E3A8A] font-medium transition-colors"
              >
                <User className="w-5 h-5" />
                {t.dashboard?.title || 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:block p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-[#1E3A8A] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white absolute w-full shadow-lg">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            <Link
              href="/lawyers"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.nav.lawyers}
            </Link>
            <Link
              href="/knowledge"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.nav.knowledge}
            </Link>
            <Link
              href="/templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.nav.templates}
            </Link>
            <Link
              href="/guides"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              Legal Guides
            </Link>
            <Link
              href="/rights"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-gray-600 hover:text-[#1E3A8A] font-medium transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              {t.nav.rights}
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-[#D4AF37] hover:text-[#B8962D] font-bold transition-colors ${isIndic ? 'font-hindi' : ''}`}
            >
              For Lawyers
            </Link>

            {!userRole ? (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 sm:hidden">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className={`text-center text-[#1E3A8A] font-medium hover:text-blue-700 transition-colors py-2 ${isIndic ? 'font-hindi' : ''}`}
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className={`text-center bg-[#1E3A8A] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors shadow-sm ${isIndic ? 'font-hindi' : ''}`}
                >
                  {t.nav.signup}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 sm:hidden">
                <Link
                  href={`/dashboard/${userRole}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 text-gray-700 hover:text-[#1E3A8A] font-medium transition-colors py-2"
                >
                  <User className="w-5 h-5" />
                  {t.dashboard?.title || 'Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 font-medium transition-colors py-2 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

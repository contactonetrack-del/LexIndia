'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronRight,
  FileText,
  Home,
  Landmark,
  Lock,
  MessageSquare,
  Scale,
  Search,
  Shield,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';

import LocaleLink from '@/components/LocaleLink';
import { PartnerLogos } from '@/components/ui/PartnerLogos';
import { SearchForm } from '@/components/ui/SearchForm';
import { TestimonialsCarousel } from '@/components/ui/Testimonials';
import { useAuth } from '@/lib/AuthContext';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { getPageFallbackContent } from '@/lib/content/page-fallbacks';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { useABTest } from '@/hooks/useABTest';

function StatsBar({
  lawyersLabel,
  verifiedLabel,
}: {
  lawyersLabel: string;
  verifiedLabel: string;
}) {
  const [stats, setStats] = useState({ lawyers: 0, verified: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || stats.verified === 0) return null;

  return (
    <div className="mx-auto mt-12 flex w-full max-w-4xl flex-wrap items-center justify-center gap-6 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/85 sm:text-base">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-accent" />
        <span>
          <strong className="text-lg text-primary-foreground">{stats.lawyers}+</strong> {lawyersLabel}
        </span>
      </div>
      <div className="hidden h-1.5 w-1.5 rounded-full bg-primary-foreground/30 sm:block" />
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-success" />
        <span>
          <strong className="text-lg text-primary-foreground">{stats.verified}+</strong> {verifiedLabel}
        </span>
      </div>
      <div className="hidden h-1.5 w-1.5 rounded-full bg-primary-foreground/30 sm:block" />
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-accent" />
        <span>
          <strong className="text-lg text-primary-foreground">24/7</strong> AI
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { lang, fontClass } = useLanguage();
  const t = getTranslation(lang);
  const { openAuthModal } = useAuth();
  const heroVariant = useABTest('homepage_hero');
  const isEnglish = lang === 'en';
  const useVariantB = isEnglish && heroVariant === 'B';
  const verifyLawyersLabel = getPageFallbackContent('verifyLawyers', lang).title;
  const verificationProcessTitle = 'Our verification process';
  const verificationPolicyLabel = 'Read full verification policy';
  const discoveryCopy = localizeTreeFromMemory(
    {
      title: 'Start with the right legal path',
      subtitle:
        'Use the right surface for the right problem: issue-led guidance, procedural guides, or reviewed law sections.',
      rightsTitle: 'Know your rights',
      rightsBody: 'Start with issue-led summaries if you are not sure which law or process applies.',
      guidesTitle: 'Follow practical guides',
      guidesBody: 'Move through FIR, bail, consumer, RTI, and family-law procedures step by step.',
      lawsTitle: 'Browse Indian laws',
      lawsBody: 'Read reviewed act summaries and plain-English section explainers.',
    } as const,
    lang
  );

  const categoryCards = [
    { icon: Shield, title: t.categories.c1, href: '/lawyers?q=criminal' },
    { icon: Users, title: t.categories.c2, href: '/lawyers?q=family' },
    { icon: Home, title: t.categories.c3, href: '/lawyers?q=property' },
    { icon: Briefcase, title: t.categories.c4, href: '/lawyers?q=corporate' },
    { icon: Scale, title: t.categories.c5, href: '/lawyers?q=civil' },
    { icon: Lock, title: t.categories.c6, href: '/lawyers?q=cyber' },
  ];

  return (
    <div className="flex flex-col font-sans">
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 py-20 text-primary-foreground lg:py-32">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl ${fontClass}`}
          >
            {useVariantB ? t.hero.titleB : t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className={`mb-10 text-xl text-primary-foreground/80 md:text-2xl ${fontClass}`}
          >
            {useVariantB ? t.hero.subtitleB : t.hero.subtitle}
          </motion.p>

          <SearchForm t={t} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'CITIZEN' })}
              className={`w-full rounded-lg bg-background px-8 py-3 font-semibold text-primary shadow-md transition-colors hover:bg-surface sm:w-auto ${fontClass}`}
            >
              {t.hero.forCitizens}
            </button>
            <button
              onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'LAWYER' })}
              className={`w-full rounded-lg border-2 border-primary-foreground/40 bg-transparent px-8 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 sm:w-auto ${fontClass}`}
            >
              {t.hero.forLawyers}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <StatsBar lawyersLabel={t.categories.lawyers} verifiedLabel={t.dashboard.statsVerified} />
          </motion.div>
        </div>
      </section>

      <PartnerLogos />

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={`mb-4 text-3xl font-bold text-foreground ${fontClass}`}>
              {t.features.title}
            </h2>
            <p className={`mx-auto max-w-2xl text-lg text-muted-foreground ${fontClass}`}>
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: t.features.f1Title, desc: t.features.f1Desc },
              { icon: MessageSquare, title: t.features.f2Title, desc: t.features.f2Desc },
              { icon: BookOpen, title: t.features.f3Title, desc: t.features.f3Desc },
              { icon: FileText, title: t.features.f4Title, desc: t.features.f4Desc },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className={`mb-3 text-xl font-semibold text-foreground ${fontClass}`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed text-muted-foreground ${fontClass}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className={`mb-4 text-3xl font-bold text-foreground ${fontClass}`}>
              {discoveryCopy.title}
            </h2>
            <p className={`mx-auto max-w-3xl text-lg text-muted-foreground ${fontClass}`}>
              {discoveryCopy.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <LocaleLink
              href="/rights"
              className="rounded-2xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <Shield className="mb-5 h-7 w-7 text-primary" />
              <h3 className={`mb-3 text-xl font-semibold text-foreground ${fontClass}`}>
                {discoveryCopy.rightsTitle}
              </h3>
              <p className={`text-muted-foreground ${fontClass}`}>{discoveryCopy.rightsBody}</p>
            </LocaleLink>

            <LocaleLink
              href="/guides"
              className="rounded-2xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <BookOpen className="mb-5 h-7 w-7 text-primary" />
              <h3 className={`mb-3 text-xl font-semibold text-foreground ${fontClass}`}>
                {discoveryCopy.guidesTitle}
              </h3>
              <p className={`text-muted-foreground ${fontClass}`}>{discoveryCopy.guidesBody}</p>
            </LocaleLink>

            <LocaleLink
              href="/laws"
              data-testid="homepage-laws-link"
              className="rounded-2xl border border-border bg-surface p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <Landmark className="mb-5 h-7 w-7 text-primary" />
              <h3 className={`mb-3 text-xl font-semibold text-foreground ${fontClass}`}>
                {discoveryCopy.lawsTitle}
              </h3>
              <p className={`text-muted-foreground ${fontClass}`}>{discoveryCopy.lawsBody}</p>
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className={`mb-4 text-3xl font-bold text-foreground ${fontClass}`}>
              {t.howItWorks.title}
            </h2>
            <p className={`text-lg text-muted-foreground ${fontClass}`}>
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="absolute left-[15%] right-[15%] top-12 z-0 hidden h-0.5 bg-border md:block" />
            {[
              { step: '1', title: t.howItWorks.s1Title, desc: t.howItWorks.s1Desc },
              { step: '2', title: t.howItWorks.s2Title, desc: t.howItWorks.s2Desc },
              { step: '3', title: t.howItWorks.s3Title, desc: t.howItWorks.s3Desc },
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary bg-surface text-3xl font-bold text-primary shadow-sm">
                  {item.step}
                </div>
                <h3 className={`mb-3 text-xl font-semibold text-foreground ${fontClass}`}>
                  {item.title}
                </h3>
                <p className={`max-w-xs text-muted-foreground ${fontClass}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className={`mb-4 text-3xl font-bold text-foreground ${fontClass}`}>
                {t.categories.title}
              </h2>
              <p className={`text-lg text-muted-foreground ${fontClass}`}>
                {t.categories.subtitle}
              </p>
            </div>
            <LocaleLink
              href="/lawyers"
              className="hidden items-center font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
            >
              <span className={fontClass}>{t.categories.viewAll}</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </LocaleLink>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCards.map((card) => (
              <LocaleLink
                key={card.href}
                href={card.href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold text-foreground transition-colors group-hover:text-primary ${fontClass}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm text-muted-foreground ${fontClass}`}>
                    {t.footer.findLawyer}
                  </p>
                </div>
              </LocaleLink>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <LocaleLink href="/lawyers" className="inline-flex items-center font-medium text-primary transition-colors hover:text-primary/80">
              <span className={fontClass}>{t.categories.viewAll}</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </LocaleLink>
          </div>
        </div>
      </section>

      {isEnglish && <TestimonialsCarousel />}

      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-primary-foreground/15 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-primary-foreground/10 opacity-50 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className={`mb-6 text-3xl font-bold md:text-4xl ${fontClass}`}>
                {t.testimonials.title}
              </h2>
              <p className={`mb-6 max-w-lg text-xl text-primary-foreground/80 ${fontClass}`}>
                {t.testimonials.subtitle}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => openAuthModal({ initialTab: 'register', initialRole: 'CITIZEN' })}
                  className={`inline-block rounded-lg bg-accent px-8 py-4 text-lg font-bold text-accent-foreground shadow-lg transition-opacity hover:opacity-90 ${fontClass}`}
                >
                  {t.testimonials.startBtn}
                </button>
                {isEnglish && (
                  <LocaleLink
                    href="/verify-lawyers"
                    className="inline-block rounded-lg border-2 border-primary-foreground/40 px-8 py-4 text-center text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
                  >
                    {verifyLawyersLabel}
                  </LocaleLink>
                )}
              </div>
            </div>

            {isEnglish ? (
              <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-8 backdrop-blur-lg">
                <h3 className="mb-5 text-lg font-bold text-accent">{verificationProcessTitle}</h3>
                <div className="space-y-4">
                  {[
                    {
                      step: '01',
                      title: 'Identity Verification',
                      desc: 'Every lawyer submits Aadhaar and Bar Council ID before listing.',
                    },
                    {
                      step: '02',
                      title: 'Bar Council Check',
                      desc: 'We cross-check the enrolment number against official state records.',
                    },
                    {
                      step: '03',
                      title: 'Manual Review',
                      desc: 'Only approved profiles receive the verified badge on LexIndia.',
                    },
                    {
                      step: '04',
                      title: 'Ongoing Monitoring',
                      desc: 'Ratings and complaints are monitored to keep the directory reliable.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {item.step}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-primary-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs text-primary-foreground/80">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <LocaleLink
                  href="/verify-lawyers"
                  className="mt-5 block text-center text-xs text-primary-foreground/80 underline transition-colors hover:text-primary-foreground"
                >
                  {verificationPolicyLabel}
                </LocaleLink>
              </div>
            ) : (
              <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-8 backdrop-blur-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <p className={`text-sm leading-relaxed text-primary-foreground/85 ${fontClass}`}>
                    {t.dashboard.statsVerified} {t.nav.lawyers}. {t.footer.findLawyer}.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

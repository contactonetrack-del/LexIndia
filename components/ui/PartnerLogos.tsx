'use client';

import React from 'react';
import { motion } from 'motion/react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

const partners = [
  { name: 'LiveLaw', logo: 'LiveLaw' },
  { name: 'BarAndBench', logo: 'Bar & Bench' },
  { name: 'LegalEra', logo: 'Legal Era' },
  { name: 'IndiaLegal', logo: 'India Legal' },
  { name: 'LawOctopus', logo: 'LawOctopus' },
];

export function PartnerLogos() {
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(
    {
      headline: 'Trusted by top legal professionals and featured in',
    } as const,
    lang
  );

  return (
    <section className="overflow-hidden border-b border-border bg-surface py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          {copy.headline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 md:gap-16">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="cursor-default text-xl font-bold text-muted-foreground transition-colors hover:text-primary md:text-2xl"
            >
              {partner.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

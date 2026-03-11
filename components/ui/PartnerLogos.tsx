import React from 'react';
import { motion } from 'motion/react';

const partners = [
  { name: 'LiveLaw', logo: '⚖️ LiveLaw' },
  { name: 'BarAndBench', logo: '🏛️ Bar & Bench' },
  { name: 'LegalEra', logo: '📰 Legal Era' },
  { name: 'IndiaLegal', logo: '🇮🇳 India Legal' },
  { name: 'LawOctopus', logo: '🐙 LawOctopus' },
];

export function PartnerLogos() {
  return (
    <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted by Top Legal Professionals & Featured In
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-xl md:text-2xl font-bold text-gray-700 hover:text-[#1E3A8A] transition-colors cursor-default"
            >
              {partner.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

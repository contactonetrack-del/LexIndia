import type { Metadata } from 'next';
import LegalDisclaimer from '@/components/LegalDisclaimer';

export const metadata: Metadata = {
  title: 'Legal Knowledge Base — FAQs & Guides | LexIndia',
  description: 'India\'s legal FAQ library — plain-language answers to common legal questions on criminal law, property, family, consumer rights, employment, and more. Reviewed by verified lawyers.',
  keywords: ['legal FAQ India', 'legal questions India', 'know your rights', 'Indian law explained', 'legal information India'],
  alternates: { canonical: '/knowledge' },
  openGraph: {
    title: 'Legal Knowledge Base — FAQs & Guides | LexIndia',
    description: 'Plain-language answers to common Indian legal questions, reviewed by verified lawyers.',
    url: '/knowledge',
    type: 'website',
  },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LegalDisclaimer />
      {children}
    </>
  );
}

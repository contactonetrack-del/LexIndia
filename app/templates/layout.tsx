import type { Metadata } from 'next';
import LegalDisclaimer from '@/components/LegalDisclaimer';

export const metadata: Metadata = {
  title: 'Free Legal Document Templates India | LexIndia',
  description: 'Download free legal document templates for India — rent agreements, legal notices, affidavits, employee agreements, and more. Drafted in compliance with Indian law.',
  keywords: ['legal templates India', 'free legal documents', 'rent agreement template', 'legal notice template', 'affidavit template India', 'Indian legal forms'],
  alternates: { canonical: '/templates' },
  openGraph: {
    title: 'Free Legal Document Templates India | LexIndia',
    description: 'Download free Indian legal document templates: rent agreements, notices, affidavits, and more.',
    url: '/templates',
    type: 'website',
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LegalDisclaimer />
      {children}
    </>
  );
}

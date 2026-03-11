import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Consultation | LexIndia',
  description: 'Book a legal consultation with a verified Indian lawyer on LexIndia. Choose your date, time, and consultation mode — video, call, or chat.',
  robots: 'noindex', // Booking pages should not be indexed
  openGraph: {
    title: 'Book a Legal Consultation | LexIndia',
    description: 'Schedule a consultation with a verified Indian lawyer.',
    type: 'website',
  },
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

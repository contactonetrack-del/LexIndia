import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Verified Lawyers in India | LexIndia',
  description: 'Search and connect with verified lawyers across India. Filter by specialization, city, consultation mode (video, call, chat), language, and fee. All lawyers are Bar Council verified.',
  keywords: ['find lawyer India', 'verified lawyers', 'online legal consultation', 'Bar Council lawyer', 'advocate near me', 'criminal lawyer India', 'family lawyer India'],
  alternates: { canonical: '/lawyers' },
  openGraph: {
    title: 'Find Verified Lawyers in India | LexIndia',
    description: 'Search verified advocates across India by city, specialization, and consultation mode.',
    url: '/lawyers',
    type: 'website',
  },
};

export default function LawyersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

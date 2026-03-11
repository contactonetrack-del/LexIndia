import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'LexIndia | Get Legal Help in Minutes',
  description: 'Connect with verified top-rated lawyers across India. Instantly book video consultations, access legal templates, and chat with our 24/7 AI Legal Assistant.',
  keywords: 'legal help India, find lawyer, online consultation lawyer, legal rights India, LexIndia, verified lawyers, legal expert advice, Indian law guide',
  openGraph: {
    title: 'LexIndia | Get Legal Help in Minutes',
    description: 'Connect with verified top-rated lawyers across India. Instantly book video consultations, access legal templates, and chat with our 24/7 AI Legal Assistant.',
    url: 'https://lexindia.vercel.app',
    siteName: 'LexIndia',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://lexindia.vercel.app',
  }
};

export default function Page() {
  return <HomePageClient />;
}

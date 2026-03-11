import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lawyer Profile | LexIndia — Book a Verified Indian Lawyer',
  description: 'View the profile of a verified Indian lawyer on LexIndia. See their specializations, experience, consultation fee, languages, and book a video, call, or chat consultation.',
  openGraph: {
    title: 'Lawyer Profile | LexIndia',
    description: 'View lawyer profile and book a consultation on LexIndia. Verified Bar Council enrollment, transparent fees.',
    type: 'profile',
  },
};

export default function LawyerProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

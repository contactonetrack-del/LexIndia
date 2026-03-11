import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AuthProvider } from '@/lib/AuthContext';
import { NextAuthProvider } from '@/components/SessionProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import MobileNav from '@/components/MobileNav';
import AuthModalWrapper from '@/components/AuthModalWrapper';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SkipToContent from '@/components/SkipToContent';
import { SocialProofToast } from '@/components/ui/SocialProofToast';
import { ClientMotionConfig } from '@/components/ClientMotionConfig';
import { AriaAnnouncerProvider } from '@/components/AriaAnnouncer';
import AccessibilityControls from '@/components/AccessibilityControls';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ExitIntentPopup } from '@/components/ui/ExitIntentPopup';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari'],
  variable: '--font-hindi',
});

export const metadata: Metadata = {
  title: 'LexIndia | Get Legal Help in Minutes',
  description: 'A comprehensive legal platform for Indian citizens — find verified lawyers, know your rights, and access legal templates.',
  keywords: ['legal help India', 'find lawyer', 'legal rights India', 'LexIndia', 'Indian legal platform', 'know your rights'],
  openGraph: {
    title: 'LexIndia | Get Legal Help in Minutes',
    description: 'Find verified lawyers, know your rights, and access legal document templates.',
    type: 'website',
    siteName: 'LexIndia',
  },
  metadataBase: new URL('https://lexindia.in'),
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LexIndia',
  url: 'https://lexindia.in',
  logo: 'https://lexindia.in/logo.png',
  description: 'An Indian legal-tech platform connecting citizens with verified lawyers, legal knowledge, and AI-powered legal information.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@lexindia.in',
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LexIndia',
  url: 'https://lexindia.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://lexindia.in/lawyers?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansDevanagari.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors" suppressHydrationWarning>
        <AriaAnnouncerProvider>
          <Toaster position="bottom-center" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
          <NextAuthProvider>
          <AuthProvider>
            <LanguageProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div className="min-h-screen flex flex-col">
                  <SkipToContent />
                  <Header />
                  <main id="main-content" className="flex-1 pb-16 md:pb-0">
                    {children}
                  </main>
                  <Footer />
                  <Chatbot />
                  <SocialProofToast />
                  <ExitIntentPopup />
                  <AuthModalWrapper />
                  <MobileNav />
                </div>
              </ThemeProvider>
            </LanguageProvider>
          </AuthProvider>
        </NextAuthProvider>
        <ClientMotionConfig />
        <GoogleAnalytics />
        </AriaAnnouncerProvider>
      </body>
    </html>
  );
}

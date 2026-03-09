import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import { AuthProvider } from '@/lib/AuthContext';
import { NextAuthProvider } from '@/components/SessionProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import MobileNav from '@/components/MobileNav';
import AuthModalWrapper from '@/components/AuthModalWrapper';

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
  keywords: ['legal help India', 'find lawyer', 'legal rights India', 'LexIndia'],
  openGraph: {
    title: 'LexIndia | Get Legal Help in Minutes',
    description: 'Find verified lawyers, know your rights, and access legal document templates.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansDevanagari.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900" suppressHydrationWarning>
        <NextAuthProvider>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 pb-16 md:pb-0">
                  {children}
                </main>
                <Footer />
                <Chatbot />
                <AuthModalWrapper />
                <MobileNav />
              </div>
            </LanguageProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

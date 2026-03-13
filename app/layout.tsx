import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import './globals.css';
import { Toaster } from 'react-hot-toast';

import AccessibilityControls from '@/components/AccessibilityControls';
import { AriaAnnouncerProvider } from '@/components/AriaAnnouncer';
import AuthModalWrapper from '@/components/AuthModalWrapper';
import Chatbot from '@/components/Chatbot';
import { ClientMotionConfig } from '@/components/ClientMotionConfig';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import { NextAuthProvider } from '@/components/SessionProvider';
import SkipToContent from '@/components/SkipToContent';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ExitIntentPopup } from '@/components/ui/ExitIntentPopup';
import { SocialProofToast } from '@/components/ui/SocialProofToast';
import { AuthProvider } from '@/lib/AuthContext';
import { getMemoryLocalizedText } from '@/lib/content/localized';
import { getLocaleOpenGraph, SITE_URL, THEME_COOKIE } from '@/lib/i18n/config';
import { getLocaleFontStyle, fontVariablesClassName } from '@/lib/i18n/fonts';
import { buildLocalizedAlternates } from '@/lib/i18n/metadata';
import { getMessages } from '@/lib/i18n/messages';
import { getRequestDirection, getRequestLocale } from '@/lib/i18n/request';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { LanguageProvider } from '@/lib/LanguageContext';
import { languageNames } from '@/lib/translations';

const themeBootstrapScript = `
  (() => {
    try {
      const match = document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]+)/);
      const preference = match ? decodeURIComponent(match[1]) : 'system';
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const activeTheme = preference === 'system' ? systemTheme : preference;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(activeTheme);
      document.documentElement.dataset.theme = activeTheme;
    } catch (error) {
      console.error('Theme bootstrap failed', error);
    }
  })();
`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const localizedHome = withLocalePrefix('/', locale);

  return {
    title: `LexIndia | ${messages.hero.title}`,
    description: messages.features.subtitle,
    metadataBase: new URL(SITE_URL),
    alternates: buildLocalizedAlternates('/', locale),
    openGraph: {
      title: `LexIndia | ${messages.hero.title}`,
      description: messages.features.subtitle,
      locale: getLocaleOpenGraph(locale),
      siteName: 'LexIndia',
      type: 'website',
      url: new URL(localizedHome, SITE_URL).toString(),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const direction = await getRequestDirection();
  const cookieStore = await cookies();
  const themePreference = cookieStore.get(THEME_COOKIE)?.value;

  const themeClassName = themePreference === 'dark' ? 'dark' : '';
  const htmlClassName = [fontVariablesClassName, themeClassName].filter(Boolean).join(' ');
  const localizedSiteDescription = getMemoryLocalizedText(
    'An Indian legal-tech platform connecting citizens with verified lawyers, legal knowledge, and AI-powered legal information.',
    locale
  );
  const localizedHomeUrl = new URL(withLocalePrefix('/', locale), SITE_URL).toString();
  const localizedLawyersSearchUrl = new URL(withLocalePrefix('/lawyers', locale), SITE_URL);
  localizedLawyersSearchUrl.searchParams.set('q', '{search_term_string}');

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LexIndia',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: localizedSiteDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@lexindia.in',
      contactType: 'customer support',
      availableLanguage: Object.values(languageNames),
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LexIndia',
    url: localizedHomeUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: localizedLawyersSearchUrl.toString(),
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang={locale}
      dir={direction}
      className={htmlClassName}
      style={getLocaleFontStyle(locale)}
      suppressHydrationWarning
    >
      <head>
        <script id="theme-bootstrap" dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-background font-locale text-foreground antialiased transition-colors" suppressHydrationWarning>
        <AriaAnnouncerProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--surface))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
          <NextAuthProvider>
            <AuthProvider>
              <LanguageProvider initialLang={locale}>
                <ThemeProvider defaultThemePreference={themePreference}>
                  <div className="flex min-h-screen flex-col">
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
                    <AccessibilityControls />
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

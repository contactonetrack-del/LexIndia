'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';

import { THEME_COOKIE } from '@/lib/i18n/config';

function ThemeCookieSync() {
  const { resolvedTheme, theme } = useTheme();

  React.useEffect(() => {
    const preference = theme ?? 'system';
    document.cookie = `${THEME_COOKIE}=${preference}; path=/; max-age=31536000; SameSite=Lax`;
    if (resolvedTheme) {
      document.documentElement.dataset.theme = resolvedTheme;
    }
  }, [resolvedTheme, theme]);

  return null;
}

export function ThemeProvider({
  children,
  defaultThemePreference = 'system',
  ...props
}: React.ComponentProps<typeof NextThemesProvider> & {
  defaultThemePreference?: string;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultThemePreference}
      disableTransitionOnChange
      enableSystem={defaultThemePreference === 'system'}
      storageKey={THEME_COOKIE}
      {...props}
    >
      <ThemeCookieSync />
      {children}
    </NextThemesProvider>
  );
}

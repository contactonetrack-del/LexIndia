'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

export function ThemeToggle() {
  const { lang } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
  const copy = localizeTreeFromMemory(
    {
      srOnlyToggle: 'Toggle theme',
      switchTheme: 'Switch theme',
    } as const,
    lang
  );

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={copy.switchTheme}
      title={copy.switchTheme}
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 text-warning transition-all dark:-rotate-90 dark:scale-0 dark:text-warning" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 text-primary transition-all dark:rotate-0 dark:scale-100 dark:text-primary" />
      <span className="sr-only">{copy.srOnlyToggle}</span>
    </button>
  );
}

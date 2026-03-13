'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = localizeTreeFromMemory(
    {
      title: 'Something went wrong',
      body: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
      tryAgain: 'Try again',
    } as const,
    lang
  );

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-danger/10 p-4">
            <AlertTriangle className="h-10 w-10 text-danger" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">{copy.title}</h1>
        <p className="mb-6 text-muted-foreground">{copy.body}</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          {copy.tryAgain}
        </button>
      </div>
    </div>
  );
}

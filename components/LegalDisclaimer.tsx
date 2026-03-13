'use client';

import { AlertTriangle } from 'lucide-react';

import { useLanguage } from '@/lib/LanguageContext';

export default function LegalDisclaimer() {
  const { t } = useLanguage();

  return (
    <div className="border-b border-warning/30 bg-warning/10">
      <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-4 py-2.5 sm:px-6 lg:px-8">
        <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
        <p className="text-xs leading-relaxed text-warning">{t.footer.disclaimer}</p>
      </div>
    </div>
  );
}

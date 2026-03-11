import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

/**
 * LegalDisclaimer — a compact "not legal advice" banner.
 * Drop this at the top of any content page:
 *   /knowledge, /templates, /rights, /guides, /guides/[slug]
 */
export default function LegalDisclaimer() {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-semibold">Information only, not legal advice.</span>
          {' '}Content on this page is for general awareness. For advice specific to your situation,{' '}
          <Link href="/lawyers" className="underline hover:text-amber-900 font-medium">
            consult a verified lawyer
          </Link>.
          {' '}
          <Link href="/disclaimer" className="underline hover:text-amber-900">
            Full disclaimer →
          </Link>
        </p>
      </div>
    </div>
  );
}

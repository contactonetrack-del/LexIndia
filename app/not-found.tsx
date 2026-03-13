import { Scale, Home, Search } from 'lucide-react';

import LocaleLink from '@/components/LocaleLink';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { getRequestLocale } from '@/lib/i18n/request';

export default async function NotFound() {
  const locale = await getRequestLocale();
  const copy = localizeTreeFromMemory(
    {
      title: 'Page Not Found',
      body: "The page you're looking for doesn't exist or has been moved.",
      homeAction: 'Go Home',
      lawyersAction: 'Find Lawyers',
    } as const,
    locale
  );

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Scale className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
        <h2 className="mb-3 text-2xl font-semibold text-foreground">{copy.title}</h2>
        <p className="mb-8 text-muted-foreground">{copy.body}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <LocaleLink
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" /> {copy.homeAction}
          </LocaleLink>
          <LocaleLink
            href="/lawyers"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary bg-background px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <Search className="h-4 w-4" /> {copy.lawyersAction}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}

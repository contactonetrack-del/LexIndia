import type { Metadata } from 'next';
import { ArrowRight, FileText, MessageSquare, Scale, Shield, Target } from 'lucide-react';
import Link from 'next/link';

import {
  HighlightBanner,
  PageContainer,
  PageShell,
  SubtlePanel,
  SurfaceCard,
} from '@/components/ui/theme-primitives';
import { getAboutContent } from '@/lib/content/about';
import { createLocalizedMetadata } from '@/lib/i18n/metadata';
import { localizeHref } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const content = getAboutContent(locale);

  return createLocalizedMetadata({
    locale,
    pathname: '/about',
    title: `${content.badge} | LexIndia`,
    description: content.intro,
  });
}

const CAPABILITY_ICONS = [Scale, Shield, FileText, MessageSquare] as const;

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const content = getAboutContent(locale);

  return (
    <PageShell className="py-0">
      <section className="border-b border-border bg-gradient-to-br from-primary via-primary to-accent/30 text-primary-foreground">
        <PageContainer className="py-20">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/85">
              {content.badge}
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/80">
              {content.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={localizeHref('/lawyers', locale)}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                {content.capabilities[0].title}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizeHref('/knowledge', locale)}
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/15"
              >
                {content.ctaTitle}
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <HighlightBanner className="p-8">
            <div className="flex items-center gap-3 text-primary">
              <Target className="h-6 w-6" />
              <h2 className="text-2xl font-bold text-foreground">{content.missionTitle}</h2>
            </div>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              {content.missionBody}
            </p>
          </HighlightBanner>

          <SubtlePanel className="p-8">
            <div className="flex items-center gap-3 text-primary">
              <Shield className="h-6 w-6" />
              <h2 className="text-2xl font-bold text-foreground">{content.legalTitle}</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{content.legalBody}</p>
          </SubtlePanel>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-foreground">{content.capabilitiesTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {content.capabilities.map((item, index) => {
              const Icon = CAPABILITY_ICONS[index] ?? Scale;

              return (
                <Link key={item.href} href={localizeHref(item.href, locale)} className="group block">
                  <SurfaceCard className="h-full p-6 transition-all group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <span>{item.title}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </SurfaceCard>
                </Link>
              );
            })}
          </div>
        </section>

        <HighlightBanner className="mt-16 p-8 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground">{content.ctaTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{content.ctaBody}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={localizeHref('/lawyers', locale)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {content.capabilities[0].title}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={localizeHref('/knowledge', locale)}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              {content.capabilities[1].title}
            </Link>
          </div>
        </HighlightBanner>
      </PageContainer>
    </PageShell>
  );
}

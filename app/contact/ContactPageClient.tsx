'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Scale,
} from 'lucide-react';

import {
  HighlightBanner,
  PageContainer,
  PageShell,
  SubtlePanel,
  SurfaceCard,
} from '@/components/ui/theme-primitives';
import type { ContactContent } from '@/lib/content/contact';
import type { Locale } from '@/lib/i18n/config';
import { localizeHref } from '@/lib/i18n/navigation';

type ContactPageClientProps = {
  locale: Locale;
  content: ContactContent;
  labels: {
    nameLabel: string;
    emailLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    knowledgeLabel: string;
    lawyersLabel: string;
    loadingLabel: string;
  };
};

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const CARD_ICONS = {
  support: Mail,
  legal: Scale,
  hours: Clock,
} as const;

export default function ContactPageClient({
  locale,
  content,
  labels,
}: ContactPageClientProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setForm(INITIAL_FORM);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setStatus('idle');
  };

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
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-6">
            {content.cards.map((card) => {
              const Icon = CARD_ICONS[card.kind];

              return (
                <SurfaceCard key={card.kind} className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-foreground">{card.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{card.description}</p>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      {card.value}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm font-semibold text-foreground">{card.value}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">{card.meta}</p>
                </SurfaceCard>
              );
            })}

            <SubtlePanel className="border-warning/25 bg-warning/10 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-warning" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{content.noteTitle}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{content.noteBody}</p>
                </div>
              </div>
            </SubtlePanel>
          </div>

          <SurfaceCard className="p-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 text-primary">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-2xl font-bold text-foreground">{content.formTitle}</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{content.formIntro}</p>
            </div>

            {status === 'sent' ? (
              <div className="mt-8 rounded-2xl border border-success/20 bg-success/10 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{content.sentTitle}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{content.sentBody}</p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-6 inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
                >
                  {content.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-foreground">
                      {labels.nameLabel}
                      <span aria-hidden="true"> *</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder={labels.namePlaceholder}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-foreground">
                      {labels.emailLabel}
                      <span aria-hidden="true"> *</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder={labels.emailPlaceholder}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-foreground">
                    {content.topicLabel}
                    <span aria-hidden="true"> *</span>
                  </label>
                  <select
                    id="contact-subject"
                    required
                    value={form.subject}
                    onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">{content.subjectPlaceholder}</option>
                    {content.subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-foreground">
                    {content.messageLabel}
                    <span aria-hidden="true"> *</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    placeholder={content.messagePlaceholder}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {status === 'error' ? (
                  <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{content.errorMessage}</p>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === 'sending' ? labels.loadingLabel : content.sendMessage}
                </button>
              </form>
            )}
          </SurfaceCard>
        </div>

        <HighlightBanner className="mt-10 p-8 sm:p-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground">{content.quickTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{content.quickBody}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={localizeHref('/lawyers', locale)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {labels.lawyersLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={localizeHref('/knowledge', locale)}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              {labels.knowledgeLabel}
            </Link>
          </div>
        </HighlightBanner>
      </PageContainer>
    </PageShell>
  );
}

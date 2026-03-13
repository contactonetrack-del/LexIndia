'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

export function LeadCapture() {
  const { fontClass, lang } = useLanguage();
  const copy = localizeTreeFromMemory(
    {
      heading: 'Know Your Rights. Protect Your Future.',
      body: 'Join readers receiving legal updates, free templates, and practical guidance every week.',
      weeklyUpdates: 'Weekly updates',
      freeHandbook: 'Free handbook',
      noSpam: 'No spam',
      successTitle: "You're on the list!",
      successBody: 'Check your inbox for your legal rights handbook.',
      emailAddressLabel: 'Email address',
      emailPlaceholder: 'Enter your email address',
      subscribing: 'Subscribing...',
      submitLabel: 'Get Free Handbook',
      privacyNote: 'We respect your privacy. Unsubscribe at any time.',
    } as const,
    lang
  );
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground shadow-2xl md:p-12">
      <div className="pointer-events-none absolute left-0 top-0 -m-8 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 -m-8 h-40 w-40 rounded-full bg-background/20 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <h3 className={`mb-4 text-3xl font-bold tracking-tight md:text-4xl ${fontClass}`}>
            {copy.heading}
          </h3>
          <p className={`mb-6 max-w-xl text-lg text-primary-foreground/80 ${fontClass}`}>
            {copy.body}
          </p>
          <div className={`flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/75 md:justify-start ${fontClass}`}>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              {copy.weeklyUpdates}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              {copy.freeHandbook}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              {copy.noSpam}
            </span>
          </div>
        </div>

        <div className="w-full shrink-0 rounded-2xl border border-primary-foreground/20 bg-background/10 p-6 backdrop-blur-sm md:w-[400px]">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className={`mb-2 text-xl font-bold ${fontClass}`}>{copy.successTitle}</h4>
                <p className={`text-sm text-primary-foreground/80 ${fontClass}`}>
                  {copy.successBody}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div>
                  <label htmlFor="lead-email" className="sr-only">
                    {copy.emailAddressLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="lead-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={copy.emailPlaceholder}
                      className={`w-full rounded-xl bg-background px-4 py-4 pl-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${fontClass}`}
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-bold text-accent-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 ${fontClass}`}
                >
                  {status === 'loading' ? (
                    copy.subscribing
                  ) : (
                    <>
                      {copy.submitLabel}
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <p className={`mt-2 text-center text-xs text-primary-foreground/75 ${fontClass}`}>
                  {copy.privacyNote}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

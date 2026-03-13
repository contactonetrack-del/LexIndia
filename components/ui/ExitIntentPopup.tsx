'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Mail, ShieldCheck, X } from 'lucide-react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

export function ExitIntentPopup() {
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(
    {
      closeDialogAria: 'Close dialog',
      heroTitle: "Wait! Don't Miss Out",
      heroDescription:
        "Get our exclusive 'Citizen Legal Rights Handbook' before you go. Completely free.",
      successTitle: 'Handbook Sent!',
      successDescription: "Check your inbox. We've sent the PDF guide to your email address.",
      emailAddressLabel: 'Email address',
      emailPlaceholder: 'Enter your email address...',
      sendingLabel: 'Sending...',
      ctaLabel: 'Download Free Handbook',
      antiSpamNote: 'We hate spam. Unsubscribe at any time.',
    } as const,
    lang
  );
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    const seen = localStorage.getItem('lexindia-exit-intent-seen');
    if (seen === 'true') {
      return;
    }

    const mouseEvent = (event: MouseEvent) => {
      if (!hasTriggered && event.clientY < 50 && event.movementY < 0) {
        setIsVisible(true);
        setHasTriggered(true);
        localStorage.setItem('lexindia-exit-intent-seen', 'true');
      }
    };

    document.addEventListener('mouseout', mouseEvent);
    return () => {
      document.removeEventListener('mouseout', mouseEvent);
    };
  }, [hasTriggered]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={() => setIsVisible(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-background/65 p-1 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
              aria-label={copy.closeDialogAria}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative overflow-hidden bg-primary p-6 text-center text-primary-foreground">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 2px 2px, hsl(var(--primary-foreground)) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative z-10 mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h2 className="relative z-10 mb-2 text-2xl font-bold">{copy.heroTitle}</h2>
              <p className="relative z-10 text-sm text-primary-foreground/80">{copy.heroDescription}</p>
            </div>

            <div className="p-6">
              {status === 'success' ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
                    <ShieldCheck className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">{copy.successTitle}</h3>
                  <p className="text-muted-foreground">{copy.successDescription}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="exit-email" className="sr-only">
                      {copy.emailAddressLabel}
                    </label>
                    <input
                      id="exit-email"
                      type="email"
                      required
                      placeholder={copy.emailPlaceholder}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <span className="animate-pulse">{copy.sendingLabel}</span>
                    ) : (
                      <>
                        {copy.ctaLabel} <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-center text-xs text-muted-foreground">{copy.antiSpamNote}</p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

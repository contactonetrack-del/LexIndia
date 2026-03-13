'use client';

import React, { useState } from 'react';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

import LocaleLink from '@/components/LocaleLink';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import { useLanguage } from '@/lib/LanguageContext';

const FORGOT_PASSWORD_PAGE = {
  title: 'Reset password',
  subtitle: 'Enter your email to receive a secure recovery link.',
  successTitle: 'Check your inbox',
  successBody: 'If an account matches, we sent a reset link.',
  emailLabel: 'Email address',
  emailPlaceholder: 'you@example.com',
  submit: 'Send reset link',
  backHome: 'Back to home',
  resetSent: 'Reset email sent.',
  genericError: 'Something went wrong.',
  networkError: 'Network error. Please try again.',
} as const;

export default function ForgotPasswordPage() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const copy = localizeTreeFromMemory(FORGOT_PASSWORD_PAGE, lang);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        toast.success(data.message || copy.resetSent);
      } else {
        toast.error(data.error || copy.genericError);
      }
    } catch {
      toast.error(copy.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-background p-10 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground">{copy.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>

        {isSuccess ? (
          <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-center text-success">
            <p className="font-medium">{copy.successTitle}</p>
            <p className="mt-1 text-sm">{copy.successBody}</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                {copy.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-3 pl-10 outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder={copy.emailPlaceholder}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : copy.submit}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <LocaleLink
            href="/"
            className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {copy.backHome}
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, Scale, User, X } from 'lucide-react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useAuth } from '@/lib/AuthContext';
import { getDashboardPath } from '@/lib/dashboard';
import { useLanguage } from '@/lib/LanguageContext';
import { localizeHref } from '@/lib/i18n/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'login' | 'register';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
      <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z" />
      <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
    </svg>
  );
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { authOptions } = useAuth();

  const copy = localizeTreeFromMemory(
    {
      roleGroupAriaLabel: 'Account type',
      consentSeparator: '/',
    } as const,
    lang
  );

  const [tab, setTab] = useState<TabType>('login');
  const [role, setRole] = useState<'CITIZEN' | 'LAWYER'>('CITIZEN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setConsentChecked(false);
    setConsentTimestamp(null);
  };

  useEffect(() => {
    if (isOpen) {
      const timeout = window.setTimeout(() => {
        setTab(authOptions.initialTab || 'login');
        setRole(authOptions.initialRole || 'CITIZEN');
        resetForm();
      }, 0);

      return () => {
        window.clearTimeout(timeout);
      };
    }
    return undefined;
  }, [isOpen, authOptions]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (tab === 'register' && !consentChecked) {
      setError(t.common.error);
      return;
    }

    setIsGoogleLoading(true);
    setError('');

    try {
      await signIn('google', {
        callbackUrl: localizeHref('/dashboard/citizen', lang),
      });
      onClose();
    } catch {
      setError(t.common.error);
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', { email, password, redirect: false });

    setIsLoading(false);
    if (result?.error) {
      setError(t.common.error);
      return;
    }

    const session = await getSession();
    const dashboardHref = localizeHref(
      getDashboardPath(session?.user),
      lang
    );
    onClose();
    router.push(dashboardHref);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      setError(t.auth.passRequirements);
      return;
    }

    if (!consentChecked) {
      setError(t.common.error);
      return;
    }

    setIsLoading(true);
    setError('');
    const timestamp = new Date().toISOString();
    setConsentTimestamp(timestamp);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          consentTimestamp: timestamp,
          consentVersion: '1.0',
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setError(t.common.error);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.error || t.common.error);
        setIsLoading(false);
        return;
      }

      await signIn('credentials', { email, password, redirect: false });
      setIsLoading(false);
      const dashboardHref = localizeHref(getDashboardPath({ role }), lang);
      onClose();
      router.push(dashboardHref);
    } catch {
      setError(t.common.error);
      setIsLoading(false);
    }
  };

  const isGoogleAvailable = typeof window !== 'undefined';

  return (
    <div
      data-testid="auth-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-primary p-6 text-primary-foreground">
          <h2 id="auth-modal-title" className="text-xl font-bold">
            {tab === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="rounded-full p-2 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground"
            aria-label={t.common.cancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-border" role="tablist">
          {(['login', 'register'] as TabType[]).map((tabName) => (
            <button
              key={tabName}
              data-testid={`auth-tab-${tabName}`}
              role="tab"
              aria-selected={tab === tabName}
              onClick={() => {
                setTab(tabName);
                resetForm();
              }}
              className={`flex-1 border-b-2 py-3 text-sm font-semibold capitalize transition-colors ${
                tab === tabName
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tabName === 'login' ? t.auth.loginBtn : t.auth.signupBtn}
            </button>
          ))}
        </div>

        <div className="space-y-4 p-6">
          <div className="flex gap-3" role="group" aria-label={copy.roleGroupAriaLabel}>
            {(['CITIZEN', 'LAWYER'] as const).map((currentRole) => (
              <button
                key={currentRole}
                type="button"
                data-testid={`auth-role-${currentRole.toLowerCase()}`}
                onClick={() => setRole(currentRole)}
                aria-pressed={role === currentRole}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                  role === currentRole
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {currentRole === 'CITIZEN' ? <User className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
                {currentRole === 'CITIZEN' ? t.auth.roleCitizen : t.auth.roleLawyer}
              </button>
            ))}
          </div>

          {tab === 'register' && (
            <div className="flex items-start gap-3 py-1">
              <input
                id="auth-consent-global"
                type="checkbox"
                checked={consentChecked}
                onChange={(event) => setConsentChecked(event.target.checked)}
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
                required
              />
              <label
                htmlFor="auth-consent-global"
                className="cursor-pointer text-xs leading-relaxed text-muted-foreground"
              >
                <a
                  href={localizeHref('/terms', lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline"
                >
                  {t.footer.terms}
                </a>{' '}
                <span aria-hidden="true">{copy.consentSeparator}</span>{' '}
                <a
                  href={localizeHref('/privacy', lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline"
                >
                  {t.footer.privacy}
                </a>
                .
              </label>
            </div>
          )}

          {isGoogleAvailable && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t.auth.continueGoogle}
            >
              {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
              {t.auth.continueGoogle}
            </button>
          )}

          <div className="relative" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label htmlFor="auth-name" className="mb-1 block text-sm font-medium text-foreground">
                  {t.auth.nameLabel}
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={t.auth.namePh}
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="mb-1 block text-sm font-medium text-foreground">
                {t.auth.emailLabel}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="auth-email"
                  data-testid="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={t.auth.emailPh}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1 block text-sm font-medium text-foreground">
                {t.auth.passLabel}{' '}
                {tab === 'register' && (
                  <span className="text-xs text-muted-foreground">({t.auth.passRequirements})</span>
                )}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="auth-password"
                  data-testid="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder={t.auth.passPh}
                  required
                  minLength={8}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={t.auth.passLabel}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {tab === 'login' && (
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(localizeHref('/forgot-password', lang));
                    }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t.auth.forgotPass}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <p
                role="alert"
                aria-live="polite"
                className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              data-testid="auth-submit-button"
              disabled={isLoading || (tab === 'register' && !consentChecked)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {tab === 'login' ? t.auth.loginBtn : t.auth.signupBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

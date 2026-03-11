'use client';

import React, { useState } from 'react';
import { X, User, Scale, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'login' | 'register';

// Google "G" SVG icon
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
  const { t } = useLanguage();
  const { authOptions } = useAuth();

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
    setName(''); setEmail(''); setPassword(''); setError('');
    setConsentChecked(false); setConsentTimestamp(null);
  };

  // Update internal state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTab(authOptions.initialTab || 'login');
      setRole(authOptions.initialRole || 'CITIZEN');
      resetForm();
    }
  }, [isOpen, authOptions]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (tab === 'register' && !consentChecked) {
      setError('You must agree to the Terms of Service and Privacy Policy to register.');
      return;
    }
    setIsGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: role === 'LAWYER' ? '/dashboard/lawyer' : '/dashboard/citizen' });
      onClose();
    } catch {
      setError('Google sign-in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    setIsLoading(false);
    if (result?.error) {
      setError('Invalid email or password');
    } else {
      onClose();
      router.refresh();
      router.push(role === 'LAWYER' ? '/dashboard/lawyer' : '/dashboard/citizen');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!consentChecked) { setError('You must agree to the Terms of Service and Privacy Policy to register.'); return; }
    setIsLoading(true); setError('');
    const ts = new Date().toISOString();
    setConsentTimestamp(ts);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, consentTimestamp: ts, consentVersion: '1.0' }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setError(`Too many attempts. Retry in ${data.retryAfter} seconds.`);
        setIsLoading(false); return;
      }
      if (!res.ok) { setError(data.error || 'Registration failed'); setIsLoading(false); return; }
      await signIn('credentials', { email, password, redirect: false });
      setIsLoading(false);
      onClose();
      router.refresh();
      router.push(role === 'LAWYER' ? '/dashboard/lawyer' : '/dashboard/citizen');
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const isGoogleAvailable = typeof window !== 'undefined';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#1E3A8A] to-blue-700">
          <h2 id="auth-modal-title" className="text-xl font-bold text-white">
            {tab === 'login' ? t.auth.loginTitle : t.auth.signupTitle}
          </h2>
          <button
            onClick={() => { onClose(); resetForm(); }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100" role="tablist">
          {(['login', 'register'] as TabType[]).map((tabName) => (
            <button
              key={tabName}
              role="tab"
              aria-selected={tab === tabName}
              onClick={() => { setTab(tabName); resetForm(); }}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${tab === tabName ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tabName === 'login' ? t.auth.loginBtn : t.auth.signupBtn}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {/* Role Selector */}
          <div className="flex gap-3" role="group" aria-label="Account type">
            {(['CITIZEN', 'LAWYER'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role === r}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${role === r ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
              >
                {r === 'CITIZEN' ? <User className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                {r === 'CITIZEN' ? t.auth.roleCitizen : t.auth.roleLawyer}
              </button>
            ))}
          </div>

          {/* Consent Checkbox — register only (Applies to both Google and Email) */}
          {tab === 'register' && (
            <div className="flex items-start gap-3 py-1">
              <input
                id="auth-consent-global"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1E3A8A] focus:ring-[#1E3A8A] cursor-pointer"
                required
              />
              <label htmlFor="auth-consent-global" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                I agree to LexIndia&apos;s{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#1E3A8A] underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1E3A8A] underline font-medium">
                  Privacy Policy
                </a>.
              </label>
            </div>
          )}

          {/* Google Sign-In */}
          {isGoogleAvailable && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              aria-label="Continue with Google"
            >
              {isGoogleLoading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <GoogleIcon />}
              {t.auth.continueGoogle}
            </button>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs text-gray-500 bg-white px-2">
              <span className="bg-white px-2">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 mb-1">{t.auth.nameLabel}</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  placeholder="Adv. Ravi Shankar"
                  required
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 mb-1">{t.auth.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 mb-1">
                {t.auth.passLabel} {tab === 'register' && <span className="text-gray-400 text-xs">({t.auth.passRequirements})</span>}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {tab === 'login' && (
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push('/forgot-password');
                    }}
                    className="text-sm font-medium text-[#1E3A8A] hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>

            {error && (
              <p role="alert" aria-live="polite" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}



            <button
              type="submit"
              disabled={isLoading || (tab === 'register' && !consentChecked)}
              className="w-full bg-[#1E3A8A] text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              {tab === 'login' ? t.auth.loginBtn : t.auth.signupBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

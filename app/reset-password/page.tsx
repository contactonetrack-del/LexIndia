"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import LocaleLink from "@/components/LocaleLink";
import { localizeTreeFromMemory } from "@/lib/content/localized";
import { REQUEST_LOCALE_HEADER } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/navigation";
import { useLanguage } from "@/lib/LanguageContext";

const RESET_PASSWORD_PAGE = {
  invalidTokenToast: "Invalid or missing reset token.",
  passwordLengthToast: "Password must be at least 8 characters.",
  passwordsMismatchToast: "Passwords do not match.",
  successToast: "Password updated successfully!",
  resetFailureToast: "Failed to reset password.",
  networkErrorToast: "A network error occurred.",
  invalidLinkTitle: "Invalid Link",
  invalidLinkBody: "This password reset link is invalid or missing the token.",
  backToHome: "Back to Home",
  successTitle: "Password Reset",
  successBody: "Your password has been successfully updated.",
  redirecting: "Redirecting to login...",
  createTitle: "Create New Password",
  createBody: "Enter a strong password to secure your account.",
  newPasswordLabel: "New Password",
  confirmPasswordLabel: "Confirm Password",
  resetAction: "Reset Password",
  passwordMaskPlaceholder: "********",
} as const;

function ResetPasswordForm() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const copy = localizeTreeFromMemory(RESET_PASSWORD_PAGE, lang);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(copy.invalidTokenToast);
      return;
    }

    if (password.length < 8) {
      toast.error(copy.passwordLengthToast);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(copy.passwordsMismatchToast);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        toast.success(data.message || copy.successToast);
        setTimeout(() => router.push(localizeHref("/", lang)), 3000);
      } else {
        toast.error(data.error || copy.resetFailureToast);
      }
    } catch {
      toast.error(copy.networkErrorToast);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-foreground">{copy.invalidLinkTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy.invalidLinkBody}</p>
        <div className="mt-6">
          <LocaleLink href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> {copy.backToHome}
          </LocaleLink>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success" />
        <h2 className="text-3xl font-extrabold text-foreground">{copy.successTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy.successBody}</p>
        <p className="mt-4 text-xs text-muted-foreground">{copy.redirecting}</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-foreground">{copy.createTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy.createBody}</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{copy.newPasswordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 pl-10 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder={copy.passwordMaskPlaceholder}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{copy.confirmPasswordLabel}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-3 pl-10 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder={copy.passwordMaskPlaceholder}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="flex w-full justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : copy.resetAction}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-background p-10 shadow-xl">
        <Suspense fallback={<div className="py-10 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}


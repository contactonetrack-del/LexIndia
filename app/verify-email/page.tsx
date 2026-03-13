import Link from 'next/link';
import { CheckCircle, XCircle } from 'lucide-react';

import prisma from '@/lib/prisma';
import { localizeTreeFromMemory } from '@/lib/content/localized';
import type { Locale } from '@/lib/i18n/config';
import { withLocalePrefix } from '@/lib/i18n/navigation';
import { getRequestLocale } from '@/lib/i18n/request';

const VERIFY_EMAIL_PAGE = {
  missingToken: 'Missing verification token.',
  invalidExpired: 'Invalid or expired token.',
  tokenExpired: 'Token has expired. Please log in to request a new one.',
  userMissing: 'Email does not exist in our systems.',
  verifiedMessage: 'Your email has been verified successfully!',
  verifiedTitle: 'Email Verified',
  failedTitle: 'Verification Failed',
  continueAction: 'Continue to LexIndia',
  backAction: 'Back to Home',
} as const;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const locale = await getRequestLocale();
  const resolvedParams = await searchParams;
  const token = resolvedParams.token;
  const copy = localizeTreeFromMemory(VERIFY_EMAIL_PAGE, locale);

  if (!token) {
    return <ResultState success={false} message={copy.missingToken} locale={locale} copy={copy} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-background p-10 text-center shadow-lg">
        <VerificationProcessor token={token} locale={locale} copy={copy} />
      </div>
    </div>
  );
}

async function VerificationProcessor({
  token,
  locale,
  copy,
}: {
  token: string;
  locale: Locale;
  copy: typeof VERIFY_EMAIL_PAGE;
}) {
  const existingToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!existingToken) {
    return <ResultState success={false} message={copy.invalidExpired} locale={locale} copy={copy} />;
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return <ResultState success={false} message={copy.tokenExpired} locale={locale} copy={copy} />;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.identifier },
  });

  if (!existingUser) {
    return <ResultState success={false} message={copy.userMissing} locale={locale} copy={copy} />;
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: existingToken.identifier,
        token: existingToken.token,
      },
    },
  });

  return <ResultState success={true} message={copy.verifiedMessage} locale={locale} copy={copy} />;
}

function ResultState({
  success,
  message,
  locale,
  copy,
}: {
  success: boolean;
  message: string;
  locale: Locale;
  copy: typeof VERIFY_EMAIL_PAGE;
}) {
  return (
    <>
      <div className="flex justify-center">
        {success ? (
          <CheckCircle className="h-16 w-16 text-success" />
        ) : (
          <XCircle className="h-16 w-16 text-danger" />
        )}
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-foreground">
        {success ? copy.verifiedTitle : copy.failedTitle}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <div className="mt-8">
        <Link
          href={withLocalePrefix('/', locale)}
          className="flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          {success ? copy.continueAction : copy.backAction}
        </Link>
      </div>
    </>
  );
}

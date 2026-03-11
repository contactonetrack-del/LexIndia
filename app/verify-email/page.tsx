import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token;

  if (!token) {
    return <ResultState success={false} message="Missing verification token." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
        <VerificationProcessor token={token} />
      </div>
    </div>
  );
}

// Server Component performing the strict DB token sync
async function VerificationProcessor({ token }: { token: string }) {
  const existingToken = await prisma.verificationToken.findFirst({
    where: { token },
  });

  if (!existingToken) {
    return <ResultState success={false} message="Invalid or expired token." />;
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return <ResultState success={false} message="Token has expired. Please log in to request a new one." />;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.identifier },
  });

  if (!existingUser) {
    return <ResultState success={false} message="Email does not exist in our systems." />;
  }

  // Atomically flush verification and shred the short-lived token
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

  return <ResultState success={true} message="Your email has been verified successfully!" />;
}

// UI Rendering Wrapper
function ResultState({ success, message }: { success: boolean; message: string }) {
  return (
    <>
      <div className="flex justify-center">
        {success ? (
          <CheckCircle className="h-16 w-16 text-green-500" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500" />
        )}
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        {success ? "Email Verified" : "Verification Failed"}
      </h2>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      <div className="mt-8">
        <Link
          href="/"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1E3A8A] hover:bg-blue-800"
        >
          {success ? "Continue to LexIndia" : "Back to Home"}
        </Link>
      </div>
    </>
  );
}

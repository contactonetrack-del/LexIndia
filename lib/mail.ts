import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${SITE_URL}/reset-password?token=${token}`;

  if (!resend) {
    console.log(`\n\n[MOCK EMAIL] Password Reset link for ${email}: ${resetLink}\n\n`);
    return;
  }

  await resend.emails.send({
    from: "LexIndia Auth <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your LexIndia password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${SITE_URL}/verify-email?token=${token}`;

  if (!resend) {
    console.log(`\n\n[MOCK EMAIL] Email Verification link for ${email}: ${confirmLink}\n\n`);
    return;
  }

  await resend.emails.send({
    from: "LexIndia Auth <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your email address",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email for LexIndia.</p>`,
  });
};

/**
 * lib/email.ts
 * Email notification utility for LexIndia using Resend.
 * Set RESEND_API_KEY in .env to enable. If key is missing,
 * emails are skipped gracefully (console.info logged).
 */

import { Resend } from 'resend';
import { formatDate as formatLocalizedDate, formatTime } from '@/lib/i18n/format';
import { SITE_URL } from '@/lib/site';

// Lazy-initialise so the module is safe to import even without the key
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.EMAIL_FROM ?? 'LexIndia <no-reply@lexindia.in>';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoDate: string) {
  const d = new Date(isoDate);
  return (
    formatLocalizedDate(d, 'en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) +
    ' at ' +
    formatTime(d, 'en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
}

const modeLabel: Record<string, string> = {
  VIDEO: 'Video Call',
  CALL: 'Phone Call',
  CHAT: 'Chat / Messaging',
  IN_PERSON: 'In-person Meeting',
};

// ─── Templates ────────────────────────────────────────────────────────────────

function citizenConfirmationHtml(params: {
  citizenName: string;
  lawyerName: string;
  date: string;
  mode: string;
  appointmentId: string;
}) {
  const { citizenName, lawyerName, date, mode, appointmentId } = params;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
    <!-- Header -->
    <div style="background:#1E3A8A;padding:32px 28px;text-align:center;">
      <p style="color:#93c5fd;margin:0 0 4px;font-size:13px;letter-spacing:.05em;">LEXINDIA</p>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Booking Confirmed ✓</h1>
    </div>
    <!-- Body -->
    <div style="padding:28px;">
      <p style="color:#374151;margin:0 0 20px;">Hi <strong>${citizenName}</strong>,</p>
      <p style="color:#374151;margin:0 0 20px;">Your consultation has been booked. Here are the details:</p>
      <div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0 4px;width:40%;">Lawyer</td><td style="color:#111827;font-weight:600;font-size:14px;">${lawyerName}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Date & Time</td><td style="color:#111827;font-weight:600;font-size:14px;">${formatDate(date)}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Mode</td><td style="color:#111827;font-weight:600;font-size:14px;">${modeLabel[mode] ?? mode}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Booking ID</td><td style="color:#111827;font-family:monospace;font-size:12px;">${appointmentId.slice(0, 8).toUpperCase()}</td></tr>
        </table>
      </div>
      <p style="color:#4b5563;font-size:13px;margin:0 0 20px;">The lawyer will reach out to confirm the session. If you need to reschedule, please contact us at least 24 hours before your appointment.</p>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${SITE_URL}/dashboard/citizen" style="background:#1E3A8A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">View My Appointments</a>
      </div>
    </div>
    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">LexIndia — Connecting India to verified legal help. This is an automated email. <a href="${SITE_URL}/disclaimer" style="color:#6b7280;">Legal Disclaimer</a></p>
    </div>
  </div>
</body>
</html>`;
}

function lawyerAlertHtml(params: {
  lawyerName: string;
  citizenName: string;
  citizenEmail: string;
  date: string;
  mode: string;
  notes: string | null;
  appointmentId: string;
}) {
  const { lawyerName, citizenName, citizenEmail, date, mode, notes, appointmentId } = params;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
    <!-- Header -->
    <div style="background:#1E3A8A;padding:32px 28px;text-align:center;">
      <p style="color:#93c5fd;margin:0 0 4px;font-size:13px;letter-spacing:.05em;">LEXINDIA</p>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">New Appointment Request 📅</h1>
    </div>
    <!-- Body -->
    <div style="padding:28px;">
      <p style="color:#374151;margin:0 0 20px;">Hi <strong>${lawyerName}</strong>,</p>
      <p style="color:#374151;margin:0 0 20px;">A client has booked a consultation with you on LexIndia:</p>
      <div style="background:#f0f4ff;border:1px solid #c7d2fe;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0 4px;width:40%;">Client</td><td style="color:#111827;font-weight:600;font-size:14px;">${citizenName}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Client Email</td><td style="color:#111827;font-size:14px;">${citizenEmail}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Date & Time</td><td style="color:#111827;font-weight:600;font-size:14px;">${formatDate(date)}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Mode</td><td style="color:#111827;font-weight:600;font-size:14px;">${modeLabel[mode] ?? mode}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Booking ID</td><td style="color:#111827;font-family:monospace;font-size:12px;">${appointmentId.slice(0, 8).toUpperCase()}</td></tr>
        </table>
      </div>
      ${notes ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:20px;"><p style="color:#92400e;font-size:12px;font-weight:600;margin:0 0 4px;">Client's Note:</p><p style="color:#78350f;font-size:13px;margin:0;">${notes}</p></div>` : ''}
      <p style="color:#4b5563;font-size:13px;margin:0 0 20px;">Please log in to your dashboard to view the full booking and confirm the session with the client.</p>
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${SITE_URL}/dashboard/lawyer" style="background:#1E3A8A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">View Appointments</a>
      </div>
    </div>
    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid #f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">LexIndia Lawyer Portal — Automated notification. <a href="${SITE_URL}/disclaimer" style="color:#6b7280;">Disclaimer</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function sendBookingEmails(params: {
  citizenEmail: string;
  citizenName: string;
  lawyerEmail: string;
  lawyerName: string;
  date: string;
  mode: string;
  notes: string | null;
  appointmentId: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.info('[email] RESEND_API_KEY not set — skipping email notifications.');
    return;
  }

  const { citizenEmail, citizenName, lawyerEmail, lawyerName, date, mode, notes, appointmentId } = params;

  try {
    await Promise.all([
      // Confirmation to citizen
      resend.emails.send({
        from: FROM,
        to: citizenEmail,
        subject: `Your LexIndia Consultation is Confirmed — ${formatDate(date)}`,
        html: citizenConfirmationHtml({ citizenName, lawyerName, date, mode, appointmentId }),
      }),
      // Alert to lawyer
      resend.emails.send({
        from: FROM,
        to: lawyerEmail,
        subject: `New Appointment Request from ${citizenName} — ${formatDate(date)}`,
        html: lawyerAlertHtml({ lawyerName, citizenName, citizenEmail, date, mode, notes, appointmentId }),
      }),
    ]);
    console.info(`[email] Booking emails sent for appointment ${appointmentId}`);
  } catch (err) {
    // Non-fatal — log but don't break the booking flow
    console.error('[email] Failed to send booking emails:', err);
  }
}

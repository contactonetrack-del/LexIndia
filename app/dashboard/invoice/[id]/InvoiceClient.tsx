'use client';

import React from 'react';
import { Scale, Printer, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { formatCurrency, formatDate } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';

interface InvoiceAppointment {
  id: string;
  date: string;
  createdAt: string;
  mode: string;
  amount: number;
  paymentStatus: string;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  citizen: { name: string; email: string };
  lawyer: { user: { name: string; email: string } };
}

interface Props {
  appointment: InvoiceAppointment;
}

export default function InvoiceClient({ appointment }: Props) {
  const router = useRouter();
  const { lang } = useLanguage();

  const localizedCopy = localizeTreeFromMemory({
    printInvoice: 'Print or save PDF',
    tagline: 'Empowering your legal needs',
    supportEmail: 'support@lexindia.in',
    backToDashboard: 'Back to dashboard',
    invoiceHeading: 'Invoice',
    receiptIdLabel: 'Receipt ID',
    dateIssuedLabel: 'Date issued',
    billedToLabel: 'Billed to',
    consultantLabel: 'Consultant',
    descriptionLabel: 'Description',
    amountLabel: 'Amount',
    scheduledForLabel: 'Scheduled for',
    subtotalLabel: 'Subtotal',
    gstLabel: 'GST (18%)',
    totalPaidLabel: 'Total paid',
    statusLabel: 'Status',
    transactionIdLabel: 'Transaction ID',
    transactionFallback: 'N/A',
    trustFooter: 'Thank you for trusting LexIndia.',
    consultationSuffix: 'Legal consultation',
    modeVideo: 'Video',
    modeCall: 'Call',
    modeChat: 'Chat',
    paymentPaid: 'Paid',
    paymentPending: 'Pending',
    paymentFailed: 'Failed',
  } as const, lang);

  const copy = localizedCopy;

  const handlePrint = () => window.print();
  const modeLabel =
    appointment.mode === 'VIDEO'
      ? copy.modeVideo
      : appointment.mode === 'CALL'
        ? copy.modeCall
        : appointment.mode === 'CHAT'
          ? copy.modeChat
          : appointment.mode;

  const paymentStatusLabel =
    appointment.paymentStatus === 'PAID'
      ? copy.paymentPaid
      : appointment.paymentStatus === 'PENDING'
        ? copy.paymentPending
        : appointment.paymentStatus === 'FAILED'
          ? copy.paymentFailed
          : appointment.paymentStatus;

  const consultationDate = new Date(appointment.date);
  const formattedConsultationDate = formatDate(consultationDate, lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedIssueDate = formatDate(appointment.createdAt, lang);

  const baseAmount = appointment.amount || 0;
  const gstRate = 0.18;
  const gstAmount = baseAmount * gstRate;
  const totalAmount = Math.round(baseAmount + gstAmount);

  const receiptId =
    appointment.razorpayPaymentId || `RCPT-${appointment.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-muted px-4 py-8 print:bg-background print:py-0">
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backToDashboard}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Printer className="h-4 w-4" />
          {copy.printInvoice}
        </button>
      </div>

      <div className="mx-auto min-h-[800px] max-w-3xl border border-border bg-background p-10 shadow-xl print:border-none print:shadow-none md:p-16">
        <div className="mb-8 flex items-start justify-between border-b border-border pb-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary">
              <Scale className="h-8 w-8" />
              <span className="text-2xl font-extrabold tracking-tight">LexIndia</span>
            </div>
            <p className="text-sm text-muted-foreground">{copy.tagline}</p>
            <p className="mt-1 text-sm text-muted-foreground">{copy.supportEmail}</p>
          </div>
          <div className="text-right">
            <h1 className="mb-2 text-4xl font-bold uppercase tracking-widest text-muted-foreground/35">
              {copy.invoiceHeading}
            </h1>
            <p className="mb-1 font-semibold text-foreground">
              {copy.receiptIdLabel}: {receiptId}
            </p>
            <p className="text-sm text-muted-foreground">
              {copy.dateIssuedLabel}: {formattedIssueDate}
            </p>
          </div>
        </div>

        <div className="mb-12 flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {copy.billedToLabel}
            </p>
            <p className="font-bold text-foreground">{appointment.citizen.name}</p>
            <p className="text-sm text-muted-foreground">{appointment.citizen.email}</p>
          </div>
          <div className="sm:text-right">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {copy.consultantLabel}
            </p>
            <p className="font-bold text-foreground">{appointment.lawyer.user.name}</p>
            <p className="text-sm text-muted-foreground">{appointment.lawyer.user.email}</p>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="py-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {copy.descriptionLabel}
                </th>
                <th className="py-3 text-right text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {copy.amountLabel}
                </th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-b border-border">
                <td className="py-5">
                  <p className="font-semibold">
                    {modeLabel} {copy.consultationSuffix}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {copy.scheduledForLabel}: {formattedConsultationDate}
                  </p>
                </td>
                <td className="py-5 text-right font-medium">{formatCurrency(baseAmount, lang)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-16 flex justify-end">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{copy.subtotalLabel}</span>
              <span>{formatCurrency(baseAmount, lang)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{copy.gstLabel}</span>
              <span>{formatCurrency(gstAmount, lang)}</span>
            </div>
            <div className="my-2 h-px w-full bg-border" />
            <div className="flex items-center justify-between text-xl font-bold text-foreground">
              <span>{copy.totalPaidLabel}</span>
              <span>{formatCurrency(totalAmount, lang)}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-8">
          <div>
            <p className="mb-1 text-sm font-bold text-primary">
              {copy.statusLabel}: {paymentStatusLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              {copy.transactionIdLabel}: {appointment.razorpayOrderId ?? copy.transactionFallback}
            </p>
          </div>
          <div>
            <p className="text-right text-xs text-muted-foreground">{copy.trustFooter}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

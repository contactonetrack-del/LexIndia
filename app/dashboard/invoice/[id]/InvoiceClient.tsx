'use client';

import React from 'react';
import { Scale, Printer, Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Props {
  appointment: any; // Type accurately in production
}

export default function InvoiceClient({ appointment }: Props) {
  const router = useRouter();
  const handlePrint = () => window.print();

  const d = new Date(appointment.date);
  const formattedDate = d.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Basic math definitions
  const baseAmount = appointment.amount || 0;
  const gstRate = 0.18;
  const gstAmount = baseAmount * gstRate;
  const totalAmount = baseAmount + gstAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white print:py-0">
      
      {/* NO-PRINT Toolbar */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1E3A8A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <button
          onClick={handlePrint}
          className="bg-[#1E3A8A] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* INVOICE PAPER */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl min-h-[800px] border border-gray-100 print:shadow-none print:border-none p-10 md:p-16">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#1E3A8A]">
              <Scale className="w-8 h-8" />
              <span className="text-2xl font-extrabold tracking-tight">LexIndia</span>
            </div>
            <p className="text-gray-500 text-sm">Empowering Your Legal Needs</p>
            <p className="text-gray-500 text-sm mt-1">support@lexindia.com</p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold text-gray-200 mb-2 tracking-widest uppercase">INVOICE</h1>
            <p className="text-gray-700 font-semibold mb-1">Receipt ID: {appointment.razorpayPaymentId || `RCPT-${appointment.id.slice(0, 8).toUpperCase()}`}</p>
            <p className="text-gray-500 text-sm">Date Issued: {new Date(appointment.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* Bill To / From */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 mb-12">
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To</p>
            <p className="font-bold text-gray-900">{appointment.citizen.name}</p>
            <p className="text-sm text-gray-500">{appointment.citizen.email}</p>
          </div>
          <div className="sm:text-right">
             <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Consultant</p>
             <p className="font-bold text-gray-900">{appointment.lawyer.user.name}</p>
             <p className="text-sm text-gray-500">{appointment.lawyer.user.email}</p>
          </div>
        </div>

        {/* Tables */}
        <div className="mb-8">
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b-2 border-gray-200">
                    <th className="py-3 text-sm text-gray-400 uppercase tracking-widest font-semibold">Description</th>
                    <th className="py-3 text-sm text-gray-400 uppercase tracking-widest font-semibold text-right">Amount</th>
                 </tr>
              </thead>
              <tbody className="text-gray-800">
                 <tr className="border-b border-gray-100">
                    <td className="py-5">
                      <p className="font-semibold">{appointment.mode} Legal Consultation</p>
                      <p className="text-sm text-gray-500 mt-1">Scheduled for: {formattedDate}</p>
                    </td>
                    <td className="py-5 text-right font-medium">₹{baseAmount.toLocaleString()}</td>
                 </tr>
              </tbody>
           </table>
        </div>

        {/* Totals Box */}
        <div className="flex justify-end mb-16">
          <div className="w-full max-w-sm space-y-3">
             <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{baseAmount.toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center text-sm text-gray-600">
                <span>GST (18%)</span>
                <span>₹{gstAmount.toLocaleString()}</span>
             </div>
             <div className="w-full h-px bg-gray-200 my-2" />
             <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                <span>Total Paid</span>
                <span>₹{Math.round(totalAmount).toLocaleString()}</span>
             </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-gray-200 pt-8 mt-auto flex justify-between items-end">
           <div>
              <p className="font-bold text-[#1E3A8A] text-sm mb-1">Status: {appointment.paymentStatus}</p>
              <p className="text-xs text-gray-400">Transaction ID: {appointment.razorpayOrderId ?? 'N/A'}</p>
           </div>
           <div>
              <p className="text-xs text-gray-400 text-right">Thank you for trusting LexIndia.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

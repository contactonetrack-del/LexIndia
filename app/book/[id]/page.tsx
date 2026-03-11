'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Calendar as CalendarIcon, Clock, Video, Phone, MessageSquare,
  Upload, ShieldCheck, ChevronLeft, CheckCircle2, Loader2,
  AlertTriangle, User
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface LawyerInfo {
  id: string;
  consultationFee: number;
  isVerified: boolean;
  user: { name: string | null; image: string | null };
  specializations: { name: string }[];
  modes: { mode: string }[];
}

const TIME_SLOTS = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];
const MODE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  VIDEO: { label: 'Video Call', icon: <Video className="w-6 h-6 mb-2" /> },
  CALL: { label: 'Voice Call', icon: <Phone className="w-6 h-6 mb-2" /> },
  CHAT: { label: 'Chat', icon: <MessageSquare className="w-6 h-6 mb-2" /> },
};

// Convert "10:00 AM" + date string into ISO datetime
function buildDateTime(dateStr: string, timeSlot: string): string {
  const [time, meridiem] = timeSlot.split(' ');
  const [rawHour, min] = time.split(':').map(Number);
  let hour = rawHour;
  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  const d = new Date(dateStr);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

const loadRazorpay = () => new Promise((resolve) => {
  if (typeof window === 'undefined') return resolve(false);
  if ((window as any).Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const lawyerId = params?.id as string;
  const { data: session, status: sessionStatus } = useSession();

  const [lawyer, setLawyer] = useState<LawyerInfo | null>(null);
  const [lawyerLoading, setLawyerLoading] = useState(true);
  const [lawyerError, setLawyerError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [issueDesc, setIssueDesc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    id: string; date: string; mode: string;
  } | null>(null);

  // Fetch lawyer profile
  const loadLawyer = useCallback(async () => {
    if (!lawyerId) return;
    try {
      const res = await fetch(`/api/lawyers/${lawyerId}`);
      if (res.status === 404) { setLawyerError('not_found'); return; }
      if (!res.ok) throw new Error('fetch_failed');
      const data = await res.json();
      setLawyer(data.lawyer);
    } catch {
      setLawyerError('fetch_failed');
    } finally {
      setLawyerLoading(false);
    }
  }, [lawyerId]);

  useEffect(() => { loadLawyer(); }, [loadLawyer]);

  const isFirstConsultation = true; // Hardcoded hook for conversion optimization
  const gst = isFirstConsultation || !lawyer ? 0 : Math.round(lawyer.consultationFee * 0.18);
  const total = isFirstConsultation || !lawyer ? 0 : lawyer.consultationFee + gst;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleConfirmBooking = async () => {
    if (!session?.user || !lawyer) return;
    setIsSubmitting(true);

    const isoDate = buildDateTime(selectedDate, selectedTime);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyerId: lawyer.id,
          date: isoDate,
          mode: selectedMode,
          notes: issueDesc,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        toast.error('This time slot was just taken. Please go back and choose another.');
        setIsSubmitting(false);
        return;
      }
      if (!res.ok) {
        toast.error(data.error ?? 'Booking failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const { appointment, razorpayOrderId, amount, currency } = data;

      if (razorpayOrderId) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          toast.error('Failed to load payment gateway. Please check your connection.');
          setIsSubmitting(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SPdmB9aXnSTcC5',
          amount: amount,
          currency: currency,
          name: 'LexIndia',
          description: `Consultation with ${lawyer.user.name}`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
             toast.loading('Verifying payment...', { id: 'payment-verify' });
             try {
                const verifyRes = await fetch('/api/payment/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });
                
                if (verifyRes.ok) {
                  setConfirmedAppointment({
                    id: appointment.id,
                    date: `${selectedDate} at ${selectedTime}`,
                    mode: selectedMode,
                  });
                  setStep(4);
                  toast.success('Payment successful! Consultation confirmed.', { id: 'payment-verify' });
                } else {
                  toast.error('Payment verification failed. Please contact support.', { id: 'payment-verify' });
                }
             } catch (err) {
                toast.error('An error occurred during verification.', { id: 'payment-verify' });
             }
          },
          prefill: {
            name: session.user.name,
            email: session.user.email,
          },
          theme: { color: '#1E3A8A' }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on('payment.failed', function (response: any) {
           toast.error(`Payment failed: ${response.error.description}`);
        });
        razorpay.open();
        setIsSubmitting(false); // Enable buttons immediately since modal takes over
      } else {
        // Free consultation / Zero amount flow
        setConfirmedAppointment({
          id: appointment.id,
          date: `${selectedDate} at ${selectedTime}`,
          mode: selectedMode,
        });
        setStep(4);
        toast.success('Consultation booked successfully!');
        setIsSubmitting(false);
      }
    } catch {
      toast.error('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (lawyerLoading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1E3A8A] dark:text-blue-500 animate-spin" />
      </div>
    );
  }

  // — Lawyer not found —
  if (lawyerError === 'not_found' || !lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lawyer Not Found</h1>
        <Link href="/lawyers" className="mt-4 bg-[#1E3A8A] dark:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 dark:hover:bg-blue-700">
          Browse Lawyers
        </Link>
      </div>
    );
  }

  // — Not logged in — redirect to sign in
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center text-center px-4">
        <User className="w-12 h-12 text-[#1E3A8A] dark:text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In to Book</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You need to be signed in to book a consultation.</p>
        <Link href="/" className="bg-[#1E3A8A] dark:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 dark:hover:bg-blue-700">
          Go to Homepage & Sign In
        </Link>
      </div>
    );
  }

  // — Success screen —
  if (step === 4 && confirmedAppointment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your consultation with <strong>{lawyer.user.name}</strong> is scheduled for{' '}
            <strong>{confirmedAppointment.date}</strong>.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Mode</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">{confirmedAppointment.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Amount</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Booking ID</span>
              <span className="font-medium text-gray-900 dark:text-white text-xs">{confirmedAppointment.id.slice(0, 16)}…</span>
            </div>
          </div>
          <Link
            href="/dashboard/citizen"
            className="block w-full bg-[#1E3A8A] dark:bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
          >
            Go to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const availableModes = lawyer.modes.map(m => m.mode);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => step > 1 ? handleBack() : router.back()}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book Consultation</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Time & Mode', 'Details', 'Confirm'].map((label, i) => (
              <span key={label} className={`text-sm font-medium ${step >= i + 1 ? 'text-[#1E3A8A] dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{label}</span>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-[#1E3A8A] dark:bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Lawyer Banner */}
          <div className="bg-[#1E3A8A] dark:bg-gray-800 p-6 text-white flex items-center gap-4 border-b border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 relative shrink-0 bg-blue-800 flex items-center justify-center">
              {lawyer.user.image ? (
                <Image src={lawyer.user.image} alt={lawyer.user.name ?? 'Lawyer'} fill className="object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-white text-2xl font-bold">{(lawyer.user.name ?? 'L')[0]}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">{lawyer.user.name}</h2>
              <div className="text-blue-200 text-sm flex items-center gap-2 flex-wrap mt-1">
                <span>{lawyer.specializations[0]?.name ?? 'Legal Expert'}</span>
                <span>•</span>
                <span className="line-through opacity-70">₹{lawyer.consultationFee}/session</span>
                <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs font-bold border border-green-500/30">First Consultation Free ✨</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* STEP 1: Time & Mode */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">1. Select Consultation Mode</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {availableModes.map(mode => (
                      <button
                        key={mode}
                        onClick={() => setSelectedMode(mode)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedMode === mode ? 'border-[#1E3A8A] dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'}`}
                      >
                        {MODE_LABELS[mode]?.icon ?? <MessageSquare className="w-6 h-6 mb-2" />}
                        <span className="font-medium">{MODE_LABELS[mode]?.label ?? mode}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">2. Select Date</h3>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 dark:focus:ring-blue-500/20 focus:border-[#1E3A8A] dark:focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">3. Select Time Slot</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${selectedTime === time ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                          <Clock className="w-4 h-4" /> {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  disabled={!selectedMode || !selectedDate || !selectedTime}
                  className="w-full bg-[#D4AF37] text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Continue to Details
                </button>
              </div>
            )}

            {/* STEP 2: Issue Description */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Briefly describe your legal issue</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This helps the lawyer prepare. Minimum 20 characters.</p>
                  <textarea
                    rows={5}
                    value={issueDesc}
                    onChange={e => setIssueDesc(e.target.value)}
                    placeholder="E.g., I have a property dispute with my landlord regarding the security deposit..."
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 dark:focus:ring-blue-500/20 focus:border-[#1E3A8A] dark:focus:border-blue-500 outline-none transition-all resize-none"
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{issueDesc.length}/2000</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Documents (Optional)</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Attach any relevant notices, FIRs, or agreements. (Feature coming soon)</p>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Document uploads coming soon</p>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={issueDesc.trim().length < 20}
                  className="w-full bg-[#D4AF37] text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Confirm
                </button>
              </div>
            )}

            {/* STEP 3: Confirm Booking */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Lawyer</span>
                      <span className="font-medium text-gray-900 dark:text-white">{lawyer.user.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedDate} at {selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Mode</span>
                      <span className="font-medium text-gray-900 dark:text-white">{MODE_LABELS[selectedMode]?.label ?? selectedMode}</span>
                    </div>
                  </div>
                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Consultation Fee</span>
                      <span className="font-medium text-gray-900 dark:text-white line-through text-gray-400 dark:text-gray-500">₹{lawyer.consultationFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                      <span className="font-medium text-gray-900 dark:text-white line-through text-gray-400 dark:text-gray-500">₹{lawyer ? Math.round(lawyer.consultationFee * 0.18) : 0}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                      <span className="text-gray-900 dark:text-white flex items-center gap-2">Total Amount <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">First Free ✨</span></span>
                      <span className="text-green-600 dark:text-green-500">Free</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-[#1E3A8A] dark:text-blue-400 shrink-0" />
                  <p>Payments are secure and encrypted. 100% refund if the lawyer cancels or reschedules.</p>
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-sm">{submitError}</p>
                  </div>
                )}

                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="w-full bg-[#1E3A8A] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                  ) : (
                    `Confirm Free Booking`
                  )}
                </button>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  By confirming, you agree to LexIndia&apos;s{' '}
                  <Link href="/terms" target="_blank" className="underline dark:text-blue-400">Terms of Service</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, Video, Phone, MessageSquare, Upload, ShieldCheck, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock Data (In a real app, fetch this based on the ID)
const MOCK_LAWYERS: Record<string, any> = {
  '1': { name: 'Adv. Rajesh Kumar', fee: 1500, image: 'https://picsum.photos/seed/lawyer1/200/200', modes: ['video', 'call', 'in-person'], spec: 'Criminal Law' },
  '2': { name: 'Adv. Priya Sharma', fee: 2000, image: 'https://picsum.photos/seed/lawyer2/200/200', modes: ['video', 'chat'], spec: 'Corporate Law' },
  '3': { name: 'Adv. Amit Patel', fee: 1200, image: 'https://picsum.photos/seed/lawyer3/200/200', modes: ['call', 'in-person'], spec: 'Civil Law' },
  '4': { name: 'Adv. Sneha Reddy', fee: 800, image: 'https://picsum.photos/seed/lawyer4/200/200', modes: ['video', 'call', 'chat'], spec: 'Family Law' },
};

const TIME_SLOTS = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const lawyerId = params.id as string;
  const lawyer = MOCK_LAWYERS[lawyerId] || MOCK_LAWYERS['1']; // Fallback

  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [issueDesc, setIssueDesc] = useState('');

  const [bookingId, setBookingId] = useState('');

  React.useEffect(() => {
    setBookingId(`LEX-${Math.floor(Math.random() * 1000000)}`);
  }, []);

  const handleNext = () => {
    if (step === 3) {
      const newBooking = {
        id: bookingId,
        lawyerId,
        lawyerName: lawyer.name,
        date: selectedDate,
        time: selectedTime,
        mode: selectedMode,
        status: 'upcoming',
        fee: total,
        issue: issueDesc
      };
      const existing = JSON.parse(localStorage.getItem('lexindia_bookings') || '[]');
      localStorage.setItem('lexindia_bookings', JSON.stringify([...existing, newBooking]));
    }
    setStep(prev => prev + 1);
  };
  const handleBack = () => setStep(prev => prev - 1);

  const gst = Math.round(lawyer.fee * 0.18);
  const total = lawyer.fee + gst;

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            Your consultation with {lawyer.name} is scheduled for {selectedDate} at {selectedTime}.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Mode:</span>
              <span className="font-medium text-gray-900 capitalize">{selectedMode}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-medium text-gray-900">₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Booking ID:</span>
              <span className="font-medium text-gray-900">{bookingId}</span>
            </div>
          </div>
          <Link href="/" className="block w-full bg-[#1E3A8A] text-white font-semibold py-3 rounded-xl hover:bg-blue-800 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => step > 1 ? handleBack() : router.back()} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Book Consultation</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-[#1E3A8A]' : 'text-gray-400'}`}>Time & Mode</span>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-[#1E3A8A]' : 'text-gray-400'}`}>Details</span>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-[#1E3A8A]' : 'text-gray-400'}`}>Payment</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#1E3A8A] h-2 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Lawyer Info Banner */}
          <div className="bg-[#1E3A8A] p-6 text-white flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 relative shrink-0">
              <Image src={lawyer.image} alt={lawyer.name} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{lawyer.name}</h2>
              <p className="text-blue-200 text-sm">{lawyer.spec} • ₹{lawyer.fee}/session</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* STEP 1: Time & Mode */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Mode Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Select Consultation Mode</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {lawyer.modes.includes('video') && (
                      <button 
                        onClick={() => setSelectedMode('video')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedMode === 'video' ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                      >
                        <Video className="w-6 h-6 mb-2" />
                        <span className="font-medium">Video Call</span>
                      </button>
                    )}
                    {lawyer.modes.includes('call') && (
                      <button 
                        onClick={() => setSelectedMode('call')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedMode === 'call' ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                      >
                        <Phone className="w-6 h-6 mb-2" />
                        <span className="font-medium">Voice Call</span>
                      </button>
                    )}
                    {lawyer.modes.includes('chat') && (
                      <button 
                        onClick={() => setSelectedMode('chat')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${selectedMode === 'chat' ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}
                      >
                        <MessageSquare className="w-6 h-6 mb-2" />
                        <span className="font-medium">Chat</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Select Date</h3>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="animate-in fade-in duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Select Time Slot</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${selectedTime === time ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                          <Clock className="w-4 h-4" />
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleNext}
                  disabled={!selectedMode || !selectedDate || !selectedTime}
                  className="w-full bg-[#D4AF37] text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  Continue to Details
                </button>
              </div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Briefly describe your legal issue</h3>
                  <p className="text-sm text-gray-500 mb-4">This helps the lawyer prepare for your consultation.</p>
                  <textarea 
                    rows={5}
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                    placeholder="E.g., I have a property dispute with my landlord regarding the security deposit..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-4">Attach any relevant notices, FIRs, or agreements.</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-[#1E3A8A]">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={!issueDesc.trim()}
                  className="w-full bg-[#D4AF37] text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Consultation with</span>
                      <span className="font-medium text-gray-900">{lawyer.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date & Time</span>
                      <span className="font-medium text-gray-900">{selectedDate} at {selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mode</span>
                      <span className="font-medium text-gray-900 capitalize">{selectedMode}</span>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-medium text-gray-900">₹{lawyer.fee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-medium text-gray-900">₹{gst}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 mt-2">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-[#1E3A8A]">₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-[#1E3A8A] shrink-0" />
                  <p>Payments are secure and encrypted. 100% refund if the lawyer cancels or reschedules.</p>
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full bg-[#1E3A8A] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Pay ₹{total} Securely
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

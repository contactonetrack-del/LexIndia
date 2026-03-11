'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, CheckCircle2, ChevronRight, User, Briefcase, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'type', title: 'Case Type' },
  { id: 'details', title: 'Details' },
  { id: 'contact', title: 'Contact' }
];

const CATEGORIES = [
  { id: 'family', label: 'Family & Divorce', icon: User },
  { id: 'criminal', label: 'Criminal Defense', icon: ShieldCheck },
  { id: 'property', label: 'Property & Real Estate', icon: Briefcase },
  { id: 'corporate', label: 'Corporate & Startup', icon: FileText },
  { id: 'other', label: 'Other/Not Sure', icon: Scale },
];


export default function PreScreeningPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    urgency: 'Medium',
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      submitForm();
    }
  };

  const submitForm = () => {
    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">You&apos;re on the list!</h2>
          <p className="text-gray-600 mb-8">
            Our legal triage team is reviewing your details. We will match you with the best available expert and call you at <strong>{formData.phone}</strong> shortly to begin your free consultation.
          </p>
          <button
            onClick={() => router.push('/lawyers')}
            className="w-full bg-[#1E3A8A] text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors"
          >
            Browse Lawyers Meantime
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-[#1E3A8A]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Free Legal Pre-Screening
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answer a few quick questions so we can instantly match you with the highest-rated attorneys specializing in your exact legal situation.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1E3A8A] rounded-full -z-10 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            ></div>
            
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-50 px-2 text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                  index <= currentStep 
                    ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs font-semibold ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-10 mb-8 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">What kind of legal help do you need?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          formData.category === cat.id 
                            ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]' 
                            : 'border-gray-200 hover:border-[#1E3A8A]/50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <cat.icon className="w-5 h-5" />
                          <span className="font-semibold">{cat.label}</span>
                        </div>
                        {formData.category === cat.id && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us briefly about the situation.</h2>
                  <p className="text-gray-500 mb-6">Do not include highly sensitive personal information entirely. Keep it general so we understand the gravity.</p>
                  
                  <div className="space-y-4">
                    <textarea
                      rows={5}
                      className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all resize-none"
                      placeholder="e.g., I was suddenly terminated without a 30-day notice and denied my final severance package..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">How urgent is this matter?</label>
                      <select 
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none bg-white"
                        value={formData.urgency}
                        onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                      >
                        <option>Low - Just seeking advice</option>
                        <option>Medium - Exploring options</option>
                        <option>High - Upcoming hearing / Deadline imminent</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Where should we send your matches?</h2>
                  <p className="text-gray-500 mb-6">Your data is secured with AES-256 encryption and not shared externally without explicit permission.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="pt-8 mt-auto flex items-center justify-between border-t border-gray-100">
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 0 || isSubmitting}
              className={`font-semibold text-gray-500 hover:text-gray-900 transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting || (currentStep === 0 && !formData.category) || (currentStep === 2 && (!formData.name || !formData.phone))}
              className="bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Evaluating...' : currentStep === STEPS.length - 1 ? 'Get Fast Matches' : 'Continue'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

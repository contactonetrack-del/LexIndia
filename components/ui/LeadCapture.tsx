'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function LeadCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setStatus('loading');
    
    // Simulate API call to Add Subscriber
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="bg-[#1E3A8A] rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden relative border border-[#2B4B9F]">
      <div className="absolute top-0 right-0 -m-8 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -m-8 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Know Your Rights. Protect Your Future.</h3>
          <p className="text-blue-100 text-lg mb-6 max-w-xl mx-auto md:mx-0">
            Join 50,000+ Indians receiving vital legal updates, free templates, and practical advice every week.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-blue-200">
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Weekly updates</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Free eBook</span>
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-[#D4AF37]" /> No spam</span>
          </div>
        </div>

        <div className="w-full md:w-[400px] shrink-0 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">You&apos;re on the list!</h4>
                <p className="text-blue-100 text-sm">Check your inbox for your free Legal Rights Handbook.</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-inner"
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#D4AF37] text-gray-900 font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-yellow-500 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {status === 'loading' ? (
                    'Subscribing...'
                  ) : (
                    <>
                      Get Free Handbook
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-blue-200 mt-2">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

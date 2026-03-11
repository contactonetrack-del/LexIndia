'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    // Only run on client, check if already seen
    const seen = localStorage.getItem('lexindia-exit-intent-seen');
    if (seen === 'true') {
      return;
    }

    const mouseEvent = (e: MouseEvent) => {
      // Trigger if mouse leaves the top of the viewport
      if (!hasTriggered && e.clientY < 50 && e.movementY < 0) {
        setIsVisible(true);
        setHasTriggered(true);
        localStorage.setItem('lexindia-exit-intent-seen', 'true');
      }
    };

    document.addEventListener('mouseout', mouseEvent);

    return () => {
      document.removeEventListener('mouseout', mouseEvent);
    };
  }, [hasTriggered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setIsVisible(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-1 bg-white/50 backdrop-blur rounded-full"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="bg-[#1E3A8A] p-6 text-center text-white relative overflow-hidden">
              {/* Abstract pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              
              <div className="relative z-10 flex justify-center mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <Mail className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold relative z-10 mb-2">Wait! Don&apos;t Miss Out</h2>
              <p className="text-white/80 text-sm relative z-10">
                Get our exclusive &apos;Citizen Legal Rights Handbook&apos; before you go. Completely free.
              </p>
            </div>
            
            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Handbook Sent!</h3>
                  <p className="text-gray-600">
                    Check your inbox. We&apos;ve sent the PDF guide to your email address.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="exit-email" className="sr-only">Email address</label>
                    <input
                      id="exit-email"
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#1E3A8A] hover:bg-blue-800 text-white font-semibold flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : (
                      <>
                        Download Free Handbook <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-4">
                    We hate spam. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

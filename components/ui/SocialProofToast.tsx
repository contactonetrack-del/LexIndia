'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const NOTIFICATIONS = [
  { name: "Rahul D.", action: "booked a consultation with", lawyer: "Adv. Sharma", location: "Delhi", time: "2 mins ago" },
  { name: "Sneha P.", action: "downloaded the", document: "Free Legal Handbook", time: "5 mins ago" },
  { name: "Vikram S.", action: "booked a video call with", lawyer: "Adv. Kapoor", location: "Mumbai", time: "12 mins ago" },
  { name: "Priya M.", action: "found a trusted lawyer in", location: "Bangalore", time: "18 mins ago" },
  { name: "Arjun K.", action: "saved ₹2000 on their first consultation", time: "25 mins ago" },
];

export function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Don't show toast on dashboard or auth pages
  const isExcludedRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/login') || pathname?.startsWith('/register');

  useEffect(() => {
    if (isExcludedRoute) return;

    let timeoutId: NodeJS.Timeout;

    const showToast = () => {
      const nextIndex = Math.floor(Math.random() * NOTIFICATIONS.length);
      setCurrentIndex(nextIndex);
      setIsVisible(true);

      timeoutId = setTimeout(() => {
        setIsVisible(false);
        const nextDelay = Math.floor(Math.random() * 15000) + 15000;
        timeoutId = setTimeout(showToast, nextDelay);
      }, 5000);
    };

    // Initial delay before first toast
    timeoutId = setTimeout(showToast, 5000);

    return () => clearTimeout(timeoutId);
  }, [isExcludedRoute]);

  if (isExcludedRoute || currentIndex === -1) return null;

  const notification = NOTIFICATIONS[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm bg-white border border-gray-200 shadow-xl rounded-xl p-4 flex gap-4 pointer-events-auto"
        >
          <div className="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Close notification"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-sm text-gray-800 leading-snug pr-4">
              <span className="font-bold">{notification.name}</span> {notification.action}{' '}
              {notification.lawyer && <span className="font-bold text-[#1E3A8A]">{notification.lawyer}</span>}
              {notification.document && <span className="font-bold text-[#D4AF37]">{notification.document}</span>}
              {notification.location && <span> from <span className="font-medium">{notification.location}</span></span>}
            </p>
            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

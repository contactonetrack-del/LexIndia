'use client';

import React, { useState, useEffect } from 'react';
import { Type, Minus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    if (size === 'normal') {
      root.style.fontSize = '16px';
    } else if (size === 'large') {
      root.style.fontSize = '18px';
    } else if (size === 'xl') {
      root.style.fontSize = '20px';
    }
    localStorage.setItem('lexindia-text-size', size);
  };

  useEffect(() => {
    const saved = localStorage.getItem('lexindia-text-size');
    if (saved === 'large' || saved === 'xl') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFontSize(saved as any);
      applyFontSize(saved);
    }
  }, []);

  const handleSizeChange = (size: 'normal' | 'large' | 'xl') => {
    setFontSize(size);
    applyFontSize(size);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 border-l-0 shadow-md p-2 rounded-r-xl z-40 hover:bg-gray-50 transition-colors"
        aria-label="Open accessibility controls"
      >
        <Type className="w-5 h-5 text-[#1E3A8A]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed left-0 top-1/2 -translate-y-1/2 w-64 bg-white border border-gray-200 shadow-xl rounded-r-2xl z-50 overflow-hidden"
          >
            <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <Type className="w-5 h-5" /> Accessibility
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
                aria-label="Close accessibility controls"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Text Size</p>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleSizeChange('normal')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${fontSize === 'normal' ? 'bg-white shadow text-[#1E3A8A]' : 'text-gray-600 hover:text-gray-900'}`}
                    aria-label="Normal text size"
                    aria-pressed={fontSize === 'normal'}
                  >
                    Aa
                  </button>
                  <button
                    onClick={() => handleSizeChange('large')}
                    className={`flex-1 py-1.5 text-base font-medium rounded-md transition-colors ${fontSize === 'large' ? 'bg-white shadow text-[#1E3A8A]' : 'text-gray-600 hover:text-gray-900'}`}
                    aria-label="Large text size"
                    aria-pressed={fontSize === 'large'}
                  >
                    Aa
                  </button>
                  <button
                    onClick={() => handleSizeChange('xl')}
                    className={`flex-1 py-1.5 text-lg font-medium rounded-md transition-colors ${fontSize === 'xl' ? 'bg-white shadow text-[#1E3A8A]' : 'text-gray-600 hover:text-gray-900'}`}
                    aria-label="Extra large text size"
                    aria-pressed={fontSize === 'xl'}
                  >
                    Aa
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

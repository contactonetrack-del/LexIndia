'use client';

import React, { useState, useEffect } from 'react';
import { Type, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';

export default function AccessibilityControls() {
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(
    {
      openAria: 'Open accessibility controls',
      closeAria: 'Close accessibility controls',
      title: 'Accessibility',
      textSize: 'Text Size',
      normalAria: 'Normal text size',
      largeAria: 'Large text size',
      xlAria: 'Extra large text size',
    } as const,
    lang
  );
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>(() => {
    if (typeof window === 'undefined') {
      return 'normal';
    }

    const saved = localStorage.getItem('lexindia-text-size');
    return saved === 'large' || saved === 'xl' ? saved : 'normal';
  });

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
    applyFontSize(fontSize);
  }, [fontSize]);

  const handleSizeChange = (size: 'normal' | 'large' | 'xl') => {
    setFontSize(size);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-xl border border-border border-l-0 bg-surface p-2 shadow-md transition-colors hover:bg-surface-hover"
        aria-label={copy.openAria}
      >
        <Type className="w-5 h-5 text-primary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed left-0 top-1/2 z-50 w-64 -translate-y-1/2 overflow-hidden rounded-r-2xl border border-border bg-background shadow-xl"
          >
            <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
              <h3 className="font-bold flex items-center gap-2">
                <Type className="w-5 h-5" /> {copy.title}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground"
                aria-label={copy.closeAria}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">{copy.textSize}</p>
                <div className="flex rounded-lg bg-muted p-1">
                  <button
                    onClick={() => handleSizeChange('normal')}
                    className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${fontSize === 'normal' ? 'bg-background text-primary shadow' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-label={copy.normalAria}
                    aria-pressed={fontSize === 'normal'}
                  >
                    Aa
                  </button>
                  <button
                    onClick={() => handleSizeChange('large')}
                    className={`flex-1 rounded-md py-1.5 text-base font-medium transition-colors ${fontSize === 'large' ? 'bg-background text-primary shadow' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-label={copy.largeAria}
                    aria-pressed={fontSize === 'large'}
                  >
                    Aa
                  </button>
                  <button
                    onClick={() => handleSizeChange('xl')}
                    className={`flex-1 rounded-md py-1.5 text-lg font-medium transition-colors ${fontSize === 'xl' ? 'bg-background text-primary shadow' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-label={copy.xlAria}
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

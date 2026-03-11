'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AriaContextType {
  announce: (message: string) => void;
}

const AriaContext = createContext<AriaContextType | undefined>(undefined);

export function AriaAnnouncerProvider({ children }: { children: ReactNode }) {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message: string) => {
    setAnnouncement('');
    setTimeout(() => {
      setAnnouncement(message);
    }, 50);
  };

  return (
    <AriaContext.Provider value={{ announce }}>
      {children}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
    </AriaContext.Provider>
  );
}

export const useAriaAnnouncer = () => {
  const context = useContext(AriaContext);
  if (!context) {
    throw new Error('useAriaAnnouncer must be used within an AriaAnnouncerProvider');
  }
  return context;
};

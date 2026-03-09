'use client';

/**
 * AuthContext.tsx - Replaced with NextAuth SessionProvider
 * 
 * The old dummy AuthContext is replaced by next-auth's useSession hook.
 * This thin wrapper remains to manage the AuthModal open/close state.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { signOut } from 'next-auth/react';

interface AuthUIContextType {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => void;
}

const AuthUIContext = createContext<AuthUIContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <AuthUIContext.Provider value={{
      isAuthModalOpen,
      openAuthModal: () => setIsAuthModalOpen(true),
      closeAuthModal: () => setIsAuthModalOpen(false),
      logout,
    }}>
      {children}
    </AuthUIContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthUIContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

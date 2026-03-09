'use client';

/**
 * AuthContext.tsx - Replaced with NextAuth SessionProvider
 * 
 * The old dummy AuthContext is replaced by next-auth's useSession hook.
 * This thin wrapper remains to manage the AuthModal open/close state
 * and allows pre-configuring the modal's role and tab.
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { signOut } from 'next-auth/react';

export interface AuthModalOptions {
  initialTab?: 'login' | 'register';
  initialRole?: 'CITIZEN' | 'LAWYER';
}

interface AuthUIContextType {
  isAuthModalOpen: boolean;
  authOptions: AuthModalOptions;
  openAuthModal: (options?: AuthModalOptions) => void;
  closeAuthModal: () => void;
  logout: () => void;
}

const AuthUIContext = createContext<AuthUIContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authOptions, setAuthOptions] = useState<AuthModalOptions>({});

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const openAuthModal = (options?: AuthModalOptions) => {
    if (options) {
      setAuthOptions(options);
    } else {
      setAuthOptions({}); // Reset options if none provided
    }
    setIsAuthModalOpen(true);
  };

  return (
    <AuthUIContext.Provider value={{
      isAuthModalOpen,
      authOptions,
      openAuthModal,
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

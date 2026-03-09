'use client';

import { useAuth } from '@/lib/AuthContext';
import AuthModal from '@/components/AuthModal';

export default function AuthModalWrapper() {
    const { isAuthModalOpen, closeAuthModal } = useAuth();
    return <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />;
}

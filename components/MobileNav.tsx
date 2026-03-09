'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, BookOpen, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useSession } from 'next-auth/react';

export default function MobileNav() {
  const pathname = usePathname();
  const { openAuthModal } = useAuth();
  const { data: session } = useSession();
  const userRole = session?.user?.role?.toLowerCase() ?? null;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Lawyers', href: '/lawyers', icon: Search },
    { name: 'Rights', href: '/knowledge', icon: BookOpen },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-[#1E3A8A]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-blue-50' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}

        {userRole ? (
          <Link
            href={`/dashboard/${userRole}`}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${pathname.includes('/dashboard') ? 'text-[#1E3A8A]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <User className={`w-5 h-5 ${pathname.includes('/dashboard') ? 'fill-blue-50' : ''}`} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-900"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Login</span>
          </button>
        )}
      </div>
    </div>
  );
}

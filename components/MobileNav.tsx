'use client';

import React from 'react';
import { BookOpen, Home, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import LocaleLink from '@/components/LocaleLink';
import { getLocalizedText } from '@/lib/content/localized';
import { shellCopy } from '@/lib/content/public-ui';
import { useAuth } from '@/lib/AuthContext';
import { useLanguage } from '@/lib/LanguageContext';
import { getPathWithoutLocale } from '@/lib/i18n/navigation';

export default function MobileNav() {
  const pathname = usePathname();
  const { openAuthModal } = useAuth();
  const { data: session } = useSession();
  const { fontClass, lang, t } = useLanguage();

  const userRole = session?.user?.role?.toLowerCase() ?? null;
  const currentPath = getPathWithoutLocale(pathname || '/');
  const homeLabel = getLocalizedText(shellCopy.home, lang);

  const navItems = [
    { name: homeLabel, href: '/', icon: Home },
    { name: t.nav.lawyers, href: '/lawyers', icon: Search },
    { name: t.nav.rights, href: '/rights', icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          const Icon = item.icon;
          return (
            <LocaleLink
              key={item.name}
              href={item.href}
              className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/10' : ''}`} />
              <span className={`text-[10px] font-medium ${fontClass}`}>{item.name}</span>
            </LocaleLink>
          );
        })}

        {userRole ? (
          <LocaleLink
            href={`/dashboard/${userRole}`}
            className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${currentPath.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <User className={`h-5 w-5 ${currentPath.startsWith('/dashboard') ? 'fill-primary/10' : ''}`} />
            <span className={`text-[10px] font-medium ${fontClass}`}>{t.dashboard.title}</span>
          </LocaleLink>
        ) : (
          <button
            onClick={() => openAuthModal()}
            className="flex h-full w-full flex-col items-center justify-center space-y-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <User className="h-5 w-5" />
            <span className={`text-[10px] font-medium ${fontClass}`}>{t.nav.login}</span>
          </button>
        )}
      </div>
    </div>
  );
}

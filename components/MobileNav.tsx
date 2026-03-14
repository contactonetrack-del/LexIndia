'use client';

import React from 'react';
import { BookOpen, Home, Landmark, Search, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import LocaleLink from '@/components/LocaleLink';
import { getLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { shellCopy } from '@/lib/content/public-ui';
import { useAuth } from '@/lib/AuthContext';
import { getDashboardPath } from '@/lib/dashboard';
import { useAdminQueueSummary } from '@/hooks/useAdminQueueSummary';
import { useLanguage } from '@/lib/LanguageContext';
import { getPathWithoutLocale } from '@/lib/i18n/navigation';

export default function MobileNav() {
  const pathname = usePathname();
  const { openAuthModal } = useAuth();
  const { data: session } = useSession();
  const { fontClass, lang, t } = useLanguage();

  const dashboardHref = session?.user ? getDashboardPath(session.user) : null;
  const adminQueueSummary = useAdminQueueSummary(Boolean(session?.user?.isAdmin));
  const currentPath = getPathWithoutLocale(pathname || '/');
  const homeLabel = getLocalizedText(shellCopy.home, lang);
  const lawsLabel = localizeTreeFromMemory({ laws: 'Indian Laws' } as const, lang).laws;

  const navItems = [
    { name: homeLabel, href: '/', icon: Home },
    { name: t.nav.lawyers, href: '/lawyers', icon: Search },
    { name: lawsLabel, href: '/laws', icon: Landmark },
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
              data-testid={item.href === '/laws' ? 'mobile-nav-laws-link' : undefined}
              className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-primary/10' : ''}`} />
              <span className={`text-[10px] font-medium ${fontClass}`}>{item.name}</span>
            </LocaleLink>
          );
        })}

        {session?.user ? (
          <LocaleLink
            href={dashboardHref ?? '/dashboard/citizen'}
            data-testid="mobile-nav-dashboard-link"
            className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${currentPath.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <span className="relative">
              <User className={`h-5 w-5 ${currentPath.startsWith('/dashboard') ? 'fill-primary/10' : ''}`} />
              {session.user.isAdmin && adminQueueSummary.pendingTotal > 0 ? (
                <span data-testid="mobile-nav-admin-review-badge" className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold leading-none text-danger-foreground">
                  {adminQueueSummary.pendingTotal > 9 ? '9+' : adminQueueSummary.pendingTotal}
                </span>
              ) : null}
            </span>
            <span className={`text-[10px] font-medium ${fontClass}`}>{t.dashboard.title}</span>
          </LocaleLink>
        ) : (
          <button
            onClick={() => openAuthModal()}
            data-testid="mobile-nav-login-button"
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

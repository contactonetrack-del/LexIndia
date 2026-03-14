'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { localizeTemplateText, localizeTreeFromMemory } from '@/lib/content/localized';
import { formatRelativeTime } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';
import { getPathWithoutLocale } from '@/lib/i18n/navigation';

const notifications = [
  { name: 'Rahul D.', type: 'consultation', lawyer: 'Adv. Sharma', location: 'Delhi', minutesAgo: 2 },
  { name: 'Sneha P.', type: 'downloaded', document: 'Free Legal Handbook', minutesAgo: 5 },
  { name: 'Vikram S.', type: 'videoCall', lawyer: 'Adv. Kapoor', location: 'Mumbai', minutesAgo: 12 },
  { name: 'Priya M.', type: 'foundLawyer', location: 'Bangalore', minutesAgo: 18 },
  { name: 'Arjun K.', type: 'savedMoney', minutesAgo: 25 },
];

export function SocialProofToast() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const copy = localizeTreeFromMemory(
    {
      closeNotificationAria: 'Close notification',
      consultationTemplate: '{name} booked a consultation with {lawyer} from {location}',
      downloadedTemplate: '{name} downloaded the {document}',
      videoCallTemplate: '{name} booked a video call with {lawyer} from {location}',
      foundLawyerTemplate: '{name} found a trusted lawyer in {location}',
      savedMoneyTemplate: '{name} viewed a verified lawyer profile',
    } as const,
    lang
  );
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const pathWithoutLocale = getPathWithoutLocale(pathname || '/');

  const isExcludedRoute =
    pathWithoutLocale.startsWith('/dashboard') ||
    pathWithoutLocale.startsWith('/login') ||
    pathWithoutLocale.startsWith('/register');

  useEffect(() => {
    if (isExcludedRoute) return;

    let timeoutId: NodeJS.Timeout;

    const showToast = () => {
      const nextIndex = Math.floor(Math.random() * notifications.length);
      setCurrentIndex(nextIndex);
      setIsVisible(true);

      timeoutId = setTimeout(() => {
        setIsVisible(false);
        const nextDelay = Math.floor(Math.random() * 15000) + 15000;
        timeoutId = setTimeout(showToast, nextDelay);
      }, 5000);
    };

    timeoutId = setTimeout(showToast, 5000);

    return () => clearTimeout(timeoutId);
  }, [isExcludedRoute]);

  if (isExcludedRoute || currentIndex === -1) return null;

  const notification = notifications[currentIndex];
  const body =
    notification.type === 'consultation'
      ? localizeTemplateText(copy.consultationTemplate, lang, {
          name: notification.name,
          lawyer: notification.lawyer ?? '',
          location: notification.location ?? '',
        })
      : notification.type === 'downloaded'
        ? localizeTemplateText(copy.downloadedTemplate, lang, {
            name: notification.name,
            document: notification.document ?? '',
          })
        : notification.type === 'videoCall'
          ? localizeTemplateText(copy.videoCallTemplate, lang, {
              name: notification.name,
              lawyer: notification.lawyer ?? '',
              location: notification.location ?? '',
            })
          : notification.type === 'foundLawyer'
            ? localizeTemplateText(copy.foundLawyerTemplate, lang, {
                name: notification.name,
                location: notification.location ?? '',
              })
            : localizeTemplateText(copy.savedMoneyTemplate, lang, {
                name: notification.name,
              });
  const timeLabel = formatRelativeTime(-notification.minutesAgo, 'minute', lang);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="pointer-events-auto fixed bottom-6 left-6 z-50 flex max-w-sm gap-4 rounded-xl border border-border bg-surface p-4 shadow-xl"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div className="flex-1">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label={copy.closeNotificationAria}
            >
              <X className="h-3 w-3" />
            </button>
            <p className="pr-4 text-sm leading-snug text-foreground">{body}</p>
            <p className="mt-1 text-xs text-muted-foreground">{timeLabel}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

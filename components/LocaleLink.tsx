'use client';

import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

import { useLanguage } from '@/lib/LanguageContext';
import { localizeHref } from '@/lib/i18n/navigation';

type LinkAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
type NextLinkPropsWithoutHref = Omit<LinkProps, 'href'>;
type LocaleLinkProps = PropsWithChildren<
  LinkAnchorProps &
    NextLinkPropsWithoutHref & {
      href: string;
    }
>;

export default function LocaleLink({ children, href, ...props }: LocaleLinkProps) {
  const { lang } = useLanguage();
  return (
    <Link href={localizeHref(href, lang)} {...props}>
      {children}
    </Link>
  );
}

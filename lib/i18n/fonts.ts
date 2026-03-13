import type { CSSProperties } from 'react';

import {
  Inter,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
  Noto_Sans_Gurmukhi,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_Oriya,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
} from 'next/font/google';

import { getLocaleFontToken, type Locale } from '@/lib/i18n/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const devanagari = Noto_Sans_Devanagari({
  weight: ['400', '500', '600', '700'],
  subsets: ['devanagari', 'latin'],
  variable: '--font-devanagari',
});

const bengali = Noto_Sans_Bengali({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-bengali',
});

const telugu = Noto_Sans_Telugu({
  weight: ['400', '500', '600', '700'],
  subsets: ['telugu', 'latin'],
  variable: '--font-telugu',
});

const tamil = Noto_Sans_Tamil({
  weight: ['400', '500', '600', '700'],
  subsets: ['tamil', 'latin'],
  variable: '--font-tamil',
});

const gujarati = Noto_Sans_Gujarati({
  weight: ['400', '500', '600', '700'],
  subsets: ['gujarati', 'latin'],
  variable: '--font-gujarati',
});

const gurmukhi = Noto_Sans_Gurmukhi({
  weight: ['400', '500', '600', '700'],
  subsets: ['gurmukhi', 'latin'],
  variable: '--font-gurmukhi',
});

const kannada = Noto_Sans_Kannada({
  weight: ['400', '500', '600', '700'],
  subsets: ['kannada', 'latin'],
  variable: '--font-kannada',
});

const malayalam = Noto_Sans_Malayalam({
  weight: ['400', '500', '600', '700'],
  subsets: ['malayalam', 'latin'],
  variable: '--font-malayalam',
});

const oriya = Noto_Sans_Oriya({
  weight: ['400', '500', '600', '700'],
  subsets: ['oriya', 'latin'],
  variable: '--font-oriya',
});

const urdu = Noto_Nastaliq_Urdu({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-urdu',
});

export const fontVariablesClassName = [
  inter.variable,
  devanagari.variable,
  bengali.variable,
  telugu.variable,
  tamil.variable,
  gujarati.variable,
  gurmukhi.variable,
  kannada.variable,
  malayalam.variable,
  oriya.variable,
  urdu.variable,
].join(' ');

export function getLocaleFontStyle(locale: Locale) {
  return {
    '--font-current-locale': `var(${getLocaleFontToken(locale)})`,
  } as CSSProperties;
}

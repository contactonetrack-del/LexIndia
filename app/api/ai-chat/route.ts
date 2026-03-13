import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

import { getMemoryLocalizedText } from '@/lib/content/localized';
import { isSupportedLocale } from '@/lib/i18n/config';
import { getApiLocale } from '@/lib/i18n/api';
import { languageNames } from '@/lib/i18n/messages';

export async function POST(req: NextRequest) {
  const requestLocale = getApiLocale(req);
  const localizedFallbackError = getMemoryLocalizedText(
    'Something went wrong. Please try again.',
    requestLocale
  );

  try {
    const body = await req.json();
    const { message, history, locale: bodyLocale } = body;
    const locale = isSupportedLocale(bodyLocale) ? bodyLocale : requestLocale;
    const languageName = languageNames[locale] ?? languageNames.en;

    if (!message) {
      return NextResponse.json({ error: localizedFallbackError }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: localizedFallbackError }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Format history for GoogleGenAI
    const formattedHistory = [];
    if (history && Array.isArray(history)) {
       for (const msg of history) {
           formattedHistory.push({
               role: msg.role === 'user' ? 'user' : 'model',
               parts: msg.parts,
           });
       }
    }

    // Add current message to history
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: `You are LexIndia AI, a legal information assistant. Respond in ${languageName}. Provide helpful, structured, and easy-to-understand legal information relevant to Indian law. Always add a disclaimer that you provide general information, not legal advice. Do not switch back to English unless the user explicitly asks for English.`,
      }
    });

    return NextResponse.json({ text: response.text });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: localizedFallbackError }, { status: 500 });
  }
}

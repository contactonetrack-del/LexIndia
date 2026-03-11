import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
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
        systemInstruction: "You are LexIndia AI, a legal information assistant. Provide helpful, structured, and easy-to-understand legal information relevant to Indian law. Always add a disclaimer that you provide general information, not legal advice.",
      }
    });

    return NextResponse.json({ text: response.text });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

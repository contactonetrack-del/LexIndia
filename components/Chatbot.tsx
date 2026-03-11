'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Scale, AlertTriangle, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import Markdown from 'react-markdown';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

type ApiHistory = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'model',
  text: `Hello! I'm **LexIndia AI**, your legal information assistant. I can help you understand:

- Your rights under Indian law
- Legal procedures and processes
- Which type of lawyer you may need

⚠️ *I provide general legal information only — not legal advice. For your specific situation, always consult a [verified lawyer](/lawyers).*

How can I help you today?`,
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildApiHistory = (msgs: Message[]): ApiHistory[] => {
    return msgs
      .filter((m) => m.id !== 'initial' && m.text.trim())
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setError(null);

    const userMsgId = `user-${Date.now()}`;
    const modelMsgId = `model-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', text: userText },
      { id: modelMsgId, role: 'model', text: '' },
    ]);
    setIsLoading(true);

    try {
      const history = buildApiHistory(messages);

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Unknown error');
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId ? { ...msg, text: data.text } : msg
        )
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errMsg);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId
            ? { ...msg, text: `⚠️ ${errMsg}` }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#1E3A8A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 transition-transform duration-300 z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open AI Legal Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 ${isExpanded ? 'w-[calc(100vw-3rem)] sm:w-[600px] h-[calc(100vh-3rem)] md:h-[700px]' : 'w-[380px] h-[600px] max-h-[80vh]'} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">LexIndia AI</h3>
              <p className="text-blue-200 text-xs">Legal Information Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-200 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              aria-label={isExpanded ? 'Minimize chat' : 'Maximize chat'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-200 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-2 flex items-start gap-2 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-amber-700 text-[10px] leading-relaxed">
            General legal information only — not legal advice.{' '}
            <Link href="/lawyers" className="underline font-semibold" onClick={() => setIsOpen(false)}>
              Book a verified lawyer
            </Link>{' '}
            for your specific case.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'ml-auto flex-row-reverse max-w-[85%]' : 'max-w-[92%]'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-[#D4AF37] text-gray-900' : 'bg-[#1E3A8A] text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#1E3A8A] text-white rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:my-1 prose-a:text-[#1E3A8A] prose-a:font-medium">
                    <Markdown
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} className="text-[#1E3A8A] underline" target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                            {children}
                            {href?.startsWith('http') && <ExternalLink className="w-3 h-3 inline ml-0.5" />}
                          </a>
                        ),
                      }}
                    >
                      {msg.text || (isLoading && msg.id === messages.at(-1)?.id ? '...' : '')}
                    </Markdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Book a Lawyer CTA (appears after 3 exchanges) */}
        {messages.length >= 5 && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between shrink-0">
            <p className="text-xs text-blue-700">Need case-specific advice?</p>
            <Link
              href="/lawyers"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-white bg-[#1E3A8A] px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Find a Lawyer →
            </Link>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          {error && (
            <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {error}
            </p>
          )}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a legal question..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
              disabled={isLoading}
              aria-label="Your legal question"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#D4AF37] text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <p className="text-[10px] text-center text-gray-400 mt-2">
            AI can make mistakes. Always consult a verified lawyer for your case.
          </p>
        </div>
      </div>
    </>
  );
}

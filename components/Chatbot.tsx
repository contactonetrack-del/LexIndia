'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  ExternalLink,
  Loader2,
  Maximize2,
  MessageSquare,
  Minimize2,
  Scale,
  Send,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Markdown from 'react-markdown';

import { getMemoryLocalizedText, localizeTreeFromMemory } from '@/lib/content/localized';
import { useLanguage } from '@/lib/LanguageContext';
import { localizeHref } from '@/lib/i18n/navigation';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

type ApiHistory = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

const COPY = {
  title: 'LexIndia AI',
  subtitle: 'Legal Information Assistant',
  openAria: 'Open AI Legal Assistant',
  closeAria: 'Close chat',
  minimizeAria: 'Minimize chat',
  maximizeAria: 'Maximize chat',
  disclaimerText: 'General legal information only, not legal advice.',
  disclaimerCta: 'Book a verified lawyer',
  disclaimerSuffix: 'for your specific case.',
  ctaPrompt: 'Need case-specific advice?',
  ctaAction: 'Find a Lawyer',
  ctaArrow: '->',
  inputPlaceholder: 'Ask a legal question...',
  inputAria: 'Your legal question',
  sendAria: 'Send message',
  footerText: 'AI can make mistakes. Always consult a verified lawyer for your case.',
  loadingPlaceholder: '...',
  unknownError: 'Unknown error',
  fallbackError: 'Something went wrong. Please try again.',
} as const;

const INITIAL_MESSAGE: Message = {
  id: 'initial',
  role: 'model',
  text: `Hello! I'm **LexIndia AI**, your legal information assistant. I can help you understand:

- Your rights under Indian law
- Legal procedures and processes
- Which type of lawyer you may need

I provide general legal information only and not legal advice. For your specific situation, always consult a [verified lawyer](/lawyers).

How can I help you today?`,
};

export default function Chatbot() {
  const { lang } = useLanguage();
  const lawyersHref = localizeHref('/lawyers', lang);
  const localizedCopy = localizeTreeFromMemory(COPY, lang);
  const copy = {
    ...localizedCopy,
    ctaArrow: COPY.ctaArrow,
    loadingPlaceholder: COPY.loadingPlaceholder,
  } as const;
  const initialMessage = useMemo(
    () => ({
      ...INITIAL_MESSAGE,
      text: getMemoryLocalizedText(INITIAL_MESSAGE.text, lang).replace(/\(\/lawyers\)/g, `(${lawyersHref})`),
    }),
    [lang, lawyersHref]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages((previous) =>
      previous.length === 1 && previous[0]?.id === 'initial' ? [initialMessage] : previous
    );
  }, [initialMessage]);

  const buildApiHistory = (currentMessages: Message[]): ApiHistory[] =>
    currentMessages
      .filter((message) => message.id !== 'initial' && message.text.trim())
      .map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      }));

  const handleSend = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setError(null);

    const userMsgId = `user-${Date.now()}`;
    const modelMsgId = `model-${Date.now()}`;

    setMessages((previous) => [
      ...previous,
      { id: userMsgId, role: 'user', text: userText },
      { id: modelMsgId, role: 'model', text: '' },
    ]);
    setIsLoading(true);

    try {
      const history = buildApiHistory(messages);

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history, locale: lang }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? copy.unknownError);
      }

      setMessages((previous) =>
        previous.map((message) =>
          message.id === modelMsgId ? { ...message, text: data.text } : message
        )
      );
    } catch (caughtError) {
      const errorMessage =
        caughtError instanceof Error ? caughtError.message : copy.fallbackError;

      setError(errorMessage);
      setMessages((previous) =>
        previous.map((message) =>
          message.id === modelMsgId ? { ...message, text: errorMessage } : message
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        data-testid="chatbot-trigger"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300 hover:bg-primary/90 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label={copy.openAria}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 origin-bottom-right overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all duration-300 ${
          isExpanded
            ? 'h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] sm:w-[600px] md:h-[700px]'
            : 'h-[600px] max-h-[80vh] w-[380px]'
        } ${isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}
      >
        <div className="flex shrink-0 items-center justify-between bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold leading-tight">{copy.title}</h3>
              <p className="text-xs text-primary-foreground/75">{copy.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-lg p-1.5 text-primary-foreground/75 transition-colors hover:bg-primary-foreground/12 hover:text-primary-foreground"
              aria-label={isExpanded ? copy.minimizeAria : copy.maximizeAria}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-primary-foreground/75 transition-colors hover:bg-primary-foreground/12 hover:text-primary-foreground"
              aria-label={copy.closeAria}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-2 border-b border-warning/30 bg-warning/10 px-3 py-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
          <p className="text-[10px] leading-relaxed text-warning">
            {copy.disclaimerText}{' '}
            <Link href={lawyersHref} className="font-semibold underline" onClick={() => setIsOpen(false)}>
              {copy.disclaimerCta}
            </Link>{' '}
            {copy.disclaimerSuffix}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-muted p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'ml-auto max-w-[85%] flex-row-reverse' : 'max-w-[92%]'}`}
            >
              <div
                className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  message.role === 'user'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`rounded-2xl p-3 text-sm ${
                  message.role === 'user'
                    ? 'rounded-tr-none bg-primary text-primary-foreground'
                    : 'rounded-tl-none border border-border bg-background text-foreground shadow-sm'
                }`}
              >
              {message.role === 'model' ? (
                  <div className="prose prose-sm max-w-none prose-a:font-medium prose-a:text-primary prose-p:my-1 prose-p:leading-relaxed">
                    <Markdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            className="text-primary underline"
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                          >
                            {children}
                            {href?.startsWith('http') && (
                              <ExternalLink className="ml-0.5 inline h-3 w-3" />
                            )}
                          </a>
                        ),
                      }}
                    >
                      {message.text || (isLoading && message.id === messages.at(-1)?.id ? copy.loadingPlaceholder : '')}
                    </Markdown>
                  </div>
                ) : (
                  message.text
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length >= 5 && (
          <div className="flex shrink-0 items-center justify-between border-t border-primary/20 bg-primary/10 px-4 py-2">
            <p className="text-xs text-primary">{copy.ctaPrompt}</p>
            <Link
              href={lawyersHref}
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {copy.ctaAction} {copy.ctaArrow}
            </Link>
          </div>
        )}

        <div className="shrink-0 border-t border-border bg-background p-4">
          {error && (
            <p className="mb-2 flex items-center gap-1 text-xs text-danger">
              <AlertTriangle className="h-3 w-3" /> {error}
            </p>
          )}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              data-testid="chatbot-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={copy.inputPlaceholder}
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              disabled={isLoading}
              aria-label={copy.inputAria}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={copy.sendAria}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">{copy.footerText}</p>
        </div>
      </div>
    </>
  );
}

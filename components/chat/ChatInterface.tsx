'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, File, Paperclip, Loader2, X } from 'lucide-react';

import { localizeTreeFromMemory } from '@/lib/content/localized';
import { REQUEST_LOCALE_HEADER } from '@/lib/i18n/config';
import { formatTime } from '@/lib/i18n/format';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
}

interface ChatInterfaceProps {
  appointmentId: string;
  currentUserId: string;
  otherUserName: string;
}

const FILE_SIZE_LIMIT_BYTES = 5 * 1024 * 1024;
const POLL_INTERVAL_MS = 3000;

export default function ChatInterface({
  appointmentId,
  currentUserId,
  otherUserName,
}: ChatInterfaceProps) {
  const { lang } = useLanguage();
  const t = getTranslation(lang);
  const copy = localizeTreeFromMemory({
    fileTooLarge: 'File size must be less than 5MB',
    inConsultation: 'In consultation',
    emptyChat: 'Send the first message to start this consultation chat.',
    attachmentFallback: 'Attachment',
    downloadFallback: 'download',
    attachFile: 'Attach file',
    messagePlaceholder: 'Type your message',
    sendFailed: 'Failed to send message',
    loadFailed: 'Failed to load messages',
  } as const, lang);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/chat?appointmentId=${appointmentId}`, {
        headers: {
          [REQUEST_LOCALE_HEADER]: lang,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages ?? []);
      }
    } catch {
      console.error(copy.loadFailed);
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId, copy.loadFailed, lang]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      window.alert(copy.fileTooLarge);
      return;
    }

    setSelectedFile(file);
  };

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    setIsSending(true);

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (selectedFile) {
      fileUrl = await convertToBase64(selectedFile);
      fileName = selectedFile.name;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [REQUEST_LOCALE_HEADER]: lang,
        },
        body: JSON.stringify({
          appointmentId,
          text: newMessage,
          fileUrl,
          fileName,
        }),
      });

      if (!response.ok) {
        console.error(copy.sendFailed);
        return;
      }

      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchMessages();
    } catch {
      console.error(t.common.error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
            {otherUserName[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-foreground">{otherUserName}</h3>
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success"></span>
              {copy.inConsultation}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-muted p-5">
        {messages.length === 0 ? (
          <div className="mt-10 text-center text-sm text-muted-foreground">{copy.emptyChat}</div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            return (
              <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isCurrentUser
                      ? 'rounded-br-sm bg-primary text-primary-foreground'
                      : 'rounded-bl-sm border border-border bg-background text-foreground shadow-sm'
                  }`}
                >
                  {message.text ? <p className="whitespace-pre-wrap">{message.text}</p> : null}

                  {message.fileUrl ? (
                    <a
                      href={message.fileUrl}
                      download={message.fileName || copy.downloadFallback}
                      className={`mt-2 flex items-center gap-2 rounded border p-2 text-xs font-semibold ${
                        isCurrentUser
                          ? 'border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15'
                          : 'border-border bg-surface text-primary hover:bg-surface-hover'
                    } transition-colors`}
                  >
                    <File className="h-4 w-4" />
                      <span className="max-w-[150px] truncate">
                        {message.fileName || copy.attachmentFallback}
                      </span>
                    </a>
                  ) : null}

                  <div
                    className={`mt-1 text-right text-[10px] ${
                      isCurrentUser ? 'text-primary-foreground/75' : 'text-muted-foreground'
                    }`}
                  >
                    {formatTime(message.createdAt, lang, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-border bg-background p-4">
        {selectedFile ? (
          <div className="mb-2 flex w-fit items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs text-primary">
            <File className="h-3.5 w-3.5" />
            <span className="max-w-[200px] truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="ml-2 rounded p-0.5 text-primary/75 transition-colors hover:bg-primary/15 hover:text-primary"
              aria-label={t.common.cancel}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-surface hover:text-primary"
            title={copy.attachFile}
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <textarea
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void sendMessage(event);
              }
            }}
            placeholder={copy.messagePlaceholder}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={1}
          />

          <button
            type="submit"
            disabled={isSending || (!newMessage.trim() && !selectedFile)}
            className="shrink-0 rounded-xl bg-primary p-3 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, File, Paperclip, Loader2 } from 'lucide-react';

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

export default function ChatInterface({ appointmentId, currentUserId, otherUserName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat?appointmentId=${appointmentId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch (e) {
      console.error('Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Max 5MB file limit for Base64 (PostgreSQL text limits)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    setIsSending(true);

    let fileUrl = null;
    let fileName = null;

    if (selectedFile) {
      fileUrl = await convertToBase64(selectedFile);
      fileName = selectedFile.name;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          text: newMessage,
          fileUrl,
          fileName,
        }),
      });

      if (res.ok) {
        setNewMessage('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        await fetchMessages();
      } else {
         console.error('Failed to send message');
      }
    } catch (e) {
      console.error('Network error sending message');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100">
        <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#1E3A8A] font-bold">
            {otherUserName[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{otherUserName}</h3>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
               In Consultation
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            Say hello to start the conversation...
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMe ? 'bg-[#1E3A8A] text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'
                }`}>
                  {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                  
                  {msg.fileUrl && (
                    <a
                      href={msg.fileUrl}
                      download={msg.fileName || 'download'}
                      className={`flex items-center gap-2 mt-2 p-2 rounded border text-xs font-semibold ${
                        isMe ? 'bg-blue-800/50 border-blue-700/50 text-blue-50 hover:bg-blue-700' : 'bg-gray-50 border-gray-200 text-[#1E3A8A] hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <File className="w-4 h-4" />
                      <span className="truncate max-w-[150px]">{msg.fileName || 'Attachment'}</span>
                    </a>
                  )}
                  
                  <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 text-xs bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg w-fit border border-blue-100">
            <File className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
            <button
               type="button"
               onClick={() => setSelectedFile(null)}
               className="ml-2 px-1 text-blue-400 hover:text-blue-600 font-bold"
            >
               ✕
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-gray-400 hover:text-[#1E3A8A] hover:bg-blue-50 rounded-xl transition-colors shrink-0"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
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
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
               }
            }}
            placeholder="Type your message..."
            className="flex-1 max-h-32 min-h-[44px] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all resize-none"
            rows={1}
          />
          <button
            type="submit"
            disabled={isSending || (!newMessage.trim() && !selectedFile)}
            className="bg-[#1E3A8A] text-white p-3 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 shrink-0 shadow-sm"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}

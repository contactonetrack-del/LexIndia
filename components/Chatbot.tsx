'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Scale } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am LexIndia AI, your personal legal assistant. How can I help you understand your legal rights today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction: 'You are LexIndia AI, a helpful legal assistant for Indian citizens. Provide accurate, easy-to-understand information about Indian laws, rights, and legal procedures. Always include a disclaimer that you are an AI and they should consult a verified lawyer on LexIndia for formal legal advice. Keep responses concise and structured.',
          tools: [{ googleSearch: {} }],
        }
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input.trim();
    setInput('');
    
    const userMsgId = Date.now().toString() + '-user';
    const tempId = Date.now().toString() + '-model';
    
    setMessages(prev => [
      ...prev, 
      { id: userMsgId, role: 'user', text: userMsg },
      { id: tempId, role: 'model', text: '' }
    ]);
    setIsLoading(true);

    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      for await (const chunk of responseStream) {
        fullText += chunk.text || '';
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, text: 'Sorry, I encountered an error connecting to the legal database. Please try again later.' } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#1E3A8A] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-800 transition-transform duration-300 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open AI Legal Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-[#1E3A8A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">LexIndia AI</h3>
              <p className="text-blue-200 text-xs">Powered by Gemini 3.1 Pro</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-blue-200 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-[#D4AF37] text-gray-900' : 'bg-[#1E3A8A] text-white'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#1E3A8A] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm overflow-hidden'}`}>
                {msg.role === 'model' ? (
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-[#1E3A8A] prose-a:font-medium prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-code:text-gray-800">
                    <Markdown>{msg.text || (isLoading && msg.id === messages[messages.length - 1].id ? 'Thinking...' : '')}</Markdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#D4AF37] text-gray-900 w-12 h-12 rounded-xl flex items-center justify-center hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <p className="text-[10px] text-center text-gray-400 mt-3">
            AI can make mistakes. Always consult a verified lawyer.
          </p>
        </div>
      </div>
    </>
  );
}

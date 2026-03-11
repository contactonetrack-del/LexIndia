'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Mail, MessageSquare, Clock, CheckCircle, AlertCircle, Phone } from 'lucide-react';

// Note: metadata export removed from client component — add in a parent server component if needed.
// For now, using static metadata via layout or a generateMetadata wrapper.

const faqs = [
  { q: 'How do I find a lawyer?', a: 'Use the Lawyers section to search by specialization and city. You can filter by verification status, consultation mode, and fees.' },
  { q: 'Is the AI assistant free?', a: 'Yes. The AI Legal Assistant is free to use for all visitors. It provides general legal information only — not legal advice.' },
  { q: 'How are lawyers verified?', a: 'Lawyers must provide their Bar Council of India enrollment number and state bar details. Our team manually verifies these against Bar Council records before granting the verified badge.' },
  { q: 'Can I get a refund if the lawyer cancels?', a: 'Yes. If a lawyer cancels a confirmed consultation, you are entitled to a full refund to your original payment method within 5-7 business days.' },
  { q: 'How do I download legal templates?', a: 'Visit the Templates page, browse or search for the template you need, and click Download. No account is required for preview; an account may be required for download.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // TODO: Wire to /api/contact route when backend is ready
      await new Promise((r) => setTimeout(r, 1200));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-semibold uppercase tracking-wider text-sm">Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-blue-200 text-lg max-w-xl">
            Have a question, feedback, or need help with your account? We&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Mail className="w-6 h-6 text-[#1E3A8A] mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
              <a href="mailto:support@lexindia.in" className="text-[#1E3A8A] text-sm hover:underline">
                support@lexindia.in
              </a>
              <p className="text-gray-400 text-xs mt-1">Response within 24–48 hours</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Phone className="w-6 h-6 text-[#1E3A8A] mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Legal Queries</h3>
              <a href="mailto:legal@lexindia.in" className="text-[#1E3A8A] text-sm hover:underline">
                legal@lexindia.in
              </a>
              <p className="text-gray-400 text-xs mt-1">For compliance and legal matters</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Clock className="w-6 h-6 text-[#1E3A8A] mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Support Hours</h3>
              <p className="text-gray-500 text-sm">Monday – Saturday</p>
              <p className="text-gray-500 text-sm">9:00 AM – 6:00 PM IST</p>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <AlertCircle className="w-6 h-6 text-amber-600 mb-3" />
              <h3 className="font-bold text-amber-900 mb-1 text-sm">Not Legal Advice</h3>
              <p className="text-amber-700 text-xs leading-relaxed">
                Our support team cannot provide legal advice. For legal questions, please use the AI Assistant
                or book a consultation with a verified lawyer.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              {status === 'sent' ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24–48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <select
                      id="subject"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all bg-white"
                    >
                      <option value="">Select a topic</option>
                      <option value="booking">Booking / Consultation Issue</option>
                      <option value="payment">Payment / Refund</option>
                      <option value="account">Account Help</option>
                      <option value="lawyer">Complaint About a Lawyer</option>
                      <option value="privacy">Privacy / Data Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all resize-none"
                      placeholder="Describe your issue or question..."
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Something went wrong. Please email support@lexindia.in directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.q} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

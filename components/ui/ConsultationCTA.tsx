import React from 'react';
import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';

interface ConsultationCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export function ConsultationCTA({
  title = "Ready to discuss your legal matter?",
  description = "Get matched with a verified expert. The first consultation is 100% free.",
  buttonText = "Find a Lawyer Now"
}: ConsultationCTAProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8 my-8 text-center sm:text-left sm:flex items-center justify-between gap-6 relative overflow-hidden">
      {/* Background motif */}
      <div className="absolute -right-8 -top-8 text-blue-100/50 pointer-events-none">
        <Scale className="w-48 h-48" strokeWidth={1} />
      </div>
      
      <div className="relative z-10 flex-1 mb-6 sm:mb-0">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-2xl">{description}</p>
      </div>
      
      <div className="relative z-10 shrink-0">
        <Link 
          href="/lawyers"
          className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5"
        >
          {buttonText} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

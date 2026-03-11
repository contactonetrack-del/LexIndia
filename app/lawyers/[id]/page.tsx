'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin, Star, Clock, CheckCircle, Video, Phone,
  MessageSquare, ArrowLeft, Shield, BookOpen, AlertTriangle,
  Loader2, ExternalLink
} from 'lucide-react';

interface LawyerDetail {
  id: string;
  city: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  isVerified: boolean;
  barCouncilID: string | null;
  bio: string | null;
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
    createdAt: string;
  };
  languages: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
  modes: { id: string; mode: string }[];
  appointments: { id: string }[];
}

const MODE_ICONS: Record<string, React.ReactNode> = {
  VIDEO: <Video className="w-4 h-4" />,
  CALL: <Phone className="w-4 h-4" />,
  CHAT: <MessageSquare className="w-4 h-4" />,
};

const MODE_LABELS: Record<string, string> = {
  VIDEO: 'Video Consultation',
  CALL: 'Phone Call',
  CHAT: 'Chat / Message',
};

export default function LawyerProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [lawyer, setLawyer] = useState<LawyerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/lawyers/${id}`);
        if (cancelled) return;
        if (res.status === 404) { setError('not_found'); setIsLoading(false); return; }
        if (!res.ok) { setError('fetch_error'); setIsLoading(false); return; }
        const data = await res.json();
        if (!cancelled) {
          setLawyer(data.lawyer);
          setIsLoading(false);

          // Fire-and-forget profile view increment tracker
          fetch(`/api/lawyers/${id}/view`, { method: 'POST' }).catch(console.error);
        }
      } catch (err) {
        if (!cancelled) { setError('fetch_error'); setIsLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1E3A8A] dark:text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error === 'not_found' || !lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lawyer Profile Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This profile may have been removed or the link is incorrect.</p>
        <Link href="/lawyers" className="bg-[#1E3A8A] dark:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors">
          Browse All Lawyers
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center text-center px-4">
        <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something Went Wrong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Unable to load this lawyer profile. Please try again.</p>
        <Link href="/lawyers" className="bg-[#1E3A8A] dark:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors">
          Back to Lawyers
        </Link>
      </div>
    );
  }

  const completedConsultations = lawyer.appointments?.length ?? 0;
  const memberSince = new Date(lawyer.user.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
      {/* Back Link */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/lawyers" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#1E3A8A] dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Lawyers
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0">
                  {lawyer.user.image ? (
                    <Image
                      src={lawyer.user.image}
                      alt={lawyer.user.name ?? 'Lawyer'}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1E3A8A] dark:bg-gray-800 text-white dark:text-gray-400 text-3xl font-bold">
                      {(lawyer.user.name ?? 'L')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name & Meta */}
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lawyer.user.name}</h1>
                    {lawyer.isVerified && (
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {lawyer.city}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lawyer.experienceYears} years experience</span>
                    <span className="text-gray-400 dark:text-gray-500">Member since {memberSince}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {lawyer.specializations?.length > 0 ? lawyer.specializations.map((s) => (
                      <span key={s.id} className="bg-blue-50 dark:bg-blue-900/30 text-[#1E3A8A] dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-md">
                        {s.name}
                      </span>
                    )) : (
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md italic">Specialty not specified</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 font-bold text-green-700 dark:text-green-500">
                      <Star className="w-4 h-4 fill-green-600 dark:fill-green-500 text-green-600 dark:text-green-500" />
                      {lawyer.rating.toFixed(1)}
                      <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">({lawyer.reviewCount} reviews)</span>
                    </div>
                    {completedConsultations > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">{completedConsultations} consultations done</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h2>
              {lawyer.bio ? (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{lawyer.bio}</p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic text-sm">This lawyer has not added a bio yet.</p>
              )}
            </div>

            {/* Languages */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Languages Spoken</h2>
              <div className="flex flex-wrap gap-2">
                {lawyer.languages.length > 0 ? (
                  lawyer.languages.map((l) => (
                    <span key={l.id} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                      {l.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">Not specified</span>
                )}
              </div>
            </div>

            {/* Consultation Modes */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Consultation Modes</h2>
              <div className="space-y-3">
                {lawyer.modes.length > 0 ? (
                  lawyer.modes.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm">
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-[#1E3A8A] dark:text-blue-400">
                        {MODE_ICONS[m.mode] ?? <MessageSquare className="w-4 h-4" />}
                      </div>
                      {MODE_LABELS[m.mode] ?? m.mode}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 text-sm italic">Modes not specified</span>
                )}
              </div>
            </div>

            {/* Verification */}
            {lawyer.isVerified && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-900 dark:text-green-400 mb-1">Verified Lawyer</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                      This lawyer&apos;s Bar Council of India enrollment has been verified by the LexIndia team.
                      {lawyer.barCouncilID && (
                        <span className="block mt-1">Bar Council ID: <strong className="dark:text-white">{lawyer.barCouncilID}</strong></span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Legal Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <p className="text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
                  LexIndia verifies Bar Council enrollment but does not guarantee specific legal outcomes.
                  Lawyers listed are independent practitioners. Always read their profile carefully before booking.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Booking Panel */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 lg:sticky lg:top-24">
              <div className="text-center mb-5">
                {lawyer.consultationFee > 0 ? (
                  <>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">₹{lawyer.consultationFee}</div>
                    <div className="text-gray-400 dark:text-gray-500 text-sm">per consultation</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-500">Free</div>
                    <div className="text-gray-400 dark:text-gray-500 text-sm">First Consultation</div>
                  </>
                )}
              </div>

              <Link
                href={`/book/${lawyer.id}`}
                className="block w-full text-center bg-[#1E3A8A] dark:bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors mb-3"
              >
                Book a Consultation
              </Link>

              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-5">
                Secure payment. Cancel 24hrs before for full refund.
              </p>

              <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rating</span>
                  <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {lawyer.rating.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Experience</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{lawyer.experienceYears ? `${lawyer.experienceYears} years` : 'Not listed'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Location</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{lawyer.city || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Verification</span>
                  <span className={`font-semibold ${lawyer.isVerified ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {lawyer.isVerified ? '✓ Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Find more lawyers */}
            <div className="bg-gray-900 rounded-2xl p-5 text-white">
              <BookOpen className="w-5 h-5 text-[#D4AF37] mb-2" />
              <h3 className="font-bold mb-1 text-sm">Need to compare?</h3>
              <p className="text-gray-400 text-xs mb-3">Browse our full directory of verified lawyers.</p>
              <Link
                href="/lawyers"
                className="flex items-center gap-1 text-[#D4AF37] text-xs font-semibold hover:underline"
              >
                See all lawyers <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

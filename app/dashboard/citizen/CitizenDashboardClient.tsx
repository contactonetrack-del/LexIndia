'use client';

import React, { useEffect, useState } from 'react';
import {
  Scale, FileText, Calendar, BookOpen, User, LogOut,
  Clock, Video, Phone, MessageSquare, ChevronRight, Loader2,
  CheckCircle, XCircle, AlertCircle, MapPin, Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';
import ReviewModal from '@/components/dashboard/ReviewModal';

interface Appointment {
  id: string;
  date: string;
  mode: string;
  status: string;
  paymentStatus?: string;
  amount?: number | null;
  notes: string | null;
  review?: { id: string } | null;
  lawyer: {
    id: string;
    city: string;
    consultationFee: number;
    user: { name: string | null; image: string | null };
    specializations: { name: string }[];
  };
}

const MODE_ICONS: Record<string, React.ReactNode> = {
  VIDEO: <Video className="w-4 h-4" />,
  CALL: <Phone className="w-4 h-4" />,
  CHAT: <MessageSquare className="w-4 h-4" />,
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  CONFIRMED: {
    label: 'Confirmed',
    className: 'bg-green-50 text-green-700 border-green-200',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-500 border-gray-200 line-through',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

function AppointmentCard({ appt, onReviewClick }: { appt: Appointment; onReviewClick?: () => void }) {
  const date = new Date(appt.date);
  const isUpcoming = date > new Date() && appt.status !== 'CANCELLED';
  const status = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG['PENDING'];

  const hasInvoice = appt.amount !== null && appt.amount! > 0 && (appt.status === 'CONFIRMED' || appt.status === 'COMPLETED' || appt.paymentStatus === 'PAID');
  const needsReview = appt.status === 'COMPLETED' && !appt.review;

  return (
    <div className={`bg-white rounded-xl border p-4 flex gap-4 ${isUpcoming ? 'border-[#1E3A8A]/20 shadow-sm' : 'border-gray-100'}`}>
      {/* Avatar */}
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1E3A8A] flex items-center justify-center shrink-0 relative">
        {appt.lawyer.user.image ? (
          <Image src={appt.lawyer.user.image} alt={appt.lawyer.user.name ?? 'Lawyer'} fill className="object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-white font-bold text-lg">{(appt.lawyer.user.name ?? 'L')[0]}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 text-sm truncate">{appt.lawyer.user.name}</h4>
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${status.className}`}>
            {status.icon} {status.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-2">{appt.lawyer.specializations[0]?.name ?? 'Legal Expert'}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />
            {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="flex items-center gap-1">{MODE_ICONS[appt.mode]} {appt.mode}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{appt.lawyer.city}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-end gap-2 shrink-0">
         <Link
           href={`/lawyers/${appt.lawyer.id}`}
           className="text-[#1E3A8A] border border-[#1E3A8A]/30 hover:bg-[#1E3A8A]/5 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
           aria-label="View lawyer profile"
         >
           Profile <ChevronRight className="w-3 h-3" />
         </Link>

         {hasInvoice && (
           <Link
             href={`/dashboard/invoice/${appt.id}`}
             target="_blank"
             className="text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
             aria-label="View Invoice"
           >
             <FileText className="w-3 h-3" /> Invoice
           </Link>
         )}

         <Link
           href={`/dashboard/chat/${appt.id}`}
           className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
         >
           <MessageSquare className="w-3.5 h-3.5" /> Message Workspace
         </Link>

         {appt.status === 'CONFIRMED' && appt.mode === 'VIDEO' && (
           <Link
             href={`/dashboard/room/${appt.id}`}
             className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
           >
             <Video className="w-3.5 h-3.5" /> Join Video Call
           </Link>
         )}

         {needsReview && onReviewClick && (
           <button
             onClick={onReviewClick}
             className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors shadow-sm"
           >
             <Star className="w-3.5 h-3.5 fill-current" /> Leave a Review
           </button>
         )}
      </div>
    </div>
  );
}

export default function CitizenDashboardClient({ user }: { user: { name?: string | null; email?: string | null } }) {
  const { lang, isIndic } = useLanguage();
  const t = getTranslation(lang);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  
  // Review Modal State
  const [reviewAppt, setReviewAppt] = useState<{ id: string; name: string } | null>(null);

  const fetchAppointments = () => {
    fetch('/api/appointments')
      .then(r => r.json())
      .then(d => setAppointments(d.appointments ?? []))
      .catch(() => setAppointments([]))
      .finally(() => setApptLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const upcoming = appointments.filter(a => new Date(a.date) > new Date() && a.status !== 'CANCELLED');
  const past = appointments.filter(a => new Date(a.date) <= new Date() || a.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-7 h-7" />
              </div>
              <div className={isIndic ? 'font-hindi' : ''}>
                <p className="text-blue-200 text-sm">{t.dashboard.welcome},</p>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-200 text-sm">{user.email}</p>
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className={`flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm ${isIndic ? 'font-hindi' : ''}`}
            >
              <LogOut className="w-4 h-4" /> {t.dashboard.signOut}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <h2 className={`text-xl font-bold text-gray-900 mb-4 ${isIndic ? 'font-hindi' : ''}`}>{t.dashboard.quickActions}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Scale, label: t.dashboard.findLawyer, href: '/lawyers', color: 'bg-blue-500', desc: t.dashboard.findLawyerDesc },
            { icon: BookOpen, label: 'Legal Guides', href: '/guides', color: 'bg-emerald-500', desc: 'Free plain-language guides' },
            { icon: FileText, label: t.dashboard.legalTemplates, href: '/templates', color: 'bg-amber-500', desc: t.dashboard.legalTemplatesDesc },
            { icon: Calendar, label: 'My Bookings', href: '#my-appointments', color: 'bg-purple-500', desc: `${upcoming.length} upcoming` },
          ].map(({ icon: Icon, label, href, color, desc }) => (
            <Link key={label} href={href}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group ${isIndic ? 'font-hindi' : ''}`}
            >
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
              <p className="text-gray-500 text-xs mt-1">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Appointments Section */}
        <div id="my-appointments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">My Appointments</h2>
            <Link href="/lawyers" className="text-sm text-[#1E3A8A] font-medium hover:underline">+ Book New</Link>
          </div>

          {apptLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-[#1E3A8A] animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-[#1E3A8A]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments Yet</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                Book your first consultation with a verified lawyer to get personalized legal advice.
              </p>
              <Link href="/lawyers" className="inline-block bg-[#1E3A8A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg">
                Find a Verified Lawyer
              </Link>
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h3>
                  <div className="space-y-3">
                    {upcoming.map(a => <AppointmentCard key={a.id} appt={a} />)}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Past & Cancelled</h3>
                  <div className="space-y-3 opacity-75">
                    {past.map(a => <AppointmentCard key={a.id} appt={a} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ReviewModal 
        isOpen={!!reviewAppt}
        onClose={() => setReviewAppt(null)}
        appointmentId={reviewAppt?.id || ''}
        lawyerName={reviewAppt?.name || ''}
        onSuccess={fetchAppointments}
      />
    </div>
  );
}

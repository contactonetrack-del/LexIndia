'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Scale, Users, Star, CheckCircle, Calendar, Settings, LogOut,
  Clock, Video, Phone, MessageSquare, AlertCircle, Loader2,
  Edit3, Save, X, ExternalLink, ChevronDown, ChevronUp, FileText, Award
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';
import CaseWorkspace from '@/components/dashboard/CaseWorkspace';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IncomingAppointment {
  id: string;
  date: string;
  mode: string;
  status: string;
  notes: string | null;
  amount?: number | null;
  payoutStatus?: string;
  paymentStatus?: string;
  citizen: { name: string | null; email: string | null };
}

interface ProfileData {
  id?: string;
  userId?: string;
  barCouncilID?: string | null;
  rating: number;
  reviewCount: number;
  profileViews?: number;
  isVerified: boolean;
  experienceYears: number;
  city: string;
  state?: string | null;
  bio?: string | null;
  consultationFee: number;
  consultationModes?: string[];
  subscriptionTier?: string | null;
  subscriptionExpiry?: string | Date | null;
  languages?: { id: string; name: string }[];
  specializations: { id: string; name: string }[];
  modes?: { id: string; mode: string }[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const MODE_ICONS: Record<string, React.ReactNode> = {
  VIDEO: <Video className="w-4 h-4" />,
  CALL: <Phone className="w-4 h-4" />,
  CHAT: <MessageSquare className="w-4 h-4" />,
};

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
  COMPLETED: 'bg-gray-100 text-gray-600 border-gray-200',
};

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = 'appointments' | 'edit-profile' | 'subscriptions';

export default function LawyerDashboardClient({
  user,
  profile: initialProfile,
}: {
  user: { name?: string | null; email?: string | null };
  profile: ProfileData | null;
}) {
  const { lang, isIndic } = useLanguage();
  const t = getTranslation(lang);

  const [activeTab, setActiveTab] = useState<Tab>('appointments');
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [openWorkspaceId, setOpenWorkspaceId] = useState<string | null>(null);

  // ── Appointments ──────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState<IncomingAppointment[]>([]);
  const [apptLoading, setApptLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState<Record<string, boolean>>({});

  const fetchAppointments = useCallback(() => {
    setApptLoading(true);
    fetch('/api/appointments')
      .then(r => r.json())
      .then(d => setAppointments(d.appointments ?? []))
      .catch(() => setAppointments([]))
      .finally(() => setApptLoading(false));
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id: string, status: string) => {
    setStatusLoading(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setAppointments(prev =>
          prev.map(a => a.id === id ? { ...a, status } : a)
        );
        toast.success(`Appointment marked as ${status.toLowerCase()}`);
      } else {
        toast.error('Failed to update status.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setStatusLoading(p => ({ ...p, [id]: false }));
    }
  };

  const markComplete = async (id: string) => {
    setStatusLoading(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`/api/appointments/${id}/complete`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(prev =>
          prev.map(a => a.id === id ? { ...a, status: 'COMPLETED', payoutStatus: 'ELIGIBLE' } : a)
        );
        toast.success('Consultation marked as completed! Funds marked eligible.');
      } else {
        toast.error(data.error ?? 'Failed to mark complete.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setStatusLoading(p => ({ ...p, [id]: false }));
    }
  };

  const upcoming = appointments.filter(a => new Date(a.date) > new Date() && a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
  const past = appointments.filter(a => new Date(a.date) <= new Date() || a.status === 'CANCELLED' || a.status === 'COMPLETED');

  // Escrow Calculations
  const escrowFunds = appointments.filter(a => ['PENDING', 'ELIGIBLE', 'DISPUTED'].includes(a.payoutStatus || '') && a.status !== 'CANCELLED').reduce((sum, a) => sum + (a.amount || 0), 0);
  const settledFunds = appointments.filter(a => a.payoutStatus === 'SETTLED').reduce((sum, a) => sum + (a.amount || 0), 0);

  // ── Profile Edit Form ─────────────────────────────────────────────────────
  const [editForm, setEditForm] = useState({
    bio: profile?.bio ?? '',
    city: profile?.city ?? '',
    state: profile?.state ?? '',
    experienceYears: profile?.experienceYears ?? 0,
    consultationFee: profile?.consultationFee ?? 0,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess(false);
    try {
      const res = await fetch('/api/lawyers/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editForm.bio,
          city: editForm.city,
          state: editForm.state,
          experienceYears: Number(editForm.experienceYears),
          consultationFee: Number(editForm.consultationFee),
        }),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setProfile(prev => prev ? { ...prev, ...data.profile } : data.profile);
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.error ?? 'Failed to update profile.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // ── Subscriptions ─────────────────────────────────────────────────────────
  const [purchasingTier, setPurchasingTier] = useState<string | null>(null);

  const handlePurchaseSubscription = async (tier: string) => {
    setPurchasingTier(tier);
    try {
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const scriptLoaded = await loadScript();
      if (!scriptLoaded) throw new Error('Failed to load Razorpay SDK');

      // 1. Create order
      const orderRes = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // 2. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LexIndia Subscription',
        description: `${tier} Tier Subscription Upgrade`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            toast.success('Subscription upgraded successfully! Reloading...');
            setTimeout(() => window.location.reload(), 2000);
          } else {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user.name ?? '',
          email: user.email ?? '',
        },
        theme: { color: '#1E3A8A' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed'));
      rzp.open();
    } catch (e: any) {
      toast.error(e.message ?? 'An error occurred initializing payment');
    } finally {
      setPurchasingTier(null);
    }
  };

  // ── Profile Completeness ──────────────────────────────────────────────────
  const getCompleteness = () => {
    if (!profile) return 0;
    const fields = [
      Boolean(profile.city),
      Boolean(profile.state),
      Boolean(profile.experienceYears),
      Boolean(profile.consultationFee),
      Boolean(profile.barCouncilID),
      Boolean(profile.bio?.trim()),
      (profile.languages ?? []).length > 0,
      (profile.specializations ?? []).length > 0,
      (profile.modes ?? []).length > 0
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };
  const completeness = getCompleteness();

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Scale className="w-7 h-7" />
              </div>
              <div className={isIndic ? 'font-hindi' : ''}>
                <p className="text-blue-200 text-sm">{t.dashboard.lawyerPortal}</p>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-200 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile?.id && (
                <Link
                  href={`/lawyers/${profile.id}`}
                  target="_blank"
                  className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> View Public Profile
                </Link>
              )}
              <Link href="/api/auth/signout" className={`flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm ${isIndic ? 'font-hindi' : ''}`}>
                <LogOut className="w-4 h-4" /> {t.dashboard.signOut}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Profile Completeness */}
        {profile && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">Profile Completeness</h3>
              <span className={`text-sm font-bold ${completeness === 100 ? 'text-emerald-500' : 'text-[#1E3A8A]'}`}>
                {completeness}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${completeness === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#1E3A8A] to-blue-500'}`}
                style={{ width: `${completeness}%` }}
              />
            </div>
            {completeness < 100 && (
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" /> Complete your profile details in the &apos;Edit Profile&apos; tab to rank higher in searches.
              </p>
            )}
            {completeness === 100 && (
              <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Your profile is fully complete!
              </p>
            )}
          </div>
        )}

        {/* Financial Overview (Escrow) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#1E3A8A]/20 p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-amber-500" /> Funds in Escrow</p>
              <p className="text-3xl font-bold text-[#1E3A8A]">₹{escrowFunds.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Pending verification by clients</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Settled Earnings</p>
              <p className="text-3xl font-bold text-emerald-600">₹{settledFunds.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">Total lifetime payouts completed</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {profile && (
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 ${isIndic ? 'font-hindi' : ''}`}>
            {[
              { icon: Star, label: t.dashboard.statsRating, value: profile.rating.toFixed(1), color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Users, label: t.dashboard.statsReviews, value: profile.reviewCount.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: CheckCircle, label: t.dashboard.statsVerified, value: profile.isVerified ? 'Verified ✓' : 'Pending', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Calendar, label: t.dashboard.statsExperience, value: `${profile.experienceYears} yrs`, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`text-xl font-bold ${color}`}>{value}</div>
                <div className="text-gray-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded-xl mb-6 w-fit">
          {[
            { id: 'appointments' as Tab, icon: Calendar, label: 'Appointments' },
            { id: 'edit-profile' as Tab, icon: Edit3, label: 'Edit Profile' },
            { id: 'subscriptions' as Tab, icon: Award, label: 'Membership' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-white text-[#1E3A8A] shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* TAB: Appointments */}
        {activeTab === 'appointments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Incoming Appointments</h2>
              {upcoming.length > 0 && (
                <span className="bg-blue-100 text-[#1E3A8A] text-xs font-bold px-2.5 py-1 rounded-full">
                  {upcoming.length} upcoming
                </span>
              )}
            </div>

            {apptLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#1E3A8A] animate-spin" />
              </div>
            ) : upcoming.length === 0 && past.length === 0 ? (
              <div className="bg-white border text-center border-gray-100 shadow-sm rounded-2xl p-12">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-[#1E3A8A]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  When citizens book consultations with you, they will appear here. Make sure your profile is fully filled out to attract more clients.
                </p>
                <button
                  onClick={() => setActiveTab('edit-profile')}
                  className="bg-white border-2 border-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  Enhance Profile
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Upcoming */}
                {upcoming.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</h3>
                    <div className="space-y-3">
                      {upcoming.map(appt => {
                        const d = new Date(appt.date);
                        const isLoading = statusLoading[appt.id];
                        return (
                          <React.Fragment key={appt.id}>
                            <div className="bg-white border border-[#1E3A8A]/20 rounded-xl p-4">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#1E3A8A] font-bold shrink-0">
                                  {(appt.citizen.name ?? 'C')[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 text-sm">{appt.citizen.name}</p>
                                  <p className="text-xs text-gray-500">{appt.citizen.email}</p>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="flex items-center gap-1">{MODE_ICONS[appt.mode]} {appt.mode}</span>
                                  </div>
                                  {appt.notes && (
                                    <p className="mt-2 text-xs bg-amber-50 text-amber-800 border border-amber-100 rounded-lg px-2.5 py-1.5 italic">
                                      &ldquo;{appt.notes}&rdquo;
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2 items-end shrink-0">
                                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[appt.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    <AlertCircle className="w-3 h-3" /> {appt.status}
                                  </span>
                                  {(appt.amount && appt.amount > 0 && (appt.status === 'CONFIRMED' || appt.status === 'COMPLETED' || appt.paymentStatus === 'PAID')) && (
                                    <Link
                                      href={`/dashboard/invoice/${appt.id}`}
                                      target="_blank"
                                      className="text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                                    >
                                      <FileText className="w-3 h-3" /> Receipt
                                    </Link>
                                  )}
                                  {appt.status === 'COMPLETED' && (
                                    <button
                                      onClick={() => setOpenWorkspaceId(openWorkspaceId === appt.id ? null : appt.id)}
                                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent shadow-sm"
                                      title="View Case File"
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              {/* Action Buttons */}
                              {appt.status === 'PENDING' && (
                                <div className="mt-3 flex gap-2 justify-end">
                                  <button
                                    disabled={isLoading}
                                    onClick={() => updateStatus(appt.id, 'CONFIRMED')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
                                  >
                                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} Confirm
                                  </button>
                                  <button
                                    disabled={isLoading}
                                    onClick={() => updateStatus(appt.id, 'CANCELLED')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 disabled:opacity-60 transition-colors"
                                  >
                                    <X className="w-3 h-3" /> Cancel
                                  </button>
                                </div>
                              )}
                              {appt.status === 'CONFIRMED' && (
                                <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between sm:items-center">
                                  <div className="flex flex-wrap gap-2">
                                    <Link
                                      href={`/dashboard/chat/${appt.id}`}
                                      className="flex items-center gap-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" /> Message Workspace
                                    </Link>
                                    {appt.mode === 'VIDEO' && (
                                      <Link
                                        href={`/dashboard/room/${appt.id}`}
                                        className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-[#1E3A8A] border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                      >
                                        <Video className="w-3.5 h-3.5" /> Join Video Call
                                      </Link>
                                    )}
                                    <button
                                      onClick={() => setOpenWorkspaceId(openWorkspaceId === appt.id ? null : appt.id)}
                                      className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
                                    >
                                      <FileText className="w-3.5 h-3.5" /> {openWorkspaceId === appt.id ? 'Close File' : 'Case File'}
                                    </button>
                                  </div>
                                  <div className="flex gap-2 justify-end sm:mt-0">
                                    <button
                                      disabled={isLoading || new Date(appt.date) > new Date()}
                                      title={new Date(appt.date) > new Date() ? "Cannot complete before scheduled time" : ""}
                                      onClick={() => markComplete(appt.id)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                    >
                                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />} Mark Complete
                                    </button>
                                    <button
                                      disabled={isLoading}
                                      onClick={() => updateStatus(appt.id, 'CANCELLED')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 disabled:opacity-60 transition-colors"
                                    >
                                      <X className="w-3 h-3" /> Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            {openWorkspaceId === appt.id && (
                              <div className="bg-white border-x border-b border-gray-100 rounded-b-xl px-4 pb-4">
                                <CaseWorkspace appointmentId={appt.id} citizenName={appt.citizen?.name ?? 'Client'} />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Past */}
                {past.length > 0 && (
                  <details className="group">
                    <summary className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 cursor-pointer hover:text-gray-600 flex items-center gap-2">
                      <span>Past &amp; Cancelled ({past.length})</span>
                      <ChevronDown className="w-4 h-4 group-open:hidden" />
                      <ChevronUp className="w-4 h-4 hidden group-open:block" />
                    </summary>
                    <div className="space-y-2 mt-2 opacity-70">
                      {past.map(appt => {
                        const d = new Date(appt.date);
                        return (
                          <div key={appt.id}>
                            <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                                {(appt.citizen.name ?? 'C')[0].toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-700 text-xs">{appt.citizen.name}</p>
                                <p className="text-gray-400 text-xs">{d.toLocaleDateString('en-IN')} · {appt.mode}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[appt.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                  {appt.status}
                                </span>
                                {(appt.amount && appt.amount > 0 && (appt.status === 'CONFIRMED' || appt.status === 'COMPLETED' || appt.paymentStatus === 'PAID')) && (
                                  <Link
                                    href={`/dashboard/invoice/${appt.id}`}
                                    target="_blank"
                                    className="text-emerald-700 hover:text-emerald-900 transition-colors"
                                    title="View Receipt"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </Link>
                                )}
                                {appt.status === 'COMPLETED' && (
                                  <button
                                    onClick={() => setOpenWorkspaceId(openWorkspaceId === appt.id ? null : appt.id)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent shadow-sm"
                                    title="View Case File"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {openWorkspaceId === appt.id && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <CaseWorkspace appointmentId={appt.id} citizenName={appt.citizen?.name ?? 'Client'} />
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: Edit Profile */}
        {activeTab === 'edit-profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-[#1E3A8A]" />
              <h2 className="text-lg font-bold text-gray-900">Edit Your Profile</h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Professional Bio
                  <span className="text-gray-400 font-normal ml-1 text-xs">(visible on your public profile)</span>
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe your expertise, experience, and approach to legal practice..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{editForm.bio.length}/2000</p>
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={e => setEditForm(p => ({ ...p, city: e.target.value }))}
                    maxLength={100}
                    placeholder="e.g. New Delhi"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={e => setEditForm(p => ({ ...p, state: e.target.value }))}
                    maxLength={100}
                    placeholder="e.g. Delhi"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                  />
                </div>
              </div>

              {/* Experience + Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={editForm.experienceYears}
                    onChange={e => setEditForm(p => ({ ...p, experienceYears: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Consultation Fee (₹/hr)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.consultationFee}
                    onChange={e => setEditForm(p => ({ ...p, consultationFee: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all"
                  />
                </div>
              </div>

              {/* Info note */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
                <strong>Note:</strong> Specializations, languages, and consultation modes can be updated by contacting our team at hello@lexindia.in while the self-service form is in beta.
              </div>

              {/* Status messages */}
              {editError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {editError}
                </div>
              )}
              {editSuccess && (
                <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 shrink-0" /> Profile updated successfully!
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex items-center gap-2 bg-[#1E3A8A] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-800 disabled:opacity-60 transition-colors"
                >
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
                {profile?.id && (
                  <Link
                    href={`/lawyers/${profile.id}`}
                    target="_blank"
                    className="flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Preview Profile
                  </Link>
                )}
              </div>
            </form>
          </div>
        )}

        {/* TAB: Subscriptions */}
        {activeTab === 'subscriptions' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-6 h-6 text-[#1E3A8A]" />
              <h2 className="text-xl font-bold text-gray-900">Subscription & Badges</h2>
            </div>
            <p className="text-gray-500 text-sm mb-8">Boost your visibility and rank higher in search results across LexIndia.</p>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <p className="text-sm font-semibold text-gray-800">Current Tier</p>
                  <p className="text-2xl font-bold text-[#1E3A8A] mt-1">{profile?.subscriptionTier || 'BASIC'}</p>
                  {profile?.subscriptionTier !== 'BASIC' && profile?.subscriptionExpiry && (
                     <p className="text-xs text-gray-500 mt-2">Active until: {new Date(profile.subscriptionExpiry).toLocaleDateString('en-IN')}</p>
                  )}
               </div>
               <div className="bg-white/60 p-3 rounded-lg flex items-center gap-2 hidden sm:flex">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-gray-800">Stand out securely to thousands of citizens.</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* PRO */}
               <div className={`p-6 rounded-2xl border-2 transition-all ${profile?.subscriptionTier === 'PRO' ? 'border-[#1E3A8A] bg-blue-50/20' : 'border-gray-200 hover:border-blue-300'}`}>
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-xl font-bold text-gray-900">PRO Plan</h3>
                     {profile?.subscriptionTier === 'PRO' && <span className="bg-[#1E3A8A] text-white text-xs font-bold px-2 py-1 rounded">ACTIVE</span>}
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 mb-6">₹999<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  <ul className="space-y-3 mb-8">
                     <li className="flex gap-2 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Visible <strong className="text-[#1E3A8A]">PRO Badge</strong> on Profile</li>
                     <li className="flex gap-2 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> Boosted Directory Ranking</li>
                     <li className="flex gap-2 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> 0% LexIndia Commission Escrow</li>
                  </ul>
                  {profile?.subscriptionTier !== 'PRO' ? (
                     <button
                        onClick={() => handlePurchaseSubscription('PRO')}
                        disabled={purchasingTier !== null}
                        className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-50"
                     >
                        {purchasingTier === 'PRO' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Upgrade to PRO'}
                     </button>
                  ) : <div className="w-full text-center text-sm font-semibold text-[#1E3A8A] py-3 bg-blue-100/50 rounded-xl">Current Plan</div>}
               </div>

               {/* ELITE */}
               <div className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${profile?.subscriptionTier === 'ELITE' ? 'border-purple-600 bg-purple-50/20' : 'border-purple-200 hover:border-purple-400'}`}>
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-xl font-bold text-gray-900">ELITE Plan</h3>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 mb-6">₹2499<span className="text-sm font-normal text-gray-500">/mo</span></p>
                  <ul className="space-y-3 mb-8">
                     <li className="flex gap-2 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-purple-600 shrink-0" /> Premium <strong className="text-purple-700">ELITE Badge</strong></li>
                     <li className="flex gap-2 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-purple-600 shrink-0" /> <strong>#1 Priority Ranking</strong> in Search</li>
                     <li className="flex gap-2 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-purple-600 shrink-0" /> Dedicated Account Manager</li>
                     <li className="flex gap-2 text-sm text-gray-700"><CheckCircle className="w-5 h-5 text-purple-600 shrink-0" /> 0% LexIndia Commission Escrow</li>
                  </ul>
                  {profile?.subscriptionTier !== 'ELITE' ? (
                     <button
                        onClick={() => handlePurchaseSubscription('ELITE')}
                        disabled={purchasingTier !== null}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                     >
                        {purchasingTier === 'ELITE' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Upgrade to ELITE'}
                     </button>
                  ) : <div className="w-full text-center text-sm font-semibold text-purple-700 py-3 bg-purple-100/50 rounded-xl">Current Plan</div>}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

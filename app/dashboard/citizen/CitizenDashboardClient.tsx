'use client';

import { Scale, FileText, Calendar, BookOpen, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { getTranslation } from '@/lib/translations';

export default function CitizenDashboardClient({ user }: { user: { name?: string | null, email?: string | null } }) {
    const { lang, isIndic } = useLanguage();
    const t = getTranslation(lang);

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
                        <Link href="/api/auth/signout" className={`flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm ${isIndic ? 'font-hindi' : ''}`}>
                            <LogOut className="w-4 h-4" /> {t.dashboard.signOut}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h2 className={`text-xl font-bold text-gray-900 mb-6 ${isIndic ? 'font-hindi' : ''}`}>{t.dashboard.quickActions}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: Scale, label: t.dashboard.findLawyer, href: '/lawyers', color: 'bg-blue-500', desc: t.dashboard.findLawyerDesc },
                        { icon: BookOpen, label: t.dashboard.legalKnowledge, href: '/knowledge', color: 'bg-emerald-500', desc: t.dashboard.legalKnowledgeDesc },
                        { icon: FileText, label: t.dashboard.legalTemplates, href: '/templates', color: 'bg-amber-500', desc: t.dashboard.legalTemplatesDesc },
                        { icon: Calendar, label: t.dashboard.myAppointments, href: '#', color: 'bg-purple-500', desc: t.dashboard.myAppointmentsDesc },
                    ].map(({ icon: Icon, label, href, color, desc }) => (
                        <Link key={label} href={href}
                            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group ${isIndic ? 'font-hindi' : ''}`}>
                            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-900">{label}</h3>
                            <p className="text-gray-500 text-sm mt-1">{desc}</p>
                        </Link>
                    ))}
                </div>

                {/* Info Banner */}
                <div className={`bg-blue-50 border border-blue-200 rounded-2xl p-6 ${isIndic ? 'font-hindi' : ''}`}>
                    <h3 className="font-semibold text-[#1E3A8A] mb-2">🚀 {t.dashboard.comingSoon}</h3>
                    <p className="text-blue-700 text-sm">{t.dashboard.comingSoonDesc}</p>
                </div>
            </div>
        </div>
    );
}

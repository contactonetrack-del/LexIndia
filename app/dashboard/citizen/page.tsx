import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Scale, FileText, Calendar, BookOpen, User, LogOut } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Citizen Dashboard | LexIndia' };

export default async function CitizenDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  if (session.user.role === 'LAWYER') redirect('/dashboard/lawyer');

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
              <div>
                <p className="text-blue-200 text-sm">Welcome back,</p>
                <h1 className="text-2xl font-bold">{session.user.name}</h1>
                <p className="text-blue-200 text-sm">{session.user.email}</p>
              </div>
            </div>
            <Link href="/api/auth/signout" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Scale, label: 'Find a Lawyer', href: '/lawyers', color: 'bg-blue-500', desc: 'Browse 4+ verified lawyers' },
            { icon: BookOpen, label: 'Legal Knowledge', href: '/knowledge', color: 'bg-emerald-500', desc: 'Know your legal rights' },
            { icon: FileText, label: 'Legal Templates', href: '/templates', color: 'bg-amber-500', desc: 'Download free documents' },
            { icon: Calendar, label: 'My Appointments', href: '#', color: 'bg-purple-500', desc: 'View upcoming consultations' },
          ].map(({ icon: Icon, label, href, color, desc }) => (
            <Link key={label} href={href}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <p className="text-gray-500 text-sm mt-1">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-[#1E3A8A] mb-2">🚀 More features coming soon</h3>
          <p className="text-blue-700 text-sm">Appointment booking, case tracking, and document storage will be available in the next update.</p>
        </div>
      </div>
    </div>
  );
}

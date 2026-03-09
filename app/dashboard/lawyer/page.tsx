import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Scale, Users, Star, CheckCircle, Calendar, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Lawyer Dashboard | LexIndia' };

export default async function LawyerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  if (session.user.role === 'CITIZEN') redirect('/dashboard/citizen');

  const profile = await prisma.lawyerProfile.findFirst({
    where: { userId: session.user.id },
    include: { specializations: true, languages: true, modes: true },
  });

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
              <div>
                <p className="text-blue-200 text-sm">Lawyer Portal</p>
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        {profile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Star, label: 'Rating', value: profile.rating.toFixed(1), color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Users, label: 'Reviews', value: profile.reviewCount.toString(), color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: CheckCircle, label: 'Verified', value: profile.isVerified ? 'Yes' : 'Pending', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Calendar, label: 'Experience', value: `${profile.experienceYears} yrs`, color: 'text-purple-600', bg: 'bg-purple-50' },
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

        {/* Profile Info */}
        {profile ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Profile Details</h2>
              <button className="flex items-center gap-1.5 text-sm text-[#1E3A8A] hover:underline">
                <Settings className="w-4 h-4" /> Edit Profile
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">City:</span> <span className="font-medium ml-1">{profile.city}</span></div>
              <div><span className="text-gray-500">Fee:</span> <span className="font-medium ml-1">₹{profile.consultationFee}/hr</span></div>
              <div>
                <span className="text-gray-500">Specializations:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.specializations.map(s => (
                    <span key={s.id} className="bg-blue-50 text-[#1E3A8A] text-xs px-2 py-0.5 rounded-full">{s.name}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Languages:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.languages.map(l => (
                    <span key={l.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{l.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-amber-800 mb-1">Complete Your Profile</h3>
            <p className="text-amber-700 text-sm">Set up your lawyer profile so clients can find and book you.</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-[#1E3A8A] mb-1">🚀 Appointment Management Coming Soon</h3>
          <p className="text-blue-700 text-sm">View and manage client appointment requests in the next update.</p>
        </div>
      </div>
    </div>
  );
}

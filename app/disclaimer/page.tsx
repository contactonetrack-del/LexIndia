import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Scale, BookOpen, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal Disclaimer | LexIndia',
  description: 'LexIndia legal disclaimer — the platform provides general legal information only, not legal advice. All users must read this disclaimer before using LexIndia services.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1E3A8A] text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Legal Disclaimer</h1>
          <p className="text-blue-200 text-sm">Last updated: 10 March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Critical warning */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-amber-900 mb-2">Important: Information, Not Legal Advice</h2>
              <p className="text-amber-800 text-sm leading-relaxed">
                LexIndia provides <strong>general legal information</strong> only. Nothing on this website — including guides, articles, AI chat responses, templates, or Know Your Rights content — constitutes <strong>legal advice</strong>. Using LexIndia does not create a lawyer-client relationship between you and LexIndia.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        {[
          {
            icon: Scale,
            title: '1. No Lawyer-Client Relationship',
            content: 'Using LexIndia, including consulting our AI assistant, reading our legal guides, or browsing our platform, does not create a lawyer-client relationship. Only a formal engagement with a licensed advocate creates such a relationship. If you need legal advice specific to your situation, you must engage a qualified lawyer directly.'
          },
          {
            icon: BookOpen,
            title: '2. General Information Only',
            content: 'All content on LexIndia — including guides, templates, AI responses, Know Your Rights articles, and lawyer listings — is intended to provide general legal awareness. Laws, regulations, and their interpretations change frequently and vary by jurisdiction. LexIndia makes no guarantee that the information is current, accurate, complete, or applicable to your specific situation.'
          },
          {
            icon: AlertTriangle,
            title: '3. AI Chat Limitations',
            content: 'LexIndia\'s AI legal assistant is powered by large language models. It can provide general information but can make errors, cite outdated laws, or misunderstand your specific situation. Never rely solely on AI responses for legal decisions. Always verify information with a qualified lawyer and official legal resources.'
          },
          {
            icon: Scale,
            title: '4. Lawyer Listings — Not Endorsements',
            content: 'Lawyers listed on LexIndia are independent legal professionals. LexIndia verifies identity and Bar Council enrolment but does not guarantee the quality, accuracy, or outcome of any legal services provided by listed lawyers. LexIndia is not liable for any actions, advice, or services offered by lawyers listed on the platform.'
          },
          {
            icon: BookOpen,
            title: '5. Legal Templates',
            content: 'Templates provided on LexIndia are general drafts for common situations. They may not be suitable for your specific circumstances, jurisdiction, or needs. Before using any template in a legal matter, consult a qualified lawyer who can review and customise it appropriately. Using a template incorrectly may have adverse legal consequences.'
          },
          {
            icon: AlertTriangle,
            title: '6. Links to External Websites',
            content: 'LexIndia may link to external government websites, legal databases, or resources. We do not control these websites and are not responsible for their content, accuracy, or availability. Links are provided for convenience only and do not constitute endorsement.'
          },
          {
            icon: Scale,
            title: '7. Limitation of Liability',
            content: 'To the fullest extent permitted by law, LexIndia, its directors, employees, partners, and affiliates shall not be liable for any direct, indirect, consequential, or incidental losses arising from the use of — or reliance on — any information or services provided through this platform.'
          },
          {
            icon: BookOpen,
            title: '8. Jurisdiction',
            content: 'LexIndia operates under the laws of India. Any disputes arising from use of this platform are subject to the exclusive jurisdiction of the courts of New Delhi, India. The platform is designed for Indian users and Indian legal content. If you access it from another country, you do so at your own risk and must comply with local laws.'
          },
          {
            icon: Scale,
            title: '9. Applicable Law',
            content: 'This disclaimer is governed by and construed in accordance with the laws of India, including the Information Technology Act 2000 (as amended), the Advocates Act 1961, the Bar Council of India Rules on Lawyers\' Advertising, and the Digital Personal Data Protection Act 2023.'
          },
        ].map(({ icon: Icon, title, content }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <h2 className="font-bold text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
          </div>
        ))}

        {/* Emergency note */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-red-900 mb-2">In Case of Emergency</h2>
              <p className="text-red-800 text-sm">
                If you are in immediate danger, call Police: <strong>100</strong>. Women&apos;s helpline: <strong>1091</strong>. 
                NALSA free legal aid: <strong>15100</strong>. LexIndia is an information resource — it is not an emergency service.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pb-4 space-y-2">
          <p>If you have questions about this disclaimer, please <Link href="/contact" className="text-[#1E3A8A] underline">contact us</Link>.</p>
          <div className="flex justify-center gap-4">
            <Link href="/privacy" className="text-[#1E3A8A] hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-[#1E3A8A] hover:underline">Terms of Service</Link>
            <Link href="/verify-lawyers" className="text-[#1E3A8A] hover:underline">Verification Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

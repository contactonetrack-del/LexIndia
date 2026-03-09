import Link from 'next/link';
import { Scale, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Scale className="w-12 h-12 text-[#1E3A8A]" />
                    </div>
                </div>
                <h1 className="text-6xl font-bold text-[#1E3A8A] mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page Not Found</h2>
                <p className="text-gray-500 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#1E3A8A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
                        <Home className="w-4 h-4" /> Go Home
                    </Link>
                    <Link href="/lawyers" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                        <Search className="w-4 h-4" /> Find Lawyers
                    </Link>
                </div>
            </div>
        </div>
    );
}

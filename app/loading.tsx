export default function Loading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#1E3A8A] border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-500 font-medium">Loading...</p>
            </div>
        </div>
    );
}

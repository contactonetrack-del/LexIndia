export function LawyerCardSkeleton() {
    return (
        <div className="bg-background rounded-2xl shadow-sm border border-border p-5 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <div className="h-6 bg-muted rounded-full w-20" />
                <div className="h-6 bg-muted rounded-full w-24" />
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-9 bg-muted rounded-xl w-28" />
            </div>
        </div>
    );
}

export function LawyersGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <LawyerCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function FAQSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-background rounded-xl border border-border p-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                </div>
            ))}
        </div>
    );
}

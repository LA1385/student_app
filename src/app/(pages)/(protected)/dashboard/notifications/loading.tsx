function SkeletonBlock({ className }: { className: string }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-bg-input ${className}`} />;
}

export default function NotificationsLoading() {
    return (
        <div className="p-4 md:p-6">
            <SkeletonBlock className="h-8 w-64" />
            <div className="mt-6 flex flex-col gap-3">
                <div className="flex flex-wrap justify-end gap-2">
                    <SkeletonBlock className="h-11 w-28" />
                    <SkeletonBlock className="h-11 w-24" />
                </div>
                {Array.from({ length: 4 }, (_, index) => (
                    <div
                        key={index}
                        className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-bg-card p-4"
                    >
                        <SkeletonBlock className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <SkeletonBlock className="h-4 w-4/5" />
                            <SkeletonBlock className="h-3 w-16" />
                        </div>
                        <SkeletonBlock className="h-11 w-11 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

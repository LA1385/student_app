function SkeletonBlock({ className }: { className: string }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-bg-input ${className}`} />;
}

function ChoiceSkeleton({ width = "w-20" }: { width?: string }) {
    return <SkeletonBlock className={`h-10 rounded-full ${width}`} />;
}

export default function TaskDetailLoading() {
    return (
        <div className="mx-auto w-full max-w-6xl pb-8 pt-6 sm:pb-10 sm:pt-8 lg:pl-4 lg:pt-10">
            <header className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
                <div className="min-w-0 w-full">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="mt-3 h-10 w-3/4 sm:h-12 sm:w-1/2" />
                    <div className="mt-3 flex gap-2">
                        <SkeletonBlock className="h-6 w-16 rounded-full" />
                        <SkeletonBlock className="h-6 w-20 rounded-full" />
                    </div>
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
                <section className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-sm">
                    <div className="border-b border-border bg-primary-light px-5 py-4 sm:px-8">
                        <SkeletonBlock className="h-4 w-28" />
                    </div>
                    <div className="divide-y divide-border px-5 sm:px-8">
                        <div className="grid gap-3 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
                            <SkeletonBlock className="h-4 w-20" />
                            <SkeletonBlock className="h-6 w-32" />
                        </div>
                        <div className="grid gap-3 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
                            <SkeletonBlock className="h-4 w-12" />
                            <div className="flex flex-wrap gap-2">
                                <ChoiceSkeleton />
                                <ChoiceSkeleton />
                                <ChoiceSkeleton />
                            </div>
                        </div>
                        <div className="grid gap-3 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
                            <SkeletonBlock className="h-4 w-16" />
                            <SkeletonBlock className="h-6 w-24" />
                        </div>
                        <div className="grid gap-3 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
                            <SkeletonBlock className="h-4 w-14" />
                            <SkeletonBlock className="h-6 w-24" />
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-purple/25 bg-purple-light/45 p-5 shadow-sm sm:p-6">
                    <SkeletonBlock className="h-6 w-28" />
                    <SkeletonBlock className="mt-2 h-3 w-20" />
                    <div className="mt-6 space-y-6">
                        <div>
                            <SkeletonBlock className="h-3 w-16" />
                            <div className="mt-3 flex flex-wrap gap-2">
                                <ChoiceSkeleton width="w-24" />
                                <ChoiceSkeleton width="w-24" />
                            </div>
                        </div>
                        <div>
                            <SkeletonBlock className="h-3 w-20" />
                            <div className="mt-3 flex flex-wrap gap-2">
                                <ChoiceSkeleton width="w-20" />
                                <ChoiceSkeleton width="w-20" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:mt-8 sm:flex-row sm:justify-end sm:pt-7">
                <SkeletonBlock className="h-12 w-full rounded-xl sm:w-32" />
                <SkeletonBlock className="h-12 w-full rounded-xl sm:w-40" />
            </div>
        </div>
    );
}

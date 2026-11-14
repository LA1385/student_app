function SkeletonBlock({ className }: { className: string }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-bg-input ${className}`} />;
}

function TaskSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-bg-card p-4">
            <div className="flex items-start justify-between gap-4">
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-4 w-20" />
            </div>
            <SkeletonBlock className="mt-4 h-6 w-3/4" />
            <SkeletonBlock className="mt-3 h-5 w-20" />
            <div className="mt-4 flex justify-end">
                <SkeletonBlock className="h-11 w-11 rounded-full" />
            </div>
        </div>
    );
}

export default function TasksLoading() {
    return (
        <div className="space-y-8 py-4 md:px-6 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <SkeletonBlock className="h-10 w-32" />
                    <SkeletonBlock className="mt-3 h-5 w-72 max-w-full" />
                </div>
                <SkeletonBlock className="h-11 w-full rounded-2xl md:w-32" />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <SkeletonBlock className="h-14 w-full rounded-2xl md:w-80" />
                <SkeletonBlock className="h-14 w-full rounded-2xl md:max-w-md" />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="space-y-4">
                    <SkeletonBlock className="h-7 w-32" />
                    <TaskSkeleton />
                    <TaskSkeleton />
                </section>
                <section className="space-y-4">
                    <SkeletonBlock className="h-7 w-36" />
                    <TaskSkeleton />
                    <TaskSkeleton />
                </section>
            </div>

            <section className="space-y-4">
                <SkeletonBlock className="h-7 w-32" />
                <TaskSkeleton />
                <TaskSkeleton />
            </section>
        </div>
    );
}

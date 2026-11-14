function SkeletonBlock({ className }: { className: string }) {
    return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-bg-input ${className}`} />;
}

function MetricSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-bg-card p-3 md:p-4">
            <SkeletonBlock className="h-3 w-16 md:h-4 md:w-20" />
            <SkeletonBlock className="mt-3 h-7 w-10 md:h-9 md:w-12" />
        </div>
    );
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

function ToolSkeleton() {
    return <SkeletonBlock className="h-28 w-full rounded-xl" />;
}

export default function DashboardLoading() {
    return (
        <div className="bg-bg-page">
            <div className="p-4 md:p-6">
                <div className="mb-6 grid grid-cols-3 gap-3">
                    <MetricSkeleton />
                    <MetricSkeleton />
                    <MetricSkeleton />
                </div>

                <div className="md:hidden">
                    <div className="mb-4 flex items-center justify-between">
                        <SkeletonBlock className="h-7 w-32" />
                        <SkeletonBlock className="h-10 w-20 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <TaskSkeleton />
                        <TaskSkeleton />
                    </div>
                </div>

                <div className="hidden md:grid md:grid-cols-[1fr_360px] md:gap-6">
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <SkeletonBlock className="h-7 w-32" />
                            <SkeletonBlock className="h-10 w-20 rounded-lg" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <TaskSkeleton />
                            <TaskSkeleton />
                            <TaskSkeleton />
                        </div>
                    </section>
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <SkeletonBlock className="h-7 w-36" />
                            <SkeletonBlock className="h-5 w-16" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <ToolSkeleton />
                            <ToolSkeleton />
                            <ToolSkeleton />
                            <ToolSkeleton />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

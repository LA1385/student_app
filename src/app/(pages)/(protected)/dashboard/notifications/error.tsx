"use client";

export default function NotificationsError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="p-4 md:p-6">
            <div
                role="alert"
                className="rounded-xl border border-urgent/25 bg-bg-card px-4 py-10 text-center"
            >
                <h1 className="text-lg font-semibold text-text">
                    Notifications are unavailable
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                    We couldn&apos;t load your notifications. Please try again.
                </p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-6 min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}

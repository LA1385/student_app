"use client";

export default function ProtectedError({ reset }: { reset: () => void }) {
    return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
            <div
                role="alert"
                className="w-full max-w-md rounded-2xl border border-urgent/25 bg-bg-card p-6 text-center shadow-sm"
            >
                <h1 className="text-xl font-semibold text-text">
                    We couldn&apos;t load your student area
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                    Your tasks or dashboard data could not be loaded. Please try again.
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

"use client";

export default function AppError({ reset }: { reset: () => void }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-bg-page p-6 text-text">
            <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card p-6 text-center shadow-sm">
                <h1 className="text-xl font-semibold">Something went wrong</h1>
                <p className="mt-2 text-sm text-text-secondary">
                    We couldn&apos;t load this page. Please try again.
                </p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-6 min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                    Try again
                </button>
            </div>
        </main>
    );
}

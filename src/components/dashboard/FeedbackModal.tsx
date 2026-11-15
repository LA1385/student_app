"use client";

import Portal from "@/components/Tasks/Portal";
import { useEffect, useRef, useState } from "react";

const categories = ["Bug", "Idea", "Other"] as const;
const MAX_MESSAGE_LENGTH = 1000;

type FeedbackModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [category, setCategory] = useState<(typeof categories)[number]>("Bug");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
        modalRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocusedElement.current?.focus();
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        return () => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
        };
    }, []);

    if (!isOpen) return null;

    const handleClose = () => {
        if (isSending) return;
        setError(null);
        setIsSuccess(false);
        setMessage("");
        setCategory("Bug");
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage || isSending) return;

        setIsSending(true);
        setError(null);

        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, message: trimmedMessage }),
            });
            const result: { error?: string } = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || "Unable to send feedback. Please try again.");
            }

            setIsSuccess(true);
            closeTimer.current = setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to send feedback. Please try again.",
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Portal>
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-text/55 px-4 py-6 backdrop-blur-sm"
                onClick={handleClose}
            >
                <div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="feedback-modal-title"
                    tabIndex={-1}
                    className="w-full max-w-md min-w-0 overflow-hidden rounded-2xl border border-border bg-bg-card p-5 shadow-2xl shadow-text/20 sm:p-7"
                    onClick={(event) => event.stopPropagation()}
                >
                    <h2 id="feedback-modal-title" className="text-lg font-bold text-text sm:text-xl">
                        Send feedback
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Help us improve Scholarly.
                    </p>

                    {isSuccess ? (
                        <p className="mt-6 rounded-xl bg-upcoming/10 p-4 text-sm font-medium text-upcoming" aria-live="polite">
                            Thanks for your feedback. It has been sent.
                        </p>
                    ) : (
                        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                            <fieldset>
                                <legend className="text-sm font-semibold text-text">Category</legend>
                                <div className="mt-2 grid grid-cols-3 gap-2">
                                    {categories.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            aria-pressed={category === option}
                                            onClick={() => setCategory(option)}
                                            className={`min-h-11 rounded-xl border px-2 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                                                category === option
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border-strong bg-bg-card text-text-secondary hover:bg-bg-page"
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="feedback-message" className="text-sm font-semibold text-text">
                                    Message
                                </label>
                                <textarea
                                    id="feedback-message"
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    rows={5}
                                    required
                                    className="mt-2 block min-h-32 w-full resize-y rounded-xl border border-border-strong bg-bg-input px-3 py-3 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-4 focus:ring-primary/20"
                                    placeholder="Tell us what you think..."
                                />
                                <p className="mt-1 text-right text-xs text-text-muted" aria-live="polite">
                                    {message.length}/{MAX_MESSAGE_LENGTH}
                                </p>
                            </div>

                            {error && (
                                <p className="break-words rounded-xl bg-urgent/10 p-3 text-sm text-urgent" role="alert">
                                    {error}
                                </p>
                            )}

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSending}
                                    className="min-h-11 rounded-xl border border-border-strong bg-bg-card px-5 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-bg-page focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSending || message.trim().length === 0}
                                    className="min-h-11 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSending ? "Sending..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Portal>
    );
}

"use client";

import { Trash2 } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/Tasks/ConfirmationModal";

type Notification = {
    id: string;
    taskId: string;
    message: string;
    read: boolean;
    createdAt: string;
};

function getRelativeTime(createdAt: string) {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));

    if (elapsedSeconds < 60) return "just now";

    const minutes = Math.floor(elapsedSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;

    return new Date(createdAt).toLocaleDateString();
}

export default function NotificationList({ notifications }: { notifications: Notification[] }) {
    const router = useRouter();
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [bulkError, setBulkError] = useState<string | null>(null);
    const [readError, setReadError] = useState<string | null>(null);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [optimisticNotifications, setOptimisticNotifications] = useOptimistic(
        notifications,
        (
            currentNotifications,
            action:
                | { type: "read"; id: string }
                | { type: "delete"; id: string }
                | { type: "read-all" }
                | { type: "clear-all" }
        ) => {
            if (action.type === "read") {
                return currentNotifications.map((notification) =>
                    notification.id === action.id
                        ? { ...notification, read: true }
                        : notification
                );
            }

            if (action.type === "read-all") {
                return currentNotifications.map((notification) => ({
                    ...notification,
                    read: true,
                }));
            }

            if (action.type === "clear-all") {
                return [];
            }

            return currentNotifications.filter((notification) => notification.id !== action.id);
        }
    );
    const hasUnreadNotifications = optimisticNotifications.some((notification) => !notification.read);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            setReadError(null);
            startTransition(async () => {
                setOptimisticNotifications({ type: "read", id: notification.id });

                try {
                    const response = await fetch(
                        `/api/notifications/${notification.id}`,
                        { method: "PATCH" }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to mark notification as read");
                    }
                } catch (error) {
                    console.error("Error marking notification as read:", error);
                    setReadError("Could not mark notification as read. Please try again.");
                } finally {
                    router.refresh();
                }
            });
        }

        router.push(`/dashboard/tasks/${notification.taskId}`);
    };

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, notificationId: string) => {
        event.stopPropagation();
        setDeleteError(null);

        startTransition(async () => {
            setOptimisticNotifications({ type: "delete", id: notificationId });

            try {
                const response = await fetch(`/api/notifications/${notificationId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Failed to delete notification");
                }
            } catch {
                setDeleteError("Could not delete notification. It has been restored.");
            } finally {
                router.refresh();
            }
        });
    };

    const handleMarkAllRead = () => {
        setBulkError(null);
        startTransition(async () => {
            setOptimisticNotifications({ type: "read-all" });

            try {
                const response = await fetch("/api/notifications/read-all", {
                    method: "PATCH",
                });
                if (!response.ok) {
                    throw new Error("Failed to mark all notifications as read");
                }
            } catch {
                setBulkError("Could not mark all notifications as read. Please try again.");
            } finally {
                router.refresh();
            }
        });
    };

    const handleClearAll = () => {
        setBulkError(null);
        startTransition(async () => {
            setOptimisticNotifications({ type: "clear-all" });

            try {
                const response = await fetch("/api/notifications", {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Failed to clear notifications");
                }
            } catch {
                setBulkError("Could not clear notifications. They have been restored.");
            } finally {
                router.refresh();
            }
        });
    };

    return (
        <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                    type="button"
                    disabled={!hasUnreadNotifications || isPending}
                    onClick={handleMarkAllRead}
                    className="min-h-11 rounded-lg border border-border-strong px-3 text-sm font-medium text-text-secondary transition hover:bg-bg-input focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Mark all read
                </button>
                <button
                    type="button"
                    disabled={optimisticNotifications.length === 0 || isPending}
                    onClick={() => setIsClearModalOpen(true)}
                    className="min-h-11 rounded-lg border border-urgent/25 px-3 text-sm font-medium text-urgent transition hover:bg-urgent/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-urgent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Clear all
                </button>
            </div>
            {optimisticNotifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border-strong bg-bg-card px-4 py-10 text-center">
                    <p className="text-base font-semibold text-text">No notifications yet</p>
                    <p className="mt-1 text-sm text-text-muted">
                        You&apos;re all caught up. New reminders will appear here.
                    </p>
                </div>
            ) : (
                optimisticNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleNotificationClick(notification)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleNotificationClick(notification);
                            }
                        }}
                        className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-bg-card p-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                    >
                        <span
                            aria-label={notification.read ? "Read notification" : "Unread notification"}
                            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                                notification.read ? "bg-transparent" : "bg-primary"
                            }`}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="break-words text-sm text-text">{notification.message}</p>
                            <p className="mt-1 text-xs text-text-muted">
                                {getRelativeTime(notification.createdAt)}
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Delete notification"
                            disabled={isPending}
                            onClick={(event) => handleDelete(event, notification.id)}
                            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-bg-input hover:text-urgent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-urgent/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))
            )}
            {(deleteError || bulkError || readError) && (
                <p className="text-sm text-urgent" role="alert">
                    {deleteError || bulkError || readError}
                </p>
            )}
            <ConfirmationModal
                isOpen={isClearModalOpen}
                onClose={() => setIsClearModalOpen(false)}
                onConfirm={handleClearAll}
            />
        </div>
    );
}

"use client";

type Notification = {
    id: string;
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
    return (
        <div className="mt-6 flex flex-col gap-3">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="flex items-start gap-3 rounded-xl border border-border bg-bg-card p-4"
                >
                    <span
                        aria-label={notification.read ? "Read notification" : "Unread notification"}
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                            notification.read ? "bg-transparent" : "bg-primary"
                        }`}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm text-text">{notification.message}</p>
                        <p className="mt-1 text-xs text-text-muted">
                            {getRelativeTime(notification.createdAt)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

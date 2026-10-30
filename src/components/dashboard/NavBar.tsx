import ProfilePill from "@/components/dashboard/ProfilePill";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function NavBar({
    unreadNotificationCount,
}: {
    unreadNotificationCount: number;
}) {
    const notificationLabel = `Notifications, ${unreadNotificationCount} unread`;
    const notificationBadge = unreadNotificationCount > 99 ? "99+" : unreadNotificationCount;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-4 md:px-6 bg-bg-card border-b border-border flex items-center justify-between">
            {/* App Name & Logo */}
            <div className="flex items-center gap-2">
                <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-7 h-7 rounded-md object-contain"
                />
                <span className="text-primary font-bold text-lg">
                    Scholarly
                </span>
            </div>

            {/* Profile Pill & Bell icon & Theme Toggle */}
            <div className="flex items-center gap-1 md:gap-3">
                <Link
                    href="/dashboard/notifications"
                    aria-label={notificationLabel}
                    className="relative text-text-muted hover:text-text cursor-pointer transition-colors p-1.5 rounded-lg hover:bg-bg-input"
                >
                    <Bell className="w-[18px] h-[18px]" />
                    {unreadNotificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-urgent text-white text-[10px] leading-4 text-center rounded-full ring-2 ring-bg-card">
                            {notificationBadge}
                        </span>
                    )}
                </Link>
                <ProfilePill />
                <ThemeToggle />
            </div>
        </nav>
    );
}

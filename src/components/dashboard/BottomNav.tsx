"use client";

import { LayoutDashboard, ClipboardList, Bell, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav({ unreadNotificationCount }: { unreadNotificationCount: number }) {
    const pathname = usePathname();
    const notificationBadge = unreadNotificationCount > 99 ? "99+" : unreadNotificationCount;

    const Navigations = [
        { name: 'Home', Icon: LayoutDashboard, link: "/dashboard" },
        { name: 'Tasks', Icon: ClipboardList, link: "/dashboard/tasks" },
        { name: 'Notifications', Icon: Bell, link: "/dashboard/notifications" },
        { name: 'Tools', Icon: Wrench, link: "/dashboard/tools" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-bg-card border-t border-border flex items-center md:hidden">
            {Navigations.map((item, index) => {
                const isActive = pathname === item.link;
                const isNotifications = item.name === "Notifications";

                return (
                    <Link
                        key={index}
                        href={item.link}
                        aria-label={isNotifications
                            ? `Notifications, ${unreadNotificationCount} unread`
                            : item.name}
                        className="flex flex-col items-center justify-center flex-1 gap-1 py-2 cursor-pointer"
                    >
                        <div className={`relative ${isActive ? "bg-primary rounded-xl p-2" : "p-2"}`}>
                            <item.Icon className={isActive ? "text-white w-5 h-5" : "text-text-muted w-5 h-5"} />
                            {isNotifications && unreadNotificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-urgent text-white text-[10px] leading-4 text-center rounded-full ring-2 ring-bg-card">
                                    {notificationBadge}
                                </span>
                            )}
                        </div>
                        <span className={`text-[10px] ${isActive ? "text-primary font-medium" : "text-text-muted"}`}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

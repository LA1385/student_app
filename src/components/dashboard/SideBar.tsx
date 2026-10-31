"use client";

import { LayoutDashboard, ClipboardList, Bell, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({
    unreadNotificationCount,
}: {
    unreadNotificationCount: number;
}) {
    const pathname = usePathname();
    const notificationBadge = unreadNotificationCount > 99 ? "99+" : unreadNotificationCount;

    const Navigations = [
        { name: 'Dashboard', Icon: LayoutDashboard, link: "/dashboard" },
        { name: 'Tasks', Icon: ClipboardList, link: "/dashboard/tasks" },
        { name: 'Notifications', Icon: Bell, link: "/dashboard/notifications" },
        { name: 'Tools', Icon: Wrench, link: "/dashboard/tools" },
    ];

    return (
        <div className="hidden md:flex flex-col fixed left-0 top-14 bottom-0 w-60 bg-bg-sidebar border-r border-border pt-6 px-3">

            {/* Navigation Items */}
            <nav className="flex-1">
                {Navigations.map((item, index) => {
                    const isActive = pathname === item.link;

                    return (
                        <Link 
                            key={index} 
                            href={item.link}
                            className={`relative mb-1 flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors duration-150 hover:bg-bg-input hover:text-text focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                                isActive 
                                    ? "bg-primary/10 text-primary font-medium after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-primary after:rounded-full" 
                                    : ""
                            }`}
                        >
                            <item.Icon className="w-[18px] h-[18px]" />
                            <span>{item.name}</span>
                            {item.name === "Notifications" && unreadNotificationCount > 0 && (
                                <span className="ml-auto min-w-4 h-4 rounded-full bg-urgent px-1 text-center text-[10px] leading-4 text-primary-foreground">
                                    {notificationBadge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

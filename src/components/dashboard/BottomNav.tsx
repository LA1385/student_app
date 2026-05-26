"use client";

import { LayoutDashboard, ClipboardList, Wrench, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const Navigations = [
        { name: 'Home', Icon: LayoutDashboard, link: "/dashboard" },
        { name: 'Tasks', Icon: ClipboardList, link: "/dashboard/tasks" },
        { name: 'Tools', Icon: Wrench, link: "/dashboard/tools" },
        { name: 'Profile', Icon: User, link: "/dashboard/profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-bg-card border-t border-border flex items-center md:hidden">
            {Navigations.map((item, index) => {
                const isActive = pathname === item.link;

                return (
                    <Link
                        key={index}
                        href={item.link}
                        className="flex flex-col items-center justify-center flex-1 gap-1 py-2 cursor-pointer"
                    >
                        <div className={isActive ? "bg-primary rounded-xl p-2" : "p-2"}>
                            <item.Icon className={isActive ? "text-white w-5 h-5" : "text-text-muted w-5 h-5"} />
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


"use client";

import { LayoutDashboard, ClipboardList, TrendingUp, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
    const pathname = usePathname();

    const Navigations = [
        { name: 'Dashboard', Icon: LayoutDashboard, link: "/dashboard" },
        { name: 'Tasks', Icon: ClipboardList, link: "/dashboard/tasks" },
        { name: 'Progress', Icon: TrendingUp, link: "/dashboard/progress" },
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
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary cursor-pointer hover:bg-bg-input hover:text-text transition-colors duration-150 mb-1 relative ${
                                isActive 
                                    ? "bg-primary/10 text-primary font-medium after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-1 after:h-6 after:bg-primary after:rounded-full" 
                                    : ""
                            }`}
                        >
                            <item.Icon className="w-[18px] h-[18px]" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

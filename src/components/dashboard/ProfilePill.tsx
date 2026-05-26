"use client";
import { useSession } from "next-auth/react";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export default function ProfilePill() {
    const { data: session } = useSession();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("has seen profile tip");
        if (!hasSeen) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                localStorage.setItem("has seen profile tip", "true");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [])

    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-border rounded-full hover:bg-bg-input transition-colors cursor-pointer select-none">
                        <img 
                            src={session?.user?.image ?? "/logo.png"} 
                            alt="profile" 
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-border"
                        />
                        <span className="text-sm font-medium text-text hidden md:inline">
                            {session?.user?.name?.split(" ")[0] || "User"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-text-muted" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 align-end">
                    <DropdownMenuLabel className="text-sm font-semibold text-black">
                        {session?.user?.name || "Student"}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs text-text-muted font-normal pt-0">
                        {session?.user?.email || "student@university.edu"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {isVisible && (
                <div className="absolute top-14 right-0 bg-upcoming text-white text-xs font-medium px-3 py-2 rounded-lg shadow-md z-50 w-[180px] animate-bounce-subtle">
                    {/* Rotated triangle helper */}
                    <div className="absolute -top-1 right-6 w-2.5 h-2.5 bg-upcoming rotate-45"></div>
                    Your profile information and sign out is here
                </div>
            )}
        </div>    
    );
}


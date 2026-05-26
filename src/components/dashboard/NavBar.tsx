import ProfilePill from "@/components/dashboard/ProfilePill";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Bell } from "lucide-react";

export default function NavBar() {
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
                <div className="relative text-text-muted hover:text-text cursor-pointer transition-colors p-1.5 rounded-lg hover:bg-bg-input">
                    <Bell className="w-[18px] h-[18px]" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-urgent rounded-full ring-2 ring-bg-card"></span>
                </div>
                <ProfilePill />
                <ThemeToggle />
            </div>
        </nav>
    );
}


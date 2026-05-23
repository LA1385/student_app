import ProfilePill from "@/components/dashboard/ProfilePill";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Bell } from "lucide-react";

export default function NavBar() {
    return(
        <div>
            {/* App Name & Logo */}
            <div>
                <div>
                    <img src="/logo.png" alt="Logo" />
                </div>
                <div>
                    Scholarly
                </div>
            </div>

            {/* Profile Pill & Bell icon */}
            <div>
                <div>
                    <Bell/>
                </div>
                <div>
                    <ProfilePill/>
                </div>
                <div>
                    <ThemeToggle/>
                </div>
            </div>
        </div>
    )
}

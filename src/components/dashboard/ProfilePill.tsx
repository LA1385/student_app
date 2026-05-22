"use client";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
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
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                        <img src={session?.user?.image ?? ""} alt="profile" />
                        <span>{session?.user?.name?.split(" ")[0]}</span>
                        <ChevronDown />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                    <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {isVisible && (
                <div>Your Profile information and sign out is here</div>
            )}
        </div>    
    );
}

import NavBar from "@/components/dashboard/NavBar";
import BottomNav from "@/components/dashboard/BottomNav";
import SideBar from "@/components/dashboard/SideBar";
import NotificationRefresh from "@/components/dashboard/NotificationRefresh";
import TimeZoneSync from "@/components/dashboard/TimeZoneSync";
import { requireUser } from "@/lib/auth_helpers";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children}: {
    children: React.ReactNode}) {
        const user = await requireUser();
    if (!user) {
        redirect("/");
    }

    let unreadNotificationCount = 0;
    try {
        unreadNotificationCount = await getUnreadNotificationCount(user.id);
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
    }

        return (
            <div className="min-h-screen bg-bg-page text-text">
                <NotificationRefresh />
                <TimeZoneSync />
                <NavBar unreadNotificationCount={unreadNotificationCount} />
                <SideBar unreadNotificationCount={unreadNotificationCount} />
                <main className="min-h-screen px-4 pb-20 pt-14 md:pl-64 md:pr-12 md:pb-8">
                    {children}
                </main>
                <BottomNav unreadNotificationCount={unreadNotificationCount} />
            </div>
        )
}

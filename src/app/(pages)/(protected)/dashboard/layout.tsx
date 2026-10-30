import NavBar from "@/components/dashboard/NavBar";
import BottomNav from "@/components/dashboard/BottomNav";
import SideBar from "@/components/dashboard/SideBar";
import { requireUser } from "@/lib/auth_helpers";
import { getUnreadNotificationCount } from "@/lib/notifications";

export default async function ProtectedLayout({
    children}: {
    children: React.ReactNode}) {
        const user = await requireUser();
        const unreadNotificationCount = user?.id
            ? await getUnreadNotificationCount(user.id)
            : 0;

        return (
            <div className="min-h-screen bg-bg-page text-text">
                <NavBar unreadNotificationCount={unreadNotificationCount} />
                <SideBar unreadNotificationCount={unreadNotificationCount} />
                <main className="min-h-screen px-4 pb-20 pt-14 md:pl-64 md:pr-12 md:pb-8">
                    {children}
                </main>
                <BottomNav unreadNotificationCount={unreadNotificationCount} />
            </div>
        )
}

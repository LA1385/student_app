import NotificationList from "@/components/dashboard/NotificationList";
import { requireUser } from "@/lib/auth_helpers";
import { getNotifications } from "@/lib/notifications";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
    const user = await requireUser();
    if (!user) {
        redirect("/login");
    }

    const notifications = await getNotifications(user.id);
    const serializedNotifications = notifications.map((notification) => ({
        ...notification,
        createdAt: notification.createdAt.toISOString(),
    }));

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold text-text">Recent notifications</h1>
            <NotificationList notifications={serializedNotifications} />
        </div>
    );
}

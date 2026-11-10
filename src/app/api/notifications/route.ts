import { requireUser } from "@/lib/auth_helpers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    getNotifications,
    getUnreadNotificationCount,
} from "@/lib/notifications";

// Get Method for notifications
export async function GET() {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [notifications, unreadCount] = await Promise.all([
            getNotifications(user.id),
            getUnreadNotificationCount(user.id),
        ]);

        return NextResponse.json({ notifications, unreadCount }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 });
    }
}


// Delete Method for notifications
export async function DELETE() {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.notification.deleteMany({
            where: { userId: user.id },
        });
        return NextResponse.json({ message: "All notifications deleted" }, { status: 200 });
    }
    catch (error) {
        console.error("Error deleting notifications:", error);
        return NextResponse.json({ error: "Error deleting notifications" }, { status: 500 });
    }
}
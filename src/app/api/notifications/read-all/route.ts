import { requireUser } from "@/lib/auth_helpers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Patch method for marking all of the user's unread notifications as read
export async function PATCH() {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const updateNotifications = await prisma.notification.updateMany({
            where: { userId: user.id, read: false },
            data: { read: true },
        });

        return NextResponse.json(updateNotifications, { status: 200 });
    }
    catch (error) {
        console.error("Error updating all notifications:", error);
        return NextResponse.json({ error: "Error updating all notifications" }, { status: 500 });
    }
}
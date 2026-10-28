import { requireUser } from "@/lib/auth_helpers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get Method for notifications
export async function GET() {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 20,
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: user.id, read: false }
        });

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
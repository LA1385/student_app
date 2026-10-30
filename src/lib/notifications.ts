import { prisma } from "@/lib/prisma";

export async function getUnreadNotificationCount(userId: string) {
    return prisma.notification.count({
        where: {
            userId,
            read: false,
        },
    });
}

export async function getNotifications(userId: string) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
    });
}

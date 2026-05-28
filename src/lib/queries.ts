import { prisma } from '@/lib/prisma';

// Full task list for a user
export async function getTasks(userId: string) {
    return await prisma.task.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" }
    })
};

// Task summary for a user
export async function getTaskSummary(userId: string) {
    // Calculate the start and end of the current day
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999);
    // Calculate the end of the current week
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);

    const dueToday = await prisma.task.count({
        where: {
            userId,
            dueDate: { gte: startOfDay, lte: endOfDay },
            status: { not: "completed" }
        }
    })

    // your thisWeek and completed queries go here
    const dueThisWeek = await prisma.task.count({
        where: {
            userId,
            dueDate: { gte: startOfDay, lte: endOfWeek },
            status: { not: "completed" }
        }
    })

    const completed = await prisma.task.count({
        where: {
            userId,
            status: "completed"
        }
    })

    return { dueToday, dueThisWeek, completed };
}
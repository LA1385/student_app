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
    try{
        const now = new Date()
        const todayUTC = now.toISOString().split('T')[0] // "2026-05-29"

        const startOfDay = new Date(`${todayUTC}T00:00:00.000Z`)
        const endOfDay = new Date(`${todayUTC}T23:59:59.999Z`)
        const endOfWeek = new Date(`${todayUTC}T23:59:59.999Z`)
        endOfWeek.setDate(new Date(todayUTC).getDate() + 7)
        const endOfWeekTimestamp = endOfWeek.getTime()

        const raw = await prisma.$queryRaw`
        SELECT id, dueDate, typeof(dueDate) as dateType 
        FROM Task 
        WHERE userId = ${userId}
`
        console.log("raw query result:", raw)


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

        console.log("summary:", { dueToday, dueThisWeek, completed })
        return { dueToday, dueThisWeek, completed };
    } catch (error) {
        console.error("Error fetching task summary:", error);
        return { dueToday: 0, dueThisWeek: 0, completed: 0 };
    }
}
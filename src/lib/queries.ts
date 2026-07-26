import { prisma } from '@/lib/prisma';
import { TaskInput } from '@/lib/validators/taskValidators';

// Full task list for a user
export async function getTasks(userId: string) {
    return await prisma.task.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" }
    })
};

export async function getTaskSummary(userId: string) {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(startOfToday.getTime() + 24*60*60*1000 - 1);
        const sevenDaysLater = new Date(now.getTime() + 7*24*60*60*1000);

        const dueTodayResult = await prisma.$queryRaw<{count: number}[]>`
            SELECT COUNT(*) as count FROM Task 
            WHERE userId = ${userId} 
            AND dueDate >= ${startOfToday.getTime()} 
            AND dueDate <= ${endOfToday.getTime()}
            AND status != 'completed'
        `;
        const dueToday = Number(dueTodayResult[0].count);

        const dueThisWeekResult = await prisma.$queryRaw<{count: number}[]>`
            SELECT COUNT(*) as count FROM Task 
            WHERE userId = ${userId} 
            AND dueDate >= ${startOfToday.getTime()} 
            AND dueDate <= ${sevenDaysLater.getTime()}
            AND status != 'completed'
        `;
        const dueThisWeek = Number(dueThisWeekResult[0].count);

        const completed = await prisma.task.count({
            where: { userId, status: "completed" }
        });

        return { dueToday, dueThisWeek, completed };

    } catch (error) {
        console.error("Error fetching task summary:", error);
        return { dueToday: 0, dueThisWeek: 0, completed: 0 };
    }
}

export async function createTask(userId: string, data: TaskInput){
    const { title, type, dueDate, priority, category, daysBefore, channel } = data;
    return await prisma.task.create({
        data: {
            title,
            type,
            dueDate: new Date(dueDate),
            priority,
            category,
            userId,
            reminders: {
                create: {
                    daysBefore,
                    userId,
                    channel,
                    scheduledAt: new Date(new Date(dueDate).getTime() - daysBefore * 24 * 60 * 60 * 1000)
                }
            }
            
        }
    })
}

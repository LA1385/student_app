import { prisma } from '@/lib/prisma';
import { TaskInput } from '@/lib/validators/taskValidators';
import { getReminderSchedule } from '@/lib/timeZone';
import { FeedbackInput } from '@/lib/validators/feedbackValidators';

// Full task list for a user
export async function getTasks(userId: string) {
    return await prisma.task.findMany({
        where: { userId },
        orderBy: { dueDate: "asc" }
    })
};

export async function getTaskSummary(userId: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24*60*60*1000 - 1);
    const sevenDaysLater = new Date(now.getTime() + 7*24*60*60*1000);

    const [dueToday, dueThisWeek, completed] = await Promise.all([
    prisma.task.count({
        where: {
            userId,
            status: { not: "Completed" },
            dueDate: { gte: startOfToday, lte: endOfToday },
        },
    }),
    prisma.task.count({
        where: {
            userId,
            status: { not: "Completed" },
            dueDate: { gte: startOfToday, lte: sevenDaysLater },
        },
    }),
    prisma.task.count({
        where: { userId, status: "Completed" },
    }),
]);

return { dueToday, dueThisWeek, completed };
}

export async function createTask(userId: string, data: TaskInput){
    const { title, type, dueDate, priority, category, daysBefore, channel } = data;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { timeZone: true },
    });
    const dueDateValue = new Date(dueDate);
    const reminderSchedule = getReminderSchedule(
        dueDateValue,
        daysBefore,
        user?.timeZone ?? "Africa/Lagos",
    );
    return await prisma.task.create({
        data: {
            title,
            type,
            dueDate: dueDateValue,
            priority,
            category,
            userId,
            reminders: {
                create: {
                    daysBefore,
                    userId,
                    channel,
                    scheduledAt: reminderSchedule.scheduledAt,
                    sent: !reminderSchedule.shouldArm,
                }
            }
            
        }
    })
}

export async function getTaskById(taskId: string, userId: string) {
    return await prisma.task.findUnique({
        where: {id: taskId, userId},
    })
}

export async function getTaskReminders(taskId: string, userId: string) {
    return await prisma.reminder.findFirst({
        where: {  taskId, userId },
    })
}

export async function createFeedback(userId: string, data: FeedbackInput) {
    return await prisma.feedback.create({
        data: {
            userId,
            category: data.category,
            message: data.message,
        },
    });
}

export async function countRecentFeedbackByUser(userId: string) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    return await prisma.feedback.count({
        where: {
            userId,
            createdAt: { gte: oneHourAgo },
        },
    });
}
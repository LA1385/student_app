import { prisma } from '@/lib/prisma';
import { MAX_ATTEMPTS } from '@/lib/constant';
import { sendEmail } from './email';


const BATCH_SIZE = 50;

const findDueReminders = (now: Date) => {
    return prisma.reminder.findMany({
        where: {
            sent: false,
            attempts: { lt: MAX_ATTEMPTS },
            scheduledAt: { lte: now },
            task: { 
                status: { not: "Completed" } 
            }
        },
        orderBy: { scheduledAt: 'asc' },
        take: BATCH_SIZE,
        select: {
            id: true,
            channel: true,
            attempts: true,
            task: {
                select: { id: true, title: true, type: true, dueDate: true }
            },
            user: {
                select: { id: true, email: true }
            }
        },
    })
}

let isRunning = false;

const escapeHtml = (text: string) =>
    text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const formatDate = (date: Date) =>
    date.toLocaleString("en-NG", {
        timeZone: "Africa/Lagos",
        dateStyle: "full",
        timeStyle: "short",
    });

export const processDueReminders = async() => {
    // Overlap guard: if a run is still going, don't start another
    if (isRunning) {
        console.log("Previous reminder run still in progress, skipping");
        return;
    }
    isRunning = true;

    try {
        const now = new Date();
        const reminders = await findDueReminders(now);

        for (const reminder of reminders) {
            
            const wantsEmail = reminder.channel === "Email" || reminder.channel === "Both";
            if (!wantsEmail) continue;

            // Step 1: send. Only this decides success or failure.
            try {
                if (!reminder.user.email) throw new Error("User has no email");

                await sendEmail(
                    reminder.user.email,
                    `Reminder: ${reminder.task.title}`,
                    `<p>Your task "${escapeHtml(reminder.task.title)}" is due on ${formatDate(reminder.task.dueDate)}.</p>`
                );
            }
            catch(error) {
                console.error(`Failed to send reminder ${reminder.id}:`, error);

                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: {
                        attempts: { increment: 1 },
                        lastError: error instanceof Error ? error.message : String(error)
                    }
                }).catch(console.error);

                continue;
            }

            // Step 2: mark as sent. The email already went out, so a failure here is not a failed attempt.
            try {
                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: { sent: true, attempts: { increment: 1 } }
                });
            }
            catch(error) {
                console.error(`Email sent but reminder ${reminder.id} was not marked as sent:`, error);
            }
        }
    }
    finally {
        isRunning = false;
    }
}
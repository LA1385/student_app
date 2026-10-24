import { prisma } from '@/lib/prisma';
import { MAX_ATTEMPTS } from '@/lib/constant';
import { sendEmail } from './email';


const BATCH_SIZE = 50;
export type ReminderRunSummary = {
    ran: boolean;      // false = skipped because a run was already in progress
    found: number;
    sent: number;      // email was accepted by the mail server
    failed: number;    // send failed, attempt recorded
    skipped: number;   // in-app-only, not handled here
    unmarked: number;  // email went out but marking it sent failed
};

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

export const processDueReminders = async (): Promise<ReminderRunSummary> => {
    // Overlap guard: if a run is still going, don't start another
    if (isRunning) {
        console.log("Previous reminder run still in progress, skipping");
        return { ran: false, found: 0, sent: 0, failed: 0, skipped: 0, unmarked: 0 };
    }
    isRunning = true;

    const summary: ReminderRunSummary = {
        ran: true, found: 0, sent: 0, failed: 0, skipped: 0, unmarked: 0,
    };

    try {
        const now = new Date();
        const reminders = await findDueReminders(now);
        summary.found = reminders.length;

        for (const reminder of reminders) {
            const wantsEmail = reminder.channel === "Email" || reminder.channel === "Both";
            if (!wantsEmail) {
                summary.skipped++;
                continue;
            }

            // Step 1: send. Only this decides success or failure.
            try {
                if (!reminder.user.email) throw new Error("User has no email");

                await sendEmail(
                    reminder.user.email,
                    `Reminder: ${reminder.task.title}`,
                    `<p>Your task "${escapeHtml(reminder.task.title)}" is due on ${formatDate(reminder.task.dueDate)}.</p>`
                );
            }
            catch (error) {
                console.error(`Failed to send reminder ${reminder.id}:`, error);
                summary.failed++;

                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: {
                        attempts: { increment: 1 },
                        lastError: error instanceof Error ? error.message : String(error)
                    }
                }).catch(console.error);

                continue;
            }

            summary.sent++;

            // Step 2: mark as sent. The email already went out, so this is not a failed attempt.
            try {
                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: { sent: true, attempts: { increment: 1 } }
                });
            }
            catch (error) {
                summary.unmarked++;
                console.error(`Email sent but reminder ${reminder.id} was not marked as sent:`, error);
            }
        }

        return summary;
    }
    finally {
        isRunning = false;
    }
};
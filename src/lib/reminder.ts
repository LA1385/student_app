import { prisma } from '@/lib/prisma';
import { MAX_ATTEMPTS } from '@/lib/constant';
import { sendEmail } from './email';


const BATCH_SIZE = 50;
export type ReminderRunSummary = {
    ran: boolean;       // false = skipped because a run was already in progress
    found: number;
    sent: number;       // emails accepted by the mail server
    notified: number;   // in-app notifications created or already present
    failed: number;     // reminders where a requested channel failed
    skipped: number;    // reminders with an unrecognized channel
    unmarked: number;   // all channels succeeded but marking sent failed
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
        return { ran: false, found: 0, sent: 0, notified: 0, failed: 0, skipped: 0, unmarked: 0 };
    }
    isRunning = true;

    const summary: ReminderRunSummary = {
        ran: true, found: 0, sent: 0, notified: 0, failed: 0, skipped: 0, unmarked: 0,
    };

    try {
        const now = new Date();
        const reminders = await findDueReminders(now);
        summary.found = reminders.length;

        for (const reminder of reminders) {
            const wantsEmail = reminder.channel === "Email" || reminder.channel === "Both";
            const wantsInApp = reminder.channel === "In-app" || reminder.channel === "Both";

            if (!wantsEmail && !wantsInApp) {
                summary.skipped++;
                continue;
            }

            // Plain text. Escaped separately for the email only.
            const message = `Your task "${reminder.task.title}" is due on ${formatDate(reminder.task.dueDate)}.`;

            // Step 1: deliver. Notification first; if it throws, the email is skipped this run.
            try {
                if (wantsInApp) {
                    await prisma.notification.upsert({
                        where: { reminderId: reminder.id },
                        update: {},
                        create: {
                            userId: reminder.user.id,
                            taskId: reminder.task.id,
                            reminderId: reminder.id,
                            message,
                        },
                    });
                    summary.notified++;
                }

                if (wantsEmail) {
                    if (!reminder.user.email) throw new Error("User has no email");

                    await sendEmail(
                        reminder.user.email,
                        `Reminder: ${reminder.task.title}`,
                        `<p>${escapeHtml(message)}</p>`
                    );
                    summary.sent++;
                }
            }
            catch (error) {
                console.error(`Failed to deliver reminder ${reminder.id}:`, error);
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

            // Step 2: every requested channel succeeded, so mark as sent.
            try {
                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: { sent: true, attempts: { increment: 1 } }
                });
            }
            catch (error) {
                summary.unmarked++;
                console.error(`Delivered but reminder ${reminder.id} was not marked as sent:`, error);
            }
        }

        return summary;
    }
    finally {
        isRunning = false;
    }
};
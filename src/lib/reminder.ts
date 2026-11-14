/**
 * Reminder delivery pipeline.
 *
 * Called by the scheduler (hourly) and by the cron route. Each run:
 *   1. Finds reminders that are due and not finished yet.
 *   2. Delivers each selected channel (in-app, email) on its own, and records
 *      a timestamp per channel. A retry therefore repeats only the channel
 *      that failed, never one that already succeeded.
 *   3. Marks the reminder `sent` only when every selected channel is done.
 *
 * Guarantees this file tries to give:
 *   - One bad reminder never stops the others (each one is isolated).
 *   - A reminder that keeps failing stops retrying after MAX_ATTEMPTS.
 *   - Email use stays under the daily cap (Gmail allows about 500/day).
 *   - No personal data is logged.
 *
 * Known limitations (update this list when they are fixed):
 *   - There is no atomic "claim" before sending. The `isRunning` flag only
 *     protects a single process, so two processes could both send the same
 *     reminder.
 *   - If an email is sent but the database write that records it fails, the
 *     next run sends it again (at most MAX_ATTEMPTS times in total).
 */

import { prisma } from '@/lib/prisma';
import { MAX_ATTEMPTS } from '@/lib/constant';
import { EmailDeliveryError, sendEmail } from './email';
import { Prisma } from '@generated/prisma/client';
import { normalizeTimeZone } from './timeZone';

// How many reminders one run will pick up. Leftovers are picked up by the
// next run, because the query is "due and not sent".
const BATCH_SIZE = 100;

// How many reminders are processed at the same time inside one run.
const CONCURRENCY = 5;

// Gmail's limit is about 500 emails per day. We stop at 400 to keep headroom.
// In-app notifications keep going when this budget is used up.
const EMAIL_BUDGET = 400;
const EMAIL_BUDGET_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ReminderRunSummary = {
    ran: boolean;      // false when the run was skipped because another was in progress
    found: number;     // due reminders loaded this run
    sent: number;      // emails delivered
    notified: number;  // in-app notifications created
    failed: number;    // delivery steps that failed
    skipped: number;   // reminders or emails intentionally not sent
    unmarked: number;  // bookkeeping writes that failed (state may be stale)
};

/**
 * Loads reminders that should fire now.
 * Oldest scheduledAt first, so a backlog drains in the order it built up.
 * We select only the fields the sender needs, nothing more.
 */
const findDueReminders = (now: Date) => {
    return prisma.reminder.findMany({
        where: {
            sent: false,
            // Retry cap: reminders that failed MAX_ATTEMPTS times are left alone.
            attempts: { lt: MAX_ATTEMPTS },
            scheduledAt: { lte: now },
            // Completed tasks no longer need a reminder.
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
            emailSentAt: true,   // non-null means the email part is already done
            inAppSentAt: true,   // non-null means the in-app part is already done
            task: {
                select: { id: true, title: true, type: true, dueDate: true }
            },
            user: {
                select: { id: true, email: true, timeZone: true }
            }
        },
    });
};

// Overlap guard: stops a slow run and the next scheduled run from working at
// the same time. It lives in this process's memory, so it does not protect
// against a second server instance.
let isRunning = false;

// Task titles are user input and go into an HTML email, so they must be
// escaped to stop a title like "<script>" from being interpreted as markup.
const escapeHtml = (text: string) =>
    text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const formatDate = (date: Date, timeZone: string) =>
    date.toLocaleString("en-NG", {
        timeZone: normalizeTimeZone(timeZone),
        dateStyle: "full",
        timeStyle: "short",
    });

// Strip newlines from the subject (email header injection) and cap its length.
const formatSubject = (title: string) =>
    `Reminder: ${title.replace(/[\r\n]/g, " ").slice(0, 200)}`;

// The element type of the array findDueReminders returns, derived from the
// query itself so the two can never drift apart.
type DueReminder = Awaited<ReturnType<typeof findDueReminders>>[number];
type ReminderErrorCode = "SMTP_TIMEOUT" | "SMTP_AUTH" | "DB_WRITE_FAILED" | "UNKNOWN";

const getEmailErrorCode = (error: unknown): ReminderErrorCode =>
    error instanceof EmailDeliveryError ? error.code : "UNKNOWN";

/**
 * Creates the in-app notification for a reminder, at most once.
 * Notification.reminderId is unique, so upsert makes this safe to call twice.
 * If two runs collide, the database rejects the second insert (P2002). That
 * means "someone already created it", so we treat it as success.
 */
const createNotification = async (reminder: DueReminder, message: string) => {
    try {
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
    } catch (error) {
        // Only swallow the duplicate case, and only if the row really exists.
        if (
            error instanceof Prisma.PrismaClientKnownRequestError
            && error.code === "P2002"
            && await prisma.notification.findUnique({
                where: { reminderId: reminder.id },
                select: { id: true },
            })
        ) {
            return;
        }
        throw error;
    }
};

export const processDueReminders = async (): Promise<ReminderRunSummary> => {
    if (isRunning) {
        // Safe to log: contains no user data.
        console.log("Previous reminder run still in progress, skipping");
        return { ran: false, found: 0, sent: 0, notified: 0, failed: 0, skipped: 0, unmarked: 0 };
    }
    isRunning = true;

    const summary: ReminderRunSummary = {
        ran: true, found: 0, sent: 0, notified: 0, failed: 0, skipped: 0, unmarked: 0,
    };

    // The try/finally guarantees the flag is released even if something throws,
    // otherwise every later run would be skipped until a restart.
    try {
        const now = new Date();
        const reminders = await findDueReminders(now);
        summary.found = reminders.length;

        // Work out how much of today's email budget is left by counting emails
        // recorded in the last 24 hours. We then track usage in memory for the
        // rest of this run so we do not query the database per reminder.
        const emailCutoff = new Date(now.getTime() - EMAIL_BUDGET_WINDOW_MS);
        const sentEmailCount = await prisma.reminder.count({
            where: { emailSentAt: { gte: emailCutoff } },
        });
        let emailBudgetUsed = sentEmailCount;

        /**
         * Delivers one reminder. Order of work:
         *   in-app first (cheap, does not depend on SMTP), then email,
         *   then mark the reminder finished if every channel is done.
         * If anything failed, the attempt counter goes up once at the end.
         */
        const processReminder = async (reminder: DueReminder) => {
            const wantsEmail = reminder.channel === "Email" || reminder.channel === "Both";
            const wantsInApp = reminder.channel === "In-app" || reminder.channel === "Both";

            // Unknown channel value: nothing to deliver.
            if (!wantsEmail && !wantsInApp) {
                summary.skipped++;
                return;
            }

            // Re-check the task right before sending. The student may have
            // completed it (or deleted it) after the list was loaded, so this
            // shrinks the window for sending a pointless reminder.
            const task = await prisma.task.findFirst({
                where: { id: reminder.task.id, status: { not: "Completed" } },
                select: { id: true },
            });
            if (!task) {
                summary.skipped++;
                return;
            }

            const message = `Your task "${reminder.task.title}" is due on ${formatDate(reminder.task.dueDate, reminder.user.timeZone)}.`;

            // A channel counts as complete if it was not requested, or if an
            // earlier run already finished it. This is what makes retries
            // repeat only the channel that failed.
            let inAppComplete = !wantsInApp || reminder.inAppSentAt !== null;
            let emailComplete = !wantsEmail || reminder.emailSentAt !== null;
            let failed = false;
            let failureCode: ReminderErrorCode = "UNKNOWN";

            // --- In-app channel ---
            if (wantsInApp && !inAppComplete) {
                try {
                    await createNotification(reminder, message);
                    await prisma.reminder.update({
                        where: { id: reminder.id },
                        data: { inAppSentAt: new Date() },
                    });
                    inAppComplete = true;
                    summary.notified++;
                } catch {
                    failed = true;
                    failureCode = "DB_WRITE_FAILED";
                    summary.failed++;
                }
            }

            // --- Email channel ---
            if (wantsEmail && !emailComplete) {
                if (emailBudgetUsed >= EMAIL_BUDGET) {
                    // Budget used up: leave the email undone. It stays eligible
                    // and is retried on a later run once the 24h window moves on.
                    summary.skipped++;
                } else {
                    // Reserve one unit of budget before sending. This is safe
                    // across the concurrent workers because the increment runs
                    // synchronously, before any await.
                    emailBudgetUsed++;
                    try {
                        if (!reminder.user.email) throw new Error("Missing email");

                        await sendEmail(
                            reminder.user.email,
                            formatSubject(reminder.task.title),
                            `<p>${escapeHtml(message)}</p>`
                        );
                        // Record success immediately so a later retry does not
                        // send this email again.
                        await prisma.reminder.update({
                            where: { id: reminder.id },
                            data: { emailSentAt: new Date() },
                        });
                        emailComplete = true;
                        summary.sent++;
                    } catch (error) {
                        // Give the reserved budget back: this send failed.
                        emailBudgetUsed--;
                        failed = true;
                        failureCode = getEmailErrorCode(error);
                        summary.failed++;
                    }
                }
            }

            // --- Finish ---
            // Only when every requested channel is done do we mark the whole
            // reminder as sent, which removes it from future queries.
            if (inAppComplete && emailComplete) {
                try {
                    await prisma.reminder.update({
                        where: { id: reminder.id },
                        data: { sent: true, lastError: null },
                    });
                } catch {
                    // Delivery worked but the bookkeeping write failed. The
                    // per-channel timestamps are already saved, so the next run
                    // will only retry this write, not re-send anything.
                    summary.unmarked++;
                    failed = true;
                    failureCode = "DB_WRITE_FAILED";
                }
            }

            // Count one attempt per run if anything went wrong. After
            // MAX_ATTEMPTS the reminder drops out of findDueReminders.
            if (failed) {
                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: {
                        attempts: { increment: 1 },
                        lastError: failureCode,
                    },
                }).catch(() => {
                    summary.unmarked++;
                });
            }
        };

        // Small worker pool: CONCURRENCY workers pull the next reminder from a
        // shared index until the list is exhausted. `nextIndex++` is safe here
        // because JavaScript runs one piece of code at a time between awaits.
        let nextIndex = 0;
        const worker = async () => {
            while (nextIndex < reminders.length) {
                const index = nextIndex++;
                try {
                    await processReminder(reminders[index]);
                } catch {
                    // Last line of defence. processReminder handles its own
                    // delivery errors, so this catches unexpected failures
                    // (for example the task lookup throwing). One bad reminder
                    // must not stop the rest of the batch.
                    summary.failed++;
                }
            }
        };

        await Promise.all(
            Array.from(
                { length: Math.min(CONCURRENCY, reminders.length) },
                () => worker()
            )
        );

        console.log("[reminder] run", {
            due: summary.found,
            sent: summary.sent,
            notified: summary.notified,
            skipped: summary.skipped,
            failed: summary.failed,
            emailBudgetRemaining: Math.max(0, EMAIL_BUDGET - emailBudgetUsed),
        });

        return summary;
    } finally {
        isRunning = false;
    }
};
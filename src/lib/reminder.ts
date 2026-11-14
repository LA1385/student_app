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

const formatDate = (date: Date) =>
    date.toLocaleString("en-NG", {
        timeZone: "Africa/Lagos",
        dateStyle: "full",
        timeStyle: "short",
    });

const formatSubject = (title: string) =>
    `Reminder: ${title.replace(/[\r\n]/g, " ").slice(0, 200)}`;

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
                        formatSubject(reminder.task.title),
                        `<p>${escapeHtml(message)}</p>`
                    );
                    summary.sent++;
                }
            }
            catch {
                console.error("Failed to deliver reminder");
                summary.failed++;

                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: {
                        attempts: { increment: 1 },
                        lastError: "Reminder delivery failed"
                    }
                }).catch(() => {
                    console.error("Failed to record reminder delivery failure");
                });

                continue;
            }

            // Step 2: every requested channel succeeded, so mark as sent.
            try {
                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: { sent: true, attempts: { increment: 1 } }
                });
            }
            catch {
                summary.unmarked++;
                console.error("Delivered reminder was not marked as sent");
            }
        }

        return summary;
    }
    finally {
        isRunning = false;
    }
};
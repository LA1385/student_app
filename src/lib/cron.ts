import cron from 'node-cron';
import { processDueReminders } from '@/lib/reminder';


// Typescript for the global variable to store the cron jobs
const globalForCron = globalThis as unknown as{
    reminderTask: ReturnType<typeof cron.schedule> | undefined;
}

export const startReminderScheduler = () => {
    if (globalForCron.reminderTask) {
        console.log("[cron] Scheduler already running, not starting another");
        return; // If the task is already scheduled, do nothing
    }

    const task = cron.schedule('0 * * * *', async () => { 
        try {
            const summary = await processDueReminders();

            if (summary.found > 0 || !summary.ran) {
                console.log("[cron] Reminder run:", summary);
            }
        } catch (error) {
            console.error("[cron] Reminder run failed:", error);
        }
    })

    globalForCron.reminderTask = task;
    console.log("[cron] Reminder scheduler started.");
}
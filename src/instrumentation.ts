export async function register() {
    if (
        process.env.NEXT_RUNTIME === "nodejs" &&
        process.env.ENABLE_INTERNAL_CRON === "true"
    ) {
        const { startReminderScheduler } = await import("./lib/cron");

        startReminderScheduler();
    }
}
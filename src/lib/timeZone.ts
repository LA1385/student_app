import { DateTime, IANAZone } from "luxon";

export const DEFAULT_TIME_ZONE = "Africa/Lagos";

export function normalizeTimeZone(value: unknown): string {
    return typeof value === "string" && IANAZone.isValidZone(value)
        ? value
        : DEFAULT_TIME_ZONE;
}

export function getReminderSchedule(
    dueDate: Date,
    daysBefore: number,
    timeZone: string,
    now = new Date(),
) {
    const zone = normalizeTimeZone(timeZone);
    const due = DateTime.fromJSDate(dueDate, { zone });
    const scheduled = due
        .startOf("day")
        .minus({ days: daysBefore })
        .set({ hour: 8, minute: 0, second: 0, millisecond: 0 });

    return {
        scheduledAt: scheduled.toUTC().toJSDate(),
        // If the due moment has passed, do not arm the reminder. If only the
        // scheduled time has passed, the next run should deliver it.
        shouldArm: dueDate.getTime() > now.getTime(),
    };
}

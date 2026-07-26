import { VALID_TYPES, VALID_PRIORITIES, VALID_CHANNELS } from "@/lib/constant";

export interface TaskInput {
    title: string;
    type: string;
    dueDate: string;
    priority: string;
    category?: string;
    daysBefore: number;
    channel: string;
}

export function validateTaskInput(body: TaskInput): string | null {
    const { title, type, dueDate, priority, daysBefore, channel } = body;

    if (!title || !type || !dueDate || !priority || daysBefore === undefined || !channel) {
        return "Missing required fields";
    }
    if (!VALID_TYPES.includes(type)) return "Invalid task type";
    if (!VALID_PRIORITIES.includes(priority)) return "Invalid priority";
    if (!VALID_CHANNELS.includes(channel)) return "Invalid notification channel";

    return null; // no errors
}
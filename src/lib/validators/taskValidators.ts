import { VALID_TYPES, VALID_PRIORITIES, VALID_CHANNELS } from "@/lib/constant";

const MAX_TITLE_LENGTH = 200;
const MAX_CATEGORY_LENGTH = 100;
const MAX_DAYS_BEFORE = 365;
const VALID_STATUSES = ["pending", "Completed"] as const;

export interface TaskInput {
    title: string;
    type: string;
    dueDate: string;
    priority: string;
    category?: string;
    daysBefore: number;
    channel: string;
}

export interface TaskUpdateInput {
    title?: string;
    type?: string;
    dueDate?: string;
    priority?: string;
    status?: string;
    reminderId?: string;
    daysBefore?: number;
    channel?: string;
}

type ValidationResult<T> =
    | { data: T }
    | { error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKnownFields(
    body: Record<string, unknown>,
    fields: readonly string[]
): boolean {
    return Object.keys(body).every((field) => fields.includes(field));
}

function isValidDate(value: unknown): value is string {
    return typeof value === "string" && value.length > 0 && !Number.isNaN(new Date(value).getTime());
}

function isValidDaysBefore(value: unknown): value is number {
    return typeof value === "number"
        && Number.isInteger(value)
        && value >= 0
        && value <= MAX_DAYS_BEFORE;
}

function isValidString(value: unknown, maxLength: number): value is string {
    return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

const taskFields = [
    "title",
    "type",
    "dueDate",
    "priority",
    "category",
    "daysBefore",
    "channel",
] as const;

export function validateTaskInput(body: unknown): ValidationResult<TaskInput> {
    if (!isRecord(body) || !hasOnlyKnownFields(body, taskFields)) {
        return { error: "Invalid task payload" };
    }

    const { title, type, dueDate, priority, category, daysBefore, channel } = body;

    if (
        !isValidString(title, MAX_TITLE_LENGTH)
        || typeof type !== "string"
        || typeof priority !== "string"
        || !isValidDate(dueDate)
        || !isValidDaysBefore(daysBefore)
        || typeof channel !== "string"
        || (category !== undefined && (typeof category !== "string" || category.length > MAX_CATEGORY_LENGTH))
    ) {
        return { error: "Invalid task payload" };
    }
    if (!VALID_TYPES.includes(type)) return { error: "Invalid task type" };
    if (!VALID_PRIORITIES.includes(priority)) return { error: "Invalid priority" };
    if (!VALID_CHANNELS.includes(channel)) return { error: "Invalid notification channel" };

    return {
        data: {
            title,
            type,
            dueDate,
            priority,
            category,
            daysBefore,
            channel,
        },
    };
}

const taskUpdateFields = [
    "title",
    "type",
    "dueDate",
    "priority",
    "status",
    "reminderId",
    "daysBefore",
    "channel",
] as const;

export function validateTaskUpdateInput(body: unknown): ValidationResult<TaskUpdateInput> {
    if (!isRecord(body) || !hasOnlyKnownFields(body, taskUpdateFields) || Object.keys(body).length === 0) {
        return { error: "Invalid task payload" };
    }

    const { title, type, dueDate, priority, status, reminderId, daysBefore, channel } = body;

    if (title !== undefined && !isValidString(title, MAX_TITLE_LENGTH)) {
        return { error: "Invalid task payload" };
    }
    if (type !== undefined && (typeof type !== "string" || !VALID_TYPES.includes(type))) {
        return { error: "Invalid task type" };
    }
    if (dueDate !== undefined && !isValidDate(dueDate)) {
        return { error: "Invalid task payload" };
    }
    if (priority !== undefined && (typeof priority !== "string" || !VALID_PRIORITIES.includes(priority))) {
        return { error: "Invalid priority" };
    }
    if (status !== undefined && (typeof status !== "string" || !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number]))) {
        return { error: "Invalid task status" };
    }
    if (reminderId !== undefined && (typeof reminderId !== "string" || reminderId.length === 0)) {
        return { error: "Invalid reminder" };
    }
    if (daysBefore !== undefined && !isValidDaysBefore(daysBefore)) {
        return { error: "Invalid reminder timing" };
    }
    if (channel !== undefined && (typeof channel !== "string" || !VALID_CHANNELS.includes(channel))) {
        return { error: "Invalid notification channel" };
    }

    return {
        data: {
            title,
            type,
            dueDate,
            priority,
            status,
            reminderId,
            daysBefore,
            channel,
        },
    };
}
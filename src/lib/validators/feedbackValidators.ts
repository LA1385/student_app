import { FEEDBACK_CATEGORIES } from "@/lib/constant";

const MAX_MESSAGE_LENGTH = 1000;

export interface FeedbackInput {
    category: typeof FEEDBACK_CATEGORIES[number];
    message: string;
}

type ValidationResult<T> =
    | { data: T }
    | { error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFeedbackCategory(value: unknown): value is FeedbackInput["category"] {
    return typeof value === "string"
        && FEEDBACK_CATEGORIES.includes(value as FeedbackInput["category"]);
}

export function validateFeedbackInput(body: unknown): ValidationResult<FeedbackInput> {
    if (!isRecord(body)
        || Object.keys(body).some((field) => !["category", "message"].includes(field))) {
        return { error: "Invalid feedback payload" };
    }

    const { category, message } = body;
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!isFeedbackCategory(category)
        || trimmedMessage.length === 0
        || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
        return { error: "Invalid feedback payload" };
    }

    return {
        data: {
            category,
            message: trimmedMessage,
        },
    };
}

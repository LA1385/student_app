import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const buildDueDateTime = (dueDate: string, time: string): string => {
    if (!dueDate) return "";
    const combined = time ? `${dueDate}T${time}` : `${dueDate}T00:00`;
    return new Date(combined).toISOString();
};
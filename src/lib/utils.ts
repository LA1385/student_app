import { Task } from "@generated/prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type bucketedTasks = {
  overDue: Task[];
  thisWeek: Task[];
  upComing: Task[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const buildDueDateTime = (dueDate: string, time: string): string => {
    if (!dueDate) return "";
    const combined = time ? `${dueDate}T${time}` : `${dueDate}T00:00`;
    return new Date(combined).toISOString();
};

// Function to split task into section
export const bucketTasks = (tasks: Task[], now: Date) => {
  const nowMs = now.getTime();
  const sevenDaysLaterMs = nowMs + 7*24*60*60*1000;

    const section: bucketedTasks = {
      overDue: [],
      thisWeek: [],
      upComing: [],
    }
    tasks.forEach((task) => {
      const dueDate: number = new Date(task.dueDate).getTime();

      if (dueDate < nowMs) {
        section.overDue.push(task)
      }

      else if (dueDate >= nowMs && dueDate <= sevenDaysLaterMs) {
        section.thisWeek.push(task)
      }

      else {
        section.upComing.push(task)
      }
    })
    
    return section;
  }

export const formatDueDate = (dueDate: string, now: Date) => {
    const startOfDay = (d: Date) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    const dueMs = startOfDay(new Date(dueDate));
    const nowMs = startOfDay(now);

    const oneDayMs = 24 * 60 * 60 * 1000;
    const dayDiff = Math.round((dueMs - nowMs) / oneDayMs);

    if (dayDiff === 0) return "Today";
    if (dayDiff === 1) return "Tomorrow";
    if (dayDiff === -1) return "Yesterday";

    return new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};
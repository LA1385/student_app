"use client";

import { Check, Clock, GraduationCap } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import { formatDueDate } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

type TaskCardProps = {
    taskId: string;
    title: string;
    type: string;
    dueDate: string;
    priority: string;
    status: string;
    now: Date;
    category?: string;
    onComplete?: (taskId: string) => void;
};

export default function TaskCard({taskId, title, type, dueDate, priority, status, category, now, onComplete,
}: TaskCardProps) {
    const borderMap: Record<string, string> = {
        Overdue: "border-l-urgent",
        Completed: "border-l-done",
        Pending: "border-l-upcoming",
    };
    const statusKey = status.toUpperCase();
    const borderClass = borderMap[statusKey] || "border-l-border";
    const isCompleted = statusKey === "Completed";

    const router = useRouter();
    const [isDisabled, setIsDisabled] = useState(false);

    const handleMarkAsComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCompleted) return;
        setIsDisabled(true);

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Completed" }),
            });

            if (response.ok) {
                if (onComplete) {
                    onComplete(taskId);
                } else {
                    router.refresh();
                }
            } else {
                console.error("Failed to mark task as complete");
                setIsDisabled(false);
            }
        } catch (error) {
            console.error("Network error marking task complete:", error);
            setIsDisabled(false);
        }
    };

    return (
        <div className={`bg-bg-card border border-border border-l-4 ${borderClass} rounded-xl rounded-l-none md:border-2 md:rounded-l-xl p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow duration-150`}>
            <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2">
                    <PriorityBadge priority={priority} />
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5 text-text-muted" />
                    <span>Due {formatDueDate(dueDate, now)}</span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <h3 className="text-lg font-semibold leading-tight text-text">{title}</h3>
                </div>
                <div>
                    <span className="rounded-md bg-bg-input px-2.5 py-1 text-xs font-medium text-text-secondary">
                        {type}
                    </span>
                </div>
            </div>
            <div className="mt-0.5 flex items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                    {category && (
                        <div className="text-xs text-text-muted flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-text-muted" />
                            <span>{category}</span>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    aria-label="Mark task complete"
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        status.toLowerCase() === "completed"
                            ? "border-later bg-later text-white shadow-sm shadow-later/30"
                            : "border-border bg-bg-input text-text-muted hover:bg-bg-card"
                    }`}
                    disabled={isDisabled || isCompleted}
                    onClick={handleMarkAsComplete}
                >
                    <Check className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
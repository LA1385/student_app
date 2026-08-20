import { Check, Clock, GraduationCap } from "lucide-react";
import PriorityBadge from "./PriorityBadge";
import { formatDueDate } from "@/lib/utils";

type TaskCardProps = {
    title: string;
    type: string;
    dueDate: string;
    priority: string;
    status: string;
    now: Date;
    category?: string;
    
};

export default function TaskCard({ title, type, dueDate, priority, status, category, now }: TaskCardProps) {
    const borderMap: Record<string, string> = {
        OVERDUE: 'border-l-urgent',
        COMPLETED: 'border-l-done',
        PENDING: 'border-l-upcoming',
    };
    const statusKey = status.toUpperCase();
    const borderClass = borderMap[statusKey] || 'border-l-border';

    return (
        <div className={`bg-bg-card border border-border border-l-4 ${borderClass} rounded-xl rounded-l-none md:border-2 md:rounded-l-xl p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow duration-150`}>
            {/* Badge/type on the left, due date on the right */}
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
            {/* Metadata Row */}
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
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-bg-input text-text-muted transition-colors duration-200 hover:bg-bg-card"
                >
                    <Check className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

import { Clock, GraduationCap } from "lucide-react";
import PriorityBadge from "./PriorityBadge";

export default function TaskCard({ title, type, dueDate, priority, category }: {
    title: string
    type: string
    dueDate: string
    priority: string
    category?: string
}) {
    const borderMap: Record<string, string> = {
        URGENT: 'border-l-urgent',
        OVERDUE: 'border-l-urgent',
        MEDIUM: 'border-l-upcoming',
        LOW: 'border-l-later',
        COMPLETED: 'border-l-done',
        PENDING: 'border-l-upcoming',
    };
    const priorityKey = priority.toUpperCase();
    const borderClass = borderMap[priorityKey] || 'border-l-border';

    return (
        <div className={`bg-bg-card border border-border border-l-4 ${borderClass} rounded-xl rounded-l-none md:border-2 md:rounded-l-xl p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow duration-150`}>
            {/* Title & Badge Row */}
            <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm font-semibold text-text leading-tight">{title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="bg-bg-input text-text-secondary text-xs px-2.5 py-1 rounded-md font-medium">
                        {type}
                    </span>
                    <PriorityBadge priority={priority} />
                </div>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center gap-3 mt-0.5">
                <div className="text-xs text-text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span>{dueDate}</span>
                </div>
                {category && (
                    <div className="text-xs text-text-muted flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-text-muted" />
                        <span>{category}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

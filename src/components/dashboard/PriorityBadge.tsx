export default function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
    const colorMap: Record<string, string> = {
        URGENT:    'bg-red-100 text-urgent',
        MEDIUM:    'bg-amber-100 text-upcoming',
        LOW:       'bg-green-100 text-later',
        OVERDUE:   'bg-red-100 text-urgent',
        PENDING:   'bg-slate-100 text-done',
        COMPLETED: 'bg-green-100 text-later',
    };

    const key = priority.toUpperCase();
    const colorClass = colorMap[key] || 'bg-slate-100 text-done';

    return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${colorClass} ${className || ''}`}>
            {priority.toUpperCase()}
        </div>
    )
}


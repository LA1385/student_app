export default function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
    const colorMap: Record<string, string> = {
        HIGH: 'bg-urgent text-white',
        MEDIUM: 'bg-upcoming text-white',
        LOW: 'bg-later text-white',
    };

    const key = priority.toUpperCase();
    const colorClass = colorMap[key] || 'bg-done text-white';

    return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${colorClass} ${className || ''}`}>
            {priority.toUpperCase()}
        </div>
    )
}


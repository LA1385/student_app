export default function PriorityBadge({ priority, className }: { priority: string; className?: string[] }) {
    const color = {
       /*  urgemt:red
        medium: Amber
        low: Green
        overdue: Red
        pending: amber or muted*/}
    return(
        <div className={`${color[priority]} ${className?.join(' ') || ''}`}>
            {priority}
        </div>
    )
}

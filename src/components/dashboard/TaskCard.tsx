import PriorityBadge from "./PriorityBadge";

export default function TaskCard({title, type, dueDate, priority}:
    {title: string, type: string, dueDate: string, priority: string}
){
    return(
        <div>
            <h3>{title}</h3>
            <p>{type}</p>
            <p>{dueDate}</p>
            <PriorityBadge priority={priority} />
        </div>
    )
}

"use client";

import { Task, Reminder } from "@generated/prisma/client";
import TaskActions from "@/components/Tasks/TaskAction";
import { useState } from "react";

type TaskIdClientProps = {
    task: Task;
    reminders: Reminder | null;
}

export default function TaskIdClient({task, reminders}: TaskIdClientProps) {
    const [status, setStatus] = useState(task?.status);
    const [isEditing, setIsEditing] = useState(false);
    
    return (
              <div>
            {/* Title */}
            <div>
                <h1>{task?.title }</h1>
                <p>{task?.priority}</p>
            </div>

            {/* Task Details */}
            <div>
                <div>
                    <div>
                        <h3>Due Date</h3>
                        <p>{isEditing ? <input type="time" defaultValue={task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Due date not available"} /> : task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Due date not available"}</p>
                    </div>
                    <div>
                        <h3>Type</h3>
                        <p>{isEditing ? <input type="text" defaultValue={task?.type}/> : task?.type }</p>
                    </div>
                    <div>
                        <h3>Priority</h3>
                        <p>{isEditing? <input type="text" defaultValue={task?.priority}/> :task?.priority}</p>
                    </div>
                    <div>
                        <h3>Status</h3>
                        <p>{task?.status}</p>
                    </div>
                </div>
                {/* Reminders */}
                <div>
                    <div>
                        <h1>Reminders</h1>
                        <p>Scheduled</p>
                    </div>
                    <div>
                        <div>
                            <h1>Timing</h1>
                            <p>{isEditing ? <input type="number" defaultValue={reminders?.daysBefore || "Not specified"} /> : reminders?.daysBefore || "Not specified"} days before due date</p>
                        </div>
                        <div>
                            <h1>Channel</h1>
                            <p>{isEditing ? <input type="text" defaultValue={reminders?.channel || "Not specified"} /> : reminders?.channel || "Not specified"}</p>
                        </div>
                    </div>
                </div>
                {/* Complete, Delete & edit buttons */}
                <div>
                    <TaskActions taskId={task?.id} status={status} setStatus={setStatus} setIsEditing={setIsEditing} />
                </div>
            </div>
        </div>
    )
}
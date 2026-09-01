import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getTaskById } from "@/lib/queries";
import { getTaskReminders } from "@/lib/queries";




export default async function TaskIdPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || !session.user) {
        return redirect("/login");
    }
    const { id: taskId } = await params;
    if (!taskId) {
        console.error("Task ID is missing in the parameters.");
        return notFound();
    }
    const reminders = await getTaskReminders(taskId, session.user.id);
    const task = await getTaskById(taskId, session.user.id);
    if (!task) {
        console.error(`Task with ID ${taskId} not found for user ${session.user.id}.`);
        return notFound();
    }
    if (!reminders) {
        console.error(`Reminders for task ID ${taskId} not found for user ${session.user.id}.`);
    }
    console.log("Fetched task:", task); // Debugging line to check the fetched task

    return(
        <div>
            {/* Title & Edit task icon */}
            <div>
                <div>
                    <h1>{task?.title }</h1>
                    <p>{task?.priority}</p>
                </div>
                <div>
                    <button> Edit Task </button>
                </div>
            </div>

            {/* Task Details */}
            <div>
                <div>
                    <div>
                        <h3>Due Date</h3>
                        <p>{task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Due date not available"}</p>
                    </div>
                    <div>
                        <h3>Type</h3>
                        <p>{task?.type }</p>
                    </div>
                    <div>
                        <h3>Priority</h3>
                        <p>{task?.priority}</p>
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
                            <p>{reminders?.daysBefore || "Not specified"} days before due date</p>
                        </div>
                        <div>
                            <h1>Channel</h1>
                            <p>{reminders?.channel || "Not specified"}</p>
                        </div>
                    </div>
                </div>
                {/* Complete, Delete & edit buttons */}
                <div>
                    <button>Mark as Complete</button>
                    <button>Edit Task</button>
                    <button>Delete Task</button>
                    
                </div>
            </div>
        </div>
    )
}
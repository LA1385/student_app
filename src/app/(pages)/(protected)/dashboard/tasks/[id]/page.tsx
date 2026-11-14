import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getTaskById } from "@/lib/queries";
import { getTaskReminders } from "@/lib/queries";
import  TaskIdClient  from "@/components/Tasks/TaskIdClient";



export default async function TaskIdPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || !session.user) {
        return redirect("/login");
    }
    const { id: taskId } = await params;
    if (!taskId) {
        return notFound();
    }
    const [remindersResult, taskResult] = await Promise.allSettled([
        getTaskReminders(taskId, session.user.id),
        getTaskById(taskId, session.user.id),
    ]);
    if (taskResult.status === "rejected") {
        throw taskResult.reason;
    }

    const task = taskResult.value;
    if (!task) {
        return notFound();
    }
    const reminders = remindersResult.status === "fulfilled"
        ? remindersResult.value
        : null;
    const reminderError = remindersResult.status === "rejected"
        ? "Reminder details are unavailable."
        : undefined;

    if (remindersResult.status === "rejected") {
        console.error("Error fetching task reminders:", remindersResult.reason);
    }

    return(
        <TaskIdClient
            task={task}
            reminders={reminders}
            reminderError={reminderError}
        />
    )
}
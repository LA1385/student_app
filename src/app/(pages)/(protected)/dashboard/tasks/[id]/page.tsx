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
    console.log("Fetched reminders:", reminders); // Debugging line to check the fetched reminders

    return(
        <TaskIdClient task={task} reminders={reminders} />
    )
}
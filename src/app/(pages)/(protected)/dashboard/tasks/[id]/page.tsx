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
    const [reminders, task] = await Promise.all([
        getTaskReminders(taskId, session.user.id),
        getTaskById(taskId, session.user.id),
    ]);
    if (!task) {
        return notFound();
    }

    return(
        <TaskIdClient task={task} reminders={reminders} />
    )
}
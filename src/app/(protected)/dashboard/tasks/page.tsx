import  TaskPageClient  from "@/components/Tasks/TaskPageClient";
import { auth } from "@/lib/auth";
import { getTasks } from "@/lib/queries";

export default async function TaskPage() {
    const session = await auth();

    if (!session || !session.user) {
            return <div className="text-center text-text">Unauthorized User</div>;
        }
    const userId = session?.user.id;
    const now = new Date();
    const tasks = await getTasks(userId);
    
    return <TaskPageClient tasks={tasks} now={now} />;
}

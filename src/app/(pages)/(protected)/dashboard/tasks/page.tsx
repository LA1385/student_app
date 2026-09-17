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

    return (
        <div className="py-4 md:px-6 md:py-6">
            <TaskPageClient tasks={tasks} now={now} />
        </div>
    );
}

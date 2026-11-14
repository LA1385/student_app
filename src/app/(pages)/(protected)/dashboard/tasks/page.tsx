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
    let tasks;
    try {
        tasks = await getTasks(userId);
    } catch (error) {
        console.error("Error fetching tasks page:", error);
        tasks = null;
    }

    if (!tasks) {
        return (
            <div className="py-4 md:px-6 md:py-6">
                <div
                    role="alert"
                    className="rounded-2xl border border-urgent/25 bg-bg-card px-6 py-10 text-center"
                >
                    <h1 className="text-xl font-semibold text-text">
                        Tasks are unavailable
                    </h1>
                    <p className="mt-2 text-sm text-text-secondary">
                        We couldn&apos;t load your tasks. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 md:px-6 md:py-6">
            <TaskPageClient tasks={tasks} now={now} />
        </div>
    );
}

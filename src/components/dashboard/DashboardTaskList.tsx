import Link from "next/link";
import { Plus } from "lucide-react";
import { Task } from "@generated/prisma/client";
import TaskCard from "@/components/dashboard/TaskCard";
import EmptyStateCard from "@/components/Tasks/EmptyStateCard";

type DashboardTaskListProps = {
    tasks: Task[];
    now: Date;
    error?: string;
};

export default function DashboardTaskList({ tasks, now, error }: DashboardTaskListProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">Active Tasks</h2>
                <Link href="/dashboard/tasks/new" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer border-none shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                </Link>
            </div>
            <div className="flex flex-col gap-3">
                {error ? (
                    <div
                        role="alert"
                        className="rounded-2xl border border-urgent/25 bg-bg-card px-6 py-10 text-center"
                    >
                        <p className="text-lg font-semibold text-text">
                            Tasks are unavailable
                        </p>
                        <p className="mt-1 text-sm leading-6 text-text-secondary">
                            We couldn&apos;t load your tasks. Please try again later.
                        </p>
                    </div>
                ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Link key={task.id} href={`/dashboard/tasks/${task.id}`}>
                            <TaskCard
                                taskId={task.id}
                                title={task.title}
                                type={task.type}
                                dueDate={task.dueDate.toISOString()}
                                priority={task.priority}
                                category={task.category ?? ""}
                                status={task.status}
                                now={now}
                            />
                        </Link>
                    ))
                ) : (
                    <EmptyStateCard
                        title="No tasks yet"
                        description="Create your first task to start organizing your academic workload."
                    />
                )}
            </div>
        </div>
    );
}

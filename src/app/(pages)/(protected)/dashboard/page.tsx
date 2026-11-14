import { Clock, Calendar, AlertCircle } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import DashboardTaskList from "@/components/dashboard/DashboardTaskList";
import DashboardToolList from "@/components/dashboard/DashboardToolList";
import TabSwitcher from "@/components/dashboard/TabSwitcher";
import { auth } from "@/lib/auth";
import { getTasks, getTaskSummary } from "@/lib/queries";
import { redirect } from "next/navigation";



export default async function Dashboard() {

    const session = await auth();
    if (!session || !session.user) redirect("/");
    
    const userId = session.user.id;
    const now = new Date();
    const [tasksResult, taskSummaryResult] = await Promise.allSettled([
        getTasks(userId),
        getTaskSummary(userId)
    ]);
    const tasks = tasksResult.status === "fulfilled" ? tasksResult.value : [];
    const taskSummary = taskSummaryResult.status === "fulfilled"
        ? taskSummaryResult.value
        : null;
    const tasksError = tasksResult.status === "rejected"
        ? "Tasks could not be loaded."
        : undefined;
    const metricsError = taskSummaryResult.status === "rejected"
        ? "Dashboard metrics could not be loaded."
        : undefined;

    if (tasksResult.status === "rejected") {
        console.error("Error fetching dashboard tasks:", tasksResult.reason);
    }
    if (taskSummaryResult.status === "rejected") {
        console.error("Error fetching dashboard metrics:", taskSummaryResult.reason);
    }

    return (
        <div className="bg-bg-page">
            <div className="p-4 md:p-6">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <MetricCard
                        label="Due Today"
                        value={taskSummary?.dueToday}
                        icon={<Clock className="w-3 h-3 md:w-5 md:h-5" />}
                        error={metricsError}
                    />
                    <MetricCard
                        label="This Week"
                        value={taskSummary?.dueThisWeek}
                        icon={<Calendar className="w-3 h-3 md:w-5 md:h-5" />}
                        error={metricsError}
                    />
                    <MetricCard
                        label="Completed"
                        value={taskSummary?.completed}
                        icon={<AlertCircle className="w-3 h-3 md:w-5 md:h-5" />}
                        error={metricsError}
                    />
                </div>

                {/* Tab switcher (mobile only) */}
                <TabSwitcher
                    tasks={<DashboardTaskList tasks={tasks} now={now} error={tasksError} />}
                    tools={<DashboardToolList />}
                />

                {/* Desktop View (always rendered side-by-side, hidden on mobile) */}
                <div className="hidden md:grid md:grid-cols-[1fr_360px] md:gap-6">
                    {/* Tasks Column */}
                    <DashboardTaskList tasks={tasks} now={now} error={tasksError} />

                    {/* Tools Column */}
                    <DashboardToolList />
                </div>
            </div>
        </div>
    )
}
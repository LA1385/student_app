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
    if (!session || !session.user) redirect("/")

    const userId = session.user.id;
    const now = new Date();
    const [tasks, taskSummary] = await Promise.all([
        getTasks(userId),
        getTaskSummary(userId)
    ]);

    return (
        <div className="bg-bg-page">
            <div className="p-4 md:p-6">
                {/* Metric Cards Row */}
                {taskSummary ? (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <MetricCard
                            label="Due Today"
                            value={taskSummary.dueToday}
                            variant="highlighted"
                            icon={<Clock className="w-3 h-3 md:w-5 md:h-5" />}
                        />
                        <MetricCard
                            label="This Week"
                            value={taskSummary.dueThisWeek}
                            icon={<Calendar className="w-3 h-3 md:w-5 md:h-5" />}
                        />
                        <MetricCard
                            label="Completed"
                            value={taskSummary.completed}
                            icon={<AlertCircle className="w-3 h-3 md:w-5 md:h-5" />}
                        />
                    </div>
                ) : (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-urgent/30 bg-urgent/10 p-4 text-sm text-urgent"
                    >
                        Dashboard metrics are temporarily unavailable.
                    </div>
                )}

                {/* Tab switcher (mobile only) */}
                <TabSwitcher
                    tasks={<DashboardTaskList tasks={tasks} now={now} />}
                    tools={<DashboardToolList />}
                />

                {/* Desktop View (always rendered side-by-side, hidden on mobile) */}
                <div className="hidden md:grid md:grid-cols-[1fr_360px] md:gap-6">
                    {/* Tasks Column */}
                    <DashboardTaskList tasks={tasks} now={now} />

                    {/* Tools Column */}
                    <DashboardToolList />
                </div>
            </div>
        </div>
    )
}
import { Calculator, Clock, Calendar, AlertCircle, Plus,FileArchive, RefreshCw, FilePlus2 } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import TaskCard from "@/components/dashboard/TaskCard";
import ToolCard from "@/components/dashboard/ToolCard";
import Link from "next/link";
import TabSwitcher from "@/components/dashboard/TabSwitcher";
import { auth } from "@/lib/auth";
import { getTasks, getTaskSummary } from "@/lib/queries";
import { redirect } from "next/navigation";



export default async function Dashboard() {

    const session = await auth();
    if (!session || !session.user) redirect("/")

    const userId = session.user.id;
    const [tasks, taskSummary] = await Promise.all([
        getTasks(userId),
        getTaskSummary(userId)
    ]);

    const Tools = [
        { icon: <Calculator className=" text-primary"/>, name: 'CGPA Calculator', href: '/tools/calculator' },
        { icon: <RefreshCw className=" text-primary"/>, name: 'Converter', href: '/tools/converter' },
        { icon: <FilePlus2 className=" text-primary"/>, name: 'Merge Files', href: '/tools/file-compression' },
        { icon: <FileArchive className=" text-primary" />, name: 'File Compression', href: '/tools/zip' },
    ]

    return (
        <div className="pt-14 md:pl-60 min-h-screen bg-bg-page pb-16 md:pb-0">
            <div className="p-4 md:p-6">
                {/* Metric Cards Row */}
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

                {/* Tab switcher (mobile only) */}
                <TabSwitcher tasks={
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text">Active Tasks</h2>
                            <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer border-none shadow-sm">
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {tasks.map((task) => (
                                <TaskCard 
                                    key={task.id}
                                    title={task.title}
                                    type={task.type}
                                    dueDate={task.dueDate.toString()}
                                    priority={task.priority}
                                    category={task.category?? ""}
                                />
                            ))}
                        </div>
                    </div>
                } tools={
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text">Student Tools</h2>
                            <Link href="/dashboard/tools" className="text-sm text-primary font-medium hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Tools.map((tool, index) => (
                                <ToolCard
                                    key={index}
                                    icon={tool.icon}
                                    name={tool.name}
                                    href={tool.href}
                                />
                            ))}
                        </div>
                    </div>
                } />

                {/* Desktop View (always rendered side-by-side, hidden on mobile) */}
                <div className="hidden md:grid md:grid-cols-[1fr_360px] md:gap-6">
                    {/* Tasks Column */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text">Active Tasks</h2>
                            <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer border-none shadow-sm">
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    title={task.title}
                                    type={task.type}
                                    dueDate={task.dueDate.toString()}
                                    priority={task.priority}
                                    category={task.category ?? ""}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tools Column */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-text">Student Tools</h2>
                            <Link href="/dashboard/tools" className="text-sm text-primary font-medium hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {Tools.map((tool, index) => (
                                <ToolCard
                                    key={index}
                                    icon={tool.icon}
                                    name={tool.name}
                                    href={tool.href}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


"use client";

import { useState } from "react";
import { Calculator, Clock, Calendar, AlertCircle, Plus,FileArchive, RefreshCw, FilePlus2 } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import TaskCard from "@/components/dashboard/TaskCard";
import ToolCard from "@/components/dashboard/ToolCard";
import Link from "next/link";


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'tasks' | 'tools'>('tasks');

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
                        value="01" 
                        variant="highlighted" 
                        icon={<Clock className="w-3 h-3 md:w-5 md:h-5" />} 
                    />
                    <MetricCard 
                        label="This Week" 
                        value="02" 
                        icon={<Calendar className="w-3 h-3 md:w-5 md:h-5" />} 
                    />
                    <MetricCard 
                        label="Completed" 
                        value="00" 
                        icon={<AlertCircle className="w-3 h-3 md:w-5 md:h-5" />} 
                    />
                </div>

                {/* Tab switcher (mobile only) */}
                <div className="md:hidden bg-bg-input rounded-2xl p-1 flex gap-1 mb-5">
                    <button 
                        onClick={() => setActiveTab('tasks')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                            activeTab === 'tasks' 
                                ? 'bg-bg-card text-primary shadow-sm' 
                                : 'text-text-secondary hover:text-text'
                        }`}
                    >
                        Tasks
                    </button>
                    <button 
                        onClick={() => setActiveTab('tools')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                            activeTab === 'tools' 
                                ? 'bg-bg-card text-primary shadow-sm' 
                                : 'text-text-secondary hover:text-text'
                        }`}
                    >
                        Tools
                    </button>  
                </div>

                {/* Mobile view content (rendered based on active tab) */}
                <div className="block md:hidden">
                    {activeTab === 'tasks' ? (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-text">Active Tasks</h2>
                                <button className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline bg-transparent border-none cursor-pointer">
                                    <Plus className="w-4 h-4" />
                                    <span>Add</span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <TaskCard title="COS203" type="Assignment" dueDate="2025-05-30" priority="Urgent" category="CSC" />
                                <TaskCard title="IFT211" type="Exam" dueDate="2025-05-30" priority="Medium" category="IT" />
                            </div>
                        </div>
                    ) : (
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
                    )}
                </div>

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
                            <TaskCard title="COS203" type="Assignment" dueDate="2025-05-30" priority="Urgent" category="CSC" />
                            <TaskCard title="IFT211" type="Exam" dueDate="2025-05-30" priority="Medium" category="IT" />
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


"use client";
import { useState } from "react";

export default function TabSwitcher({tasks, tools}: {
    tasks: React.ReactNode,
    tools: React.ReactNode}) {
    const [activeTab, setActiveTab] = useState<'tasks' | 'tools'>('tasks');

    return (
        <div className= "md:hidden">
        < div className ="bg-bg-input rounded-2xl p-1 flex gap-1 mb-5">
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === 'tasks'
                            ? 'bg-bg-card text-primary shadow-sm'
                            : 'text-text-secondary hover:text-text'
                        }`}
                >
                    Tasks
                </button>
                <button
                    onClick={() => setActiveTab('tools')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === 'tools'
                            ? 'bg-bg-card text-primary shadow-sm'
                            : 'text-text-secondary hover:text-text'
                        }`}
                >
                    Tools
                </button>
            </div>
            
            {activeTab === 'tasks' ? tasks : tools}
            
        </div>
    )      
}
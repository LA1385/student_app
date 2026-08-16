'use client';

import { useState } from "react";
import  SearchBar  from "./SearchBar";
import FilterChip from "./FilterChip";
import { bucketTasks, filterBySearch, filterByStatus } from "@/lib/utils";
import { Task } from "@generated/prisma/client";
import Link from "next/link";
import { Plus } from "lucide-react";
import TaskCard from "@/components/dashboard/TaskCard";

type TaskPageClientProps = {
    tasks: Task[];
    now: Date;
}

export default function TaskPageClient({ tasks, now }: TaskPageClientProps) {
    const [searchText, setSearchText] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredTasks = filterByStatus(filterBySearch(tasks, searchText), activeFilter, now);


    const { overDue, thisWeek, upComing } = bucketTasks(filteredTasks, now);

    return (
        <div>
            {/* Heading & Add Task Button */}
            <div>
                <div>
                    <h1>Tasks</h1>
                    <p>Organize and conquer your academic workload</p>
                </div>
                <div>
                    <Link href="/dashboard/tasks/new">
                        <button>
                            <Plus />
                            New Task
                        </button>
                    </Link>
                </div>
            </div>
            {/* Search Bar and Filter Chips */}
            <div>
                <div>
                    <SearchBar
                        type="text"
                        searchValue={searchText}
                        onSearchChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search tasks..."
                    />
                </div>
                <div>
                    <FilterChip
                        value="All"
                        label="All"
                        isSelected={activeFilter === "All"}
                        onSelect={() => setActiveFilter("All")}
                    />
                    <FilterChip
                        value="Pending"
                        label="Pending"
                        isSelected={activeFilter === "Pending"}
                        onSelect={() => setActiveFilter("Pending")}
                    />
                    <FilterChip
                        value="Overdue"
                        label="Overdue"
                        isSelected={activeFilter === "Overdue"}
                        onSelect={() => setActiveFilter("Overdue")}
                    />
                    <FilterChip
                        value="Done"
                        label="Done"
                        isSelected={activeFilter === "Done"}
                        onSelect={() => setActiveFilter("Done")}
                    />
                </div>
            </div>
            {/* Task Buckets */}
            <div>
                {/* Overdue Tasks */}
                <div>
                    {activeFilter !== "Done" && overDue.length > 0 && (
                        <div>
                            <div>
                                <h2>Overdue({overDue.length})</h2>
                            </div>
                            <div>
                                {overDue.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        type={task.type}
                                        dueDate={task.dueDate.toISOString()}
                                        priority={task.priority}
                                        category={task.category ?? ""}
                                        status={task.status}
                                        now={now}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* This Week's Tasks */}
                <div>
                    {activeFilter !== "Done" && thisWeek.length > 0 && (
                        <div>
                            <div>
                                <h2>This Week({thisWeek.length})</h2>
                            </div>
                            <div>
                                {thisWeek.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        type={task.type}
                                        dueDate={task.dueDate.toISOString()}
                                        priority={task.priority}
                                        category={task.category ?? ""}
                                        status={task.status}
                                        now={now}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Upcoming Tasks */}
                <div>
                    {activeFilter !== "Done" && upComing.length > 0 && (
                        <div>
                            <div>
                                <h2>Upcoming({upComing.length})</h2>
                            </div>
                            <div>
                                {upComing.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        title={task.title}
                                        type={task.type}
                                        dueDate={task.dueDate.toISOString()}
                                        priority={task.priority}
                                        category={task.category ?? ""}
                                        status={task.status}
                                        now={now}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* Done Tasks */}
                <div>
                    {activeFilter === "Done" && filteredTasks.length > 0 && (
                        <div>
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    title={task.title}
                                    type={task.type}
                                    dueDate={task.dueDate.toISOString()}
                                    priority={task.priority}
                                    category={task.category ?? ""}
                                    status={task.status}
                                    now={now}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

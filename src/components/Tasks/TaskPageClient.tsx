"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import FilterChip from "./FilterChip";
import { bucketTasks, filterBySearch, filterByStatus } from "@/lib/utils";
import { Task } from "@generated/prisma/client";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
} from "lucide-react";
import TaskCard from "@/components/dashboard/TaskCard";
import EmptyStateCard from "@/components/Tasks/EmptyStateCard";

type TaskPageClientProps = {
  tasks: Task[];
  now: Date;
};

export default function TaskPageClient({ tasks, now }: TaskPageClientProps) {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const filteredTasks = filterByStatus(
    filterBySearch(localTasks, searchText),
    activeFilter,
    now,
  );

  const handleTaskCompletion = (taskId: string) => {
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: "Completed" } : task,
      ),
    );
  }

  const { overDue, thisWeek, upComing } = bucketTasks(filteredTasks, now);

  return (
    <div className="space-y-8 py-4 md:py-6">
      {/* Heading & Add Task Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text">Tasks</h1>
          <p className="mt-2 text-base text-text-secondary">
            Organize and conquer your academic Workload.
          </p>
        </div>
        <Link
          href="/dashboard/tasks/new"
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-primary-hover md:w-auto"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Link>
      </div>

      {/* Search Bar and Filter Chips */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="order-1 rounded-2xl border border-border bg-bg-card p-3 sm:p-4 md:order-none">
          <div className="flex flex-wrap gap-2">
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

        <div className="order-2 w-full rounded-2xl border border-border bg-bg-card p-3 sm:p-4 md:order-none md:max-w-sm lg:max-w-md">
          <SearchBar
            type="text"
            searchValue={searchText}
            onSearchChange={(e) => setSearchText(e.target.value)}
            placeholder="Search tasks..."
          />
        </div>
      </div>

      {/* Task Buckets */}
      <div className="space-y-8">
        {activeFilter !== "Done" && (
          <>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-urgent" />
                  <h2 className="text-xl font-bold text-text">
                    Overdue{" "}
                    <span className="text-text-secondary">
                      ({overDue.length})
                    </span>
                  </h2>
                </div>
                {overDue.length > 0 ? (
                  <div className="space-y-4">
                    {overDue.map((task) => (
                      <Link key={task.id} href={`/dashboard/tasks/${task.id}`} className="block">
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        type={task.type}
                        dueDate={task.dueDate.toISOString()}
                        priority={task.priority}
                        category={task.category ?? ""}
                        status={task.status}
                        now={now}
                        taskId={task.id}
                        onComplete={handleTaskCompletion}
                      />
                    </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyStateCard
                    title="No overdue tasks"
                    description="You're all caught up here. Keep your momentum going."
                  />
                )}
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <h2 className="text-xl font-bold text-text">
                    This week{" "}
                    <span className="text-text-secondary">
                      ({thisWeek.length})
                    </span>
                  </h2>
                </div>
                {thisWeek.length > 0 ? (
                  <div className="space-y-3">
                    {thisWeek.map((task) => (
                      <Link key={task.id} href={`/dashboard/tasks/${task.id}`} className="block">
                      <TaskCard
                        key={task.id}
                        taskId={task.id}
                        title={task.title}
                        type={task.type}
                        dueDate={task.dueDate.toISOString()}
                        priority={task.priority}
                        category={task.category ?? ""}
                        status={task.status}
                        now={now}
                        onComplete={handleTaskCompletion}
                      />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyStateCard
                    title="No tasks due this week"
                    description="New assignments due this week will appear here."
                  />
                )}
              </section>
            </div>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-done" />
                <h2 className="text-xl font-bold text-text">
                  Upcoming{" "}
                  <span className="text-text-secondary">
                    ({upComing.length})
                  </span>
                </h2>
              </div>
              {upComing.length > 0 ? (
                <div className="space-y-3">
                  {upComing.map((task) => (
                    <Link key={task.id} href={`/dashboard/tasks/${task.id}`} className="block">
                    <TaskCard
                      key={task.id}
                      taskId={task.id}
                      title={task.title}
                      type={task.type}
                      dueDate={task.dueDate.toISOString()}
                      priority={task.priority}
                      category={task.category ?? ""}
                      status={task.status}
                      now={now}
                      onComplete={handleTaskCompletion}
                    />
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyStateCard
                  title="No upcoming tasks"
                  description="You're all caught up for the future. Enjoy the breathing room."
                />
              )}
            </section>
          </>
        )}

        {activeFilter === "Done" && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-later" />
              <h2 className="text-xl font-bold text-text">
                Done{" "}
                <span className="text-text-secondary">
                  ({filteredTasks.length})
                </span>
              </h2>
            </div>

            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <Link key={task.id} href={`/dashboard/tasks/${task.id}`} className="block">
                  <TaskCard
                    key={task.id}
                    taskId={task.id}
                    title={task.title}
                    type={task.type}
                    dueDate={task.dueDate.toISOString()}
                    priority={task.priority}
                    category={task.category ?? ""}
                    status={task.status}
                    now={now}
                    onComplete={handleTaskCompletion}
                  />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyStateCard
                title="No completed tasks"
                description="Complete tasks to see them listed in this section."
              />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

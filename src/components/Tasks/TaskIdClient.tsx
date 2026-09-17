"use client";

import { Task, Reminder } from "@generated/prisma/client";
import TaskActions from "@/components/Tasks/TaskAction";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type TaskIdClientProps = {
  task: Task;
  reminders: Reminder | null;
};

type TaskUpdatePayload = {
  title?: string;
  dueDate?: Date;
  type?: string;
  priority?: string;
  channel?: string;
  daysBefore?: number;
  reminderId?: string;
};

export default function TaskIdClient({ task, reminders }: TaskIdClientProps) {
  const [status, setStatus] = useState(task?.status);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedType, setSelectedType] = useState(task?.type || "");
  const [selectedPriority, setSelectedPriority] = useState(
    task?.priority || "",
  );
  const [selectedChannel, setSelectedChannel] = useState(
    reminders?.channel || "",
  );
  const [selectedDaysBefore, setSelectedDaysBefore] = useState(
    reminders?.daysBefore || 0,
  );
  const titleRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const TYPE_OPTIONS = ["Assignment", "Test", "Exam", "Event", "Personal"];
  const PRIORITY_OPTIONS = ["Low", "Medium", "High"];
  const CHANNEL_OPTIONS = ["Email", "In-app", "Both"];
  const DAYS_BEFORE_OPTIONS = [1, 3, 7];

  const handleSaveChanges = async () => {
    const payLoad: TaskUpdatePayload = {};

    if (titleRef.current?.value !== task?.title) {
      payLoad.title = titleRef.current?.value;
    }
    if (
      dueDateRef.current?.value !== task?.dueDate?.toISOString().split("T")[0]
    ) {
      payLoad.dueDate = dueDateRef.current?.value
        ? new Date(dueDateRef.current?.value)
        : undefined;
    }
    if (selectedType !== task?.type) {
      payLoad.type = selectedType;
    }
    if (selectedPriority !== task?.priority) {
      payLoad.priority = selectedPriority;
    }
    if (selectedChannel !== reminders?.channel) {
      payLoad.channel = selectedChannel;
    }
    if (selectedDaysBefore !== reminders?.daysBefore) {
      payLoad.daysBefore = selectedDaysBefore;
    }
    if (
      selectedChannel !== reminders?.channel ||
      selectedDaysBefore !== reminders?.daysBefore
    ) {
      payLoad.reminderId = reminders?.id;
    }

    if (payLoad.title === "") {
      alert("Title cannot be empty");
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payLoad),
      });

      if (response.ok) {
        router.push("/dashboard/tasks");
      } else {
        const errorData = await response.json();
        console.error("Failed to update task:", errorData);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl pb-8 pt-6 sm:pb-10 sm:pt-8 lg:pl-4 lg:pt-10">
      <header className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Task Detail
          </p>
          <h1 className="text-2xl font-bold leading-tight text-text sm:text-4xl">
            {isEditing ? (
              <input
                type="text"
                ref={titleRef}
                defaultValue={task?.title}
                className="w-full rounded-xl border border-border-strong bg-bg-card px-4 py-3 text-2xl font-bold text-text shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:text-4xl"
              />
            ) : (
              task?.title
            )}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-urgent/15 px-3 py-1 text-xs font-semibold text-urgent">
              {task?.priority}
            </span>
            <span className="rounded-full bg-bg-input px-3 py-1 text-xs font-semibold capitalize text-text-secondary">
              {task?.status}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
        <section className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-sm">
          <div className="border-b border-border bg-primary-light px-5 py-4 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Task Details
            </p>
          </div>
          <div className="divide-y divide-border px-5 sm:px-8">
            <div className="grid gap-2 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
              <h3 className="text-sm font-medium text-text-secondary">
                Due Date
              </h3>
              <div className="text-base font-semibold text-text">
                {isEditing ? (
                  <input
                    type="date"
                    ref={dueDateRef}
                    defaultValue={
                      task?.dueDate
                        ? new Date(task.dueDate).toISOString().split("T")[0]
                        : ""
                    }
                    className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 font-medium text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:max-w-xs"
                  />
                ) : task?.dueDate ? (
                  new Date(task.dueDate).toLocaleDateString()
                ) : (
                  "Due date not available"
                )}
              </div>
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
              <h3 className="text-sm font-medium text-text-secondary">Type</h3>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {TYPE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedType(option)}
                      className={
                        option === selectedType
                          ? "inline-flex min-h-10 items-center justify-center rounded-full border border-primary bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                          : "inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg-input px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-border-strong hover:bg-bg-page focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="font-semibold text-text">{task?.type}</p>
              )}
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
              <h3 className="text-sm font-medium text-text-secondary">
                Priority
              </h3>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedPriority(option)}
                      className={
                        option === selectedPriority
                          ? option === "High"
                            ? "inline-flex min-h-10 items-center justify-center rounded-full border border-urgent bg-urgent px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-urgent/20"
                            : option === "Medium"
                              ? "inline-flex min-h-10 items-center justify-center rounded-full border border-upcoming bg-upcoming px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-upcoming/20"
                              : "inline-flex min-h-10 items-center justify-center rounded-full border border-later bg-later px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-later/20"
                          : "inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg-input px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-border-strong hover:bg-bg-page focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <p
                  className={
                    task?.priority === "High"
                      ? "font-semibold text-urgent"
                      : task?.priority === "Medium"
                        ? "font-semibold text-upcoming"
                        : "font-semibold text-later"
                  }
                >
                  {task?.priority}
                </p>
              )}
            </div>
            <div className="grid gap-2 py-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center sm:gap-8">
              <h3 className="text-sm font-medium text-text-secondary">
                Status
              </h3>
              <p
                className={
                  task?.status === "Completed"
                    ? "font-semibold text-done"
                    : "font-semibold text-text"
                }
              >
                {task?.status}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-purple/25 bg-purple-light/45 p-5 shadow-sm dark:border-purple/60 dark:bg-purple/10 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-purple">Reminders</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-purple/80">
                Scheduled
              </p>
            </div>
            <span className="rounded-full bg-purple/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-purple dark:bg-purple/30 dark:text-purple">
              Active
            </span>
          </div>
          <div className="mt-6 space-y-6">
            <div>
              <h1 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Timing
              </h1>
              {isEditing ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {DAYS_BEFORE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedDaysBefore(option)}
                      className={
                        option === selectedDaysBefore
                          ? "inline-flex min-h-10 items-center justify-center rounded-full border border-purple bg-purple px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/20"
                          : "inline-flex min-h-10 items-center justify-center rounded-full border border-purple/25 bg-bg-card px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-purple/50 hover:bg-purple-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/20 dark:border-purple/60 dark:bg-bg-input dark:text-text dark:hover:bg-purple/20"
                      }
                    >
                      {option} days
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 font-semibold text-text">
                  {reminders?.daysBefore
                    ? `${reminders.daysBefore} days before`
                    : "Not specified"}
                </p>
              )}
            </div>
            <div>
              <h1 className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Channel
              </h1>
              {isEditing ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHANNEL_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedChannel(option)}
                      className={
                        option === selectedChannel
                          ? "inline-flex min-h-10 items-center justify-center rounded-full border border-purple bg-purple px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/20"
                          : "inline-flex min-h-10 items-center justify-center rounded-full border border-purple/25 bg-bg-card px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-purple/50 hover:bg-purple-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/20 dark:border-purple/60 dark:bg-bg-input dark:text-text dark:hover:bg-purple/20"
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 font-semibold text-text">
                  {reminders?.channel ? reminders?.channel : "Not specified"}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 border-t border-border pt-6 sm:mt-8 sm:pt-7">
        <TaskActions
          handleSaveChanges={handleSaveChanges}
          isEditing={isEditing}
          taskId={task?.id}
          status={status}
          setStatus={setStatus}
          setIsEditing={setIsEditing}
        />
      </div>
    </div>
  );
}

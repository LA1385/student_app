"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/Tasks/ConfirmationModal";

type TaskActionProps = {
    taskId: string;
    status: string;
    setStatus: (status: string) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleSaveChanges: () => Promise<void>;
}

export default function TaskAction({taskId, status, setStatus,isEditing, setIsEditing, handleSaveChanges}: TaskActionProps) {

    const [isDisabled, setIsDisabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const handleMarkAsComplete = async () => {
    setIsDisabled(true);
    if (status === "Completed") {
        console.log("Task is already completed");
        setIsDisabled(false);
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Completed" }),
        });

        if (response.ok) {
            const updated = await response.json();
            setStatus(updated.status);
            router.push("/dashboard/tasks");
            console.log("Task marked as complete");
        } else {
            console.error("Failed to mark task as complete");
        }
    } catch (error) {
        console.error("Network error marking task complete:", error);
    } finally {
        setIsDisabled(false);
    }
};

    const handleDeleteTask = async () => {
        setIsDisabled(true);
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("Task deleted successfully");
                router.push("/dashboard/tasks");
            } else {
                console.error("Failed to delete task");
            }
        } catch (error) {
            console.error("Network error deleting task:", error);
        } 
        finally {
            setIsDisabled(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            {!isEditing && <button disabled={isDisabled} className="order-1 min-h-12 rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-36" onClick={() => {
                setIsEditing(true);
            }}>Edit Task</button>}

            { isEditing? <button disabled={isDisabled} className="order-3 min-h-12 rounded-xl border border-border-strong bg-bg-card px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-bg-page focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:min-w-32" onClick={() => setIsEditing(false)}>Cancel</button> : <button disabled={isDisabled} className="order-2 min-h-12 rounded-xl border border-later bg-later px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-later/20 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:min-w-44" onClick={handleMarkAsComplete}>Mark as Complete</button>}

            {isEditing ? (
                <button disabled={isDisabled} className="order-2 min-h-12 rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1 sm:min-w-40" onClick={async () => {
                    setIsDisabled(true);
                    await handleSaveChanges();
                    setIsDisabled(false);
                }}>Save Changes</button>
            ) : (
                <button disabled={isDisabled} className="order-3 min-h-12 rounded-xl border border-urgent/25 bg-urgent/10 px-5 py-3 text-sm font-semibold text-urgent transition hover:bg-urgent/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-urgent/20 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32" onClick={() => setIsModalOpen(true)}>Delete Task</button>
                )
            }

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteTask}
            />

        </div>
    )
}
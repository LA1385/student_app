"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/Tasks/ConfirmationModal";
import {
    getNetworkErrorMessage,
    getResponseErrorMessage,
} from "@/lib/clientError";

type TaskActionProps = {
    taskId: string;
    status: string;
    setStatus: (status: string) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    handleSaveChanges: () => Promise<string | null>;
}

export default function TaskAction({taskId, status, setStatus,isEditing, setIsEditing, handleSaveChanges}: TaskActionProps) {

    const [isDisabled, setIsDisabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const router = useRouter();

    const handleMarkAsComplete = async () => {
    setIsDisabled(true);
    setActionError(null);
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
        } else if (response.status === 401) {
            router.push("/login");
        } else {
            const message = await getResponseErrorMessage(
                response,
                "Could not complete this task. Please try again.",
            );
            setActionError(message);
        }
    } catch (error) {
        console.error("Network error marking task complete:", error);
        setActionError(
            getNetworkErrorMessage("Could not complete this task. Please try again."),
        );
    } finally {
        setIsDisabled(false);
    }
};

    const handleDeleteTask = async () => {
        setIsDisabled(true);
        setActionError(null);
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("Task deleted successfully");
                router.push("/dashboard/tasks");
            } else if (response.status === 401) {
                router.push("/login");
            } else {
                const message = await getResponseErrorMessage(
                    response,
                    "Could not delete this task. Please try again.",
                );
                setActionError(message);
            }
        } catch (error) {
            console.error("Network error deleting task:", error);
            setActionError(
                getNetworkErrorMessage("Could not delete this task. Please try again."),
            );
        } 
        finally {
            setIsDisabled(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            {actionError && (
                <p role="alert" className="order-first w-full text-sm text-urgent">
                    {actionError}
                </p>
            )}
            {!isEditing && <button disabled={isDisabled} className="order-1 min-h-12 rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-36" onClick={() => {
                setIsEditing(true);
            }}>Edit Task</button>}

            { isEditing? <button disabled={isDisabled} className="order-3 min-h-12 rounded-xl border border-border-strong bg-bg-card px-5 py-3 text-sm font-semibold text-text-secondary transition hover:bg-bg-page focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:min-w-32" onClick={() => setIsEditing(false)}>Cancel</button> : <button disabled={isDisabled} className="order-2 min-h-12 rounded-xl border border-later bg-later px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-later/20 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:min-w-44" onClick={handleMarkAsComplete}>Mark as Complete</button>}

            {isEditing ? (
                <button disabled={isDisabled} className="order-2 min-h-12 rounded-xl border border-primary bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1 sm:min-w-40" onClick={async () => {
                    setIsDisabled(true);
                    setActionError(await handleSaveChanges());
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
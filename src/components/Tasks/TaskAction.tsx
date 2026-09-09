"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/Tasks/ConfirmationModal";

type TaskActionProps = {
    taskId: string;
    status: string;
    setStatus: (status: string) => void;
    setIsEditing: (isEditing: boolean) => void;
}

export default function TaskAction({taskId, status, setStatus, setIsEditing}: TaskActionProps) {

    const [isDisabled, setIsDisabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const handleMarkAsComplete = async () => {
    setIsDisabled(true);
    if (status === "completed") {
        console.log("Task is already completed");
        setIsDisabled(false);
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" }),
        });

        if (response.ok) {
            const updated = await response.json();
            setStatus(updated.status);
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
                router.push("/tasks");
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
        <div>
            <button disabled={isDisabled} onClick={handleMarkAsComplete}>Mark as Complete</button>
            <button disabled={isDisabled} onClick={() => {
                setIsEditing(true);
            }}>Edit Task</button>
            <button disabled={isDisabled} onClick={() => setIsModalOpen(true)}>Delete Task</button>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteTask}
            />
        </div>
    )
}
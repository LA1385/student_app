import { requireUser } from "@/lib/auth_helpers";
import { NextResponse } from "next/server";
import { getTaskById } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@generated/prisma/client";
import { validateTaskUpdateInput } from "@/lib/validators/taskValidators";
import { getReminderSchedule } from "@/lib/timeZone";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }){
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }
    const userId = user.id;
    const { id: taskId } = await params;

    const task = await getTaskById(taskId, userId);
    
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireUser();

    if (!user) {
        return NextResponse.json(
            { error: "Unauthorized User" },
            { status: 401 }
        );
    }

    const { id: taskId } = await params;

    try {
        const body: unknown = await request.json();
        const validation = validateTaskUpdateInput(body);
        if ("error" in validation) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }
        const update = validation.data;

        // Find the task and its reminders.
        const existingTask = await prisma.task.findFirst({
            where: { id: taskId, userId: user.id, },
            include: { reminders: true },
        });

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        // Determine the updated due date.
        // != null covers both null and undefined, so "no dueDate sent" means "no change".
        const newDueDate = update.dueDate != null ? new Date(update.dueDate) : existingTask.dueDate;
        const userProfile = await prisma.user.findUnique({
            where: { id: user.id },
            select: { timeZone: true },
        });

        const dueDateChanged = newDueDate.getTime() !== existingTask.dueDate.getTime();

        // Ensure the reminder belongs to this task.
        const targetReminder = existingTask.reminders.find(
            (reminder) => reminder.id === update.reminderId
        );

        if (update.reminderId && !targetReminder) {
            return NextResponse.json(
                { error: "Reminder not found for this task" },
                { status: 404 }
            );
        }

        // Update the task, reminders, and notifications together.
        await prisma.$transaction(async (tx) => {
            // 1. Update the task.
            await tx.task.update({
                where: { id: taskId, userId: user.id, },
                data: {
                    title: update.title ?? undefined,
                    type: update.type ?? undefined,
                    dueDate: update.dueDate != null ? newDueDate : undefined,
                    priority: update.priority ?? undefined,
                    status: update.status ?? undefined,
                },
            });

            // 2. Update affected reminders.
            for (const reminder of existingTask.reminders) {
                const isTargetReminder = reminder.id === update.reminderId;

                const newDaysBefore = isTargetReminder ? update.daysBefore ?? reminder.daysBefore : reminder.daysBefore;

                const newChannel = isTargetReminder ? update.channel ?? reminder.channel : reminder.channel;

                const channelChanged = newChannel !== reminder.channel;
                const timingChanged = dueDateChanged || newDaysBefore !== reminder.daysBefore;
                const reminderChanged = timingChanged || channelChanged;

                if (!reminderChanged) continue;
                const schedule = getReminderSchedule(
                    newDueDate,
                    newDaysBefore,
                    userProfile?.timeZone ?? "Africa/Lagos",
                );
                // Update reminder settings.
                await tx.reminder.update({
                    where: {
                        id: reminder.id,
                        taskId,
                        userId: user.id,
                    },
                    data: {
                        channel: newChannel,
                        daysBefore: newDaysBefore,
                        // Re-arm when timing or channel settings change.
                        ...(reminderChanged && {
                            scheduledAt: schedule.scheduledAt,
                            sent: !schedule.shouldArm,
                            attempts: 0,
                            emailSentAt: null,
                            inAppSentAt: null,
                            lastError: null,
                        }),
                    },
                });

                // Remove the old notification if timing changed,
                // allowing a new one to be created later.
                if (timingChanged) {
                    await tx.notification.deleteMany({
                        where: {
                            reminderId: reminder.id,
                            taskId,
                            userId: user.id,
                        },
                    });
                }
            }
        });

        return NextResponse.json({
            message: "Task updated successfully",
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Task or reminder not found" },
                { status: 404 }
            );
        }

        console.error("Error updating task");

        return NextResponse.json(
            { error: "Error updating task" },
            { status: 500 }
        );
    }
}

export async function DELETE(request : Request, { params } : { params: Promise<{ id: string }> }) {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }
    const userId = user.id;
    const { id: taskId } = await params;

    // Delete task by ID
    try{
        await prisma.task.delete({
            where: { id: taskId, userId },
        });
        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        if (error == "P2025") {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }
        console.error("Error deleting task");
        return NextResponse.json({ error: "Error deleting task" }, { status: 404 });
    }
}
import { requireUser } from "@/lib/auth_helpers";
import { NextResponse } from "next/server";
import { getTaskById } from "@/lib/queries";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }){
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }
    const userId = user.id;
    const { id: taskId } = await params;

    const task = await getTaskById(taskId, userId);
    console.log("Fetched task:", task); // Debugging line to check the fetched task
    
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }
    const userId = user.id;
    const { id: taskId } = await params;
    const body = await request.json();

    // Patch for task information changed and status completed
    try {
        await prisma.task.update({
            where: {id: taskId, userId},
            data: { 
                title: body.title ?? undefined,
                type: body.type ?? undefined,
                dueDate: body.dueDate ?? undefined,
                priority: body.priority ?? undefined,
                status: body.status ?? undefined,
                reminders: body.reminderId ? {
                    update: {
                        where: { id: body.reminderId },
                        data: {
                            channel: body.channel ?? undefined,
                            daysBefore: body.daysBefore ?? undefined,
                        }
                    }
                } : undefined,
             },
        });
        return NextResponse.json({ message: "Task marked as completed" });
    } catch (error) {
        if (error == "P2025") {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Error updating task" }, { status: 500 });
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
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Error deleting task" }, { status: 404 });
    }
}
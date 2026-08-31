import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getTaskById } from "@/lib/queries";

export async function GET(request: Request, { params }: { params: { id: string } }){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: taskId } = await params;

    const task = await getTaskById(taskId, userId);
    console.log("Fetched task:", task); // Debugging line to check the fetched task
    
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
}
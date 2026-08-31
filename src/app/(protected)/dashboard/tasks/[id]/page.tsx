import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getTaskById } from "@/lib/queries";



export default async function TaskIdPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }
    const { id: taskId } = await params;

    const task = await getTaskById(taskId, session.user.id);
    console.log("Fetched task:", task); // Debugging line to check the fetched task

    return(
        <div>
            {/* Title & Edit task icon */}
            <div>
                <div></div>
                <div><h1>{task?.title || "Task not found"}</h1></div>
            </div>
        </div>
    )
}
import {auth} from "@/lib/auth";
import { getTasks } from "@/lib/queries";
import { NextResponse } from "next/server";
import { validateTaskInput } from "@/lib/validators/taskValidators";
import { createTask } from "@/lib/queries";

export async function GET(){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401});
    }
    const userId = session.user.id;
    const task = await getTasks(userId);
    return NextResponse.json(task);
}


export async function POST(request: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }

    try {
        const body: unknown = await request.json();
        const validation = validateTaskInput(body);
        if ("error" in validation) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const newTask = await createTask(session.user.id, validation.data);
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Error creating task" }, { status: 500 });
    }
}

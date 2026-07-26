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

    const userId = session.user.id;
    const body = await request.json();

    const validationError = validateTaskInput(body);
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
    }

    try {
        const newTask = await createTask(userId, body);
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Error creating task" }, { status: 500 });
    }
}

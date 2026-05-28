import {auth} from "@/lib/auth";
import { getTasks } from "@/lib/queries";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401});
    }
    const userId = session.user.id;
    const task = await getTasks(userId);
    return NextResponse.json(task);
}

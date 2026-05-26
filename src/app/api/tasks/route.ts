import { prisma } from "@/lib/prisma";
import {auth} from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401});
    }
    const userId = session.user.id;
    const task = await prisma.task.findMany({
    where:{userId}
    });
    return NextResponse.json(task);
}

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getTaskSummary } from "@/lib/queries";

export async function GET() {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized User" }, { status: 401 });
    }

    const userId = session.user.id;
    const summary = await getTaskSummary(userId);

    return NextResponse.json(summary);
}

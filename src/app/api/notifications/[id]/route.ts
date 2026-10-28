import { requireUser } from "@/lib/auth_helpers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@generated/prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: notificationId } = await params;

    try {
        const updateNotification = await prisma.notification.update({
            where: { userId: user.id, id: notificationId },
            data: { read: true },
        });

        return NextResponse.json(updateNotification, { status: 200 });
    }
    catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        console.error("Error updating notification:", error);
        return NextResponse.json({ error: "Error updating notification" }, { status: 500 });
    }
}



export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: notificationId } = await params;

    try {
        await prisma.notification.delete({
            where: { userId: user.id, id: notificationId },
        });
        return NextResponse.json( {message: "Notification deleted"}, { status: 200 });
    }
    catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        console.error("Error deleting notification:", error);
        return NextResponse.json({ error: "Error deleting notification" }, { status: 500 });
    }
}
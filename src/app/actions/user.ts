"use server";

import { requireUser } from "@/lib/auth_helpers";
import { normalizeTimeZone } from "@/lib/timeZone";
import { prisma } from "@/lib/prisma";

export async function updateUserTimeZone(value: unknown) {
    const user = await requireUser();
    if (!user) {
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { timeZone: normalizeTimeZone(value) },
    });
}

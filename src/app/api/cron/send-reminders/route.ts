
import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { processDueReminders } from "@/lib/reminder";

function sha256(value: string): Buffer {
    return createHash("sha256").update(value).digest();
}

function isAuthorized(request: Request, secret: string): boolean {
    const header = request.headers.get("authorization");

    if (!header || !header.startsWith("Bearer ")) {
        return false;
    }

    const provided = header.slice("Bearer ".length);

    return timingSafeEqual(
        sha256(provided),
        sha256(secret)
    );
}

export async function POST(request: Request) {
    const secret = process.env.CRON_SECRET;

    if (!secret) {
        console.error(
            "[cron] CRON_SECRET is not set; refusing to run"
        );

        return NextResponse.json(
            { error: "Server misconfigured" },
            { status: 500 }
        );
    }

    if (!isAuthorized(request, secret)) {
        return new NextResponse(null, { status: 401 });
    }

    try {
        const summary = await processDueReminders();

        return NextResponse.json(summary, { status: 200 });
    } catch (error) {
        console.error("[cron] unexpected failure:", error);

        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        );
    }
}

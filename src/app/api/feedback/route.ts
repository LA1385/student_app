import { requireUser } from "@/lib/auth_helpers";
import { countRecentFeedbackByUser, createFeedback } from "@/lib/queries";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { validateFeedbackInput } from "@/lib/validators/feedbackValidators";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
    const user = await requireUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: unknown = await request.json();
        const validation = validateFeedbackInput(body);
        if ("error" in validation) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const recentFeedbackCount = await countRecentFeedbackByUser(user.id);
        if (recentFeedbackCount >= 5) {
            return NextResponse.json(
                { error: "Feedback limit reached. Please try again later." },
                { status: 429 },
            );
        }

        const feedback = await createFeedback(user.id, validation.data);
        const recipient = process.env.FEEDBACK_TO_EMAIL;
        const userName = user.name ?? "Unknown";

        try {
            if (!recipient) {
                throw new Error("FEEDBACK_TO_EMAIL is not configured");
            }

            await sendEmail(
                recipient,
                `New feedback: ${feedback.category}`,
                `<p><strong>Name:</strong> ${escapeHtml(userName)}</p>
<p><strong>Email:</strong> ${escapeHtml(user.email ?? "Not provided")}</p>
<p><strong>Category:</strong> ${escapeHtml(feedback.category)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(feedback.message).replace(/\n/g, "<br>")}</p>`,
            );
        } catch (error) {
            console.error("Error sending feedback email:", error);
        }

        return NextResponse.json({ message: "Feedback submitted successfully" }, { status: 201 });
    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        console.error("Error creating feedback:", error);
        return NextResponse.json({ error: "Error creating feedback" }, { status: 500 });
    }
}

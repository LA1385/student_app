import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export type EmailErrorCode = "SMTP_TIMEOUT" | "SMTP_AUTH" | "UNKNOWN";

export class EmailDeliveryError extends Error {
  constructor(public readonly code: EmailErrorCode) {
    super(code);
    this.name = "EmailDeliveryError";
  }
}

function getTransporter(): Transporter {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new EmailDeliveryError("SMTP_AUTH");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

export async function sendEmail(
  receiver: string,
  subject: string,
  html: string
): Promise<void> {
  const transport = getTransporter();

  let info;
  try {
    info = await transport.sendMail({
      from: `"Scholarly Reminders" <${process.env.GMAIL_USER}>`,
      to: receiver,
      subject,
      html,
    });
  } catch (error) {
    const code = error instanceof Error && (
      error.name === "ETIMEDOUT"
      || error.name === "ESOCKET"
      || "code" in error && (error.code === "ETIMEDOUT" || error.code === "ESOCKET")
    )
      ? "SMTP_TIMEOUT"
      : error instanceof Error && (
        "code" in error && (error.code === "EAUTH" || error.code === "EENVELOPE")
      )
        ? "SMTP_AUTH"
        : "UNKNOWN";
    throw new EmailDeliveryError(code);
  }

  if (info.rejected.length > 0) {
    throw new EmailDeliveryError("SMTP_AUTH");
  }
}
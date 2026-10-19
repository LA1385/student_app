import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured.");
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
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send email: ${reason}`, { cause: error });
  }

  if (info.rejected.length > 0) {
    throw new Error(`Email rejected for: ${info.rejected.join(", ")}`);
  }
}
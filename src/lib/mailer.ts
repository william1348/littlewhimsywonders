import "server-only";

import nodemailer, { type Transporter } from "nodemailer";

import type { Stage } from "@/lib/store";

type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
};

const globalForMailer = globalThis as unknown as {
  littleWhimsyTransporter?: Transporter;
};

export function contactMailerStatus(): { configured: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
  if (!process.env.CONTACT_TO_EMAIL) missing.push("CONTACT_TO_EMAIL");
  return { configured: missing.length === 0, missing };
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
  stage: Stage;
}): Promise<void> {
  const config = loadConfig();
  const transporter = transport(config);
  const subject = `Little Whimsy Wonders contact: ${input.name}`;
  const submittedAt = new Date().toISOString();

  await transporter.sendMail({
    to: config.to,
    from: config.from,
    replyTo: `${input.name} <${input.email}>`,
    subject,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Stage: ${input.stage}`,
      `Submitted: ${submittedAt}`,
      "",
      input.message,
    ].join("\n"),
    html: `
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Stage:</strong> ${escapeHtml(input.stage)}</p>
      <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
      <hr />
      <p style="white-space: pre-wrap;">${escapeHtml(input.message)}</p>
    `,
  });
}

function loadConfig(): MailerConfig {
  const status = contactMailerStatus();
  if (!status.configured) {
    throw new Error(`mailer_not_configured:${status.missing.join(",")}`);
  }

  const host = process.env.SMTP_HOST!;
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const to = process.env.CONTACT_TO_EMAIL!;
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || user;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

  return {
    host,
    port: Number.isFinite(port) ? port : 465,
    secure,
    user,
    pass,
    to,
    from,
  };
}

function transport(config: MailerConfig): Transporter {
  if (!globalForMailer.littleWhimsyTransporter) {
    globalForMailer.littleWhimsyTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
    });
  }
  return globalForMailer.littleWhimsyTransporter;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

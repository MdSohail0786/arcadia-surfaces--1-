import nodemailer from "nodemailer";

let transporter = null;
let smtpConfigured = false;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    smtpConfigured = false;
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
  smtpConfigured = true;
  return transporter;
}

/**
 * Sends an email if SMTP is configured. If it isn't, logs the intended
 * email to the console and resolves successfully rather than throwing —
 * so contact/enquiry/newsletter flows keep working (and are testable)
 * in environments without real SMTP credentials, instead of silently
 * pretending mail was sent when it wasn't.
 */
export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();

  if (!t) {
    console.log(
      `[mail] SMTP not configured — would have sent to ${to}: "${subject}"`
    );
    return { sent: false, reason: "smtp-not-configured" };
  }

  await t.sendMail({
    from: process.env.MAIL_FROM || `"Arcadia Surfaces" <no-reply@arcadiasurfaces.example>`,
    to,
    subject,
    html,
    text,
  });

  return { sent: true };
}

export function isEmailConfigured() {
  getTransporter();
  return smtpConfigured;
}

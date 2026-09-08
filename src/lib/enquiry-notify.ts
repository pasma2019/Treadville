import { Resend } from "resend";

type EnquiryEmailPayload = {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  type: string;
  productContext: string | null;
  message: string;
  submittedAt: string;
};

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailBody(p: EnquiryEmailPayload): { html: string; text: string } {
  const safe = (v: string | null | undefined) => escapeHtml(v ?? "—");

  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0e0b08;font-family:'Cormorant Garamond',Georgia,serif;color:#f5f0e6;">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#16110d;border-top:2px solid #b08d57;">
      <div style="border-bottom:1px solid rgba(176,141,87,0.4);padding-bottom:16px;margin-bottom:24px;">
        <p style="margin:0;font-size:11px;letter-spacing:4px;color:#b08d57;">TREADVILLE  ·  KENYA</p>
        <h1 style="margin:8px 0 0 0;font-size:28px;font-weight:500;color:#f5f0e6;">New Enquiry</h1>
      </div>

      <table cellpadding="0" cellspacing="0" style="width:100%;font-size:16px;color:#ece3ce;line-height:1.7;">
        <tr><td style="padding:6px 0;color:#b08d57;width:140px;">Name</td><td style="padding:6px 0;">${safe(p.name)}</td></tr>
        <tr><td style="padding:6px 0;color:#b08d57;">Email</td><td style="padding:6px 0;"><a href="mailto:${safe(p.email)}" style="color:#d9c39a;">${safe(p.email)}</a></td></tr>
        ${p.company ? `<tr><td style="padding:6px 0;color:#b08d57;">Company</td><td style="padding:6px 0;">${safe(p.company)}</td></tr>` : ""}
        ${p.phone ? `<tr><td style="padding:6px 0;color:#b08d57;">Phone</td><td style="padding:6px 0;"><a href="tel:${safe(p.phone)}" style="color:#d9c39a;">${safe(p.phone)}</a></td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#b08d57;">Type</td><td style="padding:6px 0;">${safe(p.type)}</td></tr>
        ${p.productContext ? `<tr><td style="padding:6px 0;color:#b08d57;">Product</td><td style="padding:6px 0;font-style:italic;">${safe(p.productContext)}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#b08d57;">Submitted</td><td style="padding:6px 0;">${safe(p.submittedAt)}</td></tr>
      </table>

      <div style="margin:24px 0;padding:20px;background:rgba(176,141,87,0.08);border-left:2px solid #b08d57;">
        <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:3px;color:#b08d57;">MESSAGE</p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#f5f0e6;white-space:pre-wrap;">${safe(p.message)}</p>
      </div>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(176,141,87,0.4);text-align:center;">
        <a href="mailto:${safe(p.email)}" style="display:inline-block;padding:10px 24px;background:#b08d57;color:#0e0b08;text-decoration:none;font-size:13px;letter-spacing:2px;margin-right:8px;">REPLY TO CUSTOMER</a>
        <a href="https://treadville.co.ke" style="display:inline-block;padding:10px 24px;border:1px solid #b08d57;color:#d9c39a;text-decoration:none;font-size:13px;letter-spacing:2px;">VIEW WEBSITE</a>
      </div>

      <p style="margin:24px 0 0 0;font-size:11px;color:#8a7a5a;text-align:center;">Treadville Company Limited  ·  Kenya</p>
    </div>
  </body>
</html>`;

  const text = [
    "TREADVILLE — NEW ENQUIRY",
    "",
    `Name:      ${p.name}`,
    `Email:     ${p.email}`,
    p.company ? `Company:   ${p.company}` : null,
    p.phone ? `Phone:     ${p.phone}` : null,
    `Type:      ${p.type}`,
    p.productContext ? `Product:   ${p.productContext}` : null,
    `Submitted: ${p.submittedAt}`,
    "",
    "MESSAGE",
    "-------",
    p.message,
    "",
    `Reply:  mailto:${p.email}`,
    `Site:   https://treadville.co.ke`,
    "",
    "Treadville Company Limited · Kenya",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return { html, text };
}

export type NotificationResult =
  | { sent: true; id: string }
  | { sent: false; reason: "no_api_key" | "no_recipient" | "no_from" | "send_failed"; error?: string };

export async function sendEnquiryNotification(
  payload: EnquiryEmailPayload
): Promise<NotificationResult> {
  const to = process.env.ENQUIRY_NOTIFICATION_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  if (!to) return { sent: false, reason: "no_recipient" };
  if (!from) return { sent: false, reason: "no_from" };

  const resend = getResend();
  if (!resend) return { sent: false, reason: "no_api_key" };

  const { html, text } = buildEmailBody(payload);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.email,
      subject: `[Treadville] New ${payload.type} — ${payload.name}`,
      html,
      text,
    });

    if (error) {
      return { sent: false, reason: "send_failed", error: error.message };
    }
    return { sent: true, id: data?.id ?? "unknown" };
  } catch (err) {
    return {
      sent: false,
      reason: "send_failed",
      error: err instanceof Error ? err.message : "unknown",
    };
  }
}

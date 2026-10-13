import type { BookingEnquiry } from "./booking-types";
import { serviceDisplayName } from "@/content/services";

const RESEND_URL = "https://api.resend.com/emails";

function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

export function emailConfigured() {
  return resendConfigured();
}

async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!resendConfigured()) return { sent: false, reason: "not-configured" };
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error", res.status, body);
      return { sent: false, reason: `resend:${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("Failed to send email", err);
    return { sent: false, reason: "exception" };
  }
}

export async function notifyOwner(enquiry: BookingEnquiry, enquiryId: string) {
  const html = renderEnquiryHtml(enquiry, enquiryId);
  return sendEmail({
    to: process.env.BOOKINGS_NOTIFY_EMAIL ?? "bookings.abiwandeevents@gmail.com",
    subject: `New booking enquiry: ${enquiry.eventType} — ${enquiry.fullName}`,
    html,
    replyTo: enquiry.email,
  });
}

export async function confirmToCustomer(enquiry: BookingEnquiry) {
  const subject = "We received your booking enquiry — AbiWande Events & Concierge";
  const intro = `
    <p>Hello ${esc(enquiry.fullName.split(" ")[0])},</p>
    <p>Thank you for contacting <strong>AbiWande Events &amp; Concierge</strong>.
    Your event enquiry has been received. We will review your requirements and
    contact you about availability and the next steps.</p>
    <p><em>Please note: your event is <strong>not confirmed</strong> until we have
    agreed on the details with you.</em></p>
    <p>Below is a summary of what you sent:</p>
  `;
  const body = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#29252B;line-height:1.6">
    ${intro}${renderSummaryTable(enquiry)}
    <p style="margin-top:24px;color:#6b5570;font-size:12px">If you did not submit this enquiry, please ignore this email. You can update or delete your enquiry by replying to this message.</p>
  </div>`;
  return sendEmail({ to: enquiry.email, subject, html: body });
}

function renderEnquiryHtml(enquiry: BookingEnquiry, enquiryId?: string) {
  const id = enquiryId
    ? `<p style="font-size:12px;color:#6b5570">Enquiry reference: ${esc(
        enquiryId
      )}</p>`
    : "";
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#29252B;line-height:1.6">
    <div style="background:#48364F;color:#FFFCF7;padding:28px 32px;border-radius:16px 16px 0 0">
      <h2 style="margin:0;font-size:22px">New booking enquiry</h2>
      <p style="margin:6px 0 0;color:#E7DDF8">${esc(enquiry.eventType)} · ${esc(
        enquiry.fullName
      )}</p>
    </div>
    ${id}
    ${renderSummaryTable(enquiry)}
    <p style="color:#6b5570;font-size:12px;margin-top:16px">Reply to this email or call the client directly to respond. Private admin notes are never shown here.</p>
  </div>`;
}

function renderSummaryTable(enquiry: BookingEnquiry) {
  const rows: [string, string][] = [
    ["Event type", enquiry.eventType + (enquiry.eventTypeOther ? ` — ${enquiry.eventTypeOther}` : "")],
    ["Services", enquiry.services.map(serviceDisplayName).join(", ")],
  ];
  if (enquiry.eventDate) rows.push(["Preferred date", enquiry.eventDate]);
  rows.push(["Date is flexible", enquiry.flexibleDate ? "Yes" : "No"]);
  if (enquiry.startTime || enquiry.endTime)
    rows.push(["Time", `${enquiry.startTime ?? "—"} – ${enquiry.endTime ?? "—"}`]);
  if (enquiry.venue) rows.push(["Venue / location", enquiry.venue]);
  if (enquiry.eventCity) rows.push(["City", enquiry.eventCity]);
  if (enquiry.guestCount) rows.push(["Guest count", enquiry.guestCount]);
  if (enquiry.indoorOutdoor) rows.push(["Setting", enquiry.indoorOutdoor]);
  rows.push([
    "Budget",
    enquiry.budgetGbp
      ? `£${Number(String(enquiry.budgetGbp).replace(/[£,]/g, "")).toLocaleString("en-GB")} (estimate)`
      : "Not specified",
  ]);
  if (enquiry.themeStyle) rows.push(["Theme / style", enquiry.themeStyle]);
  if (enquiry.dietaryRequirements)
    rows.push(["Dietary / catering", enquiry.dietaryRequirements]);
  if (enquiry.additionalRequests)
    rows.push(["Additional requests", enquiry.additionalRequests]);
  if (enquiry.referenceImages?.length)
    rows.push([
      "Reference images",
      `${enquiry.referenceImages.length} file(s) attached — view them in the owner dashboard.`,
    ]);
  rows.push(["Contact method", enquiry.contactMethod]);

  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 14px;background:#FBF6EE;font-weight:600;width:40%;vertical-align:top">${esc(
          k
        )}</td><td style="padding:8px 14px;background:#FFFCF7">${v}</td></tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;border:1px solid #eee">${tr}</table>`;
}

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
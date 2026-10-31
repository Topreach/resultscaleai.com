import { getAdminSettings } from "@/lib/store/db";
import { allowAttempt } from "@/lib/request-security";
import { NextRequest, NextResponse } from "next/server";
import { createContactRequest, updateContactRequest } from "@/lib/store/db";
import { ContactRequest } from "@/types";
import { createMailTransport } from "@/lib/smtp.cjs";

// POST /api/contact - Submit a contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 150 || typeof body.email !== "string" || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || typeof body.message !== "string" || !body.message.trim() || body.message.length > 20000 || (body.service !== undefined && (typeof body.service !== "string" || body.service.length > 150))) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!allowAttempt("contact:" + body.email.toLowerCase(), 3)) return NextResponse.json({ error: "Too many messages. Please wait a minute." }, { status: 429 });
    const settings = getAdminSettings();
    if (settings.google.recaptchaSecretKey) {
      if (typeof body.captchaToken !== "string" || !body.captchaToken) return NextResponse.json({ error: "Complete the security check." }, { status: 400 });
      const verification = await fetch("https://www.google.com/recaptcha/api/siteverify", { method: "POST", body: new URLSearchParams({ secret: settings.google.recaptchaSecretKey, response: body.captchaToken }), signal: AbortSignal.timeout(10000) });
      const result = await verification.json();
      if (!verification.ok || !result.success) return NextResponse.json({ error: "Security check expired or failed. Please try again." }, { status: 400 });
    }
    const contactRequest: ContactRequest = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      service: body.service || "General",
      message: body.message,
      date: new Date().toISOString().split("T")[0],
      status: "new",
      notification: { status: "pending" },
    };

    createContactRequest(contactRequest);
    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

    // Try to send email notification via SMTP (Gmail) if configured
    try {
      const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
      if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
        const transporter = createMailTransport();

        const result = await transporter.sendMail({
          from: SMTP_FROM || `"ResultScale AI" <${SMTP_USER}>`,
          to: process.env.SMTP_TO || "intelligence@resultscaleai.com",
          replyTo: body.email,
          text: `Name: ${body.name}\nEmail: ${body.email}\nService: ${body.service || "General"}\nReference: ${contactRequest.id}\n\n${body.message}`,
          subject: `New Contact Request from ${body.name.replace(/[\r\n]/g, " ")}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Request</h1>
              </div>
              <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name:</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${escapeHtml(body.name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escapeHtml(body.email)}" style="color: #4f46e5;">${escapeHtml(body.email)}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service:</td>
                    <td style="padding: 8px 0; font-size: 14px;">${escapeHtml(body.service || "General")}</td>
                  </tr>
                </table>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;"><strong>Message:</strong></p>
                  <p style="font-size: 14px; line-height: 1.6; color: #374151; background: #f9fafb; padding: 16px; border-radius: 8px;">${escapeHtml(body.message)}</p>
                </div>
              </div>
            </div>
          `,
        });
        updateContactRequest(contactRequest.id, { notification: { status: result.accepted?.length && !result.rejected?.length ? "accepted" : "failed", attemptedAt: new Date().toISOString(), messageId: result.messageId } });
        transporter.close();
      } else {
        updateContactRequest(contactRequest.id, { notification: { status: "not_configured", attemptedAt: new Date().toISOString() } });
      }
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "SMTP_SEND_FAILED";
      updateContactRequest(contactRequest.id, { notification: { status: "failed", attemptedAt: new Date().toISOString(), errorCode: code } });
      console.warn("Contact notification failed", { reference: contactRequest.id, code });
    }

    return NextResponse.json({ success: true, reference: contactRequest.id, message: "Your enquiry has been saved. Thank you for getting in touch." }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 400 });
  }
}

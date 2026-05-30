import { NextRequest, NextResponse } from "next/server";
import { createContactRequest } from "@/lib/store/db";
import { ContactRequest } from "@/types";
import nodemailer from "nodemailer";

// POST /api/contact - Submit a contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const contactRequest: ContactRequest = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      service: body.service || "General",
      message: body.message,
      date: new Date().toISOString().split("T")[0],
      status: "new",
    };

    createContactRequest(contactRequest);

    // Try to send email notification via SMTP (Gmail) if configured
    try {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
      if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT) || 587,
          secure: Number(SMTP_PORT) === 465,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: SMTP_FROM || `"ResultScale AI" <${SMTP_USER}>`,
          to: "intelligence@resultscaleai.com",
          subject: `New Contact Request from ${body.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Request</h1>
              </div>
              <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name:</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${body.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${body.email}" style="color: #4f46e5;">${body.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service:</td>
                    <td style="padding: 8px 0; font-size: 14px;">${body.service || "General"}</td>
                  </tr>
                </table>
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;"><strong>Message:</strong></p>
                  <p style="font-size: 14px; line-height: 1.6; color: #374151; background: #f9fafb; padding: 16px; border-radius: 8px;">${body.message}</p>
                </div>
              </div>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.warn("Email notification failed, but contact was saved locally");
    }

    return NextResponse.json(
      { success: true, message: "Thank you for reaching out. We'll get back to you within 24 hours." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 400 }
    );
  }
}

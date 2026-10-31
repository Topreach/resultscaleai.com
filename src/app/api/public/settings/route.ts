import { NextResponse } from "next/server";
import { getAdminSettings } from "@/lib/store/db";
export async function GET() {
  return NextResponse.json({ recaptchaSiteKey: getAdminSettings().google.recaptchaSiteKey || "" });
}

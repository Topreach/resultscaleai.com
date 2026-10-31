import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getContactRequests } from "@/lib/store/db";

// GET /api/contacts - List all contact requests
export async function GET(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const contacts = getContactRequests();
  return NextResponse.json(contacts);
}

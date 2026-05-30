import { NextResponse } from "next/server";
import { getContactRequests } from "@/lib/store/db";

// GET /api/contacts - List all contact requests
export async function GET() {
  const contacts = getContactRequests();
  return NextResponse.json(contacts);
}

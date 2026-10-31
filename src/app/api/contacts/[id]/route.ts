import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { updateContactRequest } from "@/lib/store/db";

// PATCH /api/contacts/[id] - Update contact request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const body = await request.json();
    if (!["new", "read", "replied"].includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    const updated = updateContactRequest(id, { status: body.status });
    if (!updated) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 400 }
    );
  }
}

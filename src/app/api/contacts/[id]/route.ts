import { NextRequest, NextResponse } from "next/server";
import { updateContactRequest } from "@/lib/store/db";

// PATCH /api/contacts/[id] - Update contact request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = updateContactRequest(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 400 }
    );
  }
}

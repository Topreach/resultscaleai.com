import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { publicUser } from "@/lib/account-auth";
import { getUsers, saveUsers, getAccountSessions, saveAccountSessions } from "@/lib/store/db";
export async function GET(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getUsers().map(publicUser));
}
export async function PATCH(request: NextRequest) {
  if (!getSession(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.active !== "boolean") return NextResponse.json({ error: "Invalid account status" }, { status: 400 });
    const users = getUsers();
    const user = users.find((u) => u.id === body.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    user.active = body.active;
    saveUsers(users);
    if (!user.active) saveAccountSessions(getAccountSessions().filter((s) => s.userId !== user.id));
    return NextResponse.json(publicUser(user));
  } catch { return NextResponse.json({ error: "Could not update account" }, { status: 400 }); }
}

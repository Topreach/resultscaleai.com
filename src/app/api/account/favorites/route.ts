import { NextRequest, NextResponse } from "next/server";
import { accountUser } from "@/lib/account-auth";
import { getApp, getUsers, saveUsers } from "@/lib/store/db";
export async function POST(request: NextRequest) {
  const user = accountUser(request);
  if (!user) return NextResponse.json({ error: "Please sign in to save favorites" }, { status: 401 });
  try {
    const { appId } = await request.json();
    if (typeof appId !== "string" || !getApp(appId)) return NextResponse.json({ error: "App not found" }, { status: 404 });
    const users = getUsers();
    const current = users.find((u) => u.id === user.id)!;
    current.favorites = current.favorites.includes(appId) ? current.favorites.filter((id) => id !== appId) : [...current.favorites, appId];
    saveUsers(users);
    return NextResponse.json({ saved: current.favorites.includes(appId) });
  } catch { return NextResponse.json({ error: "Could not save favorite" }, { status: 400 }); }
}

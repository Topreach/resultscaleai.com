import { NextRequest, NextResponse } from "next/server";
import { accountUser, publicUser } from "@/lib/account-auth";
export async function GET(request: NextRequest) {
  const user = accountUser(request);
  return user ? NextResponse.json({ user: publicUser(user) }) : NextResponse.json({ error: "Please sign in" }, { status: 401 });
}

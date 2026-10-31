import { randomBytes, createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getUsers, getAccountSessions, saveAccountSessions, type AccountUser } from "@/lib/store/db";
import { sameOrigin } from "@/lib/request-security";
const digest = (token: string) => createHash("sha256").update(token).digest("hex");
export function createAccountSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  saveAccountSessions([...getAccountSessions().filter((s) => s.expiresAt > Date.now()), { hash: digest(token), userId, expiresAt: Date.now() + 86_400_000 }]);
  return token;
}
export function accountUser(request: NextRequest) {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && !sameOrigin(request)) return null;
  const token = request.cookies.get("user_token")?.value || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const session = getAccountSessions().find((s) => s.hash === digest(token) && s.expiresAt > Date.now());
  return session ? getUsers().find((u) => u.id === session.userId && u.active) || null : null;
}
export function publicUser(user: AccountUser) {
  return { id: user.id, name: user.name, email: user.email, downloads: user.downloads, favorites: user.favorites, createdAt: user.createdAt, active: user.active };
}
export function logoutAccount(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value || "";
  saveAccountSessions(getAccountSessions().filter((s) => s.hash !== digest(token) && s.expiresAt > Date.now()));
}

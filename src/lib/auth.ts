import { randomBytes, createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getSessions, saveSessions } from "@/lib/store/db";
import { sameOrigin } from "@/lib/request-security";

const digest = (token: string) => createHash("sha256").update(token).digest("hex");
export function createSession(email: string): string {
  const token = randomBytes(32).toString("hex");
  const sessions = getSessions().filter((s) => s.expiresAt > Date.now());
  sessions.push({ hash: digest(token), email, expiresAt: Date.now() + 86_400_000 });
  saveSessions(sessions);
  return token;
}

export function requestToken(request: NextRequest): string {
  return request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    request.headers.get("x-auth-token") || request.cookies.get("admin_token")?.value || "";
}

export function getSession(request: NextRequest) {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && !sameOrigin(request)) return null;
  const token = requestToken(request);
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  return getSessions().find((s) => s.hash === digest(token) && s.expiresAt > Date.now()) || null;
}

export function revokeSession(request: NextRequest) {
  const hash = digest(requestToken(request));
  saveSessions(getSessions().filter((s) => s.hash !== hash && s.expiresAt > Date.now()));
}

export { hashPassword, verifyPassword } from "@/lib/passwords";

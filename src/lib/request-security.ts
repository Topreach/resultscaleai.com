import type { NextRequest } from "next/server";

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Non-browser clients still require valid authentication.
  try {
    return origin === new URL(request.url).origin || origin === new URL(process.env.SITE_URL || request.url).origin;
  } catch { return false; }
}

const attempts = new Map<string, { count: number; until: number }>();
export function allowAttempt(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  if (attempts.size > 5000) for (const [id, value] of attempts) if (value.until < now) attempts.delete(id);
  const entry = attempts.get(key);
  if (!entry || entry.until < now) {
    if (attempts.size > 10000) return false;
    attempts.set(key, { count: 1, until: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}

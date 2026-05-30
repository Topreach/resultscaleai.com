import { NextRequest, NextResponse } from "next/server";
import { mkdir, unlink } from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";

export const maxDuration = 300;

// Simple in-memory rate limiter: { [ip]: { count, resetAt } }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3; // max uploads per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// APK magic bytes: PK\x03\x04 (ZIP format)
const APK_MAGIC_BYTES = [0x50, 0x4b, 0x03, 0x04];

function validateApkMagicBytes(buffer: Uint8Array): boolean {
  if (buffer.length < 4) return false;
  return (
    buffer[0] === APK_MAGIC_BYTES[0] &&
    buffer[1] === APK_MAGIC_BYTES[1] &&
    buffer[2] === APK_MAGIC_BYTES[2] &&
    buffer[3] === APK_MAGIC_BYTES[3]
  );
}

function isAuthenticated(request: NextRequest): boolean {
  // Check cookie auth (same-domain requests via Cloudflare)
  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken) {
    try {
      const decoded = JSON.parse(Buffer.from(cookieToken, "base64").toString("utf-8"));
      if (decoded.exp > Date.now()) return true;
    } catch {
      // Invalid cookie token, fall through to header check
    }
  }

  // Check Authorization header (cross-domain requests to uploads subdomain)
  const authHeader = request.headers.get("Authorization") || request.headers.get("x-auth-token");
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  }

  return false;
}

// CORS headers for cross-origin requests from resultscaleai.com to uploads.resultscaleai.com
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://resultscaleai.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-auth-token, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // P0: Authentication check
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    // P2: Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait before uploading again." },
        { status: 429, headers: corsHeaders }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400, headers: corsHeaders });
    }

    // P2: Validate file extension
    if (!file.name.endsWith(".apk")) {
      return NextResponse.json({ error: "Only .apk files are allowed" }, { status: 400, headers: corsHeaders });
    }

    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 500MB" }, { status: 400, headers: corsHeaders });
    }

    // P2: Validate APK magic bytes (PK\x03\x04)
    const magicSlice = file.slice(0, 4);
    const magicBytes = new Uint8Array(await magicSlice.arrayBuffer());
    if (!validateApkMagicBytes(magicBytes)) {
      return NextResponse.json(
        { error: "Invalid file format. Only valid APK files are accepted." },
        { status: 400, headers: corsHeaders }
      );
    }

    const apksDir = path.join(process.cwd(), "public", "apks");
    await mkdir(apksDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const filepath = path.join(apksDir, filename);

    // P0: Stream file to disk using ReadableStream (no full memory load)
    const reader = file.stream().getReader();
    const writeStream = createWriteStream(filepath);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        writeStream.write(Buffer.from(value));
      }
    } finally {
      writeStream.end();
      reader.releaseLock();
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const url = `/apks/${filename}`;

    return NextResponse.json({
      url,
      filename: file.name,
      size: file.size,
      complete: true,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500, headers: corsHeaders });
  }
}

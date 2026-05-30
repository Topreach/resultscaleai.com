import { NextRequest, NextResponse } from "next/server";
import { mkdir, unlink, readdir, readFile, writeFile, rename } from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import path from "path";

export const maxDuration = 300;

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk

// In-memory upload sessions: { [uploadId]: UploadSession }
interface UploadSession {
  filename: string;
  totalSize: number;
  totalChunks: number;
  receivedChunks: Set<number>;
  tempDir: string;
  createdAt: number;
}
const uploadSessions = new Map<string, UploadSession>();

// Simple in-memory rate limiter: { [ip]: { count, resetAt } }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;

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
  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken) {
    try {
      const decoded = JSON.parse(Buffer.from(cookieToken, "base64").toString("utf-8"));
      if (decoded.exp > Date.now()) return true;
    } catch {
      // fall through
    }
  }
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

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://resultscaleai.com",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-auth-token, Authorization, x-upload-action",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Cleanup stale temp dirs older than 24 hours
async function cleanupStaleSessions(): Promise<void> {
  const now = Date.now();
  const expiryMs = 24 * 60 * 60 * 1000;
  for (const [id, session] of uploadSessions.entries()) {
    if (now - session.createdAt > expiryMs) {
      try {
        const files = await readdir(session.tempDir);
        await Promise.all(files.map((f) => unlink(path.join(session.tempDir, f)).catch(() => {})));
        await unlink(session.tempDir).catch(() => {});
      } catch {}
      uploadSessions.delete(id);
    }
  }
}

// ─── POST /api/upload/apk/init ──────────────────────────────────────────────
// Initialize a chunked upload session
async function handleInit(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { filename, totalSize, totalChunks } = body;

    if (!filename || !totalSize || !totalChunks) {
      return NextResponse.json({ error: "Missing required fields: filename, totalSize, totalChunks" }, { status: 400, headers: corsHeaders });
    }

    if (!filename.endsWith(".apk")) {
      return NextResponse.json({ error: "Only .apk files are allowed" }, { status: 400, headers: corsHeaders });
    }

    const maxSize = 500 * 1024 * 1024;
    if (totalSize > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 500MB" }, { status: 400, headers: corsHeaders });
    }

    const uploadId = crypto.randomUUID();
    const tempDir = path.join(process.cwd(), ".upload-cache", uploadId);
    await mkdir(tempDir, { recursive: true });

    const session: UploadSession = {
      filename,
      totalSize,
      totalChunks,
      receivedChunks: new Set(),
      tempDir,
      createdAt: Date.now(),
    };
    uploadSessions.set(uploadId, session);

    // Check if any chunks already exist (for resume after server restart)
    try {
      const existingFiles = await readdir(tempDir);
      for (const f of existingFiles) {
        const idx = parseInt(f.replace(".part", ""), 10);
        if (!isNaN(idx)) session.receivedChunks.add(idx);
      }
    } catch {}

    // Cleanup stale sessions in background
    cleanupStaleSessions().catch(() => {});

    return NextResponse.json({
      uploadId,
      totalChunks,
      receivedChunks: Array.from(session.receivedChunks).sort((a, b) => a - b),
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json({ error: "Failed to initialize upload" }, { status: 500, headers: corsHeaders });
  }
}

// ─── POST /api/upload/apk/chunk ─────────────────────────────────────────────
// Upload a single chunk
async function handleChunk(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const uploadId = formData.get("uploadId") as string;
    const chunkIndexStr = formData.get("chunkIndex") as string;
    const chunkFile = formData.get("chunk") as File | null;

    if (!uploadId || chunkIndexStr === null || !chunkFile) {
      return NextResponse.json({ error: "Missing required fields: uploadId, chunkIndex, chunk" }, { status: 400, headers: corsHeaders });
    }

    const chunkIndex = parseInt(chunkIndexStr, 10);
    if (isNaN(chunkIndex) || chunkIndex < 0) {
      return NextResponse.json({ error: "Invalid chunkIndex" }, { status: 400, headers: corsHeaders });
    }

    const session = uploadSessions.get(uploadId);
    if (!session) {
      return NextResponse.json({ error: "Upload session not found or expired" }, { status: 404, headers: corsHeaders });
    }

    // Validate APK magic bytes on first chunk
    if (chunkIndex === 0) {
      const magicSlice = chunkFile.slice(0, 4);
      const magicBytes = new Uint8Array(await magicSlice.arrayBuffer());
      if (!validateApkMagicBytes(magicBytes)) {
        return NextResponse.json(
          { error: "Invalid file format. Only valid APK files are accepted." },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Write chunk to temp dir
    const chunkPath = path.join(session.tempDir, `${chunkIndex}.part`);
    const buffer = Buffer.from(await chunkFile.arrayBuffer());
    await writeFile(chunkPath, buffer);

    session.receivedChunks.add(chunkIndex);

    return NextResponse.json({
      chunkIndex,
      received: true,
      progress: Math.round((session.receivedChunks.size / session.totalChunks) * 100),
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Chunk error:", error);
    return NextResponse.json({ error: "Failed to upload chunk" }, { status: 500, headers: corsHeaders });
  }
}

// ─── GET /api/upload/apk/status ─────────────────────────────────────────────
// Check upload status (for resume)
async function handleStatus(request: NextRequest): Promise<NextResponse> {
  try {
    const uploadId = request.nextUrl.searchParams.get("uploadId");
    if (!uploadId) {
      return NextResponse.json({ error: "Missing uploadId" }, { status: 400, headers: corsHeaders });
    }

    const session = uploadSessions.get(uploadId);
    if (!session) {
      return NextResponse.json({ error: "Upload session not found or expired" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({
      uploadId,
      filename: session.filename,
      totalSize: session.totalSize,
      totalChunks: session.totalChunks,
      receivedChunks: Array.from(session.receivedChunks).sort((a, b) => a - b),
      complete: session.receivedChunks.size === session.totalChunks,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Status error:", error);
    return NextResponse.json({ error: "Failed to get upload status" }, { status: 500, headers: corsHeaders });
  }
}

// ─── POST /api/upload/apk/complete ──────────────────────────────────────────
// Assemble all chunks into final file
async function handleComplete(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { uploadId } = body;

    if (!uploadId) {
      return NextResponse.json({ error: "Missing uploadId" }, { status: 400, headers: corsHeaders });
    }

    const session = uploadSessions.get(uploadId);
    if (!session) {
      return NextResponse.json({ error: "Upload session not found or expired" }, { status: 404, headers: corsHeaders });
    }

    if (session.receivedChunks.size !== session.totalChunks) {
      return NextResponse.json({
        error: `Not all chunks received. Got ${session.receivedChunks.size}/${session.totalChunks}`,
      }, { status: 400, headers: corsHeaders });
    }

    // Assemble chunks in order
    const apksDir = path.join(process.cwd(), "public", "apks");
    await mkdir(apksDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = session.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const finalFilename = `${timestamp}-${safeName}`;
    const finalPath = path.join(apksDir, finalFilename);

    // Concatenate all chunks
    const writeStream = createWriteStream(finalPath);
    try {
      for (let i = 0; i < session.totalChunks; i++) {
        const chunkPath = path.join(session.tempDir, `${i}.part`);
        const chunkData = await readFile(chunkPath);
        writeStream.write(chunkData);
      }
    } finally {
      writeStream.end();
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Cleanup temp files
    try {
      const files = await readdir(session.tempDir);
      await Promise.all(files.map((f) => unlink(path.join(session.tempDir, f)).catch(() => {})));
      await unlink(session.tempDir).catch(() => {});
    } catch {}

    uploadSessions.delete(uploadId);

    // Return full URL pointing to the uploads server where the file physically lives
    const url = `https://uploads.resultscaleai.com/apks/${finalFilename}`;

    return NextResponse.json({
      url,
      filename: session.filename,
      size: session.totalSize,
      complete: true,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Complete error:", error);
    return NextResponse.json({ error: "Failed to complete upload" }, { status: 500, headers: corsHeaders });
  }
}

// ─── Main POST handler ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  // Authentication check for all POST operations
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  // Route based on x-upload-action header exclusively
  // Client sends: "init", "chunk", or "complete"
  const action = request.headers.get("x-upload-action") || "";

  switch (action) {
    case "init":
      return handleInit(request);
    case "chunk":
      return handleChunk(request);
    case "complete":
      return handleComplete(request);
    default:
      return NextResponse.json(
        { error: "Unknown upload action. Use x-upload-action header: init, chunk, or complete" },
        { status: 400, headers: corsHeaders }
      );
  }
}

// ─── GET handler (for status checks) ────────────────────────────────────────
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }
  return handleStatus(request);
}

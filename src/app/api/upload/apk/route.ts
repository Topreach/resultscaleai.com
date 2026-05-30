import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, unlink, rename } from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import path from "path";

export const maxDuration = 300; // 5 minutes timeout for large uploads

// Chunked upload: first request initializes, subsequent requests append chunks
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const chunkIndex = formData.get("chunkIndex") as string | null;
    const totalChunks = formData.get("totalChunks") as string | null;
    const originalName = formData.get("originalName") as string | null;
    const uploadId = formData.get("uploadId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (only on first chunk or single upload)
    if (!file.name.endsWith(".apk") && !originalName?.endsWith(".apk")) {
      return NextResponse.json({ error: "Only .apk files are allowed" }, { status: 400 });
    }

    // Create apks directory
    const apksDir = path.join(process.cwd(), "public", "apks");
    await mkdir(apksDir, { recursive: true });

    // === CHUNKED UPLOAD ===
    if (chunkIndex !== null && totalChunks !== null && uploadId) {
      const ci = parseInt(chunkIndex, 10);
      const tc = parseInt(totalChunks, 10);
      const chunkDir = path.join(apksDir, ".chunks", uploadId);
      await mkdir(chunkDir, { recursive: true });

      // Write chunk to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const chunkPath = path.join(chunkDir, `chunk-${String(ci).padStart(6, "0")}`);
      await writeFile(chunkPath, buffer);

      // If this is the last chunk, merge all chunks into final file
      if (ci === tc - 1) {
        const safeName = (originalName || file.name).replace(/[^a-zA-Z0-9._-]/g, "_");
        const timestamp = Date.now();
        const filename = `${timestamp}-${safeName}`;
        const filepath = path.join(apksDir, filename);

        // Merge chunks in order
        const writeStream = createWriteStream(filepath);
        for (let i = 0; i < tc; i++) {
          const chunkPath = path.join(chunkDir, `chunk-${String(i).padStart(6, "0")}`);
          const { readFileSync } = await import("fs");
          writeStream.write(readFileSync(chunkPath));
        }
        writeStream.end();

        await new Promise<void>((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });

        // Clean up chunk directory
        const { rmSync } = await import("fs");
        rmSync(chunkDir, { recursive: true, force: true });

        const url = `/apks/${filename}`;
        return NextResponse.json({ url, filename: safeName, size: 0, complete: true });
      }

      return NextResponse.json({ chunkIndex: ci, totalChunks: tc, received: true });
    }

    // === SINGLE (NON-CHUNKED) UPLOAD ===
    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 500MB" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const filepath = path.join(apksDir, filename);

    // Write file using stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const writeStream = createWriteStream(filepath);
    writeStream.write(buffer);
    writeStream.end();

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
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}

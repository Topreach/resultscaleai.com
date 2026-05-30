"use server";

import { mkdir } from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";

export async function uploadApk(formData: FormData): Promise<{ url: string; filename: string; size: number }> {
  const file = formData.get("file") as File | null;

  if (!file) {
    throw new Error("No file provided");
  }

  if (!file.name.endsWith(".apk")) {
    throw new Error("Only .apk files are allowed");
  }

  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 500MB");
  }

  const apksDir = path.join(process.cwd(), "public", "apks");
  await mkdir(apksDir, { recursive: true });

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${timestamp}-${safeName}`;
  const filepath = path.join(apksDir, filename);

  // Stream file to disk
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const writeStream = createWriteStream(filepath);
  writeStream.write(buffer);
  writeStream.end();

  await new Promise<void>((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  return {
    url: `/apks/${filename}`,
    filename: file.name,
    size: file.size,
  };
}

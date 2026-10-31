import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { localApkPath } from "@/lib/apk-storage";

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const target = localApkPath(`/apks/${filename}`);
  if (!target) return new Response("File not found", { status: 404 });
  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("File not found", { status: 404 });
    return new Response(Readable.toWeb(createReadStream(target)) as ReadableStream, { headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Length": String(info.size),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    } });
  } catch { return new Response("File not found", { status: 404 }); }
}

import path from "node:path";
import { unlink } from "node:fs/promises";

export function localApkPath(value: string): string | null {
  // Only local paths belong to this server. Remote upload hosts own their cleanup.
  if (!/^\/apks\/[a-zA-Z0-9_-][a-zA-Z0-9._-]*\.apk$/.test(value)) return null;
  return path.join(process.cwd(), "public", "apks", value.slice(6));
}

export async function removeLocalApk(value: string) {
  const target = localApkPath(value);
  if (!target) return;
  try { await unlink(target); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

"use client";
import Image from "next/image";
import { useState } from "react";
import { usableImageSource } from "@/lib/visuals";

export default function AppIcon({ icon, name }: { icon?: string; name: string }) {
  const source = usableImageSource(icon);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!source || failedSource === source) return <span aria-hidden="true">{source ? name.charAt(0) : icon || name.charAt(0)}</span>;
  return <span className="relative block w-full h-full overflow-hidden rounded-[inherit]">
    <Image src={source} alt={`${name} icon`} fill sizes="96px" className="object-contain" unoptimized={source.startsWith("https://")} onError={() => setFailedSource(source)} />
  </span>;
}

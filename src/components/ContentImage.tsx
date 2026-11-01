"use client";

import Image from "next/image";
import { useState } from "react";
import { usableImageSource } from "@/lib/visuals";

export default function ContentImage({ src, fallback, alt, className = "", sizes = "(max-width: 768px) 100vw, 50vw", fallbackLabel, preload = false, contain = false }: {
  src?: string;
  fallback: string;
  alt: string;
  className?: string;
  sizes?: string;
  fallbackLabel?: string;
  preload?: boolean;
  contain?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = usableImageSource(src);
  const useFallback = !source || failedSource === source;
  const displayedSource = useFallback ? fallback : source;
  return (
    <figure className={`relative overflow-hidden bg-[#080e1b] ${className}`}>
      <Image src={displayedSource} alt={useFallback && fallbackLabel ? fallbackLabel : alt} fill
        sizes={sizes} preload={preload} unoptimized={displayedSource.startsWith("https://")}
        className={contain && !useFallback ? "object-contain" : "object-cover"}
        onError={() => { if (!useFallback) setFailedSource(source); }} />
      {useFallback && fallbackLabel && <figcaption className="absolute bottom-0 inset-x-0 bg-slate-950/85 px-4 py-2 text-xs text-slate-200">{fallbackLabel}</figcaption>}
    </figure>
  );
}

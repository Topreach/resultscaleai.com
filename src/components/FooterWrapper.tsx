"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}

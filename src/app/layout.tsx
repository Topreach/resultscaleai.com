import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResultScale AI - Building Intelligent Software Solutions",
  description:
    "ResultScale AI builds intelligent software solutions including mobile apps, web applications, AI chatbots, and cybersecurity services for businesses and individuals.",
  keywords: [
    "software development",
    "mobile apps",
    "AI",
    "cybersecurity",
    "web development",
    "APK download",
    "ResultScale AI",
  ],
  openGraph: {
    title: "ResultScale AI - Building Intelligent Software Solutions",
    description:
      "Professional software development, AI solutions, and cybersecurity services.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <FooterWrapper />
      </body>
    </html>
  );
}

// Client component to conditionally hide footer on admin pages
import { FooterWrapper } from "@/components/FooterWrapper";

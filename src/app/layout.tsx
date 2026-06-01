import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAdminSettings } from "@/lib/store/db";

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
  // Load Google configuration for SEO/analytics scripts
  let googleVerification = "";
  let analyticsId = "";
  let tagManagerId = "";
  try {
    const settings = getAdminSettings();
    googleVerification = settings.google?.searchConsoleVerification || "";
    analyticsId = settings.google?.analyticsMeasurementId || "";
    tagManagerId = settings.google?.tagManagerId || "";
  } catch {
    // Settings file may not exist yet
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Search Console Verification */}
        {googleVerification && (
          <meta
            name="google-site-verification"
            content={googleVerification}
          />
        )}

        {/* Google Analytics (gtag.js) */}
        {analyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${analyticsId}');
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager */}
        {tagManagerId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${tagManagerId}');
              `,
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) */}
        {tagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${tagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Navbar />
        <main className="flex-1">{children}</main>
        <FooterWrapper />
      </body>
    </html>
  );
}

// Client component to conditionally hide footer on admin pages
import { FooterWrapper } from "@/components/FooterWrapper";

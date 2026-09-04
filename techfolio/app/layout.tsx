import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cjyfz.dpdns.org"),
  title: "Jason Chen | Electronic Engineer",
  description:
    "I turn ideas into real-world products through hardware, software, AI, and robotics.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Jason Chen | Electronic Engineer",
    description:
      "I turn ideas into real-world products through hardware, software, AI, and robotics.",
    siteName: "Jason Chen Portfolio",
    type: "website",
    url: "https://cjyfz.dpdns.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Chen | Electronic Engineer",
    description:
      "I turn ideas into real-world products through hardware, software, AI, and robotics.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F1E8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen overflow-x-hidden bg-[#F7F1E8]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

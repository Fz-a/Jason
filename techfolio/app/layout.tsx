import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

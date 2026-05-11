import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jyothilal Reji — Independent App Developer | Creator of Delulu",
  description:
    "Jyothilal Reji is an independent mobile app developer from Kerala, India. Creator of Delulu — a modern dating app built with Flutter featuring AI face detection, real-time chat, and location-based discovery.",
  keywords: [
    "Jyothilal Reji",
    "Delulu",
    "dating app",
    "Flutter developer",
    "mobile app developer",
    "independent developer",
    "Kerala",
    "India",
    "Android app",
    "iOS app",
  ],
  authors: [{ name: "Jyothilal Reji" }],
  openGraph: {
    title: "Jyothilal Reji — Independent App Developer",
    description:
      "Creator of Delulu — a modern dating app built with Flutter. AI-powered face detection, real-time chat, and location-based discovery.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jyothilal Reji — Independent App Developer",
    description:
      "Creator of Delulu — a modern dating app built with Flutter.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

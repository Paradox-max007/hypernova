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
  title: "DevStudio — Independent Mobile App Developer",
  description:
    "DevStudio is an independent mobile app developer building thoughtful, well-crafted applications for Android. Quality apps, privacy-first design.",
  keywords: [
    "DevStudio",
    "mobile app developer",
    "Android apps",
    "independent developer",
    "app studio",
  ],
  authors: [{ name: "DevStudio" }],
  openGraph: {
    title: "DevStudio — Independent Mobile App Developer",
    description:
      "Building thoughtful, well-crafted mobile applications that make everyday life a little easier.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevStudio — Independent Mobile App Developer",
    description:
      "Building thoughtful, well-crafted mobile applications that make everyday life a little easier.",
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

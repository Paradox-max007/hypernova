import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jyothilal Reji — Full Stack Developer · Data Science · Machine Learning",
  description:
    "I build digital products, intelligent systems and experiences people actually want to use. Full Stack Developer · Data Science · Machine Learning — based in Kerala, India, working with clients worldwide.",
  keywords: [
    "Jyothilal Reji",
    "Full Stack Developer",
    "Data Science",
    "Machine Learning",
    "React",
    "TypeScript",
    "Supabase",
    "Python",
    "Portfolio",
    "Kerala",
  ],
  authors: [{ name: "Jyothilal Reji" }],
  creator: "Jyothilal Reji",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Jyothilal Reji — Digital Portfolio",
    description:
      "Full Stack Developer · Data Science · Machine Learning. Explore interactive case studies — a live UAE production platform, realtime multiplayer systems and full-stack builds.",
    siteName: "Jyothilal Reji — Digital Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jyothilal Reji — Digital Portfolio",
    description:
      "Full Stack Developer · Data Science · Machine Learning. Live production platforms, realtime systems, interactive experiences.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1512" },
    { media: "(prefers-color-scheme: light)", color: "#f4f7f5" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

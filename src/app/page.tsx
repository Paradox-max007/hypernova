"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Shield,
  Menu,
  X,
  ExternalLink,
  Github,
  User,
  Sparkles,
  MessageCircle,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "My App", href: "#app" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Contact", href: "#contact" },
];

const DELULU_FEATURES = [
  {
    icon: <User className="h-5 w-5" />,
    title: "Smart Profiles",
    description:
      "AI-powered face detection for authentic profile verification and photo matching.",
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "Real-Time Chat",
    description:
      "Instant messaging with encrypted conversations, voice messages, and media sharing.",
  },
  {
    icon: <Map className="h-5 w-5" />,
    title: "Discover Nearby",
    description:
      "Location-based discovery with interactive maps to find people around you.",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Beautiful Experience",
    description:
      "Smooth animations, custom typography, and a polished UI built with Flutter.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Privacy First",
    description:
      "End-to-end encrypted messaging and secure data handling you can trust.",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Premium Features",
    description:
      "Unlock extra perks and enhanced matching with affordable in-app purchases.",
  },
];

function fadeUp(delay: number = 0) {
  return {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  };
}

function staggerContainer() {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ───── Navigation ───── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2 font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              JR
            </div>
            <span>Jyothilal Reji</span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === link.href.slice(1)
                      ? "bg-secondary text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background"
          >
            <ul className="flex flex-col py-2 px-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className={`block w-full text-left px-3 py-2.5 text-sm rounded-md transition-colors ${
                      activeSection === link.href.slice(1)
                        ? "bg-secondary text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </header>

      {/* ───── Main Content ───── */}
      <main className="flex-1">
        {/* ─── Hero Section ─── */}
        <section
          id="home"
          className="relative overflow-hidden border-b border-border/40"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/60 via-background to-secondary/30" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer()}
            className="mx-auto max-w-5xl px-4 sm:px-6 py-24 sm:py-32 text-center"
          >
            <motion.div variants={fadeUp(0)} className="mb-6">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                <Heart className="h-3.5 w-3.5 mr-1.5 text-rose-500" />
                Independent App Developer
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.1)}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
            >
              Jyothilal Reji
            </motion.h1>

            <motion.p
              variants={fadeUp(0.15)}
              className="mt-2 text-lg text-muted-foreground"
            >
              Mobile App Developer &middot; Kerala, India
            </motion.p>

            <motion.p
              variants={fadeUp(0.2)}
              className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Building apps as a passion project — crafting thoughtful mobile
              experiences with Flutter, one idea at a time.
            </motion.p>

            <motion.div
              variants={fadeUp(0.3)}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button size="lg" onClick={() => scrollTo("#app")}>
                <Heart className="h-4 w-4 mr-2" />
                Explore Delulu
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo("#contact")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Get In Touch
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* ─── About Section ─── */}
        <section id="about" className="scroll-mt-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer()}
            className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-24"
          >
            <motion.div variants={fadeUp(0)} className="text-center mb-12">
              <Badge variant="outline" className="mb-3">
                About Me
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The Developer Behind Delulu
              </h2>
            </motion.div>

            <motion.div variants={fadeUp(0.1)} className="max-w-2xl mx-auto">
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  {/* Avatar placeholder */}
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 text-3xl">
                    🧑‍💻
                  </div>

                  <h3 className="text-xl font-semibold">Jyothilal Reji</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Solo Developer &middot; Flutter Enthusiast
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      Kerala, India
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      jyothilalreji007@gmail.com
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      +91 9747390243
                    </span>
                  </div>

                  <Separator className="my-5" />

                  <div className="text-sm text-muted-foreground leading-relaxed text-left space-y-3">
                    <p>
                      Hi, I&apos;m Jyothilal — a passionate independent developer
                      based in Kerala, India. I build mobile apps as a personal
                      passion project, learning and experimenting with new
                      technologies along the way.
                    </p>
                    <p>
                      <strong className="text-foreground">Delulu</strong> is my
                      first published app — a dating application built from the
                      ground up with Flutter. It features AI-powered face
                      detection for profile verification, real-time messaging,
                      location-based discovery, and much more.
                    </p>
                    <p>
                      I believe in clean code, thoughtful design, and building
                      things that genuinely make a difference in people&apos;s
                      lives — even if it starts as a hobby.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Values */}
            <div className="grid gap-6 sm:grid-cols-3 mt-12">
              {[
                {
                  icon: <Heart className="h-6 w-6 text-rose-500" />,
                  title: "Passion Driven",
                  text: "Every line of code comes from genuine curiosity and a love for building great apps.",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Privacy First",
                  text: "Your data is yours. End-to-end encryption and minimal data collection are non-negotiable.",
                },
                {
                  icon: <User className="h-6 w-6" />,
                  title: "User Centric",
                  text: "Designed with real people in mind — intuitive, accessible, and delightful to use.",
                },
              ].map((item, i) => (
                <motion.div key={item.title} variants={fadeUp(i * 0.1)}>
                  <Card className="h-full border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {item.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <Separator className="mx-auto max-w-5xl" />

        {/* ─── App Section ─── */}
        <section id="app" className="scroll-mt-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer()}
            className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-24"
          >
            <motion.div variants={fadeUp(0)} className="text-center mb-12">
              <Badge variant="outline" className="mb-3">
                My App
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Delulu
              </h2>
              <p className="mt-2 text-lg text-muted-foreground italic">
                &ldquo;Obsidian Dream&rdquo;
              </p>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                A modern dating app built with Flutter — featuring AI-powered
                face detection, real-time chat, and location-based discovery.
              </p>
            </motion.div>

            {/* Main app card */}
            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* App icon + info */}
                    <div className="flex-shrink-0 text-center md:text-left">
                      <div className="mx-auto md:mx-0 mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-400 to-pink-600 text-5xl shadow-lg shadow-rose-200">
                        💕
                      </div>
                      <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0">
                        Dating &amp; Social
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Built with Flutter
                      </p>
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">Delulu</h3>
                      <p className="text-sm text-muted-foreground italic mb-3">
                        Obsidian Dream
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Delulu is a feature-rich dating application that
                        reimagines how people connect. With AI-powered face
                        verification for authentic profiles, real-time encrypted
                        messaging, location-based discovery with interactive
                        maps, and beautifully crafted animations — Delulu offers
                        a premium dating experience built entirely with Flutter
                        and Dart.
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button size="sm" className="gap-1.5">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                          >
                            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.396 13l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z" />
                          </svg>
                          Google Play
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                          App Store
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="gap-1.5"
                        >
                          <a
                            href="https://github.com/JYOTHILALREJI/Delulu"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            Source Code
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features grid */}
            <motion.div variants={fadeUp(0.2)} className="mt-12">
              <h3 className="text-lg font-semibold text-center mb-6">
                Key Features
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {DELULU_FEATURES.map((feature, i) => (
                  <motion.div key={feature.title} variants={fadeUp(i * 0.05)}>
                    <Card className="h-full border-border/50 hover:border-border transition-all duration-300">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">
                              {feature.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        <Separator className="mx-auto max-w-5xl" />

        {/* ─── Privacy Policy Section ─── */}
        <section id="privacy" className="scroll-mt-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer()}
            className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-24"
          >
            <motion.div variants={fadeUp(0)} className="text-center mb-12">
              <Badge variant="outline" className="mb-3">
                <Shield className="h-3.5 w-3.5 mr-1.5" />
                Legal
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Privacy Policy
              </h2>
              <p className="mt-3 text-muted-foreground">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>

            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-border/50">
                <CardContent className="pt-6 prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:first:mt-0 [&_p]:mb-3">
                  <h3>Introduction</h3>
                  <p>
                    I (&ldquo;Jyothilal Reji&rdquo;, the developer of Delulu)
                    respect your privacy and am committed to protecting your
                    personal data. This privacy policy explains how I handle
                    information when you use the Delulu mobile application.
                  </p>

                  <h3>Information We Collect</h3>
                  <p>
                    Delulu is designed to collect the minimum amount of data
                    necessary to provide its services. Depending on features you
                    use, we may collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>
                      <strong className="text-foreground">
                        Profile information:
                      </strong>{" "}
                      Photos, name, and bio that you voluntarily provide.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Location data:
                      </strong>{" "}
                      Approximate location for discovering nearby users (with your
                      explicit permission).
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Device information:
                      </strong>{" "}
                      Device model, OS version for compatibility and crash
                      reporting.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Chat messages:
                      </strong>{" "}
                      Messages are end-to-end encrypted and are not accessible to
                      the developer.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Face detection data:
                      </strong>{" "}
                      On-device processing only — face detection runs locally and
                      images are not stored on any server.
                    </li>
                  </ul>

                  <h3>Data Storage &amp; Security</h3>
                  <p>
                    Your data is stored securely on cloud infrastructure. Messages
                    are end-to-end encrypted — meaning only you and the recipient
                    can read them. Face detection is performed entirely on-device
                    using Google ML Kit, and your photos are never uploaded to any
                    third-party server for analysis. We use industry-standard
                    encryption for data in transit and at rest.
                  </p>

                  <h3>Data Sharing</h3>
                  <p>
                    We do not sell, trade, or rent your personal data to third
                    parties. Your information is only shared with service
                    providers necessary to operate the app (e.g., cloud hosting,
                    push notification services) and only to the extent required.
                  </p>

                  <h3>Your Rights</h3>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Access the personal data we hold about you.</li>
                    <li>Request correction of inaccurate data.</li>
                    <li>Request deletion of your account and associated data.</li>
                    <li>Withdraw consent for data processing at any time.</li>
                    <li>
                      Export your data in a portable format.
                    </li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact me at{" "}
                    <a
                      href="mailto:jyothilalreji007@gmail.com"
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      jyothilalreji007@gmail.com
                    </a>
                    .
                  </p>

                  <h3>Children&apos;s Privacy</h3>
                  <p>
                    Delulu is not intended for users under 18 years of age. We do
                    not knowingly collect personal data from minors. If we become
                    aware that we have collected data from a child under 18, we
                    will take steps to delete that information promptly.
                  </p>

                  <h3>Third-Party Services</h3>
                  <p>
                    Delulu may use the following third-party services:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>
                      <strong className="text-foreground">
                        Google Play Services:
                      </strong>{" "}
                      For analytics, crash reporting, and in-app billing.
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Google ML Kit:
                      </strong>{" "}
                      For on-device face detection (no data leaves your device).
                    </li>
                    <li>
                      <strong className="text-foreground">
                        Google Maps SDK:
                      </strong>{" "}
                      For location-based features (location data is shared only
                      with your explicit permission).
                    </li>
                  </ul>

                  <h3>Changes to This Policy</h3>
                  <p>
                    I may update this privacy policy from time to time. Changes
                    will be posted on this page with an updated revision date.
                    Continued use of Delulu after changes constitutes acceptance
                    of the updated policy.
                  </p>

                  <h3>Contact</h3>
                  <p>
                    If you have any questions or concerns about this privacy
                    policy or Delulu&apos;s data practices, please contact me at:
                  </p>
                  <ul className="list-none pl-0 space-y-1 mb-3">
                    <li>
                      <strong className="text-foreground">Email:</strong>{" "}
                      <a
                        href="mailto:jyothilalreji007@gmail.com"
                        className="text-primary underline underline-offset-2 hover:text-primary/80"
                      >
                        jyothilalreji007@gmail.com
                      </a>
                    </li>
                    <li>
                      <strong className="text-foreground">Phone:</strong>{" "}
                      +91 9747390243
                    </li>
                    <li>
                      <strong className="text-foreground">Location:</strong>{" "}
                      Kerala, India
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ───── Footer ───── */}
      <footer id="contact" className="scroll-mt-16 border-t border-border/40 bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  JR
                </div>
                Jyothilal Reji
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Independent mobile app developer from Kerala, India. Building
                Delulu — a modern dating app built with Flutter.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Contact</h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="mailto:jyothilalreji007@gmail.com"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    jyothilalreji007@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919747390243"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    +91 9747390243
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Kerala, India
                  </span>
                </li>
                <li>
                  <a
                    href="https://github.com/JYOTHILALREJI/Delulu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Jyothilal Reji. All rights
              reserved.
            </p>
            <p>Built with passion in Kerala, India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

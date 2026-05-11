"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Mail,
  Globe,
  Shield,
  Menu,
  X,
  ExternalLink,
  Download,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Apps", href: "#apps" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Contact", href: "#contact" },
];

const APPS = [
  {
    title: "FocusFlow",
    description:
      "A minimalist productivity timer that helps you stay focused and manage your work sessions with the Pomodoro technique.",
    category: "Productivity",
    icon: "⏱️",
    rating: 4.7,
    downloads: "10K+",
  },
  {
    title: "PocketBudget",
    description:
      "A simple and intuitive expense tracker that helps you manage your finances and reach your savings goals.",
    category: "Finance",
    icon: "💰",
    rating: 4.5,
    downloads: "5K+",
  },
  {
    title: "NightLens",
    description:
      "A camera app optimized for low-light photography with AI-powered noise reduction and scene enhancement.",
    category: "Photography",
    icon: "📸",
    rating: 4.3,
    downloads: "2K+",
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
      transition: { staggerChildren: 0.15 },
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
              D
            </div>
            <span>DevStudio</span>
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
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
          {/* Subtle background gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary/60 via-background to-secondary/30" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer()}
            className="mx-auto max-w-5xl px-4 sm:px-6 py-24 sm:py-32 text-center"
          >
            <motion.div variants={fadeUp(0)} className="mb-6">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                Independent App Developer
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.1)}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground"
            >
              DevStudio
            </motion.h1>

            <motion.p
              variants={fadeUp(0.2)}
              className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Building thoughtful, well-crafted mobile applications that make
              everyday life a little easier and more enjoyable.
            </motion.p>

            <motion.div
              variants={fadeUp(0.3)}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button size="lg" onClick={() => scrollTo("#apps")}>
                <Smartphone className="h-4 w-4 mr-2" />
                View Our Apps
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
                About Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Who We Are
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                A small independent studio passionate about creating useful and
                beautifully designed mobile experiences.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: <Smartphone className="h-6 w-6" />,
                  title: "Quality First",
                  text: "Every app is built with attention to detail, clean code, and a focus on user experience.",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Privacy Focused",
                  text: "We respect your data. Minimal permissions, transparent policies, no hidden tracking.",
                },
                {
                  icon: <Star className="h-6 w-6" />,
                  title: "User Driven",
                  text: "Regular updates based on community feedback. Your experience matters to us.",
                },
              ].map((item, i) => (
                <motion.div key={item.title} variants={fadeUp(i * 0.1)}>
                  <Card className="h-full border-border/50 hover:border-border hover:shadow-md transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
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

        {/* ─── Apps Section ─── */}
        <section id="apps" className="scroll-mt-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer()}
            className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-24"
          >
            <motion.div variants={fadeUp(0)} className="text-center mb-12">
              <Badge variant="outline" className="mb-3">
                Our Apps
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                What We&apos;ve Built
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Explore our collection of mobile apps available on Google Play.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {APPS.map((app, i) => (
                <motion.div key={app.title} variants={fadeUp(i * 0.1)}>
                  <Card className="group h-full border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6 flex flex-col h-full">
                      {/* App icon area */}
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">
                        {app.icon}
                      </div>

                      {/* Category badge */}
                      <Badge
                        variant="secondary"
                        className="w-fit text-xs mb-3"
                      >
                        {app.category}
                      </Badge>

                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {app.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                        {app.description}
                      </p>

                      {/* Stats row */}
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {app.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3.5 w-3.5" />
                          {app.downloads}
                        </span>
                      </div>

                      <Separator className="my-4" />

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-fit text-sm"
                      >
                        View on Google Play
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.p
              variants={fadeUp(0.4)}
              className="text-center text-sm text-muted-foreground mt-8"
            >
              More apps coming soon. Stay tuned!
            </motion.p>
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
                Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </motion.div>

            <motion.div variants={fadeUp(0.1)}>
              <Card className="border-border/50">
                <CardContent className="pt-6 prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:first:mt-0 [&_p]:mb-3">
                  <h3>Introduction</h3>
                  <p>
                    DevStudio (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your
                    privacy and is committed to protecting your personal data. This
                    privacy policy explains how we handle information when you use
                    our mobile applications.
                  </p>

                  <h3>Information We Collect</h3>
                  <p>
                    Our apps are designed to collect the minimum amount of data
                    necessary to function properly. Depending on the app, we may
                    collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>
                      <strong className="text-foreground">Device information:</strong>{" "}
                      Android version, device model (for compatibility
                      optimization only).
                    </li>
                    <li>
                      <strong className="text-foreground">App usage data:</strong>{" "}
                      Crash reports and anonymous usage statistics to improve app
                      stability.
                    </li>
                    <li>
                      <strong className="text-foreground">User preferences:</strong>{" "}
                      Settings and preferences stored locally on your device.
                    </li>
                  </ul>

                  <h3>Data Storage</h3>
                  <p>
                    Most data is stored locally on your device. Any data that is
                    transmitted to our servers is encrypted in transit and does not
                    include personally identifiable information. We do not sell,
                    trade, or rent your personal data to third parties.
                  </p>

                  <h3>Third-Party Services</h3>
                  <p>
                    Our apps may use the following third-party services:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>
                      <strong className="text-foreground">Google Play Services:</strong>{" "}
                      For analytics and crash reporting (Firebase Analytics).
                    </li>
                    <li>
                      <strong className="text-foreground">Ad networks (if applicable):</strong>{" "}
                      May collect device identifiers for ad personalization.
                      You can opt out via your device settings.
                    </li>
                  </ul>

                  <h3>Children&apos;s Privacy</h3>
                  <p>
                    Our apps are not directed at children under 13. We do not
                    knowingly collect personal data from children. If you believe
                    we have collected data from a child, please contact us
                    immediately.
                  </p>

                  <h3>Your Rights</h3>
                  <p>
                    You have the right to access, correct, or delete any personal
                    data we hold about you. You can also request a copy of your
                    data or withdraw consent at any time by contacting us at{" "}
                    <a
                      href="mailto:contact@devstudio.app"
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      contact@devstudio.app
                    </a>
                    .
                  </p>

                  <h3>Changes to This Policy</h3>
                  <p>
                    We may update this privacy policy from time to time. Changes
                    will be posted on this page with an updated revision date. We
                    encourage you to review this policy periodically.
                  </p>

                  <h3>Contact Us</h3>
                  <p>
                    If you have any questions about this privacy policy or our
                    data practices, please reach out to us at{" "}
                    <a
                      href="mailto:contact@devstudio.app"
                      className="text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      contact@devstudio.app
                    </a>
                    .
                  </p>
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
                  D
                </div>
                DevStudio
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Independent mobile app developer creating thoughtful tools for
                everyday life.
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
                    href="mailto:contact@devstudio.app"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    contact@devstudio.app
                  </a>
                </li>
                <li>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    Google Play
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} DevStudio. All rights reserved.
            </p>
            <p>
              Built with care for users worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

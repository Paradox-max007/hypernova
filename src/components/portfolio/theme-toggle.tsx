"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Animated dark/light toggle — CSS-driven swap, hydration-safe. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-border/80 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className
      )}
    >
      <span className="relative inline-flex size-4" aria-hidden>
        <Sun className="absolute inset-0 size-4 transition-all duration-300 rotate-0 scale-100 dark:rotate-90 dark:scale-0" strokeWidth={1.75} />
        <Moon className="absolute inset-0 size-4 transition-all duration-300 -rotate-90 scale-0 dark:rotate-0 dark:scale-100" strokeWidth={1.75} />
      </span>
    </button>
  );
}

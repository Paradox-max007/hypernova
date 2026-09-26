import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Build a WhatsApp chat link (https://wa.me/<number>) from a raw admin-entered
 * value. Accepts formats like "+91 97785 85539", "919778585539", "+91-97785…".
 * Returns null when the value has no usable digits (so callers can hide the link).
 */
export function whatsappHref(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}

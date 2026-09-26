"use client";

/* Client-side admin API helpers + line-format utilities for the CMS editors */

export const TOKEN_KEY = "jr-admin-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(t: string) {
  try {
    window.localStorage.setItem(TOKEN_KEY, t);
  } catch {
    /* private mode */
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode */
  }
}

interface AdminFetchOptions {
  method?: string;
  body?: unknown;
  id?: string;
}

export async function adminFetch<T = unknown>(entity: string, options: AdminFetchOptions = {}): Promise<T> {
  const { method = "GET", body, id } = options;
  const url = id ? `/api/admin/${entity}?id=${encodeURIComponent(id)}` : `/api/admin/${entity}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": getToken() ?? "" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

/* ------------------------- line-based list formats ------------------------ */

export function linesToList(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function listToLines(list: string[] | null | undefined): string {
  return (list ?? []).join("\n");
}

export function parseLineItems(text: string, keys: string[]): Array<Record<string, string>> {
  return linesToList(text).map((line) => {
    const parts = line.split("|").map((p) => p.trim());
    const item: Record<string, string> = {};
    keys.forEach((k, i) => {
      item[k] = parts[i] ?? "";
    });
    return item;
  });
}

export function itemsToLines<T extends object>(items: readonly T[] | null | undefined, keys: string[]): string {
  return (items ?? [])
    .map((it) => keys.map((k) => String((it as Record<string, unknown>)[k] ?? "")).join(" | "))
    .join("\n");
}

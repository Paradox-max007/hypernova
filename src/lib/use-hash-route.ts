"use client";

/* Hash router — deep-linkable views inside the single deployed route.
 *   #/                → home (all sections)
 *   #work #skills ... → home + scroll to section
 *   #/work            → full work listing
 *   #/work/<slug>     → project case study
 *   #/admin           → admin CMS
 */
import { useCallback, useEffect, useState } from "react";

export type Route =
  | { view: "home"; section?: string }
  | { view: "work" }
  | { view: "project"; slug: string }
  | { view: "admin" };

export const HOME_SECTIONS = ["hero", "work", "experience", "skills", "about", "contact"] as const;

export function parseHash(raw: string): Route {
  const h = raw.replace(/^#/, "").split("?")[0];
  if (!h || h === "/") return { view: "home" };
  if (h === "/admin" || h.startsWith("/admin/")) return { view: "admin" };
  if (h.startsWith("/work/")) {
    const slug = decodeURIComponent(h.slice("/work/".length)).replace(/\/+$/, "");
    return slug ? { view: "project", slug } : { view: "work" };
  }
  if (h === "/work") return { view: "work" };
  // Plain section anchors like #contact
  if (HOME_SECTIONS.includes(h as (typeof HOME_SECTIONS)[number])) {
    return { view: "home", section: h };
  }
  return { view: "home" };
}

export function useHashRoute() {
  // Start at home for SSR-consistent hydration, then sync to the real hash on mount.
  const [route, setRoute] = useState<Route>({ view: "home" });

  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash));
    // Post-hydration sync avoids SSR/CSR mismatch; rAF keeps it off the effect body.
    const raf = requestAnimationFrame(sync);
    window.addEventListener("hashchange", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const navigate = useCallback((hash: string) => {
    if (window.location.hash === hash) {
      // Same-hash navigation should still fire section scrolling
      setRoute(parseHash(hash));
      window.dispatchEvent(new HashChangeEvent("hashchange"));
      return;
    }
    window.location.hash = hash;
  }, []);

  return { route, navigate };
}

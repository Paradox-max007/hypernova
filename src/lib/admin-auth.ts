import crypto from "crypto";

const SECRET = process.env.ADMIN_SECRET ?? "jr-portfolio-secret-2026";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "jyothilal9778585539";

export function makeToken(password: string): string {
  return crypto.createHash("sha256").update(`${password}::${SECRET}`).digest("hex");
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = makeToken(ADMIN_PASSWORD);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function tokenFromRequest(req: Request): string | null {
  return req.headers.get("x-admin-token");
}

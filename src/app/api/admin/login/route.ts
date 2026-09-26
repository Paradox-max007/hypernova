import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD, makeToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  return NextResponse.json({ ok: true, token: makeToken(ADMIN_PASSWORD) });
}

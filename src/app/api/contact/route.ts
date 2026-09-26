import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const projectType = typeof body.projectType === "string" ? body.projectType.trim() : "";
    const budget = typeof body.budget === "string" ? body.budget.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    if (!projectType) return NextResponse.json({ error: "Please choose a project type." }, { status: 400 });
    if (!budget) return NextResponse.json({ error: "Please choose a budget range." }, { status: 400 });
    if (message.length < 10)
      return NextResponse.json({ error: "Tell me a little more — at least 10 characters." }, { status: 400 });
    if (message.length > 4000 || name.length > 120 || company.length > 160)
      return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });

    const row = await db.contactRequest.create({
      data: { name, email, company: company || null, projectType, budget, message },
    });

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    console.error("Contact submission failed:", e);
    return NextResponse.json({ error: "Server error — please try again or email directly." }, { status: 500 });
  }
}

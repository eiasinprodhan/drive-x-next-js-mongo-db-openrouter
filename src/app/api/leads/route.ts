import { NextRequest, NextResponse } from "next/server";
import { listLeads } from "@/lib/db";
import { ingestLead } from "@/lib/automation";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Public: capture a lead → runs the AI qualification + notification pipeline */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, budget, durationDays, message, source } = body;
  if (!name || !email) return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  const { lead, notified } = await ingestLead({
    name: String(name).slice(0, 80),
    email: String(email).slice(0, 120),
    phone: String(phone || "").slice(0, 30),
    budget: Number(budget) || 0,
    durationDays: Number(durationDays) || 1,
    message: String(message || "").slice(0, 800),
    source: (["landing", "chatbot", "manual"] as const).includes(source) ? source : "landing",
  });
  return NextResponse.json({ lead, notified }, { status: 201 });
}

/** Admin: list leads */
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const status = req.nextUrl.searchParams.get("status") || undefined;
  return NextResponse.json(await listLeads({ status }));
}

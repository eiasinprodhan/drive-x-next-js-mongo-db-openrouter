import { NextRequest, NextResponse } from "next/server";
import { listMessages } from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const session = req.nextUrl.searchParams.get("session") || undefined;
  const msgs = await listMessages(session);
  const sessions = new Map<string, number>();
  msgs.forEach((m) => sessions.set(m.session, (sessions.get(m.session) || 0) + 1));
  return NextResponse.json({
    sessions: [...sessions.entries()].map(([id, count]) => ({ id, count })),
    messages: msgs.slice(-200),
  });
}

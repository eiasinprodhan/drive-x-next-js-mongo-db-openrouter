import { NextRequest, NextResponse } from "next/server";
import { listEvents } from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const limit = Number(req.nextUrl.searchParams.get("limit") || 60);
  return NextResponse.json(await listEvents(Math.min(limit, 300)));
}

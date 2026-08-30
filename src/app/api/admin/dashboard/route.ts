import { NextRequest, NextResponse } from "next/server";
import { dashboardData } from "@/lib/data";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const range = req.nextUrl.searchParams.get("range") || "30d";
  return NextResponse.json(await dashboardData(range));
}

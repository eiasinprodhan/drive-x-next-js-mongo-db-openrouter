import { NextRequest, NextResponse } from "next/server";
import { runQualificationSweep } from "@/lib/automation";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Admin: re-run AI qualification over all "new" leads */
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await runQualificationSweep();
  return NextResponse.json(result);
}

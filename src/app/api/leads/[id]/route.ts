import { NextRequest, NextResponse } from "next/server";
import { updateLead } from "@/lib/db";
import { updateLeadStatus } from "@/lib/automation";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  if (body.status) {
    const lead = await updateLeadStatus(id, body.status);
    return lead ? NextResponse.json(lead) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const lead = await updateLead(id, body);
  return lead ? NextResponse.json(lead) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

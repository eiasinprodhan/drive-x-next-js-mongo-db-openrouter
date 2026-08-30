import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();
  const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];
  if (!allowed.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const booking = await updateBookingStatus(id, status);
  return booking ? NextResponse.json(booking) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

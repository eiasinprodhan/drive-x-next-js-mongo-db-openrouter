import { NextRequest, NextResponse } from "next/server";
import { getCar, updateCar, deleteCar } from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getCar(id);
  return car ? NextResponse.json(car) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const patch = await req.json();
  const car = await updateCar(id, patch);
  return car ? NextResponse.json(car) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteCar(id);
  return NextResponse.json({ ok: true });
}

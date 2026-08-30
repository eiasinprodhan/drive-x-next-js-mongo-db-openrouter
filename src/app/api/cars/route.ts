import { NextRequest, NextResponse } from "next/server";
import { listCars, createCar } from "@/lib/db";
import { checkAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const cars = await listCars({
    category: sp.get("category") || undefined,
    q: sp.get("q") || undefined,
    // Admin passes view=all to see hidden cars too
    available: sp.get("view") === "all" ? undefined : true,
  });
  // Popular first when no category filter (mimics wireframe "Popular" tab)
  if (!sp.get("category")) cars.sort((a, b) => Number(b.popular) - Number(a.popular) || b.rating - a.rating);
  return NextResponse.json(cars);
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  try {
    const car = await createCar(body);
    return NextResponse.json(car, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 400 });
  }
}

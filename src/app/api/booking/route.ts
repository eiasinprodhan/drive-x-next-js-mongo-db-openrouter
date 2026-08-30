import { NextRequest, NextResponse } from "next/server";
import { createBooking, getCar, listBookings } from "@/lib/db";
import { checkAdmin } from "@/lib/auth";
import { daysBetween, uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const idsParam = req.nextUrl.searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
  const status = req.nextUrl.searchParams.get("status") || undefined;

  // If fetching by email or specific booking ids, allow customer access to their own bookings
  if (email || (ids && ids.length)) {
    return NextResponse.json(await listBookings({ email: email || undefined, ids, status }));
  }

  if (!checkAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await listBookings({ status }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carId, customer, email, phone, pickUp, dropOff, pickDate, dropDate, paymentMethod, location } = body;
    if (!carId || !customer || !email || !pickDate || !dropDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const car = await getCar(carId);
    if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });
    if (!car.available) return NextResponse.json({ error: "This car is currently unavailable" }, { status: 409 });

    const days = Math.max(1, daysBetween(pickDate, dropDate));
    const total = Math.round(car.pricePerDay * days * 100) / 100;

    const booking = await createBooking({
      carId: car.id,
      carName: car.name,
      carImage: car.image,
      customer,
      email: email.trim().toLowerCase(),
      phone: phone || "",
      location: pickUp || location || "Dhaka",
      pickUp: pickUp || "Dhaka",
      dropOff: dropOff || "Dhaka",
      pickDate: pickDate.slice(0, 10),
      dropDate: dropDate.slice(0, 10),
      days,
      total,
      paymentMethod: paymentMethod || "Card",
      status: "Confirmed",
    });

    // Attach ref for the confirmation page
    return NextResponse.json({ ...booking, uid: uid(), total, days, car }, { status: 201 });
  } catch (err: any) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: err.message || "Failed to create booking" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { aiChat, getCarCatalog, registerCarCatalog } from "@/lib/ai";
import { listCars, listMessages, saveMessage } from "@/lib/db";
import type { Car } from "@/lib/types";
import { normalizeText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let message = "";
  let session = "";
  try {
    const body = await req.json();
    session = body.session || "";
    message = body.message || "";
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    // Ensure the AI has the current fleet
    if (!getCarCatalog().length) {
      try {
        registerCarCatalog(await listCars({ available: true }));
      } catch {}
    }

    const sid = session || `s-${Date.now()}`;
    try {
      await saveMessage({ session: sid, role: "user", text: String(message).slice(0, 500) });
    } catch {}

    const system =
      `You are "Rex", the friendly AI concierge at DriveX, a premium car rental company. ` +
      `Today is ${new Date().toDateString()}. ` +
      `FLEET (name, pricePerDay USD, seats, transmission, fuel, rating):\n` +
      getCarCatalog()
        .map((c) => `- ${c.name}: $${c.pricePerDay}/day, ${c.seats} seats, ${c.transmission}, ${c.fuel}, ★${c.rating}, ${c.category}`)
        .join("\n") +
      `\n\nGUIDELINES:
- Maintain a refined, polite executive concierge tone. Do not use robot emojis (such as 🤖) or cartoon expressions.
- When asked for a recommendation, suggest 2-3 cars and explain WHY concisely.
- Pricing: from $45/day (Honda Fit) to $480/day (Porsche 911); includes basic insurance + 200 km/day; $200 refundable deposit.
- Locations: Dhaka, Chattogram, Sylhet, Cox's Bazar, Khulna, Singapore, Kuala Lumpur, Dubai. Airport counters 24/7.
- Booking steps: pick location/dates → choose car → pay (PayPal/Stripe/PayU/card) → show DX-XXXXXX reference at pickup.
- If the user wants to book or talk to a human, ask for their name/email/phone so you can send a callback request.
- Never invent cars not in the fleet.`;

    const llm = await aiChat([
      { role: "system", content: system },
      { role: "user", content: String(message).slice(0, 500) },
    ]);

    let reply = llm.text;
    let car: Car | null = null;
    let cars: Car[] = [];
    let score: number | undefined;
    let intent: string | undefined;

    const q = normalizeText(message);
    const mentions = getCarCatalog().filter((c) => q.includes(c.name.toLowerCase().split(" ")[0]) || q.includes(c.name.toLowerCase()));
    if (mentions.length) {
      cars = mentions.slice(0, 3);
      car = mentions[0];
    } else if (/recommend|suggest|which car|best car|fleet|available|suv|luxury|budget|sedan/i.test(q)) {
      const pool = [...getCarCatalog()].sort((a, b) => b.rating - a.rating);
      if (/suv|off.?road/i.test(q)) cars = pool.filter((c) => /range|q7|evoque|land cruiser|suv|tahoe/i.test(c.name) || c.category === "Large Car").slice(0, 3);
      else if (/wedding|event|executive|business|luxury|mercedes|porsche/i.test(q)) cars = pool.sort((a, b) => b.pricePerDay - a.pricePerDay).slice(0, 3);
      else if (/budget|cheap|economy|under \$?\d+/i.test(q)) {
        const m = q.match(/under \$?(\d+)/);
        cars = [...getCarCatalog()].filter((c) => !m || c.pricePerDay <= +m[1]).sort((a, b) => a.pricePerDay - b.pricePerDay).slice(0, 3);
      } else cars = pool.slice(0, 3);
      if (cars.length) car = cars[0];
    }

    // Lead detection: user offers contact info or asks for a callback / booking
    const wantsLead = /(callback|call me|contact me|talk to|book|reserve|urgent|help me book)/.test(q);
    const emailMatch = String(message).match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    const phoneMatch = String(message).match(/\+?\d[\d\s-]{7,}/);
    if (wantsLead && (emailMatch || phoneMatch)) {
      try {
        const nameGuess = String(message).split(/[,;.!]/)[0].replace(/(my name is|i am|i'm|name)/gi, "").trim().split(/\s+/).slice(0, 2).join(" ") || "DriveX Customer";
        const { ingestLead } = await import("@/lib/automation");
        const { lead } = await ingestLead({
          name: nameGuess || "Guest",
          email: emailMatch?.[0] || "guest@drivex.io",
          phone: phoneMatch?.[0] || "",
          budget: 0,
          durationDays: Number(q.match(/(\d+)\s*days?/)?.[1] || 3),
          message: String(message).slice(0, 500),
          source: "chatbot",
        });
        score = lead.score;
        intent = lead.intent;
        reply += `\n\nRequest Received: Your callback inquiry has been logged and qualified (${lead.score}/100 score · ${lead.intent.toUpperCase()} intent). Our team will reach out within 30 minutes.`;
      } catch {}
    }

    // Conversational Booking Detection or direct instant booking action
    let createdBooking: any = null;
    const isBookingRequest = /(confirm booking|book now|reserve this|book this car|proceed to book)/i.test(q) || (wantsLead && (emailMatch || phoneMatch) && car);
    
    if (isBookingRequest && car && (emailMatch || phoneMatch)) {
      try {
        const { createBooking } = await import("@/lib/db");
        const { daysBetween } = await import("@/lib/utils");
        const nameGuess = String(message).split(/[,;.!]/)[0].replace(/(my name is|i am|i'm|name|book for)/gi, "").trim().split(/\s+/).slice(0, 2).join(" ") || "Valued Customer";
        const email = emailMatch?.[0] || "customer@drivex.io";
        const phone = phoneMatch?.[0] || "";
        const durationDays = Number(q.match(/(\d+)\s*days?/)?.[1] || 3);
        const pickDate = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
        const dropDate = new Date(Date.now() + (durationDays + 1) * 864e5).toISOString().slice(0, 10);
        const total = Math.round(car.pricePerDay * durationDays * 100) / 100;

        createdBooking = await createBooking({
          carId: car.id,
          carName: car.name,
          carImage: car.image,
          customer: nameGuess,
          email,
          phone,
          location: "Dhaka, Bangladesh",
          pickUp: "Dhaka, Bangladesh",
          dropOff: "Dhaka, Bangladesh",
          pickDate,
          dropDate,
          days: durationDays,
          total,
          paymentMethod: "Card",
          status: "Confirmed",
        });

        reply = `Reservation Confirmed: Your booking for the ${car.name} has been processed successfully.\n\n` +
          `• Booking Reference: ${createdBooking.ref}\n` +
          `• Reservation Dates: ${pickDate} → ${dropDate} (${durationDays} days)\n` +
          `• Total Amount: $${total} (Comprehensive coverage included)\n` +
          `• Branch Location: Dhaka, Bangladesh\n\n` +
          `Your reservation voucher is now accessible in your Customer Dashboard.`;
      } catch (err: any) {
        console.error("AI Booking creation failed:", err);
      }
    }

    try {
      await saveMessage({ session: sid, role: "assistant", text: reply.slice(0, 1500) });
    } catch {}

    return NextResponse.json({
      text: reply,
      model: llm.model,
      source: llm.source,
      car: car ? { id: car.id, name: car.name, pricePerDay: car.pricePerDay, image: car.image, seats: car.seats, transmission: car.transmission, rating: car.rating, category: car.category, fuel: car.fuel } : null,
      cars: cars.map((c) => ({ id: c.id, name: c.name, pricePerDay: c.pricePerDay, image: c.image, seats: c.seats, transmission: c.transmission, rating: c.rating, category: c.category, fuel: c.fuel })),
      booking: createdBooking,
      score,
      intent,
    });
  } catch (err: any) {
    const { localAnswer, pickCars } = await import("@/lib/ai");
    const fallbackText = localAnswer(String(message || ""));
    const matchingCars = pickCars(normalizeText(String(message || "")), 3);
    return NextResponse.json({
      text: fallbackText,
      model: "drivex-local-engine",
      source: "local",
      car: matchingCars[0] || null,
      cars: matchingCars.map((c) => ({ id: c.id, name: c.name, pricePerDay: c.pricePerDay, image: c.image, seats: c.seats, transmission: c.transmission, rating: c.rating, category: c.category, fuel: c.fuel })),
    });
  }
}

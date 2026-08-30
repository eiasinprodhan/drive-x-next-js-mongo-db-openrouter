import { NextRequest, NextResponse } from "next/server";
import { aiChat, recommendCarsLocal, getCarCatalog, registerCarCatalog, type AiResult } from "@/lib/ai";
import { listCars } from "@/lib/db";
import { fmtMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { purpose = "family", budget = 250, passengers = 4, transmission = "", days = 3 } = body;

  if (!getCarCatalog().length) registerCarCatalog(await listCars({ available: true }));

  const matches = recommendCarsLocal({ purpose, budget, passengers, days, transmission });

  let model = "drivex-rule-engine";
  let source: AiResult["source"] = "local";

  // If an LLM is configured, have it riff on the top-3 shortlist for a natural, human reason
  if (process.env.OPENROUTER_API_KEY) {
    const llm = await aiChat(
      [
        {
          role: "system",
          content:
            `You are DriveX's car recommendation engine. User wants a car for: purpose='${purpose}', budget=$${budget}/day, passengers=${passengers}, transmission='${transmission || "any"}'.
Shortlist: ${matches
  .map((m) => `${m.car.name} ($${m.car.pricePerDay}/day, ${m.car.seats} seats, ${m.car.transmission}, ★${m.car.rating}, ${m.car.fuel})`)
  .join(" | ")}
Reply with ONE short sentence per car (max 18 words), first person, no markdown, no numbering. Focus on why it fits THIS user.`,
        },
        { role: "user", content: "Recommend the cars." },
      ],
      { temperature: 0.5 }
    );
    if (llm.source === "openrouter") {
      model = llm.model;
      source = llm.source;
      const lines = llm.text.split("\n").filter((l) => l.trim());
      matches.forEach((m, i) => {
        if (lines[i]) m.reason = lines[i].replace(/^\d+[.)\s-]*/, "").replace(/^[-*]\s*/, "").trim();
      });
    }
  }

  return NextResponse.json({
    matches: matches.map((m) => ({
      car: { id: m.car.id, name: m.car.name, image: m.car.image, pricePerDay: m.car.pricePerDay, seats: m.car.seats, transmission: m.car.transmission, fuel: m.car.fuel, rating: m.car.rating, category: m.car.category },
      reason: m.reason,
    })),
    model,
    source,
    budget_note: `Priced at ${fmtMoney(budget)}/day · ${passengers} passengers`,
  });
}

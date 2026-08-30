// ─── AI engine: OpenRouter first, built-in rule-based fallback ─────────
// Every AI feature in the app funnels through this module. When
// OPENROUTER_API_KEY is present we call a real LLM; when it is not,
// a deterministic rule-based engine answers so the whole product stays
// demonstrable offline (and never crashes on a missing key).

import type { Car, Lead } from "./types";
import { normalizeText } from "./utils";

const ROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface AiResult {
  text: string;
  model: string;
  source: "openrouter" | "local";
}

export async function aiChat(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  opts: { temperature?: number; json?: boolean } = {}
): Promise<AiResult> {
  const key = process.env.OPENROUTER_API_KEY;
  if (key) {
    const models = [
      process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
      process.env.OPENROUTER_MODEL_FALLBACK || "openai/gpt-4o-mini",
      "meta-llama/llama-3.1-8b-instruct",
    ].filter(Boolean);
    for (const model of [...new Set(models)]) {
      try {
        const res = await fetch(ROUTER_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://drivex.demo",
            "X-Title": "DriveX",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: opts.temperature ?? 0.7,
            ...(opts.json ? { response_format: { type: "json_object" } } : {}),
          }),
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return { text: text.trim(), model, source: "openrouter" };
      } catch {
        // try next model
      }
    }
  }
  return { text: localAnswer(messages[messages.length - 1]?.content || ""), model: "drivex-rule-engine", source: "local" };
}

export async function aiJSON<T>(system: string, user: string): Promise<T | null> {
  const res = await aiChat(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    { temperature: 0.2, json: true }
  );
  try {
    const match = res.text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : res.text) as T;
  } catch {
    return null;
  }
}

import { buildCars } from "./seed-data";

// ─── Local rule-based engine (offline fallback) ─────────────────────────

let carCatalog: Car[] = buildCars();
export function registerCarCatalog(cars: Car[]) {
  if (cars && cars.length) carCatalog = cars;
}
export function getCarCatalog() {
  if (!carCatalog.length) carCatalog = buildCars();
  return carCatalog;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  suv: ["suv", "off-road", "range", "land cruiser", "q7", "evoque"],
  luxury: ["luxury", "premium", "mercedes", "porsche", "911", "s-class", "exclusive"],
  compact: ["compact", "cheap", "economy", "budget", "small", "hatch", "fit", "city"],
  electric: ["electric", "ev", "hybrid", "eco", "zero emission"],
};

export function pickCars(query: string, limit = 3): Car[] {
  const q = normalizeText(query);
  const cat = Object.entries(CATEGORY_KEYWORDS).find(([, words]) => words.some((w) => q.includes(w)))?.[0];
  let pool = carCatalog.filter((c) => c.available);
  const budgetMatch = q.match(/(?:under|below|less than|budget)\s*\$?(\d+)/);
  const seatsMatch = q.match(/(\d+)\s*(?:seats?|people|persons?)/);
  if (budgetMatch) {
    const max = +budgetMatch[1];
    pool = pool.filter((c) => c.pricePerDay <= max);
  }
  if (seatsMatch) {
    const seats = +seatsMatch[1];
    pool = pool.filter((c) => c.seats >= seats);
  }
  if (cat === "suv") pool = pool.filter((c) => c.features.join(" ").toLowerCase().includes("4wd") || /suv|rover|q7|land cruiser/i.test(c.name));
  if (cat === "luxury") pool = pool.filter((c) => c.pricePerDay >= 200 || /mercedes|porsche|s-class|911/i.test(c.name));
  if (cat === "compact") pool = pool.filter((c) => c.pricePerDay <= 100 || /compact|fit|corolla/i.test(c.name));
  if (cat === "electric") pool = pool.filter((c) => c.fuel === "Electric" || c.fuel === "Hybrid");
  if (q.includes("automatic")) pool = pool.filter((c) => c.transmission === "Automatic");
  if (q.includes("manual")) pool = pool.filter((c) => c.transmission === "Manual");
  return (pool.length ? pool : carCatalog.filter((c) => c.available))
    .sort((a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1))
    .slice(0, limit);
}

function carLine(c: Car): string {
  return `${c.name} — $${c.pricePerDay}/day · ${c.seats} seats · ${c.transmission} · ${c.fuel} · ★${c.rating}`;
}

export function localAnswer(raw: string): string {
  const q = normalizeText(raw);
  const cars = pickCars(q, 3);

  if (/(hi|hello|hey|salam|assalamu)/.test(q) && q.length < 40)
    return "Hello. I am Rex, your DriveX AI Concierge. I can provide vehicle recommendations, explain rates and insurance terms, or assist you with booking a car directly. What kind of journey are you planning?";

  if (/book|reserve|rent|order/.test(q) && /how|step|works|process|do i/.test(q))
    return "Booking with DriveX is seamless:\n1. Select your pickup and drop-off branch locations and dates.\n2. Choose your preferred vehicle from our fleet.\n3. Enter driver details and choose payment method (Card, PayPal, Stripe).\n4. Receive your confirmation voucher reference (e.g. DX-10042) for immediate pickup.";

  if (/price|cost|rate|charge|fee|how much|deposit/.test(q))
    return "Daily rates range from $45/day (Honda Fit) up to $480/day (Porsche 911). All rentals include comprehensive collision waiver, 200 km/day allowance, and 24/7 roadside assistance. A refundable $200 security deposit is held at pickup.\n\nFeatured rates:\n" + cars.slice(0, 3).map(carLine).join("\n");

  if (/available|stock|have|which car|fleet|list|what cars/.test(q))
    return "Current available fleet:\n" + (cars.length ? cars.map(carLine).join("\n") : "Our complete fleet is listed in the Fleet section with live availability.");

  if (/recommend|suggest|best|which|what should/i.test(q) || cars.some((c) => q.includes(c.name.toLowerCase().split(" ")[0])))
    return `Based on your request, here are top recommendations:\n- ${cars.map((c) => `${c.name} — ${c.description.split(".")[0]}.`).join("\n- ")}\n\nWould you like me to book any of these models for your upcoming dates?`;

  if (/insurance|damage|coverage|protection/.test(q))
    return "Every rental includes 3rd-party liability and basic collision damage waiver (CDW). Super Coverage option reduces your excess to $0. Windshield, tyre, and underbody protections are included with standard rentals.";

  if (/location|where|pickup|drop.?off|branch/.test(q))
    return `DriveX operates across 8 major branches: ${["Dhaka", "Chattogram", "Sylhet", "Cox's Bazar", "Khulna", "Singapore", "Kuala Lumpur", "Dubai"].join(", ")}. Airport counters are open 24/7.`;

  if (/lead|contact|email|customer support|human|agent|callback/.test(q))
    return "Our concierge desk is available 24/7 at support@drivex.io or +880 1700-000000. You can also provide your name, email, and phone number here for an immediate callback.";

  if (/thank|thanks|great|awesome|nice/.test(q)) return "You are very welcome. Please let me know if you require any vehicle specifications, pricing breakdowns, or reservation assistance.";

  return (
    "I can assist you with: vehicle recommendations, pricing and insurance details, branch locations, and instant reservations.\n" +
    (cars.length ? "\nRecommended options matching your inquiry:\n" + cars.map(carLine).join("\n") : "\nTry asking: 'Recommend an SUV under $200' or 'What cars are available in Dhaka?'")
  );
}

export function recommendCarsLocal(payload: {
  purpose?: string;
  budget?: number;
  passengers?: number;
  days?: number;
  transmission?: string;
}): { car: Car; reason: string }[] {
  let pool = carCatalog.filter((c) => c.available);
  const { purpose = "", budget = 0, passengers = 0, transmission = "" } = payload;
  const p = normalizeText(purpose);
  if (passengers >= 6) pool = pool.filter((c) => c.seats >= 6);
  else if (passengers >= 3) pool = pool.filter((c) => c.seats >= 4);
  if (transmission === "Automatic" || transmission === "Manual") pool = pool.filter((c) => c.transmission === transmission);
  if (budget > 0) pool = pool.filter((c) => c.pricePerDay <= budget + 25);
  if (/wedding|event|executive|business|client|prestige/.test(p)) pool = pool.sort((a, b) => b.pricePerDay - a.pricePerDay);
  else if (/family|kids|long trip|vacation|holiday/.test(p)) pool = pool.sort((a, b) => b.seats - a.seats);
  else if (/city|commute|budget|economy|daily/.test(p)) pool = pool.sort((a, b) => a.pricePerDay - b.pricePerDay);
  else pool = pool.sort((a, b) => b.rating - a.rating);

  const reasons = (c: Car): string => {
    if (/wedding|event|executive|business|client|prestige/.test(p)) return `Premium presence for a special occasion — ★${c.rating} rated ${c.name} with chauffeur-grade comfort.`;
    if (passengers >= 6) return `Seats ${c.seats} comfortably, ideal for ${passengers} people.`;
    if (budget > 0) return `Fits your ~$${budget}/day budget with room to spare ($${c.pricePerDay}/day).`;
    if (c.fuel === "Electric" || c.fuel === "Hybrid") return `Great fuel economy — perfect for city driving.`;
    return `Best-rated (★${c.rating}) ${c.category.toLowerCase()} in the fleet right now.`;
  };
  return pool.slice(0, 3).map((car) => ({ car, reason: reasons(car) }));
}

export async function qualifyLeadAI(lead: { name: string; email: string; phone: string; budget: number; durationDays: number; message: string; createdAt: string }): Promise<{ score: number; intent: "high" | "medium" | "low"; reason: string }> {
  const key = process.env.OPENROUTER_API_KEY;
  if (key) {
    const out = await aiJSON<{ score: number; intent: "high" | "medium" | "low"; reason: string }>(
      `You are an expert sales-lead qualification model for a car rental company.
Score the lead 0-100 (100 = ready to buy now). Intent: high/medium/low.
Respond ONLY with JSON: {"score": number, "intent": "high"|"medium"|"low", "reason": "one sentence explaining the score"}`,
      JSON.stringify(lead)
    );
    if (out && typeof out.score === "number") return { score: Math.max(0, Math.min(100, Math.round(out.score))), intent: out.intent || "medium", reason: out.reason || "Qualified by AI." };
  }
  // Local deterministic fallback
  let score = 30;
  const h = lead.message.length;
  if (lead.budget > 0) score += 25;
  if (lead.phone) score += 10;
  if (h > 40) score += 15;
  if (lead.durationDays >= 3) score += 10;
  if (/urgent|today|tomorrow|asap|weekend|confirmed/i.test(lead.message)) score += 10;
  if (/price|cost|budget|discount/i.test(lead.message)) score -= 5; // still shopping around
  score = Math.max(5, Math.min(95, score));
  const intent = score >= 70 ? "high" : score >= 45 ? "medium" : "low";
  const reason =
    intent === "high"
      ? `Budget specified ($${lead.budget || "?"}), contact details complete, and the request shows clear intent — ready for immediate follow-up.`
      : intent === "medium"
        ? `Interested but needs a nudge — ${lead.budget > 0 ? `budget of $${lead.budget} suggests` : "no budget given, so"} a follow-up call is recommended.`
        : "Early-stage enquiry — nurture with a follow-up email and pricing info.";
  return { score, intent, reason };
}

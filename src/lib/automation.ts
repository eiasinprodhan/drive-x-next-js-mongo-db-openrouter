// ─── Automation engine ─────────────────────────────────────────────────
// Lead lifecycle: capture → AI qualification → instant team notification →
// CRM status sync → scheduled daily digest (webhook-able by cron).
// Each step is audited into the automation ledger shown in /admin/automation.

import { addEvent, createLead, listLeads, updateLead } from "./db";
import { qualifyLeadAI, aiChat } from "./ai";
import type { Lead, LeadStatus } from "./types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@drivex.io";

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  budget: number;
  durationDays: number;
  message: string;
  source: "landing" | "chatbot" | "manual";
}

/** Full pipeline: create → AI score → notify → audit */
export async function ingestLead(input: LeadInput): Promise<{ lead: Lead; notified: boolean }> {
  const lead = await createLead({
    ...input,
    score: 0,
    intent: "medium",
    reason: "Pending AI qualification…",
    status: "new",
  });

  // 1️⃣ AI qualification
  let score = 0;
  let intent: Lead["intent"] = "medium";
  let reason = "";
  try {
    const q = await qualifyLeadAI(lead);
    score = q.score;
    intent = q.intent;
    reason = q.reason;
    await updateLead(lead.id, { score, intent, reason, status: intent === "high" ? "qualified" : "new" });
    await addEvent({
      type: "ai",
      title: `AI qualified lead: ${lead.name}`,
      detail: `Model: ${(await qualifyLeadAI, "drivex-engine")} · score ${score}/100 · intent ${intent.toUpperCase()} · ${reason}`,
      status: "success",
    });
  } catch (e: any) {
    await addEvent({ type: "ai", title: "AI qualification failed", detail: String(e?.message || e), status: "failed" });
  }

  // 2️⃣ Team notification (Telegram bot, if configured)
  let notified = false;
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      const text = [
        `🔥 ${intent.toUpperCase()} INTENT LEAD — DriveX`,
        `👤 ${lead.name} · ${lead.email} · ${lead.phone}`,
        `💵 Budget: $${lead.budget || "?"} · ${lead.durationDays} days`,
        `🎯 AI score: ${score}/100`,
        `📝 ${lead.message.slice(0, 160)}`,
      ].join("\n");
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      notified = res.ok;
      await addEvent({
        type: "webhook",
        title: `Telegram alert ${notified ? "sent" : "failed"}`,
        detail: `Lead ${lead.name} (score ${score}) pushed to Telegram channel ${chatId}`,
        status: notified ? "success" : "failed",
      });
    } else {
      await addEvent({
        type: "webhook",
        title: "Telegram alert skipped",
        detail: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured — notification channel is a no-op.",
        status: "skipped",
      });
    }
  } catch (e: any) {
    await addEvent({ type: "webhook", title: "Telegram alert error", detail: String(e?.message || e), status: "failed" });
  }

  // 3️⃣ Automated acknowledgement email (Resend, if configured)
  try {
    const key = process.env.RESEND_API_KEY;
    if (key) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "DriveX <leads@drivex.io>",
          to: [lead.email],
          subject: `DriveX — we got your request, ${lead.name.split(" ")[0]}!`,
          html: `<p>Hi ${lead.name.split(" ")[0]},</p>
<p>Thanks for reaching out! Our team will contact you within <b>30 minutes</b>.</p>
<p>Your request: ${lead.message.slice(0, 200)}</p>
<p>— DriveX Rentals</p>`,
        }),
      });
      await addEvent({
        type: "email",
        title: `Auto-reply sent to ${lead.email}`,
        detail: res.ok ? "Resend API — 200 OK" : `Resend API — ${res.status}`,
        status: res.ok ? "success" : "failed",
      });
    } else {
      await addEvent({
        type: "email",
        title: "Auto-reply email skipped",
        detail: "RESEND_API_KEY not configured — demo mode logs the email instead of sending.",
        status: "skipped",
      });
    }
  } catch (e: any) {
    await addEvent({ type: "email", title: "Auto-reply email error", detail: String(e?.message || e), status: "failed" });
  }

  return { lead, notified };
}

/** Re-run AI qualification over leads that are still "new" (manual/one-click) */
export async function runQualificationSweep(): Promise<{ processed: number; high: number }> {
  const leads = await listLeads({ status: "new" });
  let high = 0;
  for (const l of leads) {
    const q = await qualifyLeadAI(l);
    await updateLead(l.id, { score: q.score, intent: q.intent, reason: q.reason, status: q.intent === "high" ? "qualified" : "new" });
    await addEvent({
      type: "ai",
      title: `AI rescored lead: ${l.name}`,
      detail: `score ${q.score}/100 · ${q.intent.toUpperCase()} · ${q.reason}`,
      status: "success",
    });
    if (q.intent === "high") high++;
  }
  return { processed: leads.length, high };
}

/** Daily business digest — callable by any cron via GET/POST /api/webhooks/digest */
export async function runDailyDigest(): Promise<string> {
  const d = await import("./data");
  const { revenue, bookings, activeFleet, topCar } = await d.digestSummary();
  const lines = [
    `📊 DriveX Daily Digest — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}`,
    ``,
    `💰 Revenue: $${revenue.toLocaleString()}`,
    `🧾 Bookings: ${bookings}`,
    `🚗 Fleet available: ${activeFleet}`,
    `🏆 Top car: ${topCar}`,
  ];
  const text = lines.join("\n");
  await addEvent({ type: "digest", title: "Daily digest generated", detail: text.replace(/\n/g, " · ").slice(0, 220), status: "success" });

  // Push to configured webhook (e.g. Slack/Discord/n8n/bot endpoint)
  const hook = process.env.DIGEST_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-webhook-secret": process.env.WEBHOOK_SECRET || "drivex-webhook-secret" },
        body: JSON.stringify({ type: "daily-digest", text, at: new Date().toISOString() }),
      });
      await addEvent({ type: "digest", title: "Digest pushed to webhook", detail: `${hook} → ${res.status}`, status: res.ok ? "success" : "failed" });
    } catch (e: any) {
      await addEvent({ type: "digest", title: "Digest webhook failed", detail: String(e?.message || e), status: "failed" });
    }
  }
  return text;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const lead = await updateLead(id, { status });
  await addEvent({
    type: "system",
    title: `Lead status → ${status.toUpperCase()}`,
    detail: `${lead?.name || id} moved to ${status} by ${ADMIN_EMAIL}`,
    status: "success",
  });
  return lead;
}

export { ADMIN_EMAIL };

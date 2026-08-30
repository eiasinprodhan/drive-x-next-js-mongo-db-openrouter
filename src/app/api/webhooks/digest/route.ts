import { NextRequest, NextResponse } from "next/server";
import { runDailyDigest } from "@/lib/automation";

export const dynamic = "force-dynamic";

/**
 * Automation endpoint — call from ANY cron service (UptimeRobot, cron-job.org,
 * GitHub Actions, n8n…) to generate the DriveX daily business digest:
 *
 *   POST/GET /api/webhooks/digest
 *
 * Secured by the WEBHOOK_SECRET header (or ?secret= param) unless
 * DIGEST_WEBHOOK_URL is unset and no secret is configured (demo mode).
 */
export async function POST(req: NextRequest) {
  return handle(req);
}
export async function GET(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const secret = process.env.WEBHOOK_SECRET || "";
  const provided = req.headers.get("x-webhook-secret") || req.nextUrl.searchParams.get("secret") || "";
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }
  try {
    const digest = await runDailyDigest();
    return NextResponse.json({ ok: true, digest });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

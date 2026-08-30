import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.WEBHOOK_SECRET || process.env.ADMIN_PASSWORD || "drivex-webhook-secret";

export function signToken(email: string, hours = 24): string {
  const exp = Date.now() + hours * 3600_000;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string | null): { ok: boolean; email?: string } {
  if (!token) return { ok: false };
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return { ok: false };
  const expect = createHmac("sha256", SECRET).update(payload).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return { ok: false };
    const { email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() > exp) return { ok: false };
    return { ok: true, email };
  } catch {
    return { ok: false };
  }
}

export function checkAdmin(req: Request): boolean {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  return verifyToken(token).ok;
}

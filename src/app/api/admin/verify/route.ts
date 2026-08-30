import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};
    const adminDefaultPassword = process.env.ADMIN_PASSWORD || "drivex2026";
    const adminDefaultEmail = process.env.ADMIN_EMAIL || "admin@drivex.io";

    // 1. Check default admin password credentials
    if (password === adminDefaultPassword && (!email || email.toLowerCase() === adminDefaultEmail.toLowerCase() || email === "admin")) {
      return NextResponse.json({
        ok: true,
        token: signToken(adminDefaultEmail),
        email: adminDefaultEmail,
        role: "admin",
      });
    }

    // 2. Check registered users in database if email is provided
    if (email && password) {
      const user = await findUserByEmail(email);
      if (user && user.password === password) {
        return NextResponse.json({
          ok: true,
          token: signToken(user.email),
          email: user.email,
          role: user.role,
        });
      }
    }

    return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Verification failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const v = verifyToken(token);
  return NextResponse.json(v);
}

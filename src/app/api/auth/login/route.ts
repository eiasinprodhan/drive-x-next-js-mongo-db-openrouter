import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await findUserByEmail(cleanEmail);

    if (!user || user.password !== password) {
      return NextResponse.json({ ok: false, error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken(user.email);

    return NextResponse.json({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Login failed" }, { status: 500 });
  }
}

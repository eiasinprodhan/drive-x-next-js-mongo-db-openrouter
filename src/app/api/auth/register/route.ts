import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone } = body || {};

    if (!fullName || !email || !password) {
      return NextResponse.json({ ok: false, error: "Missing required fields: fullName, email, password" }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ ok: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json({ ok: false, error: "An account with this email already exists" }, { status: 409 });
    }

    const user = await createUser({
      name: String(fullName).trim(),
      email: cleanEmail,
      phone: phone ? String(phone).trim() : "",
      password: String(password),
      role: "customer",
    });

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
    return NextResponse.json({ ok: false, error: e?.message || "Registration failed" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    const { ok, email } = verifyToken(token);

    if (!ok || !email) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed to fetch profile" }, { status: 500 });
  }
}

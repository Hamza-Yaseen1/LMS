// app/api/auth/login/route.ts
import { createConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";

type Librarian = {
  id: number;
  email: string;
  name: string | null;
  password_hash: string | null;
  active: 0 | 1;
} & RowDataPacket;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    const conn = await createConnection();

    const [rows] = await conn.execute<Librarian[]>(
      "SELECT id, email, name, password_hash, active FROM librarians WHERE email = ? AND active = 1 LIMIT 1",
      [normalizedEmail]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!user) {
      return NextResponse.json({ error: "User not found or inactive" }, { status: 401 });
    }

    // Allow either bcrypt hash or (temporarily) legacy plain text
    const hasBcryptHash = typeof user.password_hash === "string" && user.password_hash.startsWith("$2");
    const isPasswordValid = hasBcryptHash
      ? await bcrypt.compare(password, user.password_hash!)
      : user.password_hash === password;

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Set a simple session cookie (consider moving to signed/JWT later)
    (await
      // Set a simple session cookie (consider moving to signed/JWT later)
      cookies()).set(
      "session_user",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[LOGIN_POST]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// app/api/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = cookies();           // no await
  (await cookieStore).delete("session_user");

  // Use an absolute URL based on the current request URL
  return NextResponse.redirect(new URL("/login", req.url), { status: 303 });
  // 303 avoids re-submitting POST if user refreshes
}

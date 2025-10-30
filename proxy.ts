// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session_user");
  const path = request.nextUrl.pathname;

  // Allow only login & public assets if NOT logged in
  if (!session) {
    const publicPaths = ["/login", "/api/login", "/favicon.ico"];
    const isPublic = publicPaths.some((p) => path.startsWith(p));
    if (!isPublic) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If logged in and tries to go to /login, send to dashboard
  if (session && path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

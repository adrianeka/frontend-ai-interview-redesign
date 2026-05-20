import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. If trying to access private routes without a token, redirect to login
  const isPrivateRoute =
    pathname.startsWith("/interviews") ||
    pathname.startsWith("/interview-details");

  if (isPrivateRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Save the original URL to redirect back after successful login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If already logged in, prevent accessing login/register and redirect to interviews
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/interviews", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/interviews/:path*",
    "/interview-details/:path*",
    "/login",
    "/register",
  ],
};

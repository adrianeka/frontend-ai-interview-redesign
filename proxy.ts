import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
edit start
by: Zahra Hilyatul J
date: 2026-07-20
description: Add token expiration decoding and automatic cookie clearing in middleware to prevent infinite redirect glitches
*/
function isTokenExpired(token: string) {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    }
    return false;
  } catch (e) {
    return true;
  }
}

export function proxy(request: NextRequest) {
  let token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Cek apakah token sudah expired
  const expired = token ? isTokenExpired(token) : true;
  if (expired) {
    token = undefined; // Anggap tidak ada token jika expired
  }

  // 1. If trying to access private routes without a token, redirect to login
  const isPrivateRoute =
    pathname.startsWith("/interviews") ||
    pathname.startsWith("/interview-details");

  if (isPrivateRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Save the original URL to redirect back after successful login
    loginUrl.searchParams.set("callbackUrl", pathname);
    
    const response = NextResponse.redirect(loginUrl);
    // Hapus cookie yang nyangkut/expired
    response.cookies.delete("token");
    return response;
  }
/*
edit end
*/

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

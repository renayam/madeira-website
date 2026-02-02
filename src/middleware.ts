import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin";
  const isAuthApiRoute = pathname.startsWith("/api/auth");

  if (isAdminRoute && !isLoginPage && !isAuthApiRoute) {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

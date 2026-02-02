import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Remove imports that use Node.js specific modules (async_hooks, logger)
// The middleware runs in the Edge Runtime and cannot use Node.js modules

export function middleware(request: NextRequest) {
  // Generate a request ID if one is not present
  // crypto.randomUUID is available in the Edge Runtime
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();

  // Create a new headers object to pass the request ID to downstream handlers
  // The downstream handlers (running in Node.js) will use this ID to initialize their request context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  // Continue processing the request, passing the modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set the request ID header on the response so the client can see it
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

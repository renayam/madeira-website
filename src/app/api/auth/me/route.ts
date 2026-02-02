import { NextResponse } from "next/server";
import { getSessionCookie, verifyToken } from "@/lib/auth";
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  return Sentry.startSpan(
    {
      name: "api.auth.me",
      op: "http.request",
      attributes: {
        "http.method": "GET",
        "http.url": "/api/auth/me",
      },
    },
    async () => {
      const token = await getSessionCookie();

      if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      const payload = await verifyToken(token);

      if (!payload) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: payload.userId,
          username: payload.username,
          role: payload.role,
        },
      });
    },
  );
}

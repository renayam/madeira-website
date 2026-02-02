import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import * as Sentry from "@sentry/nextjs";

export async function POST() {
  return Sentry.startSpan(
    {
      name: "api.auth.logout",
      op: "http.request",
      attributes: {
        "http.method": "POST",
        "http.url": "/api/auth/logout",
      },
    },
    async () => {
      await clearSessionCookie();
      return NextResponse.json({ success: true });
    },
  );
}

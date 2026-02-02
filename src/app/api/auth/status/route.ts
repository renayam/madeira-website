import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCookie } from "@/lib/auth";

export async function GET() {
  const session = await getSessionCookie();
  return NextResponse.json({
    authenticated: !!session,
  });
}

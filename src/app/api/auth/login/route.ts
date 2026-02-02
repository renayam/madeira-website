import { NextResponse } from "next/server";
import { User } from "@/db";
import { UserModel } from "@/types/user";
import { createToken, setSessionCookie } from "@/lib/auth";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  return Sentry.startSpan(
    {
      name: "api.auth.login",
      op: "http.request",
      attributes: {
        "http.method": "POST",
        "http.url": "/api/auth/login",
      },
    },
    async (span) => {
      try {
        const body = await request.json();
        const { username, password } = body;

        span.setAttribute("auth.username_provided", !!username);

        if (!username || !password) {
          span.addEvent("auth.invalid_request");
          return NextResponse.json(
            { success: false, error: "Username and password required" },
            { status: 401 },
          );
        }

        const user = await User.findOne({ where: { username } });

        if (!user) {
          span.addEvent("auth.user_not_found");
          return NextResponse.json(
            { success: false, error: "Invalid credentials" },
            { status: 401 },
          );
        }

        const userPlain = user.get({ plain: true });
        const isValid = await UserModel.comparePassword(
          password,
          userPlain.passwordHash,
        );

        if (!isValid) {
          span.addEvent("auth.invalid_password");
          return NextResponse.json(
            { success: false, error: "Invalid credentials" },
            { status: 401 },
          );
        }

        const token = await createToken(userPlain);
        await setSessionCookie(token);

        span.addEvent("auth.success", {
          user_id: userPlain.id,
          role: userPlain.role,
        });

        return NextResponse.json({
          success: true,
          user: {
            id: userPlain.id,
            username: userPlain.username,
            role: userPlain.role,
          },
        });
      } catch (error) {
        span.setStatus({
          code: 2,
          message: error instanceof Error ? error.message : "Error",
        });
        span.addEvent("error", { error: String(error) });
        throw error;
      }
    },
  );
}

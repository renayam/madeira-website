import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { User, UserRole } from "@/types/user";

interface CustomJWTPayload extends JWTPayload {
  userId: number;
  username: string;
  role: UserRole;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
);
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

export async function createToken(user: User): Promise<string> {
  const payload: CustomJWTPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string,
): Promise<CustomJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as CustomJWTPayload;
  } catch {
    return null;
  }
}

export async function getSessionCookie(): Promise<string | undefined> {
  return (await cookies()).get("session")?.value;
}

export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete("session");
}

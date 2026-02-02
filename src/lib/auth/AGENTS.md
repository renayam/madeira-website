# Authentication Learnings

## JWT with jose Library

- Use `jose` for JWT in Next.js (Edge-compatible)
- Encode secret with `new TextEncoder().encode(process.env.JWT_SECRET)`
- Token payload: `{ userId, username, role }`
- Set expiration with `.setExpirationTime(JWT_EXPIRY)`

## Session Cookie Pattern

- Store JWT in HTTP-only cookie named `session`
- Cookie options: `httpOnly: true`, `secure: production`, `sameSite: "lax"`, `maxAge: 60*60*24*7`
- Use helper functions: `getSessionCookie()`, `setSessionCookie(token)`, `clearSessionCookie()`

## Auth Middleware

- Protect `/admin/*` routes EXCEPT `/admin` (login page itself)
- Check cookie in middleware: `request.cookies.get("session")?.value`
- Redirect unauthenticated: `redirect("/admin")`
- Let all other routes pass through

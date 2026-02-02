import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");

    // Only import DB in Node.js runtime (not Edge)
    const { connect, sync } = await import("./db");
    await connect();
    if (process.env.NODE_ENV === "development") {
      await sync();
    }
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;

import * as Sentry from "@sentry/nextjs";
import { getRequestId } from "./request-context";

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

// Keys that should be redacted from logs
const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "authorization",
  "cookie",
  "accessToken",
  "refreshToken",
  "apiKey",
];

/**
 * Redacts sensitive information from an object recursively.
 */
const redact = (obj: any): any => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redact);
  }

  if (obj instanceof Error) {
    return {
      name: obj.name,
      message: obj.message,
      stack: obj.stack,
      ...redact({ ...obj }),
    };
  }

  const newObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (
        SENSITIVE_KEYS.some((sensitive) =>
          key.toLowerCase().includes(sensitive),
        )
      ) {
        newObj[key] = "[REDACTED]";
      } else {
        newObj[key] = redact(obj[key]);
      }
    }
  }
  return newObj;
};

const formatMessage = (
  level: LogLevel,
  message: string,
  context?: LogContext,
) => {
  const requestId = getRequestId();
  const timestamp = new Date().toISOString();

  return JSON.stringify({
    level,
    message,
    timestamp,
    requestId,
    ...redact(context || {}),
  });
};

export const logger = {
  debug: (message: string, context?: LogContext) => {
    // Only log debug in non-production environments or if explicitly enabled
    if (
      process.env.NODE_ENV !== "production" ||
      process.env.LOG_LEVEL === "debug"
    ) {
      console.debug(formatMessage("debug", message, context));
    }
  },

  info: (message: string, context?: LogContext) => {
    console.log(formatMessage("info", message, context));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatMessage("warn", message, context));
  },

  error: (message: string, context?: LogContext) => {
    console.error(formatMessage("error", message, context));

    // Send to Sentry
    const requestId = getRequestId();
    const extra = { ...context, requestId };

    if (context?.error instanceof Error) {
      Sentry.captureException(context.error, { extra });
    } else if (context?.error) {
      Sentry.captureException(new Error(String(context.error)), { extra });
    } else {
      Sentry.captureMessage(message, {
        level: "error",
        extra,
      });
    }
  },
};

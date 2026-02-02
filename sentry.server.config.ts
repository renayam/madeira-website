// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a089f453f0876fdd4d380f366a82daa6@o4510756136812544.ingest.de.sentry.io/4510756146511952",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  // tracesSampleRate: 1, // Controlled by tracesSampler below

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Custom tracing configuration
  tracesSampler: (samplingContext) => {
    // Adjust sampling rates based on the transaction context
    if (samplingContext.transactionContext?.name?.includes("health")) {
      return 0; // Don't sample health checks
    }
    return 1.0; // Sample everything else for now
  },

  // Data filtering (redaction)
  beforeSend: (event) => {
    if (event.request?.headers) {
      // Redact sensitive headers
      delete event.request.headers["Authorization"];
      delete event.request.headers["Cookie"];
    }
    return event;
  },
});

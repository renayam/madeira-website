import { AsyncLocalStorage } from "node:async_hooks";

// Initialize the AsyncLocalStorage to store the request ID
const requestIdStore = new AsyncLocalStorage<string>();

/**
 * Retrieves the current request ID from the async local storage.
 * Returns undefined if called outside of a request context.
 */
export const getRequestId = (): string | undefined => {
  return requestIdStore.getStore();
};

/**
 * Runs a function within the context of a request ID.
 * @param requestId The request ID to associate with the context.
 * @param fn The function to execute.
 */
export const runWithRequestId = <T>(requestId: string, fn: () => T): T => {
  return requestIdStore.run(requestId, fn);
};

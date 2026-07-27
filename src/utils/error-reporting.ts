/**
 * Generic runtime error reporter.
 * Logs errors to the console and can be extended to send to any monitoring service.
 */
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("[Runtime Error]", error, context);
}

import { createStart, createMiddleware } from "@tanstack/react-start";
import { renderErrorPage } from "./lib/error-page";
const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    // Attempt to process the request through the normal flow
    // If the request succeeds, return the result to the client
    return await next();
  } catch (error) {
    // Check if this is a known HTTP error (e.g., from routing, authentication)
    // These should be re-thrown to let the framework handle them appropriately
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    // Log unexpected errors with structured format for better monitoring
    // This helps with debugging and error tracking in production
    console.error("[AgriMitra Error]", {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      // In production, you can add more context like request ID, user ID, etc.
    });

    // Return a user-friendly 500 error page
    // This prevents sensitive error details from being exposed to clients
    // and maintains a professional user experience
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { 
        "content-type": "text/html; charset=utf-8"
        // Add security headers in production:
        // "x-content-type-options": "nosniff",
        // "referrer-policy": "strict-origin-when-cross-origin"
      },
    });
  }
});

/**
 * Configures and exports the main TanStack Start server instance.
 * 
 * This is the entry point for the AgriMitra AI server configuration.
 * Additional middleware can be added here in order of execution:
 * 
 * Middleware execution order (top to bottom):
 * 1. Request logging middleware (track incoming requests)
 * 2. Authentication middleware (validate user sessions)
 * 3. Rate limiting middleware (prevent abuse)
 * 4. Audit logging middleware (track sensitive operations)
 * 5. Error middleware (catch and handle errors) - should be last
 * 
 
 * // Future authentication middleware integration:
 * // const authMiddleware = createMiddleware().server(async ({ next, request }) => {
 * //   const session = await validateSession(request);
 * //   if (!session) throw new Error('Unauthorized');
 * //   return next();
 * // });
 
 * // Future request logging middleware integration:
 * // const requestLoggerMiddleware = createMiddleware().server(async ({ next, request }) => {
 * //   const start = Date.now();
 * //   const response = await next();
 * //   console.log(`[AgriMitra Request] ${request.method} ${request.url} - ${Date.now() - start}ms`);
 * //   return response;
 * // });
  The configured TanStack Start server instance ready for production deployment
 */
export const startInstance = createStart(() => ({
  requestMiddleware: [
    // Add middleware in order of execution (top = first)
    // Example: requestLoggerMiddleware,  // Log all requests
    // Example: authMiddleware,           // Authenticate users
    // Example: rateLimiterMiddleware,    // Rate limit requests
    // Example: auditLoggerMiddleware,    // Log sensitive operations
    errorMiddleware, // Always keep error middleware last to catch all errors
  ],
}));
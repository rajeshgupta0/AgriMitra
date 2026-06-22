import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

// Styles
import appCss from "../styles.css?url";

/**
 * 404 Not Found Component
 * Rendered when a route doesn't match any defined route
 * Provides a user-friendly error page with navigation options
 */
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Boundary Component
 * Catches and displays runtime errors gracefully
 * Prevents the entire application from crashing due to component errors
 */
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  // Log errors with structured format for monitoring
  console.error("[AgriMitra Error]", {
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    component: "RootErrorBoundary",
  });

  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We're sorry for the inconvenience. Please try refreshing the page or return to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Root Route Configuration
 * 
 * The main application route that wraps all other routes
 * Provides global context, error boundaries, and shared UI components
 */
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  /**
   * Head Configuration
   * SEO metadata, stylesheets, and link tags for the entire application
   */
  head: () => ({
    meta: [
      // Character set and viewport
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      
      // Primary SEO metadata
      { title: "AgriMitra AI | Agriculture Intelligence Platform" },
      { name: "description", content: "AI-powered farming assistant for India's farmers. Voice-first crop advice, weather, market prices, and government schemes in your language." },
      { name: "keywords", content: "agriculture, farming, AI, India, crop advice, weather, market prices, government schemes, voice assistant" },
      { name: "author", content: "AgriMitra AI Team" },
      { name: "application-name", content: "AgriMitra AI" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#16a34a" },
      
      // Open Graph (OG) metadata for social sharing
      { property: "og:title", content: "AgriMitra AI | Agriculture Intelligence Platform" },
      { property: "og:description", content: "AI-powered farming assistant for India's farmers. Voice-first crop advice, weather, market prices, and government schemes in your language." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:url", content: "https://agrimitra.ai" },
      { property: "og:site_name", content: "AgriMitra AI" },
      
      // Twitter Card metadata
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AgriMitra AI | Agriculture Intelligence Platform" },
      { name: "twitter:description", content: "AI-powered farming assistant for India's farmers. Voice-first crop advice, weather, market prices, and government schemes in your language." },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      // Application styles
      { rel: "stylesheet", href: appCss },
      
      // PWA manifest and icons
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      
      // Preconnect for external resources
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      
      // Google Fonts
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  
  // Root shell component (HTML structure)
  shellComponent: RootShell,
  
  // Main root component
  component: RootComponent,
  
  // Error handling
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

/**
 * Root Shell Component
 * Provides the base HTML structure for the entire application
 * Includes HeadContent for SEO and Scripts for client-side hydration
 */
function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Root Component
 * The main application wrapper that provides global context
 * Includes QueryClientProvider for React Query, OfflineBanner, and routing
 */
function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Register Progressive Web App service worker
  useEffect(() => {
    import("../lib/pwa-register")
      .then((m) => m.registerPWA())
      .catch((error) => {
        // Silent failure for PWA registration
        // Service worker registration failure should not break the application
        console.debug("[AgriMitra PWA] Registration skipped:", error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      <Outlet />
    </QueryClientProvider>
  );
}

/**
 * Offline Status Banner
 * Displays a subtle notification when the user is offline
 * Informs users that cached content is available
 */
function OfflineBanner() {
  const [online, setOnline] = useState<boolean>(
    typeof navigator === "undefined" ? true : navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-3 z-[60] -translate-x-1/2 rounded-full bg-foreground/90 px-4 py-1.5 text-xs font-semibold text-background shadow-lg backdrop-blur"
    >
      Offline mode • cached pages available
    </div>
  );
}
// Guarded service-worker registration wrapper.
// Registers only in published production builds; never in Lovable preview/dev.

const SW_URL = "/sw.js";

function isUnsafeContext(): boolean {
  if (typeof window === "undefined") return true;
  if (!import.meta.env.PROD) return true;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  const host = window.location.hostname;
  if (
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" || host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")
  ) {
    return true;
  }
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

async function unregisterMatching() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const r of regs) {
      const url = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
      if (url.endsWith(SW_URL)) await r.unregister();
    }
  } catch {
    // ignore
  }
}

export function registerPWA() {
  if (typeof window === "undefined") return;
  if (isUnsafeContext()) {
    void unregisterMatching();
    return;
  }
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    import("workbox-window")
      .then(({ Workbox }) => {
        const wb = new Workbox(SW_URL);
        wb.addEventListener("waiting", () => {
          // Auto-update on next navigation
          wb.messageSkipWaiting();
        });
        wb.register().catch(() => { /* ignore */ });
      })
      .catch(() => { /* offline-first is optional */ });
  });
}

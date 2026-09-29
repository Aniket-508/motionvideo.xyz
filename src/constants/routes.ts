export const ROUTES = {
  ABOUT: "/about",
  BRAND: "/brand",
  CHECKOUT: "/checkout",
  CONTACT: "/contact",
  DASHBOARD: "/dashboard",
  DPA: "/dpa",
  FAQ: "/#faq",
  FEATURES: "/#features",
  HOME: "/",
  HOW_IT_WORKS: "/#how-it-works",
  PRICING: "/#pricing",
  PRIVACY: "/privacy",
  REFUNDS: "/refunds",
  SIGN_IN: "/sign-in",
  TERMS: "/terms",
  WELCOME: "/welcome",
} as const;

// Content pages with no per-request data: rendered to HTML at build time
// (vite.config.ts) and served by the Worker from static assets (src/server.ts).
// Keep in sync with `assets.run_worker_first` in wrangler.jsonc.
export const STATIC_PAGES: readonly string[] = [
  ROUTES.ABOUT,
  ROUTES.BRAND,
  ROUTES.CONTACT,
  ROUTES.DPA,
  ROUTES.PRIVACY,
  ROUTES.REFUNDS,
  ROUTES.TERMS,
];

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { ROUTES } from "./src/constants/routes.ts";

// Content pages with no per-request data: rendered to HTML at build time and
// served as static assets, so they never run the Worker. Everything else
// (landing offer, auth, checkout) stays server-rendered.
const STATIC_PAGES = [
  ROUTES.ABOUT,
  ROUTES.BRAND,
  ROUTES.CONTACT,
  ROUTES.DPA,
  ROUTES.PRIVACY,
  ROUTES.REFUNDS,
  ROUTES.TERMS,
];

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({
      pages: STATIC_PAGES.map((path) => ({ path })),
      prerender: {
        autoStaticPathsDiscovery: false,
        // `/about.html` rather than `/about/index.html`: Workers assets serve it
        // at `/about` without a trailing-slash redirect.
        autoSubfolderIndex: false,
        crawlLinks: false,
        enabled: true,
        filter: ({ path }) => STATIC_PAGES.some((page) => page === path),
      },
    }),
    viteReact(),
  ],
});

export default config;

import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

import { STATIC_PAGES } from "@/constants/routes";
import { SITE } from "@/constants/site";

// Worker entry. `www.` is attached as a custom domain too; send it to the
// apex so auth cookies and BETTER_AUTH_URL only ever see one origin.
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    if (url.hostname === `www.${SITE.DOMAIN}`) {
      url.hostname = SITE.DOMAIN;
      return Response.redirect(url.toString(), 301);
    }
    // Prerendered at build time: serve the HTML file. It doesn't exist yet
    // while the build itself prerenders these pages, so render instead.
    if (STATIC_PAGES.includes(url.pathname)) {
      const page = await env.ASSETS.fetch(request);
      if (page.status !== 404) {
        return page;
      }
    }
    return handler.fetch(request);
  },
};

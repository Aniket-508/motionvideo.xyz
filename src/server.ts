import handler from "@tanstack/react-start/server-entry";

import { site } from "@/lib/site";

// Worker entry. `www.` is attached as a custom domain too; send it to the
// apex so auth cookies and BETTER_AUTH_URL only ever see one origin.
export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    if (url.hostname === `www.${site.domain}`) {
      url.hostname = site.domain;
      return Response.redirect(url.toString(), 301);
    }
    return handler.fetch(request);
  },
};

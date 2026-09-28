import { APIError } from "better-auth/api";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import { createAuth } from "./auth-config";
import * as schema from "./db/schema";
import { magicLinkEmail, sendEmail } from "./email";
import { hasPurchased } from "./polar";

// `env` from `cloudflare:workers` is readable at module scope; the D1 binding
// is only queried inside requests.
export const auth = createAuth(drizzle(env.DB, { schema }), {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  // There are no open sign-ups: a link is only sent to an email that has a
  // paid Polar order, which is how buyers reach their purchase.
  sendMagicLink: async (email, url) => {
    if (!(await hasPurchased(email))) {
      throw new APIError("FORBIDDEN", {
        message:
          "We couldn’t find a purchase for this email. Use the email you paid with.",
      });
    }
    await sendEmail(magicLinkEmail(email, url));
  },
});

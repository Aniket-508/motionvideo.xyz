import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import { createAuth } from "./auth-config";
import * as schema from "./db/schema";
import { magicLinkEmail, sendEmail } from "./email";

// `env` from `cloudflare:workers` is readable at module scope; the D1 binding
// is only queried inside requests.
export const auth = createAuth(drizzle(env.DB, { schema }), {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  sendMagicLink: (email, url) => sendEmail(magicLinkEmail(email, url)),
});

import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import type * as schema from "./db/schema";

export interface AuthConfig {
  baseURL: string;
  secret: string;
  sendMagicLink: (email: string, url: string) => Promise<void>;
}

// Runtime-agnostic factory: no `cloudflare:workers` import, so the Better Auth
// CLI can load it (`pnpm auth:schema`) to regenerate the Drizzle schema.
export const createAuth = (
  db: DrizzleD1Database<typeof schema>,
  config: AuthConfig
) =>
  betterAuth({
    baseURL: config.baseURL,
    secret: config.secret,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    rateLimit: {
      enabled: true,
      storage: "database",
      customRules: {
        "/sign-in/magic-link": { window: 60, max: 3 },
      },
    },
    advanced: {
      ipAddress: { ipAddressHeaders: ["cf-connecting-ip"] },
    },
    plugins: [
      magicLink({
        expiresIn: 60 * 15,
        sendMagicLink: ({ email, url }) => config.sendMagicLink(email, url),
      }),
      // Must stay last.
      tanstackStartCookies(),
    ],
  });

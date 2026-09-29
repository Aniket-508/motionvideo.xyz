// Creates (or reuses) the Polar product and writes POLAR_PRODUCT_ID into .env.
// Safe to re-run.
//
//   pnpm polar:setup    # uses POLAR_ACCESS_TOKEN / POLAR_SERVER from .env
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { Polar } from "@polar-sh/sdk";

import { BASE_PRICE_CENTS } from "../src/constants/pricing.ts";
import { SITE } from "../src/constants/site.ts";

const ENV_FILE = ".env";
if (existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}

const accessToken = process.env.POLAR_ACCESS_TOKEN;
if (!accessToken) {
  console.error("POLAR_ACCESS_TOKEN is not set (in .env or the environment).");
  process.exit(1);
}
const server =
  process.env.POLAR_SERVER === "production" ? "production" : "sandbox";
const polar = new Polar({ accessToken, server });

let productId = process.env.POLAR_PRODUCT_ID;
if (productId) {
  await polar.products.get({ id: productId });
  console.log(`Using existing product ${productId}`);
} else {
  const { result } = await polar.products.list({
    isArchived: false,
    query: SITE.NAME,
    limit: 100,
  });
  const match = result.items.find((product) => product.name === SITE.NAME);
  if (match) {
    productId = match.id;
    console.log(`Reusing product "${SITE.NAME}" ${productId}`);
  } else {
    const product = await polar.products.create({
      name: SITE.NAME,
      description: SITE.DESCRIPTION.LONG,
      recurringInterval: null,
      prices: [
        {
          amountType: "fixed",
          priceAmount: BASE_PRICE_CENTS,
          priceCurrency: "usd",
        },
      ],
    });
    productId = product.id;
    console.log(`Created product ${productId}`);
  }
}

const values = { POLAR_PRODUCT_ID: productId };
if (existsSync(ENV_FILE)) {
  let env = readFileSync(ENV_FILE, "utf-8");
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "mu");
    env = pattern.test(env)
      ? env.replace(pattern, line)
      : `${env.trimEnd()}\n${line}\n`;
  }
  writeFileSync(ENV_FILE, env);
}

console.log(`
Polar ${server} is ready. Wrote POLAR_PRODUCT_ID to ${ENV_FILE}.
For the deployed Worker, set the same value as a secret:

  pnpm wrangler secret put POLAR_PRODUCT_ID

Then, in the Polar dashboard, add a "GitHub Repository Access" benefit that
points at your private skill repo and attach it to the product.
`);

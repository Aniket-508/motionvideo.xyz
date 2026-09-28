// Creates (or reuses) the Polar product and one PPP discount per tier, then
// writes POLAR_PRODUCT_ID and POLAR_PPP_DISCOUNTS into .env. Safe to re-run.
//
//   pnpm polar:setup    # uses POLAR_ACCESS_TOKEN / POLAR_SERVER from .env
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { Polar } from "@polar-sh/sdk";

import { BASE_PRICE_CENTS, PPP_TIERS } from "../src/lib/ppp.ts";
import { site } from "../src/lib/site.ts";

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
    query: site.name,
    limit: 100,
  });
  const match = result.items.find((product) => product.name === site.name);
  if (match) {
    productId = match.id;
    console.log(`Reusing product "${site.name}" ${productId}`);
  } else {
    const product = await polar.products.create({
      name: site.name,
      description: site.description,
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

const existing = new Map<number, string>();
for await (const page of await polar.discounts.list({ limit: 100 })) {
  for (const discount of page.result.items) {
    const tier = Number(discount.metadata.ppp_tier);
    const appliesToProduct = discount.products.some((p) => p.id === productId);
    if (tier && appliesToProduct) {
      existing.set(tier, discount.id);
    }
  }
}

const tierDiscounts = await Promise.all(
  PPP_TIERS.map(async (tier) => {
    const found = existing.get(tier);
    if (found) {
      return [tier, found] as const;
    }
    // No `code`: the discount can only be attached server-side at checkout.
    const discount = await polar.discounts.create({
      basisPoints: tier * 100,
      duration: "once",
      metadata: { ppp_tier: tier },
      name: `PPP ${tier}%`,
      products: [productId],
      type: "percentage",
    });
    console.log(`Created discount PPP ${tier}% (${discount.id})`);
    return [tier, discount.id] as const;
  })
);
const discountIds = Object.fromEntries(tierDiscounts);

const values = {
  POLAR_PRODUCT_ID: productId,
  POLAR_PPP_DISCOUNTS: JSON.stringify(discountIds),
};
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
Polar ${server} is ready. Wrote POLAR_PRODUCT_ID and POLAR_PPP_DISCOUNTS to ${ENV_FILE}.
For the deployed Worker, set the same values as secrets:

  pnpm wrangler secret put POLAR_PRODUCT_ID
  pnpm wrangler secret put POLAR_PPP_DISCOUNTS

Then, in the Polar dashboard, add a "GitHub Repository Access" benefit that
points at your private skill repo and attach it to the product.
`);

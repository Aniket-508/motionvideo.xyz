// Prepare a separate $99 product with a $20 preorder discount. Keep the
// existing $79 product (and its GitHub benefit) for its existing customers.
// Safe to re-run; never attach the benefit before launch.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { Polar } from "@polar-sh/sdk";

import {
  BASE_PRICE_CENTS,
  LAUNCH_PRICE_CENTS,
  PREORDER_LIMIT,
  PREORDER_PRODUCT_NAME,
} from "../src/constants/pricing.ts";
import { SITE } from "../src/constants/site.ts";

const ENV_FILE = ".env";
if (existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}

const accessToken = process.env.POLAR_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error("POLAR_ACCESS_TOKEN is not set.");
}
const server =
  process.env.POLAR_SERVER === "production" ? "production" : "sandbox";
const polar = new Polar({ accessToken, server });

const legacyId =
  process.env.POLAR_LEGACY_PRODUCT_ID ?? process.env.POLAR_PRODUCT_ID;
if (!legacyId) {
  throw new Error("Set POLAR_PRODUCT_ID to the existing product first.");
}
const legacy = await polar.products.get({ id: legacyId });
const githubBenefit = legacy.benefits.find(
  (benefit) => benefit.type === "github_repository"
);
if (!githubBenefit) {
  throw new Error("Existing product needs a GitHub Repository Access benefit.");
}

const preorderName = PREORDER_PRODUCT_NAME;
let product =
  process.env.POLAR_LEGACY_PRODUCT_ID && process.env.POLAR_PRODUCT_ID
    ? await polar.products.get({ id: process.env.POLAR_PRODUCT_ID })
    : undefined;
if (!product) {
  const { result: listed } = await polar.products.list({
    isArchived: false,
    query: preorderName,
    limit: 100,
  });
  product = listed.items.find((item) => item.name === preorderName);
}
if (!product) {
  product = await polar.products.create({
    name: preorderName,
    description:
      `${SITE.DESCRIPTION.LONG}\n\nPreorder: the pack will be delivered Thursday, October 1, 2026. ` +
      "Connect your GitHub account in the Polar customer portal after launch to claim access. " +
      "Refunds are available on request before delivery.",
    recurringInterval: null,
    prices: [
      {
        amountType: "fixed",
        priceAmount: LAUNCH_PRICE_CENTS,
        priceCurrency: "usd",
      },
    ],
  });
  console.log(`Created preorder product ${product.id}`);
}
if (product.id === legacyId) {
  throw new Error(
    "Preorder product must be separate from the existing product."
  );
}
if (
  !product.prices.some(
    (price) =>
      price.amountType === "fixed" &&
      price.priceCurrency === "usd" &&
      price.priceAmount === LAUNCH_PRICE_CENTS
  )
) {
  throw new Error("Preorder product must have a $99 USD fixed price.");
}

const { result: discounts } = await polar.discounts.list({ limit: 100 });
let discount = discounts.items.find(
  (item) =>
    item.metadata.launch_offer === "2026-10" &&
    item.products.some((entry) => entry.id === product.id)
);
if (!discount) {
  discount = await polar.discounts.create({
    name: "Preorder offer",
    type: "fixed",
    amounts: { usd: LAUNCH_PRICE_CENTS - BASE_PRICE_CENTS },
    duration: "once",
    endsAt: new Date("2026-10-02T00:00:00Z"),
    maxRedemptions: PREORDER_LIMIT,
    products: [product.id],
    metadata: { launch_offer: "2026-10" },
  });
  console.log(`Created preorder discount ${discount.id}`);
}
if (
  discount.type !== "fixed" ||
  !("amounts" in discount) ||
  discount.amounts.usd !== LAUNCH_PRICE_CENTS - BASE_PRICE_CENTS ||
  discount.maxRedemptions !== PREORDER_LIMIT
) {
  throw new Error("Preorder discount does not match site pricing and limit.");
}
if (
  product.benefits.length > 0 &&
  (!discount.endsAt || discount.endsAt.getTime() > Date.now())
) {
  throw new Error(
    "Preorder product has benefits before the preorder offer ended."
  );
}

const values = {
  POLAR_LEGACY_PRODUCT_ID: legacyId,
  POLAR_PRODUCT_ID: product.id,
  POLAR_LAUNCH_DISCOUNT_ID: discount.id,
};
if (existsSync(ENV_FILE)) {
  let localEnv = readFileSync(ENV_FILE, "utf-8");
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "mu");
    localEnv = pattern.test(localEnv)
      ? localEnv.replace(pattern, line)
      : `${localEnv.trimEnd()}\n${line}\n`;
  }
  writeFileSync(ENV_FILE, localEnv);
}
console.log(`Polar ${server} preorder is ready; wrote product and discount IDs to ${ENV_FILE}.
Set POLAR_LEGACY_PRODUCT_ID, POLAR_PRODUCT_ID, and POLAR_LAUNCH_DISCOUNT_ID
as Worker secrets before deploying. On Thursday, run pnpm polar:launch
after uploading the finished skill pack to the private repository.`);

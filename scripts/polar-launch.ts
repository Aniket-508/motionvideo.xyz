// Run only after the finished skill pack is in the private repository.
// This ends the preorder discount, grants GitHub access to all existing buyers
// of the new product, and emails paid buyers instructions to claim it.
import { Polar } from "@polar-sh/sdk";

import { PRODUCT_NAME } from "../src/constants/pricing.ts";
import { SITE } from "../src/constants/site.ts";

if (process.env.POLAR_ACCESS_TOKEN === undefined) {
  process.loadEnvFile(".env");
}
if (!process.argv.includes("--confirm-launch")) {
  throw new Error(
    "Upload the finished pack first, then pass --confirm-launch."
  );
}
const {
  POLAR_ACCESS_TOKEN,
  POLAR_PRODUCT_ID,
  POLAR_LEGACY_PRODUCT_ID,
  POLAR_LAUNCH_DISCOUNT_ID,
  RESEND_API_KEY,
  EMAIL_FROM,
} = process.env;
if (
  !POLAR_ACCESS_TOKEN ||
  !POLAR_PRODUCT_ID ||
  !POLAR_LEGACY_PRODUCT_ID ||
  !POLAR_LAUNCH_DISCOUNT_ID ||
  !RESEND_API_KEY ||
  !EMAIL_FROM
) {
  throw new Error(
    "Polar product, discount, Resend, and sender configuration are required."
  );
}
const polar = new Polar({
  accessToken: POLAR_ACCESS_TOKEN,
  server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});
const [legacy, product, discount] = await Promise.all([
  polar.products.get({ id: POLAR_LEGACY_PRODUCT_ID }),
  polar.products.get({ id: POLAR_PRODUCT_ID }),
  polar.discounts.get({ id: POLAR_LAUNCH_DISCOUNT_ID }),
]);
const benefit = legacy.benefits.find(
  (item) => item.type === "github_repository"
);
if (!benefit || discount.products.every((item) => item.id !== product.id)) {
  throw new Error(
    "Expected GitHub benefit on legacy product and discount on preorder product."
  );
}
if (
  !product.prices.some(
    (price) =>
      price.amountType === "fixed" &&
      price.priceCurrency === "usd" &&
      price.priceAmount === 9900
  )
) {
  throw new Error("Preorder product is not priced at $99 USD.");
}

// Stop new $79 checkouts before granting delivery. Already-paid orders retain
// their $79 price and are granted the benefit when it is attached below.
if (!discount.endsAt || discount.endsAt.getTime() > Date.now()) {
  await polar.discounts.update({
    id: discount.id,
    discountUpdate: { endsAt: new Date() },
  });
}
const storedLaunch = product.metadata.launch_at_2026_10;
const launchedAt = storedLaunch ? new Date(String(storedLaunch)) : new Date();
if (Number.isNaN(launchedAt.getTime())) {
  throw new TypeError("Invalid launch timestamp in Polar product metadata.");
}
// Store the release cutoff before attaching the benefit so retries cannot
// accidentally email customers who bought after the launch.
await polar.products.update({
  id: product.id,
  productUpdate: {
    name: PRODUCT_NAME,
    description: SITE.DESCRIPTION.LONG,
    metadata: {
      ...product.metadata,
      launch_at_2026_10: launchedAt.toISOString(),
    },
  },
});
if (!product.benefits.some((item) => item.id === benefit.id)) {
  await polar.products.updateBenefits({
    id: product.id,
    productBenefitsUpdate: {
      benefits: [...product.benefits.map((item) => item.id), benefit.id],
    },
  });
}
console.log(
  "Launch price and GitHub benefit are live. Notifying paid preorder buyers."
);

// Polar grants the benefit retroactively, but buyers must link their GitHub
// identity in the customer portal to receive a repository invitation.
const notified = new Set<string>();
for await (const page of await polar.orders.list({
  productId: product.id,
  limit: 100,
})) {
  for (const order of page.result.items) {
    const { customer } = order;
    if (
      !order.paid ||
      order.createdAt.getTime() > launchedAt.getTime() ||
      order.status === "refunded" ||
      !customer.email ||
      notified.has(customer.id) ||
      customer.metadata.launch_email_2026_10 === true
    ) {
      continue;
    }
    notified.add(customer.id);
    // Sequential sends keep Resend within its per-second rate limit and let a
    // rerun resume from the last successfully marked customer.
    // oxlint-disable-next-line no-await-in-loop
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `motionvideo-launch-2026-10/${customer.id}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [customer.email],
        subject: `${SITE.NAME} is ready — claim your GitHub access`,
        text: `Your ${SITE.NAME} preorder is ready. Sign in with the email you used at checkout: ${SITE.URL}/sign-in\n\nOn your dashboard, open the Polar customer portal, link your GitHub account, and claim the private repository invitation. Your $79 preorder price is locked in. Need help? Reply to this email.`,
        reply_to: "hello@motionvideo.xyz",
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Launch email failed (${response.status}); rerun the command to resume.`
      );
    }
    // oxlint-disable-next-line no-await-in-loop
    await polar.customers.update({
      id: customer.id,
      customerUpdate: {
        metadata: { ...customer.metadata, launch_email_2026_10: true },
      },
    });
    console.log("Notified another preorder customer.");
  }
}
console.log(`Launch complete: ${notified.size} customers processed.`);

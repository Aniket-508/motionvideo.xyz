import { PolarCore } from "@polar-sh/sdk/core.js";
import { checkoutsCreate } from "@polar-sh/sdk/funcs/checkoutsCreate.js";
import { customerSessionsCreate } from "@polar-sh/sdk/funcs/customerSessionsCreate.js";
import { ordersList } from "@polar-sh/sdk/funcs/ordersList.js";
import type { Result } from "@polar-sh/sdk/types/fp.js";
import { env } from "cloudflare:workers";

import { BASE_PRICE_CENTS, discountedPriceCents, pppTierFor } from "@/lib/ppp";
import type { PppTier } from "@/lib/ppp";

import { requestCountry } from "./geo";

// Standalone functions keep the Worker bundle small (the full `Polar` class
// pulls in every endpoint).
const polar = new PolarCore({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
});

const unwrap = <T>(result: Result<T, Error>): T => {
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
};

const pppDiscountIds: Partial<Record<PppTier, string>> = JSON.parse(
  env.POLAR_PPP_DISCOUNTS || "{}"
);

export interface Pricing {
  country: string | null;
  /** Percent off, or null for full price. */
  discountPercent: PppTier | null;
  basePriceCents: number;
  priceCents: number;
}

interface ResolvedPricing extends Pricing {
  discountId: string | null;
}

// A tier only applies when Polar has a matching discount, so the price shown
// on the site is always the price charged at checkout.
const resolvePricing = (request: Request): ResolvedPricing => {
  const country = requestCountry(request);
  const tier = pppTierFor(country);
  const discountId = tier === null ? null : (pppDiscountIds[tier] ?? null);
  const discountPercent = discountId === null ? null : tier;
  return {
    country,
    discountPercent,
    discountId,
    basePriceCents: BASE_PRICE_CENTS,
    priceCents: discountedPriceCents(discountPercent),
  };
};

export const pricingFor = (request: Request): Pricing => {
  const { discountId: _, ...pricing } = resolvePricing(request);
  return pricing;
};

export const hasPurchased = async (userId: string): Promise<boolean> => {
  const { result } = unwrap(
    await ordersList(polar, {
      externalCustomerId: userId,
      productId: env.POLAR_PRODUCT_ID,
      limit: 100,
    })
  );
  return result.items.some(
    (order) => order.paid && order.status !== "refunded"
  );
};

export const createCheckoutUrl = async (
  request: Request,
  user: { id: string; email: string; name: string },
  products: string[]
): Promise<string> => {
  const pricing = resolvePricing(request);
  const checkout = unwrap(
    await checkoutsCreate(polar, {
      products,
      externalCustomerId: user.id,
      customerEmail: user.email,
      customerName: user.name || null,
      customerIpAddress: request.headers.get("cf-connecting-ip"),
      // PPP discounts have no code and are scoped to the main product in
      // Polar, so they can only be attached here. Customers may still enter
      // promo codes you create (they replace the PPP discount, never stack).
      discountId: products.includes(env.POLAR_PRODUCT_ID)
        ? pricing.discountId
        : null,
      successUrl: `${env.BETTER_AUTH_URL}/dashboard?checkout_id={CHECKOUT_ID}`,
      returnUrl: `${env.BETTER_AUTH_URL}/`,
      metadata: {
        country: pricing.country ?? "unknown",
        pppDiscountPercent: pricing.discountPercent ?? 0,
      },
    })
  );
  return checkout.url;
};

export const customerPortalUrl = async (userId: string): Promise<string> => {
  const session = unwrap(
    await customerSessionsCreate(polar, {
      externalCustomerId: userId,
      returnUrl: `${env.BETTER_AUTH_URL}/dashboard`,
    })
  );
  return session.customerPortalUrl;
};

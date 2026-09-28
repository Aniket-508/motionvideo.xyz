import { PolarCore } from "@polar-sh/sdk/core.js";
import { checkoutsCreate } from "@polar-sh/sdk/funcs/checkoutsCreate.js";
import { checkoutsGet } from "@polar-sh/sdk/funcs/checkoutsGet.js";
import { customerSessionsCreate } from "@polar-sh/sdk/funcs/customerSessionsCreate.js";
import { customersList } from "@polar-sh/sdk/funcs/customersList.js";
import { ordersList } from "@polar-sh/sdk/funcs/ordersList.js";
import { ResourceNotFound } from "@polar-sh/sdk/models/errors/resourcenotfound.js";
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

// Polar customer ids for an email. Buyers check out as guests, so the email
// they paid with is the only link between them and their orders.
const customerIdsFor = async (email: string): Promise<string[]> => {
  const { result } = unwrap(
    await customersList(polar, { email: email.toLowerCase(), limit: 100 })
  );
  return result.items.map((customer) => customer.id);
};

export const hasPurchased = async (email: string): Promise<boolean> => {
  const customerIds = await customerIdsFor(email);
  if (customerIds.length === 0) {
    return false;
  }
  const { result } = unwrap(
    await ordersList(polar, {
      customerId: customerIds,
      limit: 100,
      productId: env.POLAR_PRODUCT_ID,
    })
  );
  return result.items.some(
    (order) => order.paid && order.status !== "refunded"
  );
};

export const createCheckoutUrl = async (
  request: Request,
  products: string[],
  email: string | null
): Promise<string> => {
  const pricing = resolvePricing(request);
  const checkout = unwrap(
    await checkoutsCreate(polar, {
      customerEmail: email,
      customerIpAddress: request.headers.get("cf-connecting-ip"),
      // PPP discounts have no code and are scoped to the main product in
      // Polar, so they can only be attached here. Customers may still enter
      // promo codes you create (they replace the PPP discount, never stack).
      discountId: products.includes(env.POLAR_PRODUCT_ID)
        ? pricing.discountId
        : null,
      metadata: {
        country: pricing.country ?? "unknown",
        pppDiscountPercent: pricing.discountPercent ?? 0,
      },
      products,
      returnUrl: `${env.BETTER_AUTH_URL}/`,
      successUrl: `${env.BETTER_AUTH_URL}/welcome?checkout_id={CHECKOUT_ID}`,
    })
  );
  return checkout.url;
};

export interface CompletedCheckout {
  /** False while Polar is still confirming the payment. */
  succeeded: boolean;
  email: string | null;
}

/** Null when Polar has no checkout with this id (bad or tampered link). */
export const completedCheckout = async (
  checkoutId: string
): Promise<CompletedCheckout | null> => {
  const result = await checkoutsGet(polar, { id: checkoutId });
  if (!result.ok) {
    if (result.error instanceof ResourceNotFound) {
      return null;
    }
    throw result.error;
  }
  return {
    email: result.value.customerEmail,
    succeeded: result.value.status === "succeeded",
  };
};

export const customerPortalUrl = async (email: string): Promise<string> => {
  const [customerId] = await customerIdsFor(email);
  if (!customerId) {
    throw new Error("No Polar customer for this email");
  }
  const session = unwrap(
    await customerSessionsCreate(polar, {
      customerId,
      returnUrl: `${env.BETTER_AUTH_URL}/dashboard`,
    })
  );
  return session.customerPortalUrl;
};

import { PolarCore } from "@polar-sh/sdk/core.js";
import { checkoutsCreate } from "@polar-sh/sdk/funcs/checkoutsCreate.js";
import { checkoutsGet } from "@polar-sh/sdk/funcs/checkoutsGet.js";
import { customerSessionsCreate } from "@polar-sh/sdk/funcs/customerSessionsCreate.js";
import { customersList } from "@polar-sh/sdk/funcs/customersList.js";
import { discountsGet } from "@polar-sh/sdk/funcs/discountsGet.js";
import { ordersList } from "@polar-sh/sdk/funcs/ordersList.js";
import { productsGet } from "@polar-sh/sdk/funcs/productsGet.js";
import { ResourceNotFound } from "@polar-sh/sdk/models/errors/resourcenotfound.js";
import type { Result } from "@polar-sh/sdk/types/fp.js";
import { env } from "cloudflare:workers";

import {
  BASE_PRICE_CENTS,
  LAUNCH_PRICE_CENTS,
  PREORDER_LIMIT,
} from "@/constants/pricing";
import type { Offer } from "@/constants/pricing";

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
// Polar is the source of truth for both the real redemption count and whether
// the GitHub benefit has been released. Keep one short cache across requests.
let offerCache: { value: Offer; expires: number } | null = null;

export const offerFor = async (): Promise<Offer> => {
  if (offerCache && offerCache.expires > Date.now()) {
    return offerCache.value;
  }
  const [discount, product] = await Promise.all([
    discountsGet(polar, { id: env.POLAR_LAUNCH_DISCOUNT_ID }),
    productsGet(polar, { id: env.POLAR_PRODUCT_ID }),
  ]);
  const deal = unwrap(discount);
  const current = unwrap(product);
  if (
    deal.type !== "fixed" ||
    !("amounts" in deal) ||
    deal.amounts.usd !== LAUNCH_PRICE_CENTS - BASE_PRICE_CENTS ||
    deal.maxRedemptions !== PREORDER_LIMIT ||
    !deal.products.some((item) => item.id === env.POLAR_PRODUCT_ID)
  ) {
    throw new Error(
      "Polar preorder discount configuration does not match site pricing"
    );
  }
  const released = current.benefits.some(
    (benefit) => benefit.type === "github_repository"
  );
  const now = Date.now();
  const value: Offer = {
    active:
      !released &&
      deal.redemptionsCount < PREORDER_LIMIT &&
      (deal.startsAt === null || deal.startsAt.getTime() <= now) &&
      (deal.endsAt === null || deal.endsAt.getTime() > now),
    limit: PREORDER_LIMIT,
    released,
    sold: deal.redemptionsCount,
  };
  offerCache = { expires: now + 10_000, value };
  return value;
};

// Polar customer ids for an email. Buyers check out as guests, so the email
// they paid with is the only link between them and their orders.
const customerIdsFor = async (email: string): Promise<string[]> => {
  const { result } = unwrap(
    await customersList(polar, { email: email.toLowerCase(), limit: 100 })
  );
  return result.items.map((customer) => customer.id);
};

export const purchaseStatus = async (
  email: string
): Promise<{ purchased: boolean; preorder: boolean }> => {
  const customerIds = await customerIdsFor(email);
  if (customerIds.length === 0) {
    return { purchased: false, preorder: false };
  }
  const { result } = unwrap(
    await ordersList(polar, {
      customerId: customerIds,
      limit: 100,
      productId: [env.POLAR_PRODUCT_ID, env.POLAR_LEGACY_PRODUCT_ID],
    })
  );
  const paid = result.items.filter(
    (order) => order.paid && order.status !== "refunded"
  );
  const legacy = paid.some(
    (order) => order.productId === env.POLAR_LEGACY_PRODUCT_ID
  );
  return { purchased: paid.length > 0, preorder: !legacy && paid.length > 0 };
};

export const hasPurchased = async (email: string): Promise<boolean> => {
  const status = await purchaseStatus(email);
  return status.purchased;
};

export const createCheckoutUrl = async (
  request: Request,
  products: string[],
  email: string | null
): Promise<string> => {
  const offer = products.includes(env.POLAR_PRODUCT_ID)
    ? await offerFor()
    : null;
  const checkout = unwrap(
    await checkoutsCreate(polar, {
      customerEmail: email,
      customerIpAddress: request.headers.get("cf-connecting-ip"),
      discountId: offer?.active ? env.POLAR_LAUNCH_DISCOUNT_ID : null,
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
  preorder: boolean;
  released: boolean;
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
  const preorder = result.value.productId === env.POLAR_PRODUCT_ID;
  const offer = preorder ? await offerFor() : null;
  return {
    email: result.value.customerEmail,
    preorder,
    released: offer?.released ?? true,
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

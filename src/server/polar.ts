import { PolarCore } from "@polar-sh/sdk/core.js";
import { checkoutsCreate } from "@polar-sh/sdk/funcs/checkoutsCreate.js";
import { checkoutsGet } from "@polar-sh/sdk/funcs/checkoutsGet.js";
import { customerSessionsCreate } from "@polar-sh/sdk/funcs/customerSessionsCreate.js";
import { customersList } from "@polar-sh/sdk/funcs/customersList.js";
import { ordersList } from "@polar-sh/sdk/funcs/ordersList.js";
import { ResourceNotFound } from "@polar-sh/sdk/models/errors/resourcenotfound.js";
import type { Result } from "@polar-sh/sdk/types/fp.js";
import { env } from "cloudflare:workers";

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
): Promise<{ purchased: boolean; name: string | null }> => {
  const customerIds = await customerIdsFor(email);
  if (customerIds.length === 0) {
    return { name: null, purchased: false };
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
  const [order] = paid;
  return {
    name: order?.customer.name ?? order?.billingName ?? null,
    purchased: paid.length > 0,
  };
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
  const checkout = unwrap(
    await checkoutsCreate(polar, {
      customerEmail: email,
      customerIpAddress: request.headers.get("cf-connecting-ip"),
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

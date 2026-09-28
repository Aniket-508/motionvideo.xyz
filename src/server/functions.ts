import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { auth } from "./auth";
import {
  completedCheckout,
  customerPortalUrl,
  hasPurchased,
  pricingFor,
} from "./polar";

const currentSession = () => {
  const request = getRequest();
  return auth.api.getSession({ headers: request.headers });
};

export const getLandingData = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await currentSession();
    return { pricing: pricingFor(getRequest()), signedIn: session !== null };
  }
);

export const getAccount = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await currentSession();
    if (!session) {
      return null;
    }
    return {
      email: session.user.email,
      purchased: await hasPurchased(session.user.email),
      pricing: pricingFor(getRequest()),
    };
  }
);

export const getPortalUrl = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await currentSession();
    if (!session) {
      throw new Error("Unauthorized");
    }
    return customerPortalUrl(session.user.email);
  }
);

// Polar's success redirect lands on /welcome with the checkout id; the email
// on that checkout is where the buyer's sign-in link goes.
export const getCheckoutResult = createServerFn({ method: "GET" })
  .inputValidator(z.object({ checkoutId: z.string().min(1) }))
  .handler(({ data }) => completedCheckout(data.checkoutId));

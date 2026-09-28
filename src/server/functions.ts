import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { auth } from "./auth";
import { customerPortalUrl, hasPurchased, pricingFor } from "./polar";

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
      purchased: await hasPurchased(session.user.id),
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
    return customerPortalUrl(session.user.id);
  }
);

import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

import { auth } from "@/server/auth";
import { createCheckoutUrl, hasPurchased } from "@/server/polar";

const redirect = (location: string): Response =>
  new Response(null, { headers: { Location: location }, status: 303 });

// `<a href="/checkout">` target. Goes straight to a Polar checkout priced for
// the visitor's country; no account needed. `?products=<id>` (repeatable)
// picks the Polar products and defaults to POLAR_PRODUCT_ID. Signed-in buyers
// who already own the main product go to their dashboard instead.
export const Route = createFileRoute("/checkout")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const requested = url.searchParams.getAll("products");
        const products =
          requested.length > 0 ? requested : [env.POLAR_PRODUCT_ID];

        const session = await auth.api.getSession({ headers: request.headers });
        const email = session?.user.email ?? null;
        if (
          email &&
          products.includes(env.POLAR_PRODUCT_ID) &&
          (await hasPurchased(email))
        ) {
          return redirect("/dashboard");
        }
        return redirect(await createCheckoutUrl(request, products, email));
      },
    },
  },
});

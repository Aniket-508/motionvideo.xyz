import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

import { auth } from "@/server/auth";
import { createCheckoutUrl, hasPurchased } from "@/server/polar";

// `<a href="/checkout">` target. `?products=<id>` (repeatable) picks the
// Polar products; defaults to POLAR_PRODUCT_ID. Signs in first if needed,
// skips buyers who already own the main product, otherwise redirects to a
// Polar checkout priced for the visitor's country.
export const Route = createFileRoute("/checkout")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
          const back = `${url.pathname}${url.search}`;
          return redirect(`/sign-in?redirect=${encodeURIComponent(back)}`);
        }

        const requested = url.searchParams.getAll("products");
        const products =
          requested.length > 0 ? requested : [env.POLAR_PRODUCT_ID];
        if (
          products.includes(env.POLAR_PRODUCT_ID) &&
          (await hasPurchased(session.user.id))
        ) {
          return redirect("/dashboard");
        }
        return redirect(
          await createCheckoutUrl(request, session.user, products)
        );
      },
    },
  },
});

const redirect = (location: string): Response =>
  new Response(null, { status: 303, headers: { Location: location } });

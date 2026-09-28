import {
  WebhookVerificationError,
  validateEvent,
} from "@polar-sh/sdk/webhooks";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

// Register in Polar as `<public-url>/api/webhook/polar` (format: raw).
// Polar retries non-2xx responses and may redeliver: dedupe on the
// `webhook-id` header, not on `event.data.id`.
export const Route = createFileRoute("/api/webhook/polar")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Signature is computed over the raw body; never re-serialize JSON.
        const body = await request.text();

        let event;
        try {
          event = validateEvent(
            body,
            {
              "webhook-id": request.headers.get("webhook-id") ?? "",
              "webhook-timestamp":
                request.headers.get("webhook-timestamp") ?? "",
              "webhook-signature":
                request.headers.get("webhook-signature") ?? "",
            },
            env.POLAR_WEBHOOK_SECRET
          );
        } catch (error) {
          if (error instanceof WebhookVerificationError) {
            return Response.json({ received: false }, { status: 403 });
          }
          throw error;
        }

        switch (event.type) {
          case "order.paid": {
            // Stub, not implemented: fulfill the order here. `event.data` is
            // the Order; `event.data.customer.externalId` is the Better Auth
            // user id set at checkout.
            break;
          }
          case "customer.state_changed": {
            // Stub, not implemented: sync entitlements here. `event.data` is
            // the CustomerState (active subscriptions and granted benefits).
            break;
          }
          default: {
            // Other subscribed events are acknowledged without action.
            break;
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});

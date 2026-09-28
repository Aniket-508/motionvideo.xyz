# Polar setup

> **This integration runs against the live Polar production environment** (`POLAR_SERVER=production`, org `motionvideo`, `d400fe8e-a679-4c7a-9d73-5c8d8505ad62`). Checkouts charge real cards. Use the test discount below or switch `POLAR_SERVER=sandbox` with a sandbox token for dry runs.

## Files created / changed

| File | Change |
| --- | --- |
| `src/routes/api/webhook/polar.ts` | **New.** `POST /api/webhook/polar`: verifies the signature with `validateEvent` (`@polar-sh/sdk/webhooks`) against `POLAR_WEBHOOK_SECRET` (403 on mismatch). `order.paid` and `customer.state_changed` are TODO stubs. |
| `src/routes/checkout.ts` | `GET /checkout` now accepts `?products=<id>` (repeatable); defaults to `POLAR_PRODUCT_ID`. Still requires sign-in, applies the PPP discount, and sets `externalCustomerId` to the user id. |
| `src/server/polar.ts` | Single shared SDK client (server from `POLAR_SERVER`). Checkout takes a product list; the PPP discount is only attached when the main product is included. Promo codes can now be entered on the checkout page. |
| `scripts/polar-setup.ts` | Reads `.env`, reuses an existing product, creates PPP discounts idempotently, and writes `POLAR_PRODUCT_ID` / `POLAR_PPP_DISCOUNTS` into `.env`. |
| `.env`, `.env.example` | Local env moved from `.dev.vars` (Wrangler reads `.env` too). `.env` is gitignored; `.env.example` is committed. |
| `.gitignore` | Replaced the `.dev.vars` entries with `!.env.example` (`.env*` was already ignored). |
| `worker-configuration.d.ts` | Regenerated (`pnpm cf-typegen`) for `POLAR_WEBHOOK_SECRET`. |
| `README.md`, `wrangler.jsonc` | Updated env and deploy docs. |

## Env keys (names only)

- `POLAR_ACCESS_TOKEN` (set by you)
- `POLAR_WEBHOOK_SECRET` (**empty**: filled in when the webhook endpoint is created)
- `POLAR_SERVER` (`production`)
- `POLAR_PRODUCT_ID` (written by `pnpm polar:setup`)
- `POLAR_PPP_DISCOUNTS` (written by `pnpm polar:setup`)

For the deployed Worker, set each one with `pnpm wrangler secret put <NAME>`.

## Polar resources (production)

| Resource | Id |
| --- | --- |
| Product "Skill Bundle", $79 | `1ffcab55-7c55-4985-b681-8f5d7b024739` (already existed) |
| Discount PPP 20% | `09c5d289-065e-4ca2-9d1d-f73ad5d59b27` |
| Discount PPP 30% | `678262ea-061c-4d14-a811-8b08f9237d1b` |
| Discount PPP 40% | `58081f8a-f4f6-4a18-a5fe-45796b7ff681` |
| Discount PPP 50% | `914a6db9-842e-4735-b20c-bfc96c7d6192` |
| Discount PPP 60% | `16c428ff-5842-46f3-8ce2-92bd3e0c4805` |
| Test discount (100%, code) | `6391822f-910d-4acf-8f20-93662faf3967` (max 5 uses) |
| GitHub benefit (`motionvideohq/motionvideo-skill`, Read) | `95fe0dc3-6138-443b-a820-091f2d42d69d` (attached to the product) |
| Webhook endpoint | **Not created**: no public URL yet |

### Registering the webhook at deploy time

1. Polar dashboard → Settings → Webhooks → Add endpoint.
2. URL `https://<your-domain>/api/webhook/polar`, format **Raw**, events `order.paid` and `customer.state_changed` (add `order.refunded` if you handle refunds).
3. Copy the signing secret into `.env` as `POLAR_WEBHOOK_SECRET` and run `pnpm wrangler secret put POLAR_WEBHOOK_SECRET`.

## Customer portal

Polar hosts the customer portal and already emails customers a link to it, so it needs no app code. (The dashboard's existing "Open customer portal" button is a convenience for signed-in buyers.)

## Verify before merging

- [ ] `pnpm typecheck && pnpm lint && pnpm build` pass.
- [ ] `pnpm dev`, then sign in and open `http://localhost:3000/checkout?products=1ffcab55-7c55-4985-b681-8f5d7b024739`. It should redirect to a Polar checkout for $79 (or the PPP price; try `DEV_COUNTRY=IN` in `.env`).
- [ ] Complete the checkout with the 100% test code; `/dashboard` should show "You own motionvideo".
- [x] Attach the GitHub Repository Access benefit to the product (`motionvideohq/motionvideo-skill`, Read).
- [ ] Confirm the test buyer gets a repo invite through the customer portal.
- [ ] After deploy: register the webhook, set `POLAR_WEBHOOK_SECRET`, and send a test event from the Polar dashboard (expect 200; unsigned requests get 403).
- [ ] Delete or archive the 100% test discount before launch.
- [ ] Fill in the `order.paid` / `customer.state_changed` stubs if you need them (purchase status currently comes from Polar orders, not webhooks).

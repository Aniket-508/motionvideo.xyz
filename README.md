# motionvideo.xyz

Marketing and checkout site for the motionvideo agent skill pack. The site is open source; the skill pack itself lives in a private repository that buyers get access to through Polar.

**Stack:** TanStack Start + shadcn/ui on Cloudflare Workers, D1 (SQLite) via Drizzle, Better Auth (email magic links), Resend (email), Polar (payments).

## How it works

- **Sign in**: email magic link only (Better Auth `magicLink` plugin). Requests are rate limited to 3/minute per IP, stored in D1.
- **Checkout**: every "Buy" button is a link to `/checkout`, which sends signed-out visitors to sign in first, sends buyers to the dashboard, and otherwise redirects to a Polar checkout for the $79 product. `?products=<id>` (repeatable) checks out other Polar products instead.
- **PPP pricing**: `src/lib/ppp.ts` maps countries to discount tiers (20–60%). The visitor's country comes from Cloudflare (`request.cf.country`). The server attaches the matching code-less Polar discount at checkout. A tier only applies when its Polar discount is set up, so the price shown on the site always matches the price charged. Promo codes you create in Polar can still be entered on the checkout page.
- **Webhooks**: `POST /api/webhook/polar` verifies Polar's signature with `POLAR_WEBHOOK_SECRET`; `order.paid` and `customer.state_changed` handlers are TODO stubs.
- **Delivery**: a Polar _GitHub Repository Access_ benefit on the product invites the buyer to the private repo. The dashboard links to the Polar customer portal, where buyers claim access and download receipts.
- **Purchase status**: read from Polar orders by `externalCustomerId` (the Better Auth user id). The app stores no order data.

## Local development

```bash
pnpm install
cp .env.example .env            # then fill in the values
pnpm db:migrate:local            # create the local D1 tables
pnpm dev                         # http://localhost:3000
```

- Leave `RESEND_API_KEY` empty to print magic links to the dev server console.
- Set `POLAR_ACCESS_TOKEN` (organization token; use `POLAR_SERVER=sandbox` with a [Polar sandbox](https://sandbox.polar.sh) org for test runs), then run `pnpm polar:setup`. It creates the product and PPP discounts and writes `POLAR_PRODUCT_ID` and `POLAR_PPP_DISCOUNTS` into `.env`.
- Set `DEV_COUNTRY=IN` (or any country code) to preview PPP pricing.

## Deploy (Cloudflare Workers)

1. `pnpm wrangler login`
2. `pnpm wrangler d1 create motionvideo`, then paste the `database_id` into `wrangler.jsonc`.
3. Check `vars` in `wrangler.jsonc` (`BETTER_AUTH_URL`, `EMAIL_FROM`).
4. Polar (production): put an organization access token in `.env` and run `pnpm polar:setup`. In the Polar dashboard, add a GitHub Repository Access benefit for the private skill repo to the product, and create a webhook endpoint for `https://<domain>/api/webhook/polar` (format: raw, events `order.paid` and `customer.state_changed`). See `POLAR_SETUP.md`.
5. Resend: verify the sending domain and create an API key.
6. Set the secrets:
   ```bash
   pnpm wrangler secret put BETTER_AUTH_SECRET   # openssl rand -base64 32
   pnpm wrangler secret put RESEND_API_KEY
   pnpm wrangler secret put POLAR_ACCESS_TOKEN
   pnpm wrangler secret put POLAR_WEBHOOK_SECRET
   pnpm wrangler secret put POLAR_PRODUCT_ID
   pnpm wrangler secret put POLAR_PPP_DISCOUNTS
   ```
7. `pnpm deploy`, which builds, applies D1 migrations remotely, and deploys.
8. Attach the custom domain under Workers → Settings → Domains & Routes.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts` after env changes |
| `pnpm auth:schema` | Regenerate the Drizzle schema from the Better Auth config |
| `pnpm db:generate` | Generate a SQL migration from schema changes |
| `pnpm db:migrate:local` | Apply migrations to local D1 |
| `pnpm db:migrate:remote` | Apply migrations to production D1 |
| `pnpm polar:setup` | Create/reuse the Polar product and PPP discounts |

## Editing content

Copy, FAQ, and links live in `src/lib/site.ts`. PPP tiers live in `src/lib/ppp.ts`. The demo frames in `src/components/demo-frame.tsx` are CSS placeholders; swap them for `<video>` renders when you have them.

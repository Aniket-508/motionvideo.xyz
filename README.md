# motionvideo.xyz

Marketing and checkout site for the motionvideo agent skill pack. The site is open source; the skill pack itself lives in a private repository that buyers get access to through Polar.

**Stack:** TanStack Start + shadcn/ui on Cloudflare Workers, D1 (SQLite) via Drizzle, Better Auth (email magic links), Resend (email), Polar (payments).

## How it works

- **Checkout**: every "Buy" button links to `/checkout`, which redirects straight to a Polar checkout (no account needed). `?products=<id>` (repeatable) checks out other Polar products. Polar's success redirect lands on `/welcome`, which emails the buyer a sign-in link to the address on the checkout.
- **Sign in**: email magic links only, and only for emails with a paid Polar order (the gate is in `src/server/auth.ts`). Requests are rate limited to 3/minute per IP, stored in D1.
- **PPP pricing**: `src/lib/ppp.ts` maps countries to discount tiers (20–60%). The visitor's country comes from Cloudflare (`request.cf.country`). The server attaches the matching code-less Polar discount at checkout. A tier only applies when its Polar discount is set up, so the price shown on the site always matches the price charged. Promo codes you create in Polar can still be entered on the checkout page.
- **Webhooks**: `POST /api/webhook/polar` verifies Polar's signature with `POLAR_WEBHOOK_SECRET`; `order.paid` and `customer.state_changed` handlers are stubs.
- **Delivery**: a Polar _GitHub Repository Access_ benefit on the product invites the buyer to the private repo. The dashboard links to the Polar customer portal, where buyers claim access and download receipts.
- **Purchase status**: read from Polar by the buyer's email (customers → orders). The app stores no order data.
- **Legal**: `/terms`, `/privacy`, `/refunds`, `/dpa`. The seller name, jurisdiction, and "last updated" date live in `SITE.LEGAL` (`src/constants/site.ts`); the support email is `LINK.EMAIL` (`src/constants/links.ts`).
- **Pages**: `/about`, `/brand` (downloads in `public/brand`), `/contact`. These and the legal pages live in `src/routes/_pages/` and share one pathless layout route (`src/routes/_pages.tsx`) for the header, footer, and page width. The contact form emails `LINK.EMAIL` via Resend with Reply-To set to the sender; a Workers rate limit (`CONTACT_LIMITER`, 3/min per IP) and a honeypot field keep spam down.

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
2. The production D1 database (`motionvideo`) already exists and its id is in `wrangler.jsonc`. For a fresh account, run `pnpm wrangler d1 create motionvideo` and paste the new `database_id`.
3. Check `vars` in `wrangler.jsonc` (`BETTER_AUTH_URL`, `EMAIL_FROM`).
4. Polar (production): put an organization access token in `.env` and run `pnpm polar:setup`. In the Polar dashboard, add a GitHub Repository Access benefit for the private skill repo to the product, and create a webhook endpoint for `https://<domain>/api/webhook/polar` (format: raw, events `order.paid` and `customer.state_changed`).
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
7. `pnpm run deploy` builds, applies D1 migrations remotely, and deploys. (Plain `pnpm deploy` is a built-in pnpm command and does something else.)
8. Custom domains (`motionvideo.xyz`, `www.motionvideo.xyz`) are declared in `wrangler.jsonc` `routes` and attached on deploy; the zone must be active on the same Cloudflare account. `src/server.ts` 301-redirects `www` to the apex, and `workers.dev` is disabled.

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

Site copy and links live in `src/constants/` (`site`, `links`, `routes`, `faqs`, `features`, `steps`, `pricing`, `stack`, `products`, `videos`). SEO lives in `src/seo/`: `createMetadata()` for per-route head tags and `baseMetadata` on the root route, plus JSON-LD (WebSite, Organization, Product, FAQPage, BreadcrumbList) emitted through `head().scripts`. PPP tiers live in `src/lib/ppp.ts`. Video URLs live in `VIDEOS` in `src/constants/videos.ts` (files in `public/videos`, max 25 MiB each on Workers) and play in the Sutro theme from [player.style](https://player.style); an empty entry shows the CSS placeholder from `src/components/demo-frame.tsx`. Agent and renderer logos live in `public/logos` (agent icons from LobeHub Icons, MIT).

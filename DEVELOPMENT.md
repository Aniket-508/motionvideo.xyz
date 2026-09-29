# Development

Everything you need to run, change, and deploy the MotionVideo website.

## Prerequisites

- Node.js 22+ and [pnpm](https://pnpm.io) 10+
- A Cloudflare account (for D1, R2, and deploys), plus Polar and Resend accounts for the full purchase flow

## Local setup

```bash
pnpm install              # also installs the Lefthook pre-commit hook
cp .env.example .env      # fill in the values below
pnpm db:migrate:local     # create the local D1 tables
pnpm dev                  # http://localhost:3000
```

The dev server runs the real Workers runtime through the Cloudflare Vite plugin, with a local D1 database under `.wrangler/`.

### Environment variables

Local values live in `.env` (gitignored); `.env.example` lists every key.

| Key | Purpose |
| --- | --- |
| `BETTER_AUTH_URL` | Site origin, `http://localhost:3000` locally |
| `BETTER_AUTH_SECRET` | Session signing secret (`openssl rand -base64 32`) |
| `RESEND_API_KEY` | Leave empty locally to print emails to the dev server console |
| `EMAIL_FROM` | Sender address for sign-in and contact emails |
| `POLAR_SERVER` | `sandbox` or `production` |
| `POLAR_ACCESS_TOKEN` | Polar organization access token |
| `POLAR_WEBHOOK_SECRET` | Signing secret of the `/api/webhook/polar` endpoint |
| `POLAR_PRODUCT_ID` | Written by `pnpm polar:setup` |

`worker-configuration.d.ts` (the `Env` types) is generated from `wrangler.jsonc` and `.env` and is not committed. `pnpm typecheck` regenerates it; run `pnpm cf-typegen` on its own after changing bindings or env keys.

### Polar

Use a [Polar sandbox](https://sandbox.polar.sh) organization for local testing (`POLAR_SERVER=sandbox`). With `POLAR_ACCESS_TOKEN` set, run:

```bash
pnpm polar:setup
```

It creates (or reuses) the product and writes `POLAR_PRODUCT_ID` into `.env`. It is safe to re-run.

## How the purchase flow works

- **Checkout**: every buy button links to `/checkout`, which redirects straight to a Polar checkout. `?products=<id>` (repeatable) checks out other Polar products. Signed-in buyers who already own the pack go to `/dashboard` instead.
- **After payment**: Polar redirects to `/welcome?checkout_id=…`, which emails a sign-in link to the address on the checkout (retrying briefly while Polar confirms the order).
- **Sign in**: Better Auth magic links, sent only to emails with a paid Polar order (gate in `src/server/auth.ts`), rate limited to 3 per minute per IP in D1.
- **Purchase status**: read from Polar by email (customers, then orders). The app stores no order data.
- **Delivery**: a Polar GitHub Repository Access benefit on the product invites buyers to the private skill repository; the dashboard links to the Polar customer portal.
- **Pricing**: the $79 price is defined in `src/constants/pricing.ts` and used for the site, structured data, and new Polar products. Individual discounts can be created separately in Polar.
- **Webhooks**: `POST /api/webhook/polar` verifies Polar's signature; the `order.paid` and `customer.state_changed` handlers are stubs.
- **Contact form**: emails the support inbox through Resend with Reply-To set to the sender, protected by a Workers rate limit (`CONTACT_LIMITER`, 3 per minute per IP) and a honeypot field.

## Project structure

```text
src/
  routes/            File-based routes (TanStack Router)
    _pages.tsx       Pathless layout for text pages (header, footer, width)
    _pages/          About, brand, contact, terms, privacy, refunds, DPA
    api/             Better Auth handler and Polar webhook
    index.tsx        Landing page
  components/        App components; ui/ holds shadcn/ui components
  constants/         Site copy, links, routes, FAQs, features, videos, …
  seo/               createMetadata(), baseMetadata, and JSON-LD helpers
  server/            Server-only code: auth, Polar, email, server functions
  lib/               Shared helpers (theme, UTM links)
  server.ts          Worker entry (www → apex redirect)
drizzle/             SQL migrations for D1
scripts/             Polar setup and Better Auth schema generation
public/              Static files: favicons, logos, brand assets, og.png
```

### Editing content

- Copy, links, and lists live in `src/constants/`.
- The legal seller name, jurisdiction, and "last updated" date live in `SITE.LEGAL` (`src/constants/site.ts`).
- Agent and renderer logos live in `public/logos` and are listed in `src/constants/stack.ts`. Single-color black logos need `mono: true` so they turn white in dark mode.
- Videos are served from the R2 bucket `motionvideo-assets` at `https://assets.motionvideo.xyz` and referenced in `src/constants/links.ts` (`ASSETS`). Upload a new file with:

  ```bash
  pnpm wrangler r2 object put motionvideo-assets/videos/<file>.mp4 \
    --file <file>.mp4 --content-type video/mp4 \
    --cache-control "public, max-age=31536000, immutable" --remote
  ```

  Files are cached for a year, so use a new file name when replacing a video.

- The share image is `public/og.png` (1200 × 630).

### Database

The Drizzle schema in `src/server/db/schema.ts` is generated from the Better Auth config:

```bash
pnpm auth:schema       # regenerate the schema after changing Better Auth plugins
pnpm db:generate       # create a SQL migration in drizzle/
pnpm db:migrate:local  # apply locally
pnpm db:migrate:remote # apply to production D1
```

## Deployment

Pushes to `main` build and deploy automatically through Cloudflare Workers Builds (build command `pnpm run build`, deploy command `npx wrangler deploy`). Workers Builds does not run migrations; apply schema changes with `pnpm db:migrate:remote`.

To deploy by hand:

```bash
pnpm run deploy   # build, apply remote migrations, deploy
```

Plain `pnpm deploy` is a built-in pnpm command and does something else.

### Production configuration

- **Vars** (`wrangler.jsonc`): `BETTER_AUTH_URL`, `EMAIL_FROM`, `POLAR_SERVER`.
- **Secrets** (set once with `pnpm wrangler secret put <NAME>`): `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCT_ID`.
- **Bindings**: D1 database `DB`, rate limiter `CONTACT_LIMITER`.
- **Domains**: `motionvideo.xyz` and `www.motionvideo.xyz` are custom domains in `wrangler.jsonc`; `src/server.ts` redirects `www` to the apex and `workers.dev` is disabled. Videos are served from `assets.motionvideo.xyz` (R2).
- **Email**: Resend sends from `hello@motionvideo.xyz`; Cloudflare Email Routing forwards incoming mail for that address.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm run deploy` | Build, migrate remote D1, and deploy |
| `pnpm typecheck` | Regenerate Worker types, then run `tsc` |
| `pnpm lint` / `pnpm format` | Oxlint / Oxfmt |
| `pnpm check` / `pnpm fix` | Ultracite check / autofix (also runs on pre-commit) |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts` |
| `pnpm auth:schema` | Regenerate the Drizzle schema from the Better Auth config |
| `pnpm db:generate` | Generate a SQL migration from schema changes |
| `pnpm db:migrate:local` / `pnpm db:migrate:remote` | Apply migrations to local / production D1 |
| `pnpm polar:setup` | Create or reuse the Polar product |

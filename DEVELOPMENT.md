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
| `POLAR_PRODUCT_ID` | New preorder product, $99 list price; set by `pnpm polar:setup` |
| `POLAR_LEGACY_PRODUCT_ID` | Previous product with existing buyer(s) and GitHub benefit |
| `POLAR_LAUNCH_DISCOUNT_ID` | $20 fixed discount, limited to 100 uses and ending October 2, 2026 at 00:00 UTC |

`worker-configuration.d.ts` (the `Env` types) is generated from `wrangler.jsonc` and `.env` and is not committed. `pnpm typecheck` regenerates it; run `pnpm cf-typegen` on its own after changing bindings or env keys.

### Polar

Use a [Polar sandbox](https://sandbox.polar.sh) organization for local testing. Production has an existing paid buyer, so **do not delete the old product or its GitHub benefit**. The old product is archived to prevent further $79 purchases, but its paid buyer retains access. `pnpm polar:setup` creates/reuses a separate $99 product without benefits and a product-scoped $20 discount limited to 100 redemptions until October 2, 2026 at 00:00 UTC, then writes the new product ID, old product ID and discount ID into `.env`. Re-running setup reuses these records. Set all three IDs as Worker secrets before deploying; use `wrangler deploy --config dist/server/wrangler.json --secrets-file <temporary JSON>` to upload the three together with code when cutting over from the old product. The checkout and displayed count read Polar's discount status.

## How the purchase flow works

- **Checkout**: every buy button links to `/checkout`, which redirects straight to a Polar checkout. `?products=<id>` (repeatable) checks out other Polar products. Signed-in buyers who already own the pack go to `/dashboard` instead.
- **After payment**: Polar redirects to `/welcome?checkout_id=…`, which emails a sign-in link to the address on the checkout (retrying briefly while Polar confirms the order).
- **Sign in**: Better Auth magic links, sent only to emails with a paid Polar order (gate in `src/server/auth.ts`), rate limited to 3 per minute per IP in D1.
- **Purchase status**: read from Polar by email (customers, then orders). The app stores no order data.
- **Local UI preview**: with `pnpm dev`, open `/welcome?preview=sent` to see the preorder confirmation without sending an email, or `/dashboard?preview=purchased` to see the prepaid buyer state without signing in. Preview data exists only behind `import.meta.env.DEV` in those route loaders; production requests always use the real checkout, session, and Polar purchase checks. The portal button is disabled in the dashboard preview.
- **Delivery**: the new product has no GitHub benefit until launch, so prepaid buyers cannot claim the unfinished pack. After uploading the finished files on Thursday, run `pnpm polar:launch --confirm-launch`; it ends the discount, attaches the existing GitHub benefit to the new product (Polar grants it retroactively to its existing paid customers), updates product copy, and emails paid buyers instructions. Buyers must link a GitHub account in Polar's customer portal to receive the collaborator invitation. The old product and its buyer remain untouched. Check benefit grants and the test buyer's email afterward.
- **Pricing**: the prepaid $79 offer ends on Thursday, October 1, 2026 (UTC date), or when 100 paid preorders have been sold, whichever occurs first; afterward the $99 list price applies. Polar's real discount redemptions supply the counter and enforce the cap. No purchasing-power or localized pricing.
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
- The animated feature illustrations live in `src/components/feature-art.tsx`, with keyframes in `src/styles.css`. The motion-token dot follows the same `motionCurve` as the dashed stroke via CSS `offset-path`; keep `transform-box-fill` and `offset-anchor: center` so its center stays on the curve. The scene-starter strip repeats its two-card pattern beyond the 160-unit viewport so the `-112px` loop never leaves a blank edge. Reduced-motion visitors see static illustrations.
- The pricing card in `src/components/pricing.tsx` displays the live Polar preorder count. Its LIVE badge pings only when motion is allowed; preorder delivery timing remains explained in the hero, checkout, FAQ, and purchase flow.
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
- **Secrets** (set once with `pnpm wrangler secret put <NAME>`): `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `POLAR_PRODUCT_ID`, `POLAR_LEGACY_PRODUCT_ID`, `POLAR_LAUNCH_DISCOUNT_ID`.
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
| `pnpm polar:setup` | Create or reuse the new $99 Polar product and $20 preorder discount; retain legacy buyers |
| `pnpm polar:launch --confirm-launch` | After uploading finished files, end discount, grant GitHub benefit to all new-product buyers, and notify them |

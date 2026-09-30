<div align="center">

<a href="https://motionvideo.xyz">
  <img src="public/og.png" alt="MotionVideo: Motion design, written in code." width="800" />
</a>

# MotionVideo

**Motion design, written in code.**

Agent skills that teach your coding agent motion design: timing, easing, and choreography.<br /> Showreels, intros, and launch films, rendered from a prompt.

[Website](https://motionvideo.xyz) · [About](https://motionvideo.xyz/about) · [Contact](https://motionvideo.xyz/contact)

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmotionvideo.xyz&label=motionvideo.xyz&style=flat-square)](https://motionvideo.xyz) [![TanStack Start](https://img.shields.io/badge/TanStack_Start-React-FF4154?style=flat-square&logo=tanstack&logoColor=white)](https://tanstack.com/start) [![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflareworkers&logoColor=white)](https://workers.cloudflare.com) [![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com) [![Polar](https://img.shields.io/badge/Payments-Polar-0062FF?style=flat-square)](https://polar.sh) [![License: MIT](https://img.shields.io/github/license/motionvideohq/motionvideo.xyz?style=flat-square)](LICENSE) [![X](https://img.shields.io/badge/@alaymanguy-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/alaymanguy)

</div>

---

This repository is the marketing and checkout site for MotionVideo. The site is open source; the skill pack itself is sold separately and delivered at launch as access to a private GitHub repository through [Polar](https://polar.sh).

## How it works

- **Checkout**: buy buttons go straight to a Polar checkout, no account needed. After paying, `/welcome` emails the buyer a sign-in link.
- **Access**: passwordless magic links are available to emails with a paid order. Preorder buyers do not receive repository access immediately. On the October 2, 2026 launch, `pnpm polar:launch --confirm-launch` attaches the GitHub benefit to the preorder product, grants it to existing buyers, and emails them instructions. Each buyer links a GitHub account in Polar's customer portal to claim the invite.
- **Pricing**: prepaid preorders are $79 until Friday, October 2, 2026, 9:00 AM ET, or the first 100 paid preorders, whichever comes first; afterward the price is $99. The original paid product remains intact; the preorder uses a separate Polar product and a real Polar discount, not a simulated sales counter. No localized or purchasing-power pricing.
- **Content**: landing page, about, brand assets, contact form, and legal pages (terms, privacy, refunds, DPA), with Open Graph tags and JSON-LD on every page.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, server functions) |
| UI | [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com), [Tailwind CSS v4](https://tailwindcss.com), [Lucide](https://lucide.dev) icons, [player.style](https://player.style) (Sutro) video player |
| Hosting | [Cloudflare Workers](https://workers.cloudflare.com), deployed with [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and Workers Builds |
| Data | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) with [Drizzle ORM](https://orm.drizzle.team), [R2](https://developers.cloudflare.com/r2/) for video assets |
| Auth | [Better Auth](https://www.better-auth.com) (email magic links) |
| Email | [Resend](https://resend.com) (sign-in and contact messages), Cloudflare Email Routing (inbound) |
| Payments | [Polar](https://polar.sh) as merchant of record, with GitHub repository access delivery |
| Tooling | [pnpm](https://pnpm.io), [Vite](https://vite.dev), [Oxlint](https://oxc.rs) + [Oxfmt](https://oxc.rs) via [Ultracite](https://www.ultracite.ai), [Lefthook](https://lefthook.dev) |

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm db:migrate:local
pnpm dev
```

Email templates are React Email components in `src/emails`. Preview them with `pnpm email:dev` (port 3001).

## License

The website source code is released under the [MIT License](LICENSE). The MotionVideo skill pack, brand name, and logomark are not covered by this license; the skill pack is sold separately under its own [terms](https://motionvideo.xyz/terms).

## Made by

[Aniket Pawar](https://www.aniketpawar.com) ([@alaymanguy](https://x.com/alaymanguy)), who also runs [Shadcn Labs](https://www.shadcn-labs.com).

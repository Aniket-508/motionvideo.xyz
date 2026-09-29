import { Link } from "@tanstack/react-router";
import { cn } from "cn";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const TICKS = 25;

// "404" as three frames of a clip: the middle frame never rendered. A playhead
// scrubs the timeline underneath. Motion is off for reduced-motion visitors.
const MissingFrame = () => (
  <div
    className="bg-muted/50 flex w-full max-w-sm flex-col gap-5 rounded-2xl p-5 sm:p-6"
    aria-hidden
  >
    <div className="grid grid-cols-3 gap-3">
      {["4", "0", "4"].map((digit, i) => (
        <div
          // oxlint-disable-next-line no-array-index-key -- fixed, never reordered
          key={i}
          className={cn(
            "animate-mv-drop flex aspect-[3/4] items-center justify-center rounded-xl text-6xl font-semibold tracking-tight tabular-nums motion-reduce:animate-none sm:text-7xl",
            ["mv-delay-0", "mv-delay-120", "mv-delay-240"][i],
            i === 1
              ? "border-muted-foreground/30 text-muted-foreground/25 border-2 border-dashed"
              : "bg-background shadow-sm"
          )}
        >
          {digit}
        </div>
      ))}
    </div>
    <div className="flex flex-col gap-2">
      <div className="relative flex h-5 items-end justify-between">
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            // oxlint-disable-next-line no-array-index-key -- static ruler
            key={i}
            className={cn(
              "bg-muted-foreground/30 w-px",
              i % 6 === 0 ? "h-3" : "h-1.5"
            )}
          />
        ))}
        <span className="animate-mv-scrub bg-cta-to absolute inset-y-0 left-1/2 -ml-px w-0.5 rounded-full motion-reduce:animate-none">
          <span className="bg-cta-to absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full" />
        </span>
      </div>
      <div className="text-muted-foreground flex justify-between font-mono text-xs">
        <span>00:00:04:04</span>
        <span>Frame missing</span>
      </div>
    </div>
  </div>
);

export const NotFound = () => (
  <>
    <SiteHeader signedIn={false} />
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:py-24"
    >
      <MissingFrame />
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-balance">
          This frame didn’t render.
        </h1>
        <p className="text-muted-foreground max-w-md text-pretty">
          The page you’re looking for isn’t in the cut. It may have moved, or
          the link is wrong.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className={buttonVariants({ size: "cta", variant: "cta" })}
        >
          Back to home
        </Link>
        <a
          href={ROUTES.CONTACT}
          className={buttonVariants({ size: "lg", variant: "ghost" })}
        >
          Report a broken link
        </a>
      </div>
    </main>
    <SiteFooter />
  </>
);

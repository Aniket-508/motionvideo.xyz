import { cn } from "cn";
import { CheckIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  BASE_PRICE_CENTS,
  formatUsd,
  LAUNCH_PRICE_CENTS,
  PERKS,
  PREORDER_LIMIT,
} from "@/constants/pricing";
import type { Offer } from "@/constants/pricing";

const preorderTicks = Array.from(
  { length: PREORDER_LIMIT },
  (_, index) => index
);

export const BuyButton = ({ offer }: { offer: Offer }) => (
  <div className="flex flex-wrap items-center gap-4">
    <a href="/checkout" className={buttonVariants({ size: "lg" })}>
      {offer.released
        ? `Buy now for ${formatUsd(LAUNCH_PRICE_CENTS)}`
        : `Preorder for ${formatUsd(
            offer.active ? BASE_PRICE_CENTS : LAUNCH_PRICE_CENTS
          )}`}
    </a>
    <span className="text-muted-foreground text-sm">
      {offer.released ? "One-time purchase" : "Prepaid · Access at launch"}
    </span>
  </div>
);

export const PriceCard = ({ offer }: { offer: Offer }) => (
  <Card size="lg" className="mx-auto w-full max-w-sm">
    <CardHeader>
      <div className="flex flex-col gap-3">
        {offer.active && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold tracking-widest uppercase">
              Preorder offer
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
              <span aria-hidden className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-600 opacity-75 motion-reduce:animate-none dark:bg-green-400" />
                <span className="relative size-1.5 rounded-full bg-green-600 dark:bg-green-400" />
              </span>
              LIVE
            </span>
          </div>
        )}
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight">
            {formatUsd(offer.active ? BASE_PRICE_CENTS : LAUNCH_PRICE_CENTS)}
          </span>
          {offer.active && (
            <del className="text-muted-foreground text-lg">
              {formatUsd(LAUNCH_PRICE_CENTS)}
            </del>
          )}
          <span className="text-muted-foreground text-sm">one time</span>
        </p>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-6">
      {offer.active && (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="font-medium tabular-nums">
              {offer.sold} / {offer.limit} paid preorders
            </span>
            <span className="text-muted-foreground tabular-nums">
              {Math.max(0, offer.limit - offer.sold)} left
            </span>
          </div>
          <progress
            className="sr-only"
            aria-label="Paid preorders"
            value={offer.sold}
            max={offer.limit}
          />
          <div
            aria-hidden
            className="grid grid-cols-[repeat(100,minmax(0,1fr))] gap-px"
          >
            {preorderTicks.map((tick) => (
              <span
                key={tick}
                aria-hidden
                className={cn(
                  "h-5 min-w-0 rounded-[1px]",
                  tick < offer.sold ? "bg-green-600" : "bg-muted"
                )}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Ends Thursday, October 1, 2026 (UTC), or when the first{" "}
            {offer.limit} paid orders are placed, whichever comes first.
          </p>
        </div>
      )}
      <ul className="flex flex-col gap-3 text-sm">
        {PERKS.map((perk) => (
          <li key={perk} className="flex gap-2">
            <CheckIcon
              aria-hidden
              className="text-primary mt-0.5 size-4 shrink-0"
            />
            {perk}
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="border-t-0 bg-transparent pt-0">
      <a
        href="/checkout"
        className={cn(
          buttonVariants({ className: "w-full", size: "cta", variant: "cta" })
        )}
      >
        {offer.released
          ? `Buy now for ${formatUsd(LAUNCH_PRICE_CENTS)}`
          : `Preorder for ${formatUsd(
              offer.active ? BASE_PRICE_CENTS : LAUNCH_PRICE_CENTS
            )}`}
      </a>
    </CardFooter>
  </Card>
);
